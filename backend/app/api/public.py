"""
Public API endpoints - no authentication required.

These endpoints are accessible to everyone, even without login.
"""

from fastapi import APIRouter

from app.models.public import BundesligaTableResponse, TeamStanding
from app.openliga.services import get_bundesliga_table

router = APIRouter()


@router.get(
    "/table",
    response_model=BundesligaTableResponse,
    summary="Get Bundesliga table",
    description="Returns the current Bundesliga standings. No authentication required.",
)
async def get_table(season: str = "2024") -> BundesligaTableResponse:
    """
    Get current Bundesliga table.

    Args:
        season: Season year (e.g., "2024" for 2024/25 season)
    """
    openliga_standings = await get_bundesliga_table(season)

    # Convert to API response models, adding position
    standings = [
        TeamStanding(
            position=i + 1,
            team_name=team.team_name,
            short_name=team.short_name,
            team_icon_url=team.team_icon_url,
            points=team.points,
            matches=team.matches,
            won=team.won,
            draw=team.draw,
            lost=team.lost,
            goals=team.goals,
            opponent_goals=team.opponent_goals,
            goal_diff=team.goal_diff,
        )
        for i, team in enumerate(openliga_standings)
    ]

    return BundesligaTableResponse(
        season=season,
        standings=standings,
    )
