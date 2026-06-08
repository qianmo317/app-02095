import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/user/HomePage.vue') },
      { path: 'pets', name: 'PetList', component: () => import('@/views/user/PetListPage.vue') },
      { path: 'pets/:id', name: 'PetDetail', component: () => import('@/views/user/PetDetailPage.vue'), props: true },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: () => import('@/views/admin/DashboardPage.vue') },
      { path: 'pets', name: 'AdminPets', component: () => import('@/views/admin/PetManagePage.vue') },
      { path: 'adoptions', name: 'AdminAdoptions', component: () => import('@/views/admin/AdoptionManagePage.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('@/views/admin/UserManagePage.vue') },
      { path: 'logs', name: 'AdminLogs', component: () => import('@/views/admin/LogPage.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  if (!userStore.isLoggedIn && userStore.token) {
    userStore.restoreSession()
  }
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next({ name: 'Home' })
    return
  }
  next()
})

export default router
