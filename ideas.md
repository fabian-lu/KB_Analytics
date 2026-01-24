# Backend API - Data Requirements

This document lists what data we need to expose through our backend API for the frontend.

**Source:** [Kickbase API v4 Documentation](https://kevinskyba.github.io/kickbase-api-doc/index.html)

---

## 1. Manager/User Data

Data about the logged-in user and their league status.

| Data | Source Endpoint | Notes |
|------|-----------------|-------|
| Manager name | `/v4/user/login` | Already have from login |
| Manager rank in league | `/v4/leagues/{id}/ranking` | Position in standings |
| Money in bank (budget) | `/v4/leagues/{id}/me` | Available budget |
| Total team value | `/v4/leagues/{id}/me` or calculated from squad | Sum of player values |
| Team points (total) | `/v4/leagues/{id}/me` | Season points |
| Performance history | `/v4/leagues/{id}/managers/{userId}/performance` | Points per matchday |

---

## 2. League Data

Info about the league the user is in.

| Data | Source Endpoint | Notes |
|------|-----------------|-------|
| League name | `/v4/user/login` | Already have from login |
| All managers + rankings | `/v4/leagues/{id}/ranking` | Standings table |
| Other managers' squads | `/v4/leagues/{id}/managers/{userId}/squad` | See competitors' teams |
| Other managers' lineups | `/v4/leagues/{id}/users/{userId}/teamcenter` | Their starting 11 |
| Activity feed | `/v4/leagues/{id}/activitiesFeed` | Transfers, trades, etc. |
| League settings | `/v4/leagues/{id}/overview` | Rules, point multipliers |

---

## 3. Player Data

Stats for individual players.

| Data | Source Endpoint | Notes |
|------|-----------------|-------|
| All Bundesliga players | `/v4/competitions/{id}/players` | Full player database |
| Player search | `/v4/competitions/{id}/players/search` | Paginated search |
| Player details | `/v4/leagues/{id}/players/{playerId}` | Full stats |
| Performance history | `/v4/leagues/{id}/players/{playerId}/performance` | Points per matchday |
| Market value history | `/v4/leagues/{id}/players/{playerId}/marketvalue/{timeframe}` | Value trend |
| Transfer history | `/v4/leagues/{id}/players/{playerId}/transfers` | Past transfers |
| Player events | `/v4/competitions/{id}/playercenter/{playerId}` | Goals, assists, cards |

**Calculated metrics (our backend):**

| Metric | Calculation |
|--------|-------------|
| Average points (season) | `sum(points) / matchdays_played` |
| Average points (last 3/5 games) | Rolling average |
| Std deviation | From performance history |
| € per point | `market_value / avg_points` |
| Form trend | Compare recent avg vs season avg |

---

## 4. Squad Data

The user's own team.

| Data | Source Endpoint | Notes |
|------|-----------------|-------|
| All owned players | `/v4/leagues/{id}/squad` | With values, stats |
| Current lineup | `/v4/leagues/{id}/lineup` | Starting 11 |
| Update lineup | `POST /v4/leagues/{id}/lineup` | Set formation |
| Scouted players | `/v4/leagues/{id}/scoutedplayers` | Watchlist |

---

## 5. Transfer Market

Buying and selling players.

| Data | Source Endpoint | Notes |
|------|-----------------|-------|
| Players on market | `/v4/leagues/{id}/market` | Current listings |
| Place offer | `POST /v4/leagues/{id}/market/{playerId}/offers` | Bid on player |
| List player | `POST /v4/leagues/{id}/market` | Sell player |
| Accept/decline offers | Various DELETE endpoints | Manage offers |

---

## 6. Bundesliga/Competition Data

Real-world football data.

| Data | Source Endpoint | Notes |
|------|-----------------|-------|
| League table | `/v4/competitions/{id}/table` | Standings |
| Fixtures/matchdays | `/v4/competitions/{id}/matchdays` | Schedule + scores |
| Team profiles | `/v4/competitions/{id}/teams/{teamId}/teamprofile` | All players in club |
| Match details | `/v4/matches/{matchId}/details` | Lineups, events, scores |

**Useful for:**
- Fixture difficulty analysis
- Team form
- Upcoming opponent strength

---

## 7. Live/Matchday Data

Real-time during matches.

| Data | Source Endpoint | Notes |
|------|-----------------|-------|
| Live lineup | `/v4/leagues/{id}/teamcenter/myeleven` | Current matchday |
| Live events | `/v4/live/eventtypes` | Event definitions |
| Match details | `/v4/matches/{matchId}/details` | Live scores, events |

---

## 8. Additional Ideas

Features we could add beyond raw API data:

### Analytics (calculated)
- **Points projection** - ML model predicting next matchday points
- **Optimal lineup suggestion** - Best 11 based on expected points
- **Value for money ranking** - Best € per point players
- **Undervalued players** - High points, low value
- **Risk assessment** - High std deviation = inconsistent

### Comparisons
- **Squad comparison** - Your team vs other managers
- **Player comparison** - Side-by-side stats
- **Historical performance** - This season vs last season

### Alerts/Notifications
- **Price changes** - Player value went up/down
- **Injury updates** - Player availability changed
- **Market activity** - Someone bid on your player

### External Data (future)
- **News/RSS feeds** - Transfer rumors, injury news
- **Betting odds** - Match predictions
- **Expected goals (xG)** - Advanced stats

---

## Priority Order

Suggested implementation order:

### Phase 1: Core Data
1. `/leagues/{id}/me` - Budget, team value, rank
2. `/leagues/{id}/squad` - User's players
3. `/leagues/{id}/ranking` - League standings
4. `/leagues/{id}/lineup` - Starting 11

### Phase 2: Player Analytics
5. `/competitions/{id}/players` - All players
6. `/players/{id}/performance` - Point history
7. Calculated metrics (avg, std dev, € per point)

### Phase 3: Market & Competition
8. `/leagues/{id}/market` - Transfer market
9. `/competitions/{id}/table` - Bundesliga standings
10. `/competitions/{id}/matchdays` - Fixtures

### Phase 4: Advanced
11. Other managers' data
12. ML predictions
13. Notifications/alerts

---

## 9. Undocumented Endpoints (from APK)

Found in the old repo's screenshot folder - endpoints extracted from the Kickbase APK that aren't in the public documentation.

### High Value (for our use case)

| Endpoint | What it does |
|----------|--------------|
| `GET /v4/base/predictions/teams/{competitionId}` | **Kickbase's own predictions!** |
| `GET /v4/base/news/{competitionId}` | News feed from Kickbase |
| `GET /v4/base/news/permanent/{competitionId}` | Permanent/pinned news |
| `POST /v4/leagues/{leagueId}/lineup/fill` | **Auto-fill lineup** |
| `GET /v4/challenges/{challengeId}/perfectlineup` | **Perfect lineup suggestion** |
| `GET /v4/leagues/{leagueId}/lineup/selection` | Player selection pool |
| `GET /v4/leagues/{leagueId}/lineup/overview` | Lineup overview/summary |

### Lineup Management

| Endpoint | Method | Notes |
|----------|--------|-------|
| `/v4/leagues/{leagueId}/lineup/fill` | POST | Auto-fill best lineup |
| `/v4/leagues/{leagueId}/lineup/clear` | POST | Clear current lineup |
| `/v4/leagues/{leagueId}/lineup/teams` | GET | Teams available for selection |
| `/v4/leagues/{leagueId}/lineup/selection` | GET | Players available |
| `/v4/leagues/{leagueId}/lineup/overview` | GET | Current lineup summary |

### User/Account

| Endpoint | Method | Notes |
|----------|--------|-------|
| `/v4/user/me` | GET | Current user info |
| `/v4/user/refreshtokens` | POST | Refresh auth tokens |
| `/v4/settings/subscriptionStatus` | GET | Premium/subscription status |

### League Admin

| Endpoint | Method | Notes |
|----------|--------|-------|
| `/v4/leagues` | POST | Create new league |
| `/v4/leagues/{leagueId}/join` | POST | Join a league |
| `/v4/leagues/{leagueId}/join/{code}` | POST | Join with invite code |
| `/v4/leagues/{leagueId}/reset` | POST | Reset league (admin) |
| `/v4/leagues/{leagueId}/resetteams` | POST | Reset all teams (admin) |
| `/v4/leagues/{leagueId}/image` | GET/POST | League image |
| `/v4/invitations/{code}/validate` | GET | Validate invite code |
| `/v4/invitations/{leagueId}/code` | GET | Get league invite code |

### Challenge Lobby (extra)

| Endpoint | Method | Notes |
|----------|--------|-------|
| `/v4/challenges/lobby/overview` | GET | Challenge lobby overview |
| `/v4/challenges/lobby/divisionLadder` | GET | Division rankings |
| `/v4/challenges/lobby/skillPoints/summary` | GET | Skill points summary |
| `/v4/challenges/lobby/skillPoints/collect` | POST | Collect skill points |
| `/v4/challenges/{challengeId}/perfectlineup` | GET | **Optimal lineup!** |
| `/v4/challenges/socialhub` | GET/POST | Social features |

### Other

| Endpoint | Method | Notes |
|----------|--------|-------|
| `/v4/base/stage` | GET | Unknown - game stage? |
| `/v4/base/items/{itemId}` | GET | In-app items |
| `/v4/config/version` | GET | API version |
| `/v4/refiner/identify` | GET | Analytics/tracking? |
| `/v4/products` | GET | In-app purchases |
| `/v4/leagues/recommended` | GET | Recommended leagues |
| `/v4/leagues/{leagueId}/players/{playerId}/transferHistory` | GET | Full transfer history |

---

## Notes

- Competition ID for Bundesliga: need to find from `/v4/config`
- All endpoints require auth token except login
- Consider caching strategies (see backend README)
- **Undocumented endpoints may change without notice** - use with caution
