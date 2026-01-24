# Kickbase Analytics

A personal analytics platform for [Kickbase](https://www.kickbase.com/) - the German Bundesliga fantasy football game.

## What is This?

This project provides:
- **Dashboard** for viewing your Kickbase data with enhanced analytics
- **ML Predictions** for player performance (planned)
- **Lineup Optimizer** to maximize your weekly points (planned)
- **Market Insights** to find undervalued players (planned)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Your Browser / Phone                        │
│                        (PWA installable)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Nginx (reverse proxy)                       │
│                         HTTPS:443                               │
│         /        → Frontend                                     │
│         /api/*   → Backend                                      │
└─────────────────────────────────────────────────────────────────┘
                    │                    │
                    ▼                    ▼
┌─────────────────────────┐  ┌────────────────────────────────────┐
│       Frontend          │  │              Backend               │
│     Vue 3 + Vite        │  │          FastAPI + Python          │
│         (PWA)           │  │                                    │
└─────────────────────────┘  │  ┌───────────┐  ┌───────────────┐  │
                             │  │ Kickbase  │  │     Redis     │  │
                             │  │  Client   │  │     Cache     │  │
                             │  └───────────┘  └───────────────┘  │
                             └────────────────────────────────────┘
                                              │
                                              ▼
                             ┌────────────────────────────────────┐
                             │           Kickbase API             │
                             │        (external, not ours)        │
                             └────────────────────────────────────┘
```

## Project Structure

```
kickbase_analytics/
├── backend/                  # FastAPI microservice
│   └── README.md
├── frontend/                 # Vue.js PWA
│   └── README.md
├── nginx/                    # Reverse proxy + SSL
│   ├── nginx.dev.conf
│   ├── certs/               # SSL certificates (gitignored)
│   └── README.md
├── docker-compose.dev.yml   # Development environment
├── install_deps.sh          # Install all dependencies
├── .env.example             # Environment variables template
└── README.md                # This file
```

Each component has its own README with detailed documentation.

## Quick Start

### Prerequisites

- Docker & Docker Compose
- mkcert (for local HTTPS)
- Python 3.13+ (for local development)
- Node.js 22+ (for local frontend development)

### 1. Clone and Setup

```bash
git clone <repo-url>
cd kickbase_analytics

# Copy environment template
cp .env.example .env

# Edit .env with your Kickbase credentials
nano .env
```

### 2. Setup HTTPS (one-time)

```bash
# Install mkcert
curl -L -o mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/

# Install local CA
sudo apt install libnss3-tools -y
mkcert -install

# Generate certificates
mkdir -p nginx/certs
cd nginx/certs
mkcert localhost 127.0.0.1 $(hostname -I | awk '{print $1}')
cd ../..
```

### 3. Run with Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

Access at: **https://localhost**

### 4. Local Development (optional)

For IDE support (autocomplete, type checking):

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install all dependencies (Python + Node.js)
./install_deps.sh
```

## Services

| Service | Internal Port | Description |
|---------|---------------|-------------|
| **Nginx** | 80, 443 | Reverse proxy, HTTPS termination |
| **Frontend** | 5173 | Vue.js dev server (Vite) |
| **Backend** | 8000 | FastAPI - proxies Kickbase API, adds analytics |
| **Redis** | 6379 | Caching layer for API responses |

All services are accessed through nginx at `https://localhost`.

## Authentication Flow

1. You enter your Kickbase email/password in the frontend
2. Frontend sends credentials to our backend (`/api/login`)
3. Backend authenticates with Kickbase, gets a token
4. Token is returned to frontend and stored in localStorage
5. All subsequent requests include this token in Authorization header
6. Backend uses the token to fetch data from Kickbase

**Important**: We never store your credentials. The token is only stored in your browser.

## PWA Features

The frontend is a Progressive Web App:
- **Installable** - Add to home screen on mobile/desktop
- **Standalone mode** - Runs without browser UI
- **Cached app shell** - Fast loading, works offline (data requires connection)
- **Auto-updates** - New versions download automatically

## Development

### Scripts

| Script | Purpose |
|--------|---------|
| `./install_deps.sh` | Install Python + Node.js dependencies |

### Environment Variables

See `.env.example` for all available options.

Required for development/testing:
```bash
KICKBASE_EMAIL=your-email
KICKBASE_PASSWORD=your-password
```

### Mobile Testing

Access from your phone using your computer's local IP:

1. Find your IP: `hostname -I | awk '{print $1}'`
2. Install root CA on phone (see `nginx/README.md`)
3. Access `https://<your-ip>` on phone

## Production Deployment

The app deploys to a VPS at **https://bigblues.de** via GitHub Actions.

### How It Works

1. Push to `main` branch
2. GitHub Actions builds Docker images (nginx, frontend, backend)
3. Images pushed to GitHub Container Registry (ghcr.io)
4. Workflow SSHs to VPS, pulls images, restarts containers

### Production Stack

| Container | Purpose |
|-----------|---------|
| nginx | SSL termination (Let's Encrypt), routing |
| frontend | Nginx serving Vue static build |
| backend | FastAPI |
| redis | Caching |
| certbot | SSL certificate renewal (every 12h check) |

See `.claude/claude.md` for detailed architecture documentation.

---

## Roadmap

- [x] Docker setup
- [x] Kickbase API client
- [x] Login endpoint
- [x] Dashboard endpoint
- [x] Redis caching
- [x] Frontend scaffold (Vue + PWA)
- [x] Nginx reverse proxy
- [x] HTTPS for development
- [x] OpenLigaDB integration (Bundesliga table)
- [x] Vue Router + route protection
- [x] Public page (Bundesliga table + login)
- [x] Dashboard page (user's Kickbase data)
- [x] Auth state management (useAuth composable)
- [x] Styling (CSS / Tailwind)
- [x] Dashboard redesign (frontend with mock data)
- [x] Production deployment (CI/CD, Docker registry, VPS)
- [ ] Dashboard backend (update endpoint to match new types)
- [ ] Lineup drag & drop system
- [ ] Market page
- [ ] ML predictions
- [ ] Lineup optimizer

## License

Private project - not for distribution.
