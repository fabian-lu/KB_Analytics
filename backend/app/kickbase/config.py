"""Configuration for Kickbase API client."""

from pydantic_settings import BaseSettings


class KickbaseConfig(BaseSettings):
    """
    Kickbase client configuration.

    Values can be overridden via environment variables:
    - KICKBASE_BASE_URL
    - KICKBASE_TIMEOUT
    - KICKBASE_MAX_RETRIES
    - etc.
    """

    # API base URL
    base_url: str = "https://api.kickbase.com/v4"

    # Request timeout in seconds
    timeout: float = 30.0

    # Connection timeout (time to establish connection)
    connect_timeout: float = 10.0

    # Retry settings
    max_retries: int = 3
    retry_codes: list[int] = [429, 500, 502, 503, 504]  # HTTP codes that trigger retry

    # Backoff settings (wait time between retries)
    retry_base_delay: float = 1.0   # Start with 1 second
    retry_max_delay: float = 30.0   # Never wait more than 30 seconds

    class Config:
        # Prefix for environment variables
        # e.g., KICKBASE_BASE_URL, KICKBASE_TIMEOUT
        env_prefix = "KICKBASE_"


# Global config instance - import this in other files
config = KickbaseConfig()
