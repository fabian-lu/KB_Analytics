"""
Cached data fetching services for Kickbase API.

This module provides cached wrappers around KickbaseClient methods.
Each function fetches data from a single Kickbase endpoint and caches the result.

The @cached decorator handles caching automatically:
- Cache key is generated from function name + arguments (excluding 'token')
- If Redis is unavailable, functions still work (just without caching)

Usage:
    from app.kickbase.services import get_squad

    squad = await get_squad(league_id="123", token="abc")
    for player in squad.players:
        print(player.name, player.market_value)
"""

from app.cache import cached
from app.kickbase import KickbaseClient
from app.kickbase.models import (
    KickbaseLeagueMe,
    KickbaseLineupResponse,
    KickbaseRankingResponse,
    KickbaseSquadResponse,
)


@cached(ttl=300)  # 5 minutes
async def get_league_me(league_id: str, token: str) -> KickbaseLeagueMe:
    """
    Get user's league info (budget, team composition).

    Kickbase endpoint: GET /leagues/{league_id}/me
    """
    client = KickbaseClient(token=token)
    data = await client.get(f"/leagues/{league_id}/me")
    return KickbaseLeagueMe.model_validate(data)


@cached(ttl=300)  # 5 minutes
async def get_ranking(league_id: str, token: str) -> KickbaseRankingResponse:
    """
    Get league standings/rankings.

    Kickbase endpoint: GET /leagues/{league_id}/ranking
    Returns: All managers with their points, team value, placement.
    """
    client = KickbaseClient(token=token)
    data = await client.get(f"/leagues/{league_id}/ranking")
    return KickbaseRankingResponse.model_validate(data)


@cached(ttl=300)  # 5 minutes
async def get_squad(league_id: str, token: str) -> KickbaseSquadResponse:
    """
    Get user's squad (all owned players).

    Kickbase endpoint: GET /leagues/{league_id}/squad
    Returns: All players with market value, points, position, etc.
    """
    client = KickbaseClient(token=token)
    data = await client.get(f"/leagues/{league_id}/squad")
    return KickbaseSquadResponse.model_validate(data)


@cached(ttl=60)  # 1 minute (lineup changes more often)
async def get_lineup(league_id: str, token: str) -> KickbaseLineupResponse:
    """
    Get user's current lineup.

    Kickbase endpoint: GET /leagues/{league_id}/lineup
    Returns: All players with lineup_order (None = bench, 0-10 = starting).
    """
    client = KickbaseClient(token=token)
    data = await client.get(f"/leagues/{league_id}/lineup")
    return KickbaseLineupResponse.model_validate(data)
