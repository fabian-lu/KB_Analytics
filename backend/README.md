# Backend Service

FastAPI microservice that acts as a gateway to the Kickbase API and provides custom analytics.

## What This Service Does

1. **Proxies Kickbase API** - Frontend can't call Kickbase directly (CORS), so we act as middleman
2. **Clean API** - Transforms Kickbase's compressed field names into readable ones
3. **Caching** - Redis caching to reduce Kickbase API calls
4. **Analytics** (planned) - ML predictions, stats calculations not available in Kickbase

## Project Structure

```
backend/
├── Dockerfile              # Container build instructions
├── requirements.txt        # Python dependencies
├── README.md               # This file
├── playground.ipynb        # Test endpoints interactively
│
└── app/
    ├── main.py             # FastAPI entry + global exception handlers
    ├── cache.py            # Redis caching + @cached decorator
    ├── dependencies.py     # Reusable dependencies (get_token)
    │
    ├── api/                # API endpoints (combine + calculate)
    │   ├── __init__.py
    │   ├── auth.py         # POST /login
    │   ├── dashboard.py    # GET /api/leagues/{id}/dashboard
    │   └── public.py       # GET /api/table (no auth)
    │
    ├── kickbase/           # Kickbase data source (self-contained)
    │   ├── __init__.py
    │   ├── client.py       # HTTP client (async, with retry)
    │   ├── config.py       # Settings (base URL, timeouts, etc.)
    │   ├── exceptions.py   # Custom error types
    │   ├── services.py     # Cached data fetching functions
    │   └── models/         # Kickbase response models (parse their weird JSON)
    │       ├── __init__.py
    │       ├── auth.py     # KickbaseUser, KickbaseLeague, KickbaseLoginResponse
    │       ├── league.py   # KickbaseLeagueMe, KickbaseRankingResponse
    │       ├── squad.py    # KickbaseSquadPlayer, KickbaseSquadResponse
    │       └── lineup.py   # KickbaseLineupResponse, KickbaseLineupOverviewResponse
    │
    ├── openliga/           # OpenLigaDB data source (Bundesliga table)
    │   ├── __init__.py
    │   ├── client.py       # HTTP client (async, with retry)
    │   ├── config.py       # Settings (base URL, timeouts)
    │   ├── exceptions.py   # Custom error types
    │   ├── services.py     # Cached data fetching (get_bundesliga_table)
    │   └── models/
    │       ├── __init__.py
    │       └── table.py    # OpenLigaTeamStanding
    │
    └── models/             # API response models (what frontend sees)
        ├── __init__.py
        ├── auth.py         # LoginResponse, User, League
        ├── dashboard.py    # DashboardResponse, PlayerSummary, etc.
        └── public.py       # BundesligaTableResponse, TeamStanding
```

---

## Core Components

### 1. Kickbase Client (`app/kickbase/`)

#### exceptions.py

Custom exception hierarchy:

| Exception | HTTP Code | When |
|-----------|-----------|------|
| `ValidationError` | 400 | Bad request data |
| `AuthenticationError` | 401 | Invalid credentials or expired token |
| `AuthorizationError` | 403 | Not allowed to access resource |
| `NotFoundError` | 404 | Resource doesn't exist |
| `RateLimitError` | 429 | Too many requests (has `retry_after`) |
| `ServerError` | 500+ | Kickbase server error |
| `NetworkError` | - | Connection failed |
| `TimeoutError` | - | Request timed out |

All inherit from `KickbaseError` for easy catch-all handling.

#### config.py

Settings loaded via pydantic-settings. Override with environment variables:

| Setting | Default | Env Variable |
|---------|---------|--------------|
| `base_url` | https://api.kickbase.com/v4 | `KICKBASE_BASE_URL` |
| `timeout` | 30.0 | `KICKBASE_TIMEOUT` |
| `connect_timeout` | 10.0 | `KICKBASE_CONNECT_TIMEOUT` |
| `max_retries` | 3 | `KICKBASE_MAX_RETRIES` |
| `retry_base_delay` | 1.0 | `KICKBASE_RETRY_BASE_DELAY` |
| `retry_max_delay` | 30.0 | `KICKBASE_RETRY_MAX_DELAY` |

#### client.py

Async HTTP client for Kickbase API.

**Features:**
- Token management (set once, used in all requests)
- Automatic retry with exponential backoff
- Maps HTTP errors to our custom exceptions

**Usage:**
```python
from app.kickbase import KickbaseClient

client = KickbaseClient(token=user_token)
squad = await client.get(f"/leagues/{league_id}/squad")
```

---

### 2. Caching (`app/cache.py`)

Redis-based caching using a decorator pattern.

**Usage:**
```python
from app.cache import cached

@cached(ttl=300)  # Cache for 5 minutes
async def get_squad(league_id: str, token: str):
    client = KickbaseClient(token=token)
    return await client.get(f"/leagues/{league_id}/squad")
```

**Features:**
- Auto-generates cache key from function name + arguments
- Excludes `token` from cache key (same data regardless of who requests)
- Graceful fallback if Redis is unavailable
- `clear_cache(pattern)` to invalidate specific keys

**Suggested TTLs:**

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Squad | 5 min | Changes rarely |
| Player details | 10 min | Stable data |
| Market | 1 min | Changes frequently |
| League ranking | 5 min | Updates periodically |

---

### 3. Dependencies (`app/dependencies.py`)

Reusable FastAPI dependencies.

**get_token** - Extracts token from Authorization header:
```python
from app.dependencies import get_token
from fastapi import Depends

@router.get("/squad/{league_id}")
async def get_squad(league_id: str, token: str = Depends(get_token)):
    # token is already extracted and validated
    client = KickbaseClient(token=token)
    ...
```

Expects header: `Authorization: Bearer <token>`

---

### 4. Global Exception Handlers (`app/main.py`)

All Kickbase exceptions are caught globally - no need for try/except in endpoints:

| Exception | HTTP Response |
|-----------|---------------|
| `AuthenticationError` | 401 "Invalid credentials or token expired" |
| `AuthorizationError` | 403 "Access denied" |
| `NotFoundError` | 404 "Resource not found" |
| `RateLimitError` | 429 "Rate limit exceeded" |
| `KickbaseError` (any other) | 502 "Kickbase error: {message}" |

---

### 5. Model Organization

We have **two types of models** to keep external data sources separate from our API:

| Type | Location | Purpose |
|------|----------|---------|
| **Source models** | `kickbase/models.py`, `news/models.py`, etc. | Parse external data (Kickbase's weird JSON, RSS XML, etc.) |
| **API models** | `models/` | What we return to frontend (clean, readable field names) |

**Why separate them?**

External APIs have their own formats - Kickbase uses compressed field names like `"tkn"`, `"i"`, `"n"`. By keeping parsing logic in source-specific models, we can:
- Add new data sources (news, RSS, Bundesliga table) without touching API models
- Change how we parse Kickbase data without affecting frontend contracts
- Keep each data source self-contained

**Example flow:**
```
Kickbase API → kickbase/models.py (parse "tkn"→token) → models/auth.py (clean) → Frontend
```

**Source models** use `Field(alias="x")` to map weird field names:
```python
# kickbase/models.py
class KickbaseUser(BaseModel):
    id: str = Field(alias="i")       # Kickbase sends "i" for ID
    name: str = Field(alias="n")     # Kickbase sends "n" for name
```

**API models** have clean, readable names:
```python
# models/auth.py
class User(BaseModel):
    id: str
    name: str
    email: str | None = None
```

---

### 6. Logging

Structured logging using Python's built-in `logging` module.

**Configuration** via `LOG_LEVEL` environment variable:

| Value | When to use | What you see |
|-------|-------------|--------------|
| `DEBUG` | Development | All requests, cache hits/misses, retries |
| `INFO` | Production | Startup/shutdown only |

**What gets logged where:**

| File | Level | What |
|------|-------|------|
| `main.py` | INFO | Startup, shutdown |
| `main.py` | ERROR | Unhandled exceptions |
| `client.py` | DEBUG | Every Kickbase API request |
| `client.py` | WARNING | Retry attempts |
| `client.py` | ERROR | Failed after all retries |
| `cache.py` | DEBUG | Cache hit/miss |
| `cache.py` | WARNING | Redis unavailable |

**Log format:**
```
2026-01-18 15:30:01 | INFO | app.main | Backend starting up (log_level=DEBUG)
2026-01-18 15:30:05 | DEBUG | app.kickbase.client | Request: POST /user/login
2026-01-18 15:30:06 | DEBUG | app.cache | Cache miss: get_squad:league123
2026-01-18 15:30:07 | WARNING | app.kickbase.client | Rate limited, retry 1/3 in 2.0s: /leagues/123/squad
```

**Where logs go:**
- Stdout (console) - captured by Docker
- View with: `docker compose logs -f backend`
- For production, add a log shipper (Filebeat) to send to Elasticsearch

---

## How to Add New Pages/Endpoints

When adding a new page (like "Market" or "Players"), follow this pattern:

### Step 1: Identify What Data You Need

Start by designing what the frontend needs. For example, a "Market" page might need:
- List of players on market with prices
- Current user's budget
- Buy recommendations

### Step 2: Add Kickbase Models (`kickbase/models/`)

Create models to parse Kickbase API responses. These translate the weird field names to readable ones:

```python
# kickbase/models/market.py
from pydantic import BaseModel, Field

class KickbaseMarketPlayer(BaseModel):
    """Single player from /leagues/{id}/market"""
    id: str = Field(alias="i")
    name: str = Field(alias="n")
    price: int = Field(alias="p")
    expiry: str = Field(alias="exp")
    # ... map all fields from Kickbase response

    model_config = {"populate_by_name": True}


class KickbaseMarketResponse(BaseModel):
    """Response from /leagues/{id}/market"""
    players: list[KickbaseMarketPlayer] = Field(alias="it")

    model_config = {"populate_by_name": True}
```

Export in `kickbase/models/__init__.py`:
```python
from app.kickbase.models.market import KickbaseMarketPlayer, KickbaseMarketResponse
```

### Step 3: Add Service Functions (`kickbase/services.py`)

Add cached functions that fetch from Kickbase and return Pydantic models:

```python
# kickbase/services.py
from app.kickbase.models import KickbaseMarketResponse

@cached(ttl=60)  # Market changes often, short TTL
async def get_market(league_id: str, token: str) -> KickbaseMarketResponse:
    """Fetch market data from Kickbase."""
    client = KickbaseClient(token=token)
    data = await client.get(f"/leagues/{league_id}/market")
    return KickbaseMarketResponse.model_validate(data)
```

**Important:**
- Services fetch data and parse into Pydantic models
- The `@cached` decorator handles Pydantic serialization automatically
- Return type hint is required for cache to reconstruct the model

### Step 4: Add API Response Models (`models/`)

Create clean models for what the frontend receives:

```python
# models/market.py
from pydantic import BaseModel

class MarketPlayer(BaseModel):
    id: str
    name: str
    price: int
    expires_in_hours: float  # Calculated from expiry timestamp
    recommendation: str | None  # "buy", "avoid", None

class MarketResponse(BaseModel):
    budget: int
    players: list[MarketPlayer]
    recommended_buys: list[MarketPlayer]
```

Export in `models/__init__.py`.

### Step 5: Create the Endpoint (`api/`)

This is where calculations happen. Use the clean Pydantic model attributes:

```python
# api/market.py
from fastapi import APIRouter, Depends
from app.dependencies import get_token
from app.kickbase.models import KickbaseMarketPlayer
from app.kickbase.services import get_market, get_league_me
from app.models.market import MarketResponse, MarketPlayer

router = APIRouter()


def _calculate_recommendation(player: KickbaseMarketPlayer, budget: int) -> str | None:
    """Business logic for buy recommendations."""
    if player.price > budget:
        return "avoid"
    # Your logic here
    return None


@router.get("/leagues/{league_id}/market", response_model=MarketResponse)
async def get_market_page(league_id: str, token: str = Depends(get_token)) -> MarketResponse:
    # 1. Fetch data (cached, returns Pydantic models)
    market = await get_market(league_id, token)
    league_me = await get_league_me(league_id, token)

    # 2. Calculate/transform using clean attribute names
    budget = int(league_me.budget)
    players = []
    for p in market.players:
        recommendation = _calculate_recommendation(p, budget)
        players.append(MarketPlayer(
            id=p.id,
            name=p.name,
            price=p.price,
            expires_in_hours=_calc_hours_until(p.expiry),
            recommendation=recommendation,
        ))

    # 3. Return response
    return MarketResponse(
        budget=budget,
        players=players,
        recommended_buys=[p for p in players if p.recommendation == "buy"],
    )
```

### Step 6: Wire Up the Router (`main.py`)

```python
from app.api import market_router

app.include_router(market_router, prefix="/api", tags=["market"])
```

And export from `api/__init__.py`:
```python
from app.api.market import router as market_router
```

### Summary: Where Things Go

| What | Where | Purpose |
|------|-------|---------|
| Kickbase field mapping | `kickbase/models/` | Parse weird JSON → clean attributes |
| Data fetching + caching | `kickbase/services.py` | Fetch & return Pydantic models |
| Frontend response shape | `models/` | Clean models for API responses |
| Calculations & logic | `api/*.py` | Combine data, compute derived values |
| Route registration | `main.py` | Wire up routers |

### Key Points

1. **Never use raw dict access** - Always use Pydantic model attributes (`player.id` not `p.get("i")`)
2. **Services return Pydantic models** - The cache handles serialization automatically
3. **Return type hints are required** - Services need `-> KickbaseMarketResponse` for caching to work
4. **Two model layers**:
   - `kickbase/models/` - Parse Kickbase's weird JSON (internal)
   - `models/` - Clean response for frontend (external API)

### Caching Strategy

Choose TTL based on how often data changes:

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Squad | 5 min | Changes rarely (only transfers) |
| Lineup | 1 min | User might change it |
| Market | 1 min | Prices change, items expire |
| Ranking | 5 min | Updates after matchdays |
| Player details | 10 min | Very stable |

---

## API Endpoints

### Available

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | No | Health check |
| `/login` | POST | No | Authenticate with Kickbase |
| `/api/table` | GET | No | Bundesliga standings (from OpenLigaDB) |
| `/api/leagues/{id}/dashboard` | GET | Yes | Dashboard data (overview, players, lineup) |

### Planned

| Endpoint | Method | Auth | Cache TTL |
|----------|--------|------|-----------|
| `/api/squad/{league_id}` | GET | Yes | 5 min |
| `/api/market/{league_id}` | GET | Yes | 1 min |
| `/api/players/{player_id}` | GET | Yes | 10 min |
| `/api/leagues` | GET | Yes | 5 min |

---

## Adding a New Data Source

When adding a new external API (like we did with OpenLigaDB), create a self-contained package:

```
app/
└── newapi/
    ├── __init__.py       # Re-exports
    ├── client.py         # HTTP client with retry logic
    ├── config.py         # Settings (pydantic-settings)
    ├── exceptions.py     # Custom exceptions
    ├── services.py       # Cached data fetchers
    └── models/
        ├── __init__.py
        └── response.py   # Pydantic models for API responses
```

Follow the pattern in `kickbase/` or `openliga/`.

---

## Running

### With Docker (recommended)

```bash
# From project root
docker compose -f docker-compose.dev.yml up --build
```

- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Redis: localhost:6379

### Without Docker

```bash
cd backend
source ../.venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

---

## Testing

Use `playground.ipynb` to test endpoints interactively:

1. Open in Jupyter/PyCharm
2. Make sure Docker is running
3. Run cells to test login, etc.

---

## Environment Variables

Required in `.env` (project root):

```bash
KICKBASE_EMAIL=your-email@example.com
KICKBASE_PASSWORD=your-password
REDIS_URL=redis://redis:6379
LOG_LEVEL=DEBUG
```

Optional overrides:
```bash
KICKBASE_TIMEOUT=30
KICKBASE_MAX_RETRIES=3
LOG_LEVEL=INFO  # Use INFO in production
```
