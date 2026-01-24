"""
Configuration for OpenLigaDB API client.

Uses pydantic-settings to load from environment variables.
All settings have sensible defaults since OpenLigaDB is a public API.
"""

from pydantic_settings import BaseSettings


class OpenLigaSettings(BaseSettings):
    """
    OpenLigaDB API settings.

    Override via environment variables prefixed with OPENLIGA_:
        OPENLIGA_BASE_URL=https://api.openligadb.de
        OPENLIGA_TIMEOUT=30
    """

    base_url: str = "https://api.openligadb.de"
    timeout: int = 30  # seconds
    max_retries: int = 3

    model_config = {"env_prefix": "OPENLIGA_"}


# Singleton instance
settings = OpenLigaSettings()
