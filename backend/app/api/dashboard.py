"""
Dashboard API endpoint.

Combines data from multiple Kickbase endpoints into a single dashboard response.
All calculations (€/point, averages, sorting) happen here.
"""

from fastapi import APIRouter, Depends

from app.dependencies import get_token
from app.kickbase.models import (
    KickbaseRankingUser,
    KickbaseSquadPlayer,
)
from app.kickbase.services import (
    get_league_me,
    get_lineup,
    get_ranking,
    get_squad,
)
from app.models.dashboard import (
    DashboardLineup,
    DashboardOverview,
    DashboardResponse,
    PlayerSummary,
)

router = APIRouter()


def _build_player_summary(player: KickbaseSquadPlayer) -> PlayerSummary:
    """
    Convert Kickbase squad player to PlayerSummary.

    Calculates euros_per_point from market_value and avg_points.
    """
    # Calculate €/point (None if no points to avoid division by zero)
    euros_per_point = None
    if player.avg_points > 0:
        euros_per_point = player.market_value / player.avg_points

    return PlayerSummary(
        id=player.id,
        name=player.name,
        position=player.position,
        team_id=player.team_id,
        profile_image=player.profile_image,
        market_value=player.market_value,
        total_points=player.total_points,
        avg_points=float(player.avg_points),
        euros_per_point=euros_per_point,
    )


def _find_user_rank(users: list[KickbaseRankingUser], user_id: str) -> tuple[int, int]:
    """
    Find user's rank in the league.

    Returns: (rank, total_managers)
    """
    total = len(users)
    for user in users:
        if user.id == user_id:
            return user.season_placement, total
    return total, total


def _calculate_avg_points_per_matchday(
    users: list[KickbaseRankingUser], user_id: str, matchday: int
) -> float:
    """Calculate user's average points per matchday."""
    for user in users:
        if user.id == user_id:
            if matchday > 0:
                return round(user.season_points / matchday, 1)
            return 0.0
    return 0.0


def _get_team_value(users: list[KickbaseRankingUser], user_id: str) -> int:
    """Get user's team value from ranking data."""
    for user in users:
        if user.id == user_id:
            return int(user.team_value)
    return 0


@router.get(
    "/leagues/{league_id}/dashboard",
    response_model=DashboardResponse,
    summary="Get dashboard data",
    description="Returns all data needed for the dashboard: overview stats, best/worst value players, and lineup.",
)
async def get_dashboard(league_id: str, token: str = Depends(get_token)) -> DashboardResponse:
    """
    Get complete dashboard data for a league.

    Combines data from multiple Kickbase endpoints:
    - /leagues/{id}/me - budget
    - /leagues/{id}/ranking - standings, team value
    - /leagues/{id}/squad - all players
    - /leagues/{id}/lineup - starting/bench split

    Calculates:
    - €/point for each player
    - Best/worst value players (sorted by €/point)
    - Average points per matchday
    """
    # 1. Fetch all data (each call is cached separately, returns Pydantic models)
    league_me = await get_league_me(league_id, token)
    ranking = await get_ranking(league_id, token)
    squad = await get_squad(league_id, token)
    lineup = await get_lineup(league_id, token)

    # 2. Find our user ID by matching lineup player IDs
    lineup_player_ids = {player.id for player in lineup.players}

    user_id = None
    for user in ranking.users:
        user_lineup_ids = {str(pid) for pid in user.lineup_player_ids}
        if user_lineup_ids & lineup_player_ids:
            user_id = user.id
            break

    # Fallback: just use first user
    if not user_id and ranking.users:
        user_id = ranking.users[0].id

    # 3. Build overview
    rank, total_managers = _find_user_rank(ranking.users, user_id)
    avg_points = _calculate_avg_points_per_matchday(ranking.users, user_id, ranking.matchday)
    team_value = _get_team_value(ranking.users, user_id)

    overview = DashboardOverview(
        rank=rank,
        total_managers=total_managers,
        avg_points_per_matchday=avg_points,
        team_value=team_value,
        budget=int(league_me.budget),
    )

    # 4. Build player summaries from squad
    players = [_build_player_summary(p) for p in squad.players]

    # 5. Find best/worst value players (by €/point)
    # Lower €/point = better value (you pay less per point)
    valid_players = [p for p in players if p.euros_per_point is not None]
    sorted_by_value = sorted(valid_players, key=lambda p: p.euros_per_point)

    best_value = sorted_by_value[:3]
    worst_value = sorted_by_value[-3:][::-1]

    # 6. Build lineup (split into starting and bench)
    # Create a map of player_id -> lineup_order for players in starting lineup
    # lineup_order is None for bench, 0-10 for starting
    lineup_order_map: dict[str, int] = {
        player.id: player.lineup_order
        for player in lineup.players
        if player.lineup_order is not None
    }

    starting_players: list[tuple[int, PlayerSummary]] = []
    bench_players: list[PlayerSummary] = []

    for player in players:
        if player.id in lineup_order_map:
            lineup_order = lineup_order_map[player.id]
            starting_players.append((lineup_order, player))
        else:
            bench_players.append(player)

    # Sort starting by lineup order
    starting_players.sort(key=lambda x: x[0])
    starting = [p for _, p in starting_players]

    # Determine formation from starting 11
    # Count by position: 1=GK, 2=DEF, 3=MID, 4=FWD
    pos_counts = {1: 0, 2: 0, 3: 0, 4: 0}
    for player in starting:
        pos_counts[player.position] = pos_counts.get(player.position, 0) + 1

    formation = f"{pos_counts[2]}-{pos_counts[3]}-{pos_counts[4]}"

    dashboard_lineup = DashboardLineup(
        formation=formation,
        starting=starting,
        bench=bench_players,
    )

    # 7. Return complete dashboard
    return DashboardResponse(
        overview=overview,
        best_value_players=best_value,
        worst_value_players=worst_value,
        lineup=dashboard_lineup,
    )
