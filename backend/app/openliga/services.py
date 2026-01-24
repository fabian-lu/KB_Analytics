"""
Cached data fetching services for OpenLigaDB API.

Similar to kickbase/services.py - cached wrappers that return Pydantic models.
"""

from app.cache import cached
from app.openliga.client import OpenLigaClient
from app.openliga.models import OpenLigaTeamStanding


@cached(ttl=1200)  # 20 minutes - table doesn't change often
async def get_bundesliga_table(season: str = "2024") -> list[OpenLigaTeamStanding]:
    """
    Get current Bundesliga table.

    Args:
        season: Season year (e.g., "2024" for 2024/25 season)

    Returns:
        List of team standings, ordered by position
    """
    client = OpenLigaClient()
    data = await client.get(f"/getbltable/bl1/{season}")

    # Parse each team into Pydantic model
    return [OpenLigaTeamStanding.model_validate(team) for team in data]
