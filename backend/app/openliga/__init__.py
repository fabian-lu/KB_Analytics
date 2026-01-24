"""
OpenLigaDB API client package.

Provides access to Bundesliga data (table, matches, etc.) from OpenLigaDB.

Usage:
    from app.openliga.services import get_bundesliga_table

    table = await get_bundesliga_table(season="2024")
    for team in table:
        print(f"{team.short_name}: {team.points} pts")
"""

from app.openliga.client import OpenLigaClient

__all__ = ["OpenLigaClient"]
