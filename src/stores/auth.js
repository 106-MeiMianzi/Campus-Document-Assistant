import { ref } from 'vue'
import { defineStore } from 'pinia'
import { loginApi, getUserInfo } from '../api'
import { setToken, removeToken } from '../api/request'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(!!sessionStorage.getItem('auth_user'))
  const user = ref(JSON.parse(sessionStorage.getItem('auth_user') || 'null'))

  /**
   * 登录 —— 优先调用后端 API，失败时回退到本地 mock 验证。
   * 后端约定：POST /api/auth/login  { username, password } → { token, expire }
   */
  async function login(userId, password) {
    // 1. 尝试后端登录
    try {
      const data = await loginApi(userId, password)
      // data = { token, expire }
      setToken(data.token)

      // 获取用户信息
      let userInfo = null
      try {
        const { data: info } = await getUserInfo()
        userInfo = {
          id: info.id || userId,
          name: info.name || userId,
          role: info.role || '用户',
          avatar: info.avatar || null
        }
      } catch {
        // 用户信息接口不可用时，用登录 ID 兜底
        userInfo = buildMockUser(userId)
      }

      sessionStorage.setItem('auth_user', JSON.stringify(userInfo))
      user.value = userInfo
      isAuthenticated.value = true
      return { ok: true }
    } catch (err) {
      console.warn('后端登录不可用，使用本地验证:', err.message)
    }

    // 2. 兜底：本地 mock 验证
    if (!/^\d{6,12}$/.test(userId)) {
      return { ok: false, msg: '学号/工号格式不正确，请输入6-12位数字' }
    }
    if (!password || password.length < 4) {
      return { ok: false, msg: '密码长度至少4位' }
    }

    const userInfo = buildMockUser(userId)
    sessionStorage.setItem('auth_user', JSON.stringify(userInfo))
    user.value = userInfo
    isAuthenticated.value = true
    return { ok: true }
  }

  function logout() {
    removeToken()
    sessionStorage.removeItem('auth_user')
    user.value = null
    isAuthenticated.value = false
  }

  return { isAuthenticated, user, login, logout }
})

function buildMockUser(userId) {
  return {
    id: userId,
    name: userId.startsWith('1') ? '张同学' : '李老师',
    role: userId.startsWith('1') ? '本科生' : '教职工',
    avatar: null
  }
}
