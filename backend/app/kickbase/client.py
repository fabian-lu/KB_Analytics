"""HTTP client for Kickbase API."""

import asyncio
import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)

from app.kickbase.config import config
from app.kickbase.exceptions import (
    AuthenticationError,
    AuthorizationError,
    KickbaseError,
    NetworkError,
    NotFoundError,
    RateLimitError,
    ServerError,
    TimeoutError,
    ValidationError,
)


class KickbaseClient:
    """
    Async HTTP client for the Kickbase API.

    Handles:
    - Authentication token management
    - Automatic retries with exponential backoff
    - Error handling with custom exceptions

    Usage:
        client = KickbaseClient()

        # Login (no token needed)
        response = await client.post("/user/login", data={"em": "...", "pass": "..."})
        client.token = response["tkn"]

        # Authenticated requests
        squad = await client.get(f"/leagues/{league_id}/squad")
    """

    def __init__(self, token: str | None = None):
        """
        Initialize the client.

        Args:
            token: Optional auth token. Can also be set later via client.token
        """
        self._token = token

    # --- Token Management ---

    @property
    def token(self) -> str | None:
        """Get the current auth token."""
        return self._token

    @token.setter
    def token(self, value: str | None) -> None:
        """Set the auth token."""
        self._token = value

    @property
    def is_authenticated(self) -> bool:
        """Check if client has a token."""
        return self._token is not None

    # --- Public Methods ---

    async def get(self, path: str, params: dict | None = None) -> dict:
        """
        Make a GET request.

        Args:
            path: API path (e.g., "/leagues/123/squad")
            params: Optional query parameters

        Returns:
            JSON response as dict
        """
        return await self._request_with_retry("GET", path, params=params)

    async def post(self, path: str, data: dict | None = None) -> dict:
        """
        Make a POST request.

        Args:
            path: API path (e.g., "/user/login")
            data: Request body as dict

        Returns:
            JSON response as dict
        """
        return await self._request_with_retry("POST", path, data=data)

    async def delete(self, path: str) -> dict:
        """
        Make a DELETE request.

        Args:
            path: API path

        Returns:
            JSON response as dict
        """
        return await self._request_with_retry("DELETE", path)

    # --- Internal Methods ---

    def _build_headers(self) -> dict[str, str]:
        """Build request headers, including auth token if available."""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        if self._token:
            headers["Authorization"] = f"Bearer {self._token}"

        return headers

    async def _request(
        self,
        method: str,
        path: str,
        params: dict | None = None,
        data: dict | None = None,
    ) -> dict:
        """
        Make a single HTTP request (no retry).

        This is the core method that actually talks to Kickbase.
        """
        url = f"{config.base_url}{path}"
        headers = self._build_headers()

        # Set up timeouts
        timeout = httpx.Timeout(
            timeout=config.timeout,
            connect=config.connect_timeout,
        )

        try:
            logger.debug(f"Request: {method} {path}")

            # Create a client and make the request
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.request(
                    method=method,
                    url=url,
                    headers=headers,
                    params=params,
                    json=data,  # httpx automatically converts dict to JSON
                )

            # Check for errors
            self._handle_response_errors(response)

            # Return the JSON body
            return response.json()

        except httpx.ConnectError as e:
            raise NetworkError(f"Failed to connect to Kickbase API: {e}")

        except httpx.TimeoutException as e:
            raise TimeoutError(f"Request timed out: {e}")

        except httpx.HTTPError as e:
            raise NetworkError(f"HTTP error: {e}")

    def _handle_response_errors(self, response: httpx.Response) -> None:
        """
        Check response status and raise appropriate exception if error.

        This converts HTTP status codes to our custom exceptions.
        """
        status = response.status_code

        # Success - no error
        if 200 <= status < 300:
            return

        # Try to get error details from response body
        try:
            detail = response.json()
        except Exception:
            detail = {"raw": response.text}

        # Map status codes to exceptions
        if status == 400:
            raise ValidationError("Bad request", detail)

        elif status == 401:
            raise AuthenticationError("Invalid credentials or token expired", detail)

        elif status == 403:
            raise AuthorizationError("Access denied", detail)

        elif status == 404:
            raise NotFoundError("Resource not found", detail)

        elif status == 429:
            # Try to get retry-after header
            retry_after = response.headers.get("Retry-After")
            retry_seconds = int(retry_after) if retry_after else None
            raise RateLimitError("Rate limit exceeded", retry_seconds, detail)

        elif status >= 500:
            raise ServerError(f"Server error ({status})", detail)

        else:
            raise KickbaseError(f"Unexpected error ({status})", detail)

    async def _request_with_retry(
        self,
        method: str,
        path: str,
        params: dict | None = None,
        data: dict | None = None,
    ) -> dict:
        """
        Make a request with automatic retry on failure.

        Uses exponential backoff: waits longer between each retry.
        Only retries on specific error codes (429, 500, 502, 503, 504).
        """
        last_exception: Exception | None = None

        for attempt in range(config.max_retries + 1):
            try:
                return await self._request(method, path, params, data)

            except RateLimitError as e:
                last_exception = e

                # Use retry-after header if provided, otherwise calculate backoff
                if e.retry_after:
                    delay = min(e.retry_after, config.retry_max_delay)
                else:
                    delay = self._calculate_backoff(attempt)

                # Don't retry if this was the last attempt
                if attempt < config.max_retries:
                    logger.warning(f"Rate limited, retry {attempt + 1}/{config.max_retries} in {delay:.1f}s: {path}")
                    await asyncio.sleep(delay)

            except ServerError as e:
                last_exception = e

                # Don't retry if this was the last attempt
                if attempt < config.max_retries:
                    delay = self._calculate_backoff(attempt)
                    logger.warning(f"Server error, retry {attempt + 1}/{config.max_retries} in {delay:.1f}s: {path}")
                    await asyncio.sleep(delay)

            except (NetworkError, TimeoutError) as e:
                last_exception = e

                # Don't retry if this was the last attempt
                if attempt < config.max_retries:
                    delay = self._calculate_backoff(attempt)
                    logger.warning(f"Network error, retry {attempt + 1}/{config.max_retries} in {delay:.1f}s: {path}")
                    await asyncio.sleep(delay)

            except KickbaseError:
                # Don't retry client errors (400, 401, 403, 404)
                # These won't succeed on retry
                raise

        # All retries failed
        logger.error(f"Request failed after {config.max_retries} retries: {method} {path}")
        raise last_exception

    def _calculate_backoff(self, attempt: int) -> float:
        """
        Calculate wait time using exponential backoff.

        attempt 0: 1 second
        attempt 1: 2 seconds
        attempt 2: 4 seconds
        attempt 3: 8 seconds
        ... capped at retry_max_delay
        """
        delay = config.retry_base_delay * (2 ** attempt)
        return min(delay, config.retry_max_delay)
