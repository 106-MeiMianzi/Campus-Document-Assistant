import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Chat from '../views/Chat.vue'
import Docs from '../views/Docs.vue'
import Service from '../views/Service.vue'

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    component: Chat,
    meta: { requiresAuth: true }
  },
  {
    path: '/docs',
    component: Docs,
    meta: { requiresAuth: true }
  },
  {
    path: '/service',
    component: Service,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  // 使用 sessionStorage 检查登录状态（避免 Pinia 初始化时序问题）
  const isAuth = !!sessionStorage.getItem('auth_user')

  if (to.meta.requiresAuth && !isAuth) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.path === '/login' && isAuth) {
    return '/'
  }
})

export default router
