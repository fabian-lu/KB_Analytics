"""Custom exceptions for Kickbase API errors."""


class KickbaseError(Exception):
    """Base exception for all Kickbase errors."""

    def __init__(self, message: str, detail: dict | None = None):
        self.message = message
        self.detail = detail or {}
        super().__init__(self.message)


# --- HTTP Errors (from Kickbase API responses) ---


class ValidationError(KickbaseError):
    """400 - Bad request, invalid data sent."""

    pass


class AuthenticationError(KickbaseError):
    """401 - Invalid credentials or expired token."""

    pass


class AuthorizationError(KickbaseError):
    """403 - Not allowed to access this resource."""

    pass


class NotFoundError(KickbaseError):
    """404 - Resource not found."""

    pass


class RateLimitError(KickbaseError):
    """429 - Too many requests, slow down."""

    def __init__(self, message: str, retry_after: int | None = None, detail: dict | None = None):
        super().__init__(message, detail)
        self.retry_after = retry_after  # Seconds to wait before retrying


class ServerError(KickbaseError):
    """500+ - Kickbase server error."""

    pass


# --- Network Errors (connection issues) ---


class NetworkError(KickbaseError):
    """Failed to connect to Kickbase API."""

    pass


class TimeoutError(KickbaseError):
    """Request timed out."""

    pass
