# Feature Ideas

Organized by main page. Each page has subpages that group related features.


---

## Market

**All Bundesliga players** - a scouting/research tool independent of your league.
Think of it as the "player database" for the entire Bundesliga.

### Subpage: Players
Full Bundesliga player database with powerful filtering and sorting.

| Feature | Description | Priority |
|---------|-------------|----------|
| Advanced Filters | Position, price range, team, form, PPM, age | High |
| Sort Options | By value, points, PPM, form trend, value change | High |
| Quick Filter Chips | Hot (rising value), Falling, Top PPM, Top Points | High |
| Value Trend Badges | Today/7d/30d market value change per player | High |
| Friday Projection | Projected value by next matchday | Medium |
| Efficiency Score | Points per million (PPM) calculation | Medium |
| Form Indicator | 5-game moving average vs season average | Medium |
| Raw Points Display | Show raw points alongside total points | Medium |
| Stability Rating | Variance/consistency (high floor vs boom-or-bust) | Low |
| Injury Status | Current injuries, expected return | Medium |
| Rotation Risk | Flag players likely rotated (European games, congestion) | Medium |
| Home/Away Splits | Performance difference home vs away | Medium |
| Set Piece Taker | Flag penalty/free kick takers (goal likelihood) | Medium |
| Points per Minute | Normalized points for fair comparison | Medium |
| New Signing Badge | Mark fresh Bundesliga transfers (sleeper potential) | Low |
| Comeback Watch | Players returning from injury, worth monitoring | Medium |
| Result Sensitivity | Avg points in team wins vs draws vs losses; shows how result-dependent a player is (also in Player Modal > Stats) | Medium |

### Subpage: Analysis
Charts and tools to analyze player performance and value.

| Feature | Description | Priority |
|---------|-------------|----------|
| Value vs Points Chart | Scatter plot showing over/underperformers | High |
| Raw Points Rankings | Players ranked by raw points (pure performance) | High |
| Position Comparison | Average PPM/points by position, find outliers | High |
| Hot Form Players | Biggest positive form trends (5-game avg vs season) | High |
| Cold Streaks | Players in poor form | High |
| Value Momentum | Players with accelerating/decelerating value change | Medium |
| Hidden Gems Algorithm | AI-suggested undervalued players | Medium |
| Similar Players (Clustering) | "Can't afford Wirtz? Here are similar cheaper options" | Medium |
| Price History Chart | Historical market value for any player | Medium |
| Bundesliga Average Lines | Compare player to position average | Medium |
| Raw Points Breakdown | What contributes to raw points (passes, tackles, etc.) | Medium |
| Breakout Candidates | Young/cheap players showing improvement | Low |

**Raw Points Explained:**
Raw points = pure in-game performance actions only (passes, tackles, duels, interceptions, etc.)
Stripped of: Starting 11 bonus, minutes bonus, goals, assists, clean sheets, SDS.
Shows who's actually *doing things* on the pitch - workrate/involvement metric.

### Subpage: Compare
Side-by-side player comparison tools.

| Feature | Description | Priority |
|---------|-------------|----------|
| Player Comparison | 2-4 players side by side, all stats | High |
| Spider/Radar Chart | Visual comparison across multiple metrics | High |
| Raw Points Comparison | Compare players' raw performance directly | Medium |
| Position Rankings | Best players at each position | Medium |
| Team Rankings | Which Bundesliga teams generate most points | Medium |

### Subpage: Matchups
Fixture analysis - which players have easy/hard games coming up.

| Feature | Description | Priority |
|---------|-------------|----------|
| Fixture Difficulty | How hard are upcoming games for each team | High |
| Best Matchups | Which players have favorable fixtures | High |
| Team Vulnerability | Which teams concede most points to positions | Medium |
| Clean Sheet Odds | Probability of clean sheet per fixture | Medium |
| Schedule Lookahead | Color-coded fixture difficulty for next 5 matchdays | Medium |

### Subpage: Best XI
Best possible team for each matchday (historical analysis).

| Feature | Description | Priority |
|---------|-------------|----------|
| Best Team per Matchday | Optimal 11 players for each past matchday | High |
| Auto Formation | Derives best formation automatically | High |
| Total Points | What this dream team would have scored | High |
| Position Breakdown | Best GK, DEFs, MIDs, FWDs per matchday | Medium |
| Season Dream Team | Best overall 11 across the entire season | Medium |
| Compare to Yours | How your lineup compared to the optimal | Medium |

### Subpage: Watchlist
Track players you're interested in.

| Feature | Description | Priority |
|---------|-------------|----------|
| Add to Watchlist | Save players for monitoring | High |
| Watchlist Dashboard | All your watched players with key stats | High |
| Quick Filters | Filter by position, price range, form | Medium |
| Quick Actions | Easy access to player details, comparison | Medium |
| Notes | Add personal notes to watched players | Low |

---

## Dashboard (existing, additional features)

The Dashboard already exists. These are additional features to add.

### Countdown Timer Enhancement
| Feature | Description | Priority |
|---------|-------------|----------|
| Go Live Button | Button next to timer to jump to League > Live | High |
| Context-aware | Shows "Watch Live" during games, "Lineup Deadline" before | Medium |
| Deadline Urgency | Highlight urgent actions before deadline closes | Medium |

### Quick Actions Section
| Feature | Description | Priority |
|---------|-------------|----------|
| Sell Suggestions | Your players trending down, suggest selling | High |
| Buy Opportunities | Hot players available that fit your budget | Medium |
| Lineup Reminders | Players with bad matchups in your starting 11 | Medium |

### News Section
Bundesliga news relevant to the user.

| Feature | Description | Priority |
|---------|-------------|----------|
| General Bundesliga News | Latest news from the league | High |
| My Squad News | News specifically about players in your squad | High |
| Injury Updates | Injury news for your players | High |
| Transfer Rumors | Rumors about your players or targets | Medium |
| News Sources | Aggregate from Kicker, Ligainsider, etc. | Medium |

---

## League

**Your Kickbase league** - everything about managers, transfers, standings.
This is league-specific data tied to your Kickbase account.

### Subpage: Live
Real-time matchday view while games are ongoing.

| Feature | Description | Priority |
|---------|-------------|----------|
| Live Standings | Current matchday points per manager, updating live | High |
| Live Player Points | Points accumulating for each player in real-time | High |
| Your Lineup Live | Your starting 11 with live points | High |
| Match Scores | Current Bundesliga match scores | High |
| Projected Final | Estimated final points based on current performance | Medium |
| Position Changes | Who's gaining/losing positions during matchday | Medium |
| Notifications | Alert when you take/lose the lead | Low |

**Note:** Only active during matchdays. Shows "No live games" otherwise.

### Subpage: Standings
League table and historical rankings.

| Feature | Description | Priority |
|---------|-------------|----------|
| Current Standings | League table with points, team value, budget | High |
| Ranking History Chart | How positions changed over the season | High |
| Matchday Winners | Who won each matchday, with points | High |
| Points by Position | Breakdown of points from GK/DEF/MID/FWD per manager | Medium |
| Matchday Breakdown | Detailed points per manager per matchday | Medium |

### Subpage: Managers
Detailed view of each manager in your league.

| Feature | Description | Priority |
|---------|-------------|----------|
| Manager Profiles | Team value, budget, total points, achievements | High |
| Squad Lineup View | Reusable lineup component (same as Dashboard) showing their squad | High |
| Investment Capacity | How much each manager CAN spend (based on sellable value) | High |
| Value Changes | See how their players' values are changing (like your Dashboard) | Medium |
| Manager Stats | Avg points/matchday, best/worst matchday, consistency | Medium |
| Kickbase Achievements | Display manager's actual Kickbase achievements | Medium |
| Bench Strength | Compare bench quality across managers | Medium |
| Manager Activity | How active (transfers/week, engagement level) | Medium |

**Note:** The lineup/squad component should be reusable across Dashboard and Manager profiles.

### Subpage: Transfer Market
Players currently listed for sale in your league.

| Feature | Description | Priority |
|---------|-------------|----------|
| Listed Players | All players on the transfer market right now | High |
| Filter/Sort | By position, price, value trend, seller | High |
| Time Listed | How long has player been on market | Medium |
| Asking Price vs Value | Compare listing price to market value | Medium |
| Seller Info | Which manager is selling | High |

### Subpage: Transfers
All transfer activity in your league.

| Feature | Description | Priority |
|---------|-------------|----------|
| Transfer Feed | Chronological list of all transfers | High |
| Filter by Manager | See only one manager's activity | High |
| Filter by Player | See a player's ownership history in this league | Medium |
| Top Transfers (7d) | Biggest/most expensive recent transfers | Medium |
| Transfer Stats | Total transfers per manager, avg price paid | Medium |

### ~~Subpage: Traders~~ (Not a standalone subpage)
> **Note:** Traders features will be integrated into other subpages (e.g., Managers or Transfers). Not implemented as a separate tab.

Who's good at buying/selling in your league.

| Feature | Description | Priority |
|---------|-------------|----------|
| Best Traders Ranking | Managers with best ROI on transfers | High |
| Worst Traders Ranking | Managers who overpay most | High |
| Overpay Pattern Analysis | Find behavioral patterns per manager | High |
| Flip Profits | Who made money buying low, selling high | Medium |
| Transfer Volume | Who trades most/least | Low |

**Overpay Pattern Analysis:**
- Average overpay % per manager
- Overpay behavior for expensive vs cheap players
- Rounding patterns (always rounds to X value)
- Time-based patterns (overpays near deadline?)
- Position preferences (overpays for forwards?)

### ~~Subpage: Head-to-Head~~ (Not a standalone subpage)
> **Note:** Head-to-Head features will be integrated into other subpages (e.g., Managers). Not implemented as a separate tab.

Compare your team directly with another manager.

| Feature | Description | Priority |
|---------|-------------|----------|
| Team Comparison | Your squad vs theirs, all stats | High |
| Position Matchup | Compare your GKs vs theirs, DEFs vs theirs, etc. | Medium |
| Historical H2H | Matchday-by-matchday comparison over season | Medium |
| Strength/Weakness | Where you're stronger/weaker than opponent | Medium |

---

## Insights

AI/ML-powered features and decision support tools.

### Subpage: Predictions
ML-powered forecasts.

| Feature | Description | Priority |
|---------|-------------|----------|
| Point Predictions | Predicted points for next matchday per player | High |
| Value Forecast | Where will market value be in 7/14/30 days | High |
| Injury Risk Model | ML prediction of injury probability (minutes, age, history) | High |
| xPoints | Expected points based on underlying stats (like xG) | High |
| Regression Alerts | Flag players due for correction (over/underperforming xPoints) | High |
| Floor/Ceiling | 10th/90th percentile outcomes per player (risk profile) | Medium |
| Win Probability | Real-time "you have 63% chance of winning this matchday" | Medium |
| Fixture Difficulty Model | ML-based difficulty (form, home/away, rest days, not just opponent) | Medium |
| Form Projections | Is player trending up or down | Medium |
| Confidence Intervals | "8 pts (95% CI: 4-12)" not just point estimates | Medium |
| Match Outcome Prediction | ML prediction of Bundesliga match results (win/draw/loss probability per team) | Medium |
| Season Projections | End-of-season point totals forecast | Low |

**xPoints Explained:**
Calculate expected points from underlying actions (passes, tackles, shots, duels, minutes).
- Actual > xPoints = overperforming (lucky, might regress down)
- Actual < xPoints = underperforming (unlucky, might regress up)
Identifies buy-low/sell-high opportunities.

### Subpage: Optimizer
Lineup and squad optimization tools.

| Feature | Description | Priority |
|---------|-------------|----------|
| Lineup Optimizer | Best 11 from your squad for next matchday | High |
| Market Optimizer | Optimize squad from market based on criteria (from old repo) | High |
| Optimization Criteria | Max avg points, max total points, best PPM, etc. | High |
| Budget Constraints | Set budget limits for optimization | High |
| Position Requirements | Specify formation/position needs | Medium |
| Trade Simulator | "What if I buy X and sell Y" - impact analysis | Medium |
| Budget Forecast | Project your budget over coming weeks | Medium |

**Market Optimizer (from old repo):**
Looks at all available players on the market and optimizes your squad based on:
- Maximize average points
- Maximize total points
- Best value (PPM)
- Custom weighted criteria

### Subpage: Assistant
LLM-powered analysis assistant with tool access.

| Feature | Description | Priority |
|---------|-------------|----------|
| Chat Interface | Ask questions about your team, market, strategy | High |
| Tool Access | LLM can query player data, run analysis, check stats | High |
| Decision Support | "Should I buy player X?" with data-backed reasoning | High |
| Explainable AI | Show WHY predictions are made (feature importance, reasoning) | High |
| Sentiment Analysis | Analyze news/social sentiment about players (buzz = value rise?) | Medium |
| Strategy Suggestions | Personalized recommendations based on your squad | Medium |
| Natural Language Queries | "Who are the best midfielders under 5M?" | Medium |
| Natural Language Insights | "Wirtz is 15% below xPoints - buy low opportunity" | Medium |

**Technical:** LangChain-style agent with access to:
- Player database
- Market data
- Your squad info
- Prediction models
- Historical data

### Subpage: Simulation (future)
Monte Carlo simulation for probabilistic outcomes.

| Feature | Description | Priority |
|---------|-------------|----------|
| Matchday Simulation | Win probability for upcoming matchday | Low |
| Season Simulation | Championship odds, expected final position | Low |
| Transfer Impact | How buying/selling affects your title odds | Low |
| Lineup Simulation | Which lineup maximizes win probability | Low |
| Confidence Intervals | 95% CI for points, positions, outcomes | Low |
| Scenario Comparison | Compare different strategies side-by-side | Low |

**How it works:**
- Each player has a point distribution (based on historical variance)
- Simulate 10,000+ matchdays/seasons
- Output: probabilities, expected values, confidence intervals
- Example: "You have 65% chance of winning, expected points: 847 (95% CI: 720-980)"

---

## Additional Ideas (Parking Lot)

Features that need more thought or don't fit cleanly.

| Feature | Description | Notes |
|---------|-------------|-------|
| Set Lineup in App | Actually set your Kickbase lineup from our app | Requires write API access |
| Season Retrospective | End-of-season summary PDF/page | Could be separate page |
| Changelog/Updates | Show users what's new in the app | Settings or footer |
| Bug/Feature Request | Let users submit feedback | Settings page |
| Position Scarcity | Are there enough good players at each position in my budget? | Market or Insights |
| What Other Leagues Pay | Compare prices across different Kickbase leagues | Requires cross-league data |
| Points Breakdown Explainer | How Kickbase calculates points | Help/Education section |

## Settings (future)

Global app settings and notifications.

| Feature | Description | Priority |
|---------|-------------|----------|
| Price Drop Alerts | Notify when player falls below threshold | Medium |
| Form Change Alerts | Notify when player's form changes significantly | Medium |
| Transfer Alerts | Notify when watched player gets listed | Medium |
| Matchday Reminders | Lineup deadline approaching | Medium |
| Custom Alerts | Build your own alert conditions | Low |
| Notification Preferences | Push, email, in-app settings | Medium |

---

## Key Metrics Reference

These should be available throughout the app:

| Metric | Formula | Use |
|--------|---------|-----|
| **PPM** (Points Per Million) | Total Points / (Market Value in M) | Core efficiency metric |
| **Raw Points** | Points from actions only (passes, tackles, duels) | Pure performance metric |
| **Form** (5-game avg) | Avg points last 5 games | Recent performance |
| **Stability** | Standard deviation of points | Consistency measure |
| **Value Change** (7d/30d) | Current value - value X days ago | Market trend |
| **Friday Projection** | Current + (daily change * days to Friday) | Timing trades |
| **Ceiling/Floor** | Position-based expected max/min points | Risk assessment |
| **ROI** | (Sell price - Buy price) / Buy price | Trading success |

---

## Key Insight from Analysis

> **88% of Kickbase points come from lineup selection alone** (just having players who play).
> Performance ratings actually contribute negatively (-4% on average).
> Goals/assists account for ~14%.

This means: **Focus on helping users pick the RIGHT players to own, not predict who will score.**
The app should emphasize:
- Player availability/fitness
- Consistent starters over volatile stars
- Efficient use of budget (PPM)
- Stable performers (low variance)

---

## Subpage Summary

### Dashboard (existing + additions)
- Already done: Profile, stats, chart, best/worst value players
- **New: News Section** - Bundesliga news, squad-specific news, injury updates
- **New: Go Live Button** - Quick link to League > Live from countdown timer

### Market (6 subpages) - Bundesliga Player Database
1. **Players** - Full database with filters + quick chips (Hot, Falling, etc.)
2. **Analysis** - Charts, over/undervalued, raw points, form trends, momentum
3. **Compare** - Side-by-side, spider charts, rankings
4. **Matchups** - Fixture difficulty, best matchups
5. **Best XI** - Best possible team per matchday, auto-formation
6. **Watchlist** - Track players you're interested in

### League (5 subpages) - Your Kickbase League
1. **Managers** - Profiles, squad lineup view (reusable component), achievements
2. **Transfer Market** - Players currently listed for sale
3. **Transfers** - Activity feed, history
4. **Standings** - Table, ranking history
5. **Live** - Real-time matchday points while games are ongoing

> Traders and Head-to-Head features are integrated into other subpages (e.g., Managers, Transfers).

### Insights (4 subpages) - AI/ML Tools
1. **Predictions** - ML point/value forecasts
2. **Optimizer** - Lineup optimizer + market optimizer (from old repo)
3. **Assistant** - LLM with tool access for decision support
4. **Simulation** (future) - Monte Carlo for probabilities & confidence intervals

### Settings (future)
- Alerts & notifications configuration

---

## Implementation Priority

### Phase 1 - Core Features
- Market > Players (with filters, value trends, quick chips)
- League > Live (real-time matchday points)
- League > Standings (with history chart)
- League > Managers (profiles, squad lineup view)
- League > Transfer Market (players for sale)
- League > Transfers (activity feed)
- Dashboard > News section
- Dashboard > Go Live button

### Phase 2 - Comparison & Analysis
- Market > Analysis (scatter plots, raw points, form trends)
- Market > Compare (player comparison, spider chart)
- Market > Matchups (fixture difficulty)
- Market > Best XI (best team per matchday)
- Market > Watchlist
- League > Managers (head-to-head, trader analysis integrated)
- League > Transfers (trader stats integrated)

### Phase 3 - AI/ML Features
- Insights > Predictions (ML models)
- Insights > Optimizer (lineup + market optimizer from old repo)
- Insights > Assistant (LLM with tool access)
- Insights > Simulation (Monte Carlo - future)
- Settings > Alerts & notifications

---

## Reusable Components to Build

| Component | Used In | Description |
|-----------|---------|-------------|
| **Lineup/Squad View** | Dashboard, League > Managers | Visual squad display with formation, player cards, value changes |
| **Player Card** | Everywhere | Clickable card showing player basics, opens PlayerModal |
| **Value Trend Badge** | Market, League | Shows value change (today/7d/30d) with color coding |
| **Spider/Radar Chart** | Market > Compare, Player Modal | Multi-metric comparison visualization |

---

## Current State

- Dashboard: Done (profile, stats, chart, best/worst value players)
- Player modal: Done (6 tabs - overview, stats, value, compare, history, news)
- Mobile swipe navigation: Done
- Nested routes structure: Done (ready for real subpages)
- **Market > Players**: Done (full player database with search, filters, sort, list/card views)
- **Market > Analysis**: Done (scatter chart with regression, similar players, form trends, value momentum, breakout candidates)
- Backend: Needs updating to provide data for these features

### Market > Analysis Features Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| Value vs Points Chart | ✅ Done | Scatter plot with clickable players, hover tooltips |
| Regression Trend Lines | ✅ Done | All players + per-position (GK/DEF/MID/FWD), toggleable |
| Position Filters | ✅ Done | Filter displayed players by position |
| Outlier Filter | ✅ Done | Show all / Overperformers / Underperformers |
| Search to Highlight | ✅ Done | Highlight players in red with name labels |
| Similar Players | ✅ Done | Find cheaper alternatives with similar stats |
| Hot Form Players | ✅ Done | Players with positive form vs season avg |
| Cold Streaks | ✅ Done | Players with negative form vs season avg |
| Value Momentum | ✅ Done | Accelerating/Decelerating value change |
| Breakout Candidates | ✅ Done | Young (≤24) players on the rise |
| Raw Points Rankings | ❌ Skipped | Per user request |
| Hidden Gems Algorithm | ❌ Skipped | Per user request |
| Price History Chart | ❌ Skipped | Per user request |
| Raw Points Breakdown | ❌ Skipped | Per user request |
