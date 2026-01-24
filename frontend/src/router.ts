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
      component: () => import('./pages/MarketPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/analytics',
      component: () => import('./pages/AnalyticsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/optimizer',
      component: () => import('./pages/OptimizerPage.vue'),
      meta: { requiresAuth: true },
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
