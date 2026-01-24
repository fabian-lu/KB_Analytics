"""Kickbase API client package."""

from app.kickbase.client import KickbaseClient
from app.kickbase.config import KickbaseConfig, config
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
from app.kickbase.models import (
    KickbaseLeague,
    KickbaseLoginResponse,
    KickbaseUser,
)

__all__ = [
    # Client
    "KickbaseClient",
    "KickbaseConfig",
    "config",
    # Exceptions
    "KickbaseError",
    "AuthenticationError",
    "AuthorizationError",
    "ValidationError",
    "NotFoundError",
    "RateLimitError",
    "ServerError",
    "NetworkError",
    "TimeoutError",
    # Models (for parsing Kickbase responses)
    "KickbaseUser",
    "KickbaseLeague",
    "KickbaseLoginResponse",
]
