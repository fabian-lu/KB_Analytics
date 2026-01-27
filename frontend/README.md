# Frontend

Vue.js PWA for Kickbase Analytics.

## Tech Stack

- **Vue 3** - UI framework (Composition API)
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Vue Router** - Client-side routing
- **VitePWA** - Progressive Web App support
- **Tailwind CSS** - Utility-first CSS framework
- **Radix Vue** - Headless UI components (dropdowns, modals, etc.)
- **Lucide** - Icon library
- **vue-i18n** - Internationalization (EN/DE)
- **Chart.js** - Charts (via vue-chartjs)
- **@vueuse/core** - Vue composables (useSwipe for mobile gestures)

## Project Structure

```
frontend/
├── src/
│   ├── main.ts              # App entry point (Vue + Router + i18n)
│   ├── router.ts            # Route definitions + navigation guards
│   ├── i18n.ts              # vue-i18n configuration
│   ├── index.css            # Tailwind directives + global styles
│   ├── App.vue              # Root component (conditionally wraps in AppLayout)
│   │
│   ├── assets/              # Images, icons
│   │   ├── logo-icon.png        # K icon (favicon)
│   │   ├── logo-full-light.svg  # Full logo for light mode
│   │   ├── logo-full-dark.svg   # Full logo for dark mode
│   │   └── flags/               # Language flags
│   │       ├── en.svg
│   │       └── de.svg
│   │
│   ├── locales/             # Translation files
│   │   ├── en.json
│   │   └── de.json
│   │
│   ├── components/
│   │   ├── layout/              # Layout components
│   │   │   ├── AppLayout.vue    # Wraps logged-in pages (nav + content)
│   │   │   ├── TopNav.vue       # Desktop top navigation
│   │   │   ├── MobileHeader.vue # Mobile header (full logo + controls)
│   │   │   ├── BottomNav.vue    # Mobile bottom tab bar (curved SVG design)
│   │   │   └── UserMenu.vue     # User dropdown (profile, settings, logout)
│   │   │
│   │   ├── dashboard/           # Dashboard-specific components
│   │   │   ├── StatCard.vue
│   │   │   ├── StatsGridTop.vue
│   │   │   ├── StatsGridBottom.vue
│   │   │   ├── UserProfileCard.vue
│   │   │   ├── PerformanceChart.vue
│   │   │   ├── PlayerValueCard.vue
│   │   │   └── PlayerValueSection.vue
│   │   │
│   │   ├── market/              # Market page components
│   │   │   ├── PlayerRow.vue        # Compact row for list view
│   │   │   ├── PlayerCard.vue       # Card component for grid view
│   │   │   ├── AnalysisChart.vue    # Scatter plot with regression lines
│   │   │   ├── SimilarPlayersFinder.vue  # Find similar player alternatives
│   │   │   ├── FormTrendSection.vue      # Hot/Cold form players
│   │   │   ├── ValueMomentumSection.vue  # Accelerating/Decelerating value
│   │   │   └── BreakoutCandidates.vue    # Young rising players
│   │   │
│   │   ├── player/              # Player detail modal components
│   │   │   ├── PlayerModal.vue      # Main modal with tab navigation + swipe
│   │   │   ├── PlayerHeader.vue     # Sticky hero section (compact on mobile)
│   │   │   ├── tabs/                # Tab content components
│   │   │   │   ├── OverviewTab.vue  # Status, form, fixtures, quick stats
│   │   │   │   ├── StatsTab.vue     # Performance chart, season stats
│   │   │   │   ├── ValueTab.vue     # Price chart, forecast, ROI
│   │   │   │   ├── CompareTab.vue   # Rankings, position comparison
│   │   │   │   ├── HistoryTab.vue   # Transfer history, season comparison
│   │   │   │   └── NewsTab.vue      # Ligainsider, Google News, links
│   │   │   └── shared/              # Shared player components
│   │   │       ├── StatBox.vue      # Compact stat display
│   │   │       ├── TrendBadge.vue   # Up/down trend indicator
│   │   │       ├── RankBadge.vue    # Rank display (#5 of 520)
│   │   │       ├── MiniBarChart.vue # Inline spark chart
│   │   │       ├── FixtureRow.vue   # Upcoming match row
│   │   │       └── FormIndicator.vue # Form trend indicator
│   │   │
│   │   ├── lineup/              # Reusable lineup components (Dashboard + Best XI)
│   │   │   ├── LineupPitch.vue      # Football pitch with position rows, drag & drop
│   │   │   ├── LineupStats.vue      # Formation, points, value, efficiency stats
│   │   │   ├── PlayerChip.vue       # Player chip for pitch display
│   │   │   └── StatBox.vue          # Compact stat with icon and tooltip
│   │   │
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── BaseModal.vue    # Modal wrapper (sm, md, lg, fullscreen, body scroll lock)
│   │   │   └── ConfirmModal.vue # Confirmation dialog (built on BaseModal)
│   │   │
│   │   ├── SettingsModal.vue    # Settings modal (league selection)
│   │   ├── DarkModeToggle.vue   # Sun/moon toggle
│   │   └── LanguageToggle.vue   # Flag dropdown (EN/DE)
│   │
│   ├── pages/               # Page components (one per route)
│   │   ├── PublicPage.vue       # Landing page (not logged in)
│   │   ├── DashboardPage.vue    # User's dashboard
│   │   │
│   │   ├── market/              # Market section (nested routes)
│   │   │   ├── MarketLayout.vue     # Layout with secondary nav + swipe
│   │   │   ├── MarketPlayers.vue    # Player database with filters/search/views
│   │   │   ├── MarketAnalysis.vue   # Charts, trends, similar players, breakout candidates
│   │   │   ├── MarketCompare.vue    # Multi-player comparison with radar chart
│   │   │   ├── MarketMatchups.vue   # Fixture difficulty, vulnerability, clean sheets
│   │   │   ├── MarketBestXI.vue     # Dream team by matchday/season with compare
│   │   │   └── MarketWatchlist.vue  # Tracked players with notes + similar suggestions
│   │   │
│   │   ├── league/              # League section (nested routes)
│   │   │   ├── LeagueLayout.vue
│   │   │   ├── LeagueStandings.vue
│   │   │   ├── LeagueMembers.vue
│   │   │   ├── LeagueResults.vue
│   │   │   ├── LeagueStatistics.vue
│   │   │   └── LeagueRules.vue
│   │   │
│   │   └── insights/            # Insights section (nested routes)
│   │       ├── InsightsLayout.vue
│   │       ├── InsightsPredictions.vue
│   │       ├── InsightsOptimizer.vue
│   │       ├── InsightsAssistant.vue
│   │       ├── InsightsTrends.vue
│   │       └── InsightsAlerts.vue
│   │
│   ├── api/                 # Backend API calls
│   │   ├── index.ts
│   │   ├── client.ts
│   │   ├── public.ts
│   │   ├── auth.ts
│   │   ├── dashboard.ts
│   │   └── player.ts        # getPlayerDetail (uses mock for now)
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── index.ts
│   │   ├── table.ts
│   │   ├── auth.ts
│   │   ├── dashboard.ts
│   │   ├── player.ts        # PlayerDetail, nested types for player modal
│   │   ├── market.ts        # MarketPlayer, filter/sort types for market page
│   │   └── analysis.ts      # ChartDataPoint, RegressionResult, analysis utilities
│   │
│   ├── mocks/               # Mock data for development
│   │   ├── dashboardMock.ts # Dashboard response mock
│   │   ├── playerMock.ts    # Player detail mock (Florian Wirtz)
│   │   └── marketMock.ts    # Market players (30 players) + teams for testing
│   │
│   ├── composables/         # Reusable stateful logic
│   │   ├── useAuth.ts       # Auth state
│   │   ├── useDarkMode.ts   # Dark mode state + toggle
│   │   └── useLanguage.ts   # Language state + toggle
│   │
│   └── vite-env.d.ts
│
├── public/                  # Static assets (copied as-is)
├── index.html
├── package.json
├── vite.config.ts           # Vite + PWA configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json
└── Dockerfile.dev
```

## Development

The frontend runs in Docker as part of the dev stack:

```bash
docker compose -f docker-compose.dev.yml up
```

Access at `https://localhost` (through nginx).

**Hot reload**: Edit any file in `src/` and changes appear instantly.

### Adding npm Packages (Important!)

Docker uses an **anonymous volume** for `node_modules` to keep it separate from your local machine. This volume persists between rebuilds.

**When you add new npm packages**, you must remove the old volume:

```bash
# 1. Stop and remove volumes
docker compose -f docker-compose.dev.yml down -v

# 2. Rebuild with new packages
docker compose -f docker-compose.dev.yml up --build
```

The `-v` flag removes the old `node_modules` volume. Without it, the container won't see your new packages.

**For normal development** (just editing code), you don't need `-v` or `--build`.

### Local Development (without Docker)

```bash
cd frontend
npm install
npm run dev
```

Then access at `http://localhost:5173` (direct to Vite).

---

## Vue Component Convention

In this project, Vue single-file components follow this order:

```vue
<template>
  <!-- HTML structure -->
</template>

<script setup lang="ts">
// Logic
</script>

<style>
/* Styling (if needed) */
</style>
```

---

## How to Add a New Page

### Step 1: Create the Page Component

Create a new file in `src/pages/`:

```vue
<!-- src/pages/MarketPage.vue -->
<template>
  <div>
    <h1>Market</h1>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">{{ error }}</p>
    <div v-else>
      <!-- Your content here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMarket } from '@/api'
import { useAuth } from '@/composables/useAuth'
import type { MarketResponse } from '@/types'

const { token } = useAuth()

const market = ref<MarketResponse | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    market.value = await getMarket({ token: token.value! })
  } catch (e) {
    error.value = 'Failed to load market'
  } finally {
    loading.value = false
  }
})
</script>
```

### Step 2: Add the Route

In `src/router.ts`:

```typescript
{
  path: '/market',
  component: () => import('./pages/MarketPage.vue'),
  meta: { requiresAuth: true },  // or guestOnly: true for public pages
},
```

### Step 3: Add Types (if needed)

Create `src/types/market.ts`:

```typescript
export interface MarketPlayer {
  id: string
  name: string
  price: number
  // ...
}

export interface MarketResponse {
  players: MarketPlayer[]
  budget: number
}
```

Export in `src/types/index.ts`:

```typescript
export * from './market'
```

### Step 4: Add API Function

Create `src/api/market.ts`:

```typescript
import { api } from './client'
import type { MarketResponse } from '@/types'

export async function getMarket({ token }: { token: string }) {
  return api<MarketResponse>('/api/market', {
    headers: { Authorization: `Bearer ${token}` },
  })
}
```

Export in `src/api/index.ts`:

```typescript
export { getMarket } from './market'
```

---

## Routing

### Route Meta Fields

Routes can have metadata that controls access:

```typescript
// router.ts
{
  path: '/dashboard',
  component: ...,
  meta: { requiresAuth: true },  // Must be logged in
},
{
  path: '/',
  component: ...,
  meta: { guestOnly: true },     // Redirects to /dashboard if logged in
},
{
  path: '/about',
  component: ...,
  // No meta = anyone can access
},
```

### Navigation Guard

The router has a global guard (`router.beforeEach`) that:
- Redirects to `/` if accessing a `requiresAuth` route without being logged in
- Redirects to `/dashboard` if accessing a `guestOnly` route while logged in

---

## Authentication

### useAuth Composable

Import and use in any component:

```typescript
import { useAuth } from '@/composables/useAuth'

const { isLoggedIn, user, token, leagues, setAuth, logout } = useAuth()

// Check if logged in
if (isLoggedIn.value) {
  console.log(`Hello, ${user.value?.name}`)
}

// After login, store auth data
setAuth({ token: '...', user: {...}, leagues: [...] })

// Log out
logout()  // Clears localStorage, redirects to /
```

### What's Stored in localStorage

| Key | Contents |
|-----|----------|
| `token` | Kickbase auth token (string) |
| `user` | User info JSON (id, name, email) |
| `leagues` | User's leagues JSON (array) |

The auth state is initialized from localStorage on page load.

---

## API Client

### Basic Usage

```typescript
import { api } from '@/api'

// GET request
const data = await api<ResponseType>('/api/endpoint')

// POST request
const result = await api<ResponseType>('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' }),
})
```

### With Named Parameters

API functions use named parameters for clarity:

```typescript
// Good - clear what each parameter is
await getTable({ season: '2025' })
await getDashboard({ leagueId: '123', token: 'abc' })

// In the function definition
export async function getTable({ season = '2024' }: { season?: string } = {}) {
  return api<TableResponse>(`/api/table?season=${season}`)
}
```

---

## PWA Features

Configured in `vite.config.ts`:

- **Installable** - Users can add to home screen
- **Standalone mode** - Runs without browser chrome
- **App shell caching** - Static files cached for fast loads
- **API calls not cached** - Always fetch fresh data

### How Updates Work

1. User opens app
2. Service worker checks for new version
3. If found, downloads in background
4. Next app open loads new version

Configured with `registerType: 'autoUpdate'` - no user prompt needed.

---

## Path Aliases

The `@/` alias points to `src/`:

```typescript
// Instead of relative paths
import { useAuth } from '../../../composables/useAuth'

// Use the alias
import { useAuth } from '@/composables/useAuth'
```

Configured in both `vite.config.ts` and `tsconfig.json`.

---

## Building for Production

```bash
npm run build
```

Outputs to `dist/`:
- Minified JS/CSS bundles
- Generated `manifest.webmanifest`
- Generated service worker (`sw.js`)

These static files are served by nginx in production.

---

## Dark Mode

Dark mode is controlled by the `dark` class on `<html>`.

### useDarkMode Composable

```typescript
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggle } = useDarkMode()

// Check current mode
if (isDark.value) {
  console.log('Dark mode is on')
}

// Toggle between light/dark
toggle()
```

### How it Works

1. On load: checks localStorage, then system preference, defaults to light
2. Persists choice to localStorage
3. Adds/removes `dark` class on `<html>`

### Using in Components

Tailwind's `dark:` prefix applies styles in dark mode:

```html
<div class="bg-white dark:bg-black text-gray-900 dark:text-white">
  This has different colors in light vs dark mode
</div>
```

### Custom Colors

Defined in `tailwind.config.js`:

| Color | Light | Dark | Usage |
|-------|-------|------|-------|
| `surface` | white | #0a0a0a (true black) | Page background |
| `card` | #f5f5f5 | #141414 | Card backgrounds |
| `accent` | #14b8a6 (teal) | same | Primary accent color |

---

## Internationalization (i18n)

The app supports English and German using vue-i18n.

### Translation Files

Located in `src/locales/`:
- `en.json` - English translations
- `de.json` - German translations

### Using Translations

```vue
<template>
  <h1>{{ t('dashboard.greeting') }}</h1>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
```

### Changing Language

```typescript
import { useLanguage } from '@/composables/useLanguage'

const { locale, setLocale, toggle } = useLanguage()

// Current language
console.log(locale.value)  // 'en' or 'de'

// Set specific language
setLocale('de')

// Toggle between en/de
toggle()
```

### Adding New Translations

1. Add the key to both `en.json` and `de.json`
2. Use `t('your.key')` in the component

### What Gets Persisted

- Language choice saved to localStorage
- On load: checks localStorage, then browser language, defaults to 'en'

---

## Layout System

### Desktop vs Mobile

The app uses different navigation for desktop and mobile:

| Screen | Navigation |
|--------|------------|
| Desktop (≥768px) | Top horizontal nav bar |
| Mobile (<768px) | Bottom tab bar + minimal header |

This is handled by CSS (Tailwind breakpoints), not JavaScript:

```vue
<!-- Desktop only -->
<TopNav class="hidden md:flex" />

<!-- Mobile only -->
<BottomNav class="flex md:hidden" />
```

### AppLayout

Logged-in pages are wrapped in `AppLayout.vue`, which provides:
- TopNav (desktop)
- MobileHeader (mobile)
- BottomNav (mobile)
- Content area with proper padding

### Mobile Bottom Navigation (BottomNav)

The mobile bottom nav has a custom curved design:

- **Curved SVG background** - A U-shaped notch follows the active nav item
- **Floating pill effect** - Active icon lifts up with a colored pill background
- **Dynamic path** - SVG path is computed based on active route index
- **Partial background** - Solid div below curve prevents content showing through

The curve is drawn using SVG bezier curves in a computed property:
```typescript
const navPath = computed(() => {
  const idx = activeIndex.value
  const centerX = (idx * 100) + 50  // Center of active item in 400-unit viewBox
  // Returns SVG path with U-shaped notch at centerX
})
```

### Settings Modal

`SettingsModal.vue` provides settings UI:
- Opens from UserMenu (both mobile and desktop)
- Currently contains league selection
- Extensible for future settings

League changes trigger a data refresh via watcher in DashboardPage.

---

## Nested Routes (Subpages)

Market, League, and Insights use nested routes for subpage navigation.

### Route Structure

```typescript
// router.ts
{
  path: '/market',
  component: () => import('./pages/market/MarketLayout.vue'),
  meta: { requiresAuth: true },
  children: [
    { path: '', redirect: '/market/overview' },
    { path: 'overview', component: () => import('./pages/market/MarketOverview.vue') },
    { path: 'players', component: () => import('./pages/market/MarketPlayers.vue') },
    // ... more children
  ],
}
```

### Why Nested Routes?

- **Umami Analytics**: Each subpage has a unique URL, so page views are automatically tracked
- **Shareable URLs**: Users can bookmark specific subpages
- **PWA friendly**: Vue Router handles client-side navigation

### Layout Components

Each section has a Layout component (e.g., `MarketLayout.vue`) that provides:
- Secondary navigation (horizontal tabs)
- `<RouterView>` for rendering child components
- Swipe gesture handling

---

## Mobile Swipe Navigation

On mobile, users can swipe left/right to navigate between subpages.

### Implementation

Uses `@vueuse/core` useSwipe composable:

```typescript
import { useSwipe } from '@vueuse/core'

const { direction } = useSwipe(swipeContainer, {
  threshold: 50,
  onSwipeEnd() {
    if (direction.value === 'left') {
      navigateToTab(currentIndex.value + 1)
    } else if (direction.value === 'right') {
      navigateToTab(currentIndex.value - 1)
    }
  },
})
```

### Slide Animations

CSS transitions provide slide animations:

```css
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease-out;
}

.slide-left-enter-from { transform: translateX(100%); opacity: 0; }
.slide-left-leave-to { transform: translateX(-100%); opacity: 0; }
.slide-right-enter-from { transform: translateX(-100%); opacity: 0; }
.slide-right-leave-to { transform: translateX(100%); opacity: 0; }

/* Prevent flicker by positioning leaving element absolutely */
.slide-left-leave-active,
.slide-right-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
```

### Where Swipe is Enabled

- Market, League, Insights layouts (subpage navigation)
- PlayerModal (tab navigation)

### Chart Interaction

Swipe navigation is disabled when touch starts on a chart (canvas element). This applies to both PlayerModal and MarketLayout:

```typescript
onSwipeStart(e) {
  const target = e.target as HTMLElement
  // Block swipe if it started on a canvas (chart) element
  if (target.tagName === 'CANVAS' || target.closest('canvas')) {
    swipeBlocked.value = true
    return
  }
}
```

This prevents accidental page/tab navigation when users interact with charts like the Analysis scatter plot.

---

## Modal Back Button Handling

On mobile, the device's back button should close a modal instead of navigating away from the page.

### Solution: Vue Router Navigation Guard

Use `onBeforeRouteLeave` to intercept navigation when a modal is open:

```typescript
import { onBeforeRouteLeave } from 'vue-router'

// In the component with the modal
const selectedPlayerId = ref<string | null>(null)

onBeforeRouteLeave((_to, _from, next) => {
  if (selectedPlayerId.value) {
    // Modal is open - close it instead of navigating
    selectedPlayerId.value = null
    next(false) // Cancel navigation
  } else {
    next() // Allow navigation
  }
})
```

### Why Not History API?

Several approaches were tried:
- `history.pushState()` / `popstate` - conflicts with Vue Router's own history management
- Hash-based routing (`#modal`) - works but adds hashes to URLs
- `history.forward()` - unreliable with Vue Router

The navigation guard approach is the cleanest solution because:
- Works with Vue Router instead of against it
- No URL changes or hash fragments
- Modal closes naturally like clicking the X button

### Body Scroll Lock

`BaseModal.vue` locks body scroll when open to prevent background content from scrolling:

```typescript
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
  } else {
    // Restore original styles and scroll position
    document.body.style.overflow = originalBodyOverflow
    document.body.style.position = originalBodyPosition
    document.body.style.top = originalBodyTop
    document.body.style.width = originalBodyWidth
    window.scrollTo(0, scrollY)
  }
})
```

Touch events on the backdrop are also prevented to avoid accidental scrolling on mobile.

---

## Confirmation Dialogs

`ConfirmModal.vue` is a reusable confirmation dialog built on `BaseModal`:

### Usage

```vue
<template>
  <button @click="showConfirm = true">Delete All</button>

  <ConfirmModal
    :open="showConfirm"
    :title="t('watchlist.clearConfirmTitle')"
    :message="t('watchlist.clearConfirmMessage')"
    @close="showConfirm = false"
    @confirm="handleConfirm(); showConfirm = false"
  />
</template>

<script setup lang="ts">
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
const showConfirm = ref(false)

function handleConfirm() {
  // Do the destructive action
}
</script>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | required | Controls modal visibility |
| `title` | string | required | Modal title (question) |
| `message` | string | required | Explanation text |
| `confirmLabel` | string | `t('confirm.confirm')` | Confirm button text |
| `confirmClass` | string | `'bg-red-500 hover:bg-red-600'` | Tailwind classes for confirm button |

### Events

| Event | Description |
|-------|-------------|
| `close` | User clicked cancel or backdrop |
| `confirm` | User clicked confirm |

---

## Lineup Components

Reusable components in `components/lineup/` for displaying football formations. Used by both Dashboard and Market > Best XI.

### LineupPitch

Renders a football pitch with players positioned by role:

```vue
<LineupPitch
  :starting-g-k="goalkeepers"
  :starting-d-f="defenders"
  :starting-m-f="midfielders"
  :starting-f-w="forwards"
  :readonly="true"
  :highlight-player-ids="['player-1', 'player-2']"
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `startingGK` | `PlayerSummary[]` | Goalkeepers to display |
| `startingDF` | `PlayerSummary[]` | Defenders to display |
| `startingMF` | `PlayerSummary[]` | Midfielders to display |
| `startingFW` | `PlayerSummary[]` | Forwards to display |
| `readonly` | boolean | If false, enables drag & drop |
| `highlightPlayerIds` | `string[]` | Player IDs to highlight with a ring |

### LineupStats

Stats bar showing lineup metrics:

```vue
<LineupStats :players="allPlayers" :formation="'4-3-3'" />
```

Displays: Formation, Total Points, Avg Points, Value, Efficiency (pts/€M), Consistency (σ), Teams.

### PlayerChip

Individual player display on the pitch:

```vue
<PlayerChip :player="player" :readonly="true" :highlight="true" />
```

Shows player photo, name, and points badge. Highlight adds a cyan ring.

### StatBox

Compact stat display with tooltip:

```vue
<StatBox
  :icon="TrophyIcon"
  value="4-3-3"
  :label="t('lineup.formation')"
  :description="t('lineup.formationDesc')"
/>
```
