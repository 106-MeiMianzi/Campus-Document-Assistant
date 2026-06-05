import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginApi, getUserInfo } from '../api'
import { setToken, removeToken } from '../api/request'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(!!sessionStorage.getItem('auth_user'))
  const rawUser = JSON.parse(sessionStorage.getItem('auth_user') || 'null')
  // 兼容旧格式：缺少新增字段时用 mock 补全
  const user = ref(rawUser ? { ...buildMockUser(rawUser.id), ...rawUser, avatar: rawUser.avatar || null } : null)

  const isTeacher = computed(() => user.value?.identity === '教师')

  /** 将后端返回的相对路径转为完整 URL（data: 或 http 开头的原样返回） */
  const API_DOMAIN = (import.meta.env.VITE_API_BASE || '').replace(/\/api\/?$/, '')
  function resolveAvatarUrl(avatar) {
    if (!avatar) return null
    if (avatar.startsWith('data:') || avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar
    return API_DOMAIN + avatar
  }
  const avatarUrl = computed(() => resolveAvatarUrl(user.value?.avatar))

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

      // 获取用户信息，规范化字段名后合并 mock 默认值
      const defaults = buildMockUser(userId)
      let userInfo
      try {
        const { data: info } = await getUserInfo()
        userInfo = normalizeUserInfo(info, defaults)
      } catch {
        userInfo = defaults
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

  function updateAvatar(avatarUrl) {
    if (!user.value) return
    user.value = { ...user.value, avatar: avatarUrl }
    sessionStorage.setItem('auth_user', JSON.stringify(user.value))
  }

  function updateProfile(fields) {
    if (!user.value) return
    user.value = { ...user.value, ...fields }
    sessionStorage.setItem('auth_user', JSON.stringify(user.value))
  }

  function logout() {
    removeToken()
    sessionStorage.removeItem('auth_user')
    user.value = null
    isAuthenticated.value = false
  }

  return { isAuthenticated, user, isTeacher, avatarUrl, login, logout, setUser, updateAvatar, updateProfile }
})

function buildMockUser(userId) {
  const id = String(userId)
  const isStudent = id.startsWith('1')
  return {
    id,
    name: isStudent ? '张同学' : '李老师',
    identity: isStudent ? '学生' : '教师',
    role: isStudent ? '本科生' : '讲师',
    college: '计算机与大数据学院',
    avatar: null,
    // 学生特有
    ...(isStudent ? {
      major: '计算机科学与技术',
      grade: '2024级',
      className: '计科2401班',
      phone: '138****5678',
    } : {
      // 教师特有
      title: '讲师',
      email: 'lisi@fzu.edu.cn',
    })
  }
}

/**
 * 将后端返回的用户信息规范化到前端统一字段名。
 * 后端可能使用不同命名（如 username / realName / jobTitle 等），
 * 这里做一次映射，确保后续组件取值一致。
 */
function normalizeUserInfo(backendUser, defaults) {
  if (!backendUser || typeof backendUser !== 'object') return defaults

  const raw = { ...backendUser }
  const id = String(raw.username || raw.studentId || raw.teacherId || raw.id || defaults.id)
  const isTeacher = raw.role === 'TEACHER' || raw.role === 'teacher' || id.startsWith('2') || id.startsWith('3')

  return {
    ...defaults,
    id,
    name: raw.name || raw.realName || raw.nickname || defaults.name,
    identity: isTeacher ? '教师' : '学生',
    role: raw.roleLabel || (isTeacher ? defaults.role : raw.role) || defaults.role,
    college: raw.college || raw.department || raw.dept || defaults.college,
    avatar: raw.avatar || defaults.avatar,
    // 学生字段
    major: raw.major || defaults.major,
    grade: raw.grade || defaults.grade,
    className: raw.className || raw.classname || defaults.className,
    phone: raw.phone || raw.phoneNumber || raw.mobile || defaults.phone,
    // 教师字段
    title: raw.title || raw.jobTitle || raw.position || defaults.title,
    email: raw.email || defaults.email,
  }
}
