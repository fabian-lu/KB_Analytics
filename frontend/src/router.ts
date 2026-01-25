import { createRouter, createWebHistory } from 'vue-router'

// Extend RouteMeta to include our custom fields
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./pages/PublicPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      component: () => import('./pages/DashboardPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/market',
      component: () => import('./pages/market/MarketLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/market/overview',
        },
        {
          path: 'overview',
          component: () => import('./pages/market/MarketOverview.vue'),
        },
        {
          path: 'players',
          component: () => import('./pages/market/MarketPlayers.vue'),
        },
        {
          path: 'transfers',
          component: () => import('./pages/market/MarketTransfers.vue'),
        },
        {
          path: 'free-agents',
          component: () => import('./pages/market/MarketFreeAgents.vue'),
        },
        {
          path: 'watchlist',
          component: () => import('./pages/market/MarketWatchlist.vue'),
        },
        {
          path: 'trends',
          component: () => import('./pages/market/MarketTrends.vue'),
        },
      ],
    },
    {
      path: '/league',
      component: () => import('./pages/league/LeagueLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/league/standings',
        },
        {
          path: 'standings',
          component: () => import('./pages/league/LeagueStandings.vue'),
        },
        {
          path: 'members',
          component: () => import('./pages/league/LeagueMembers.vue'),
        },
        {
          path: 'results',
          component: () => import('./pages/league/LeagueResults.vue'),
        },
        {
          path: 'statistics',
          component: () => import('./pages/league/LeagueStatistics.vue'),
        },
        {
          path: 'rules',
          component: () => import('./pages/league/LeagueRules.vue'),
        },
      ],
    },
    {
      path: '/insights',
      component: () => import('./pages/insights/InsightsLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/insights/predictions',
        },
        {
          path: 'predictions',
          component: () => import('./pages/insights/InsightsPredictions.vue'),
        },
        {
          path: 'optimizer',
          component: () => import('./pages/insights/InsightsOptimizer.vue'),
        },
        {
          path: 'assistant',
          component: () => import('./pages/insights/InsightsAssistant.vue'),
        },
        {
          path: 'trends',
          component: () => import('./pages/insights/InsightsTrends.vue'),
        },
        {
          path: 'alerts',
          component: () => import('./pages/insights/InsightsAlerts.vue'),
        },
      ],
    },
  ],
})

// Navigation guard
router.beforeEach((to) => {
  // User is fully logged in only if they have token AND selected a league
  const hasToken = !!localStorage.getItem('token')
  const hasLeague = !!localStorage.getItem('currentLeague')
  const isFullyLoggedIn = hasToken && hasLeague

  // Protected route + not fully logged in → redirect to public page
  if (to.meta.requiresAuth && !isFullyLoggedIn) {
    return '/'
  }

  // Guest-only route + fully logged in → redirect to dashboard
  if (to.meta.guestOnly && isFullyLoggedIn) {
    return '/dashboard'
  }
})

export default router
