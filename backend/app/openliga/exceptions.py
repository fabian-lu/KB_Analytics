"""
Custom exceptions for OpenLigaDB API interactions.

Mirrors the structure of kickbase/exceptions.py for consistency.
"""


class OpenLigaError(Exception):
    """Base exception for all OpenLigaDB errors."""

    def __init__(self, message: str = "An error occurred with OpenLigaDB"):
        self.message = message
        super().__init__(self.message)


class NetworkError(OpenLigaError):
    """Failed to connect to OpenLigaDB API."""

    def __init__(self, message: str = "Failed to connect to OpenLigaDB"):
        super().__init__(message)


class TimeoutError(OpenLigaError):
    """Request to OpenLigaDB timed out."""

    def __init__(self, message: str = "Request to OpenLigaDB timed out"):
        super().__init__(message)


class ServerError(OpenLigaError):
    """OpenLigaDB server returned 5xx error."""

    def __init__(self, status_code: int, message: str = "OpenLigaDB server error"):
        self.status_code = status_code
        super().__init__(f"{message} (HTTP {status_code})")


class NotFoundError(OpenLigaError):
    """Requested resource not found (404)."""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(message)
