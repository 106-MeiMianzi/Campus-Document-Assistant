import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginApi, getUserInfo } from '../api'
import { setToken, removeToken } from '../api/request'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(!!sessionStorage.getItem('auth_user'))
  const user = ref(JSON.parse(sessionStorage.getItem('auth_user') || 'null'))

  const isTeacher = computed(() => user.value?.role === 'TEACHER')

  function setUser(userInfo) {
    sessionStorage.setItem('auth_user', JSON.stringify(userInfo))
    user.value = userInfo
  }

  /**
   * 登录 —— 优先调用后端 API，失败时回退到本地 mock 验证。
   */
  async function login(userId, password) {
    try {
      const data = await loginApi(userId, password)
      setToken(data.token)

      let userInfo = null
      try {
        const { data: info } = await getUserInfo()
        userInfo = mapUserInfo(info, userId)
      } catch {
        userInfo = buildMockUser(userId)
      }

      setUser(userInfo)
      isAuthenticated.value = true
      return { ok: true }
    } catch (err) {
      console.warn('后端登录不可用，使用本地验证:', err.message)
    }

    if (!/^\d{6,12}$/.test(userId)) {
      return { ok: false, msg: '学号/工号格式不正确，请输入6-12位数字' }
    }
    if (!password || password.length < 4) {
      return { ok: false, msg: '密码长度至少4位' }
    }

    const userInfo = buildMockUser(userId)
    setUser(userInfo)
    isAuthenticated.value = true
    return { ok: true }
  }

  function logout() {
    removeToken()
    sessionStorage.removeItem('auth_user')
    user.value = null
    isAuthenticated.value = false
  }

  return { isAuthenticated, user, isTeacher, login, logout, setUser }
})

function mapUserInfo(info, fallbackUsername) {
  const role = info.role || (String(fallbackUsername).startsWith('9') ? 'STUDENT' : 'TEACHER')
  return {
    id: info.id,
    username: info.username || fallbackUsername,
    name: info.name || fallbackUsername,
    role,
    roleLabel: info.roleLabel || (role === 'TEACHER' ? '教师' : '学生'),
    avatar: info.avatar || null,
    college: info.college || null,
    grade: info.grade || null,
    major: info.major || null,
    className: info.className || null,
    phone: info.phone || null,
    email: info.email || null,
    jobTitle: info.jobTitle || null
  }
}

function buildMockUser(userId) {
  const isTeacher = !String(userId).startsWith('9')
  return {
    id: userId,
    username: userId,
    name: isTeacher ? '李老师' : '张同学',
    role: isTeacher ? 'TEACHER' : 'STUDENT',
    roleLabel: isTeacher ? '教师' : '学生',
    avatar: null,
    college: null,
    grade: null,
    major: null,
    className: null,
    phone: null,
    email: null,
    jobTitle: null
  }
}
