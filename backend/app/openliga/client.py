"""
Async HTTP client for OpenLigaDB API.

Simpler than Kickbase client - no authentication required.
Includes retry logic with exponential backoff.
"""

import logging
from typing import Any

import httpx

from app.openliga.config import settings
from app.openliga.exceptions import (
    NetworkError,
    NotFoundError,
    OpenLigaError,
    ServerError,
    TimeoutError,
)

logger = logging.getLogger(__name__)


class OpenLigaClient:
    """
    Async HTTP client for OpenLigaDB API.

    No authentication needed - OpenLigaDB is a public API.

    Usage:
        client = OpenLigaClient()
        table = await client.get("/getbltable/bl1/2024")
    """

    def __init__(self):
        self.base_url = settings.base_url
        self.timeout = settings.timeout
        self.max_retries = settings.max_retries

    async def get(self, endpoint: str) -> Any:
        """
        Make GET request to OpenLigaDB API.

        Args:
            endpoint: API endpoint (e.g., "/getbltable/bl1/2024")

        Returns:
            Parsed JSON response

        Raises:
            NotFoundError: Resource not found (404)
            ServerError: Server error (5xx)
            NetworkError: Connection failed
            TimeoutError: Request timed out
        """
        url = f"{self.base_url}{endpoint}"

        for attempt in range(self.max_retries):
            try:
                logger.debug(f"OpenLigaDB request: GET {endpoint} (attempt {attempt + 1})")

                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.get(url)

                # Handle HTTP errors
                if response.status_code == 404:
                    raise NotFoundError(f"Not found: {endpoint}")
                elif response.status_code >= 500:
                    raise ServerError(response.status_code)
                elif response.status_code >= 400:
                    raise OpenLigaError(f"HTTP {response.status_code}: {response.text}")

                return response.json()

            except httpx.TimeoutException:
                logger.warning(f"OpenLigaDB timeout (attempt {attempt + 1}/{self.max_retries})")
                if attempt == self.max_retries - 1:
                    raise TimeoutError()
                continue

            except httpx.RequestError as e:
                logger.warning(f"OpenLigaDB network error: {e} (attempt {attempt + 1}/{self.max_retries})")
                if attempt == self.max_retries - 1:
                    raise NetworkError(str(e))
                continue

            except (NotFoundError, ServerError, OpenLigaError):
                # Don't retry client errors or known server errors
                raise

        raise OpenLigaError("Max retries exceeded")
