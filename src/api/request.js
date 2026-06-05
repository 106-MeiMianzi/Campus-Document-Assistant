/**
 * 统一请求模块 —— Axios 实例 + 拦截器 + 错误处理。
 *
 * 特性：
 *   - 请求拦截：自动注入 Token、防重复提交、GET 防缓存
 *   - 响应拦截：统一错误码处理、401 自动登出跳转、网络异常兜底
 *   - 业务错误：ApiError 类携带 code / status / message
 *   - 文件场景：上传进度回调、下载 Blob 处理
 *   - 便捷方法：get / post / put / del / patch / upload / download
 *
 * 用法：
 *   import http from '@/api/request'
 *   const { data } = await http.get('/documents/search', { params: { q: '奖学金' } })
 *   const { data } = await http.post('/chat', { question, docId })
 *   await http.upload('/documents/upload', file, (pct) => console.log(pct))
 */

import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import router from '../router'

/* ==============================
   常量 & 错误码映射
   ============================== */

const TOKEN_KEY = 'auth_token'

// 业务错误码 —— 按后端实际约定扩展
const ERROR_CODE_MAP = {
  0: 'ok',
  400: '请求参数有误',
  401: '身份认证已过期，请重新登录',
  403: '没有访问权限',
  404: '请求的资源不存在',
  409: '数据冲突',
  422: '请求参数校验失败',
  429: '请求过于频繁，请稍后再试',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂不可用',
}

// 不需要注入 Token 的白名单
const WHITELIST = ['/auth/login', '/auth/register']

/* ==============================
   自定义业务错误
   ============================== */

export class ApiError extends Error {
  constructor({ code, message, status, data }) {
    super(message)
    this.name = 'ApiError'
    this.code = code      // 业务错误码（或 HTTP 状态码）
    this.status = status   // HTTP 状态码
    this.data = data       // 原始响应体
  }
}

/* ==============================
   Token 读写辅助
   ============================== */

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

/* ==============================
   创建 Axios 实例
   ============================== */

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },
})

export const API_BASE = http.defaults.baseURL

/** 构建带短效 token 的文档文件 URL，供 iframe / 新窗口直接加载（token 为 preview-token，非登录 JWT） */
export function buildDocumentFileUrl(documentId, previewToken) {
  const base = (API_BASE || '/api').replace(/\/$/, '')
  const urlBase = base.startsWith('http') ? base : `${window.location.origin}${base}`
  return `${urlBase}/document/${documentId}/file?token=${encodeURIComponent(previewToken)}`
}

/* ==============================
   请求拦截器
   ============================== */

// 用于取消重复请求的 Map
const pendingRequests = new Map()

/** 生成请求唯一标识 */
function requestKey(config) {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/** 移除已完成的请求 */
function removePending(config) {
  const key = requestKey(config)
  if (pendingRequests.has(key)) {
    pendingRequests.get(key)(key)
    pendingRequests.delete(key)
  }
}

/** 注册请求到待处理队列 */
function addPending(config) {
  const key = requestKey(config)
  config.cancelToken = new axios.CancelToken((cancel) => {
    if (!pendingRequests.has(key)) {
      pendingRequests.set(key, cancel)
    }
  })
}

http.interceptors.request.use(
  (config) => {
    // --- 防重复提交（仅针对写操作） ---
    if (config.method !== 'get') {
      removePending(config)
      addPending(config)
    }

    // --- 自动注入 Token ---
    const url = config.url || ''
    const needAuth = !WHITELIST.some((p) => url.includes(p))
    if (needAuth) {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // --- GET 请求加时间戳防缓存 ---
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() }
    }

    return config
  },
  (error) => Promise.reject(error),
)

/* ==============================
   响应拦截器
   ============================== */

http.interceptors.response.use(
  (response) => {
    removePending(response.config)

    // 文件下载 / 二进制：原样返回
    if (response.config.responseType === 'blob') {
      return response
    }

    const res = response.data

    // 非标准 JSON 或字符串响应：直接返回
    if (typeof res === 'string' || res instanceof ArrayBuffer) {
      return response
    }

    // --- 后端统一响应格式 { code, data, message } ---
    const { code, data, message } = res || {}

    // 成功
    if (code === undefined || code === 0 || code === 200) {
      response.data = data ?? res
      return response
    }

    // 业务失败
    const errMsg = message || ERROR_CODE_MAP[code] || `请求失败 (code: ${code})`
    return Promise.reject(new ApiError({ code, message: errMsg, status: code, data: res }))
  },
  (error) => {
    if (error.config) removePending(error.config)

    // --- 请求被取消 ---
    if (axios.isCancel(error)) {
      return Promise.reject(new ApiError({ code: -1, message: '', status: 0, data: null }))
    }

    // --- 超时 ---
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new ApiError({ code: -2, message: '请求超时，请检查网络后重试', status: 0, data: null }))
    }

    // --- 网络断开 ---
    if (!error.response) {
      const msg = error.message === 'Network Error'
        ? '网络连接失败，请检查网络'
        : error.message || '网络异常'
      return Promise.reject(new ApiError({ code: -3, message: msg, status: 0, data: null }))
    }

    // --- HTTP 状态码错误 ---
    const { status, data } = error.response
    const msg = data?.message || ERROR_CODE_MAP[status] || `请求异常 (${status})`

    // 401 自动清登录态并重定向
    if (status === 401) {
      removeToken()
      const auth = useAuthStore()
      auth.logout()
      router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    }

    // 5xx 服务端错误打印日志
    if (status >= 500) {
      console.error(`[Request] 服务端 ${status}:`, data)
    }

    return Promise.reject(new ApiError({ code: status, message: msg, status, data }))
  },
)

/* ==============================
   便捷方法
   ============================== */

export function get(url, config)          { return http.get(url, config) }
export function post(url, data, config)   { return http.post(url, data, config) }
export function put(url, data, config)    { return http.put(url, data, config) }
export function del(url, config)          { return http.delete(url, config) }
export function patch(url, data, config)  { return http.patch(url, data, config) }

/**
 * 文件上传（带进度回调）
 * @param {string}    url          上传接口地址
 * @param {File}      file         文件对象
 * @param {Function}  onProgress   进度回调 (0-100)
 * @param {object}    extraData    额外表单字段
 */
export function uploadFile(url, file, onProgress, extraData) {
  const form = new FormData()
  form.append('file', file)
  if (extraData) {
    Object.entries(extraData).forEach(([k, v]) => form.append(k, v))
  }
  return http.post(url, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
    onUploadProgress: (evt) => {
      if (evt.total && onProgress) {
        onProgress(Math.round((evt.loaded / evt.total) * 100))
      }
    },
  })
}

/**
 * 文件下载（Blob 方式）
 * @param {string} url
 * @param {string} fileName  默认文件名
 */
export async function downloadFile(url, fileName) {
  const resp = await http.get(url, { responseType: 'blob' })
  const blobUrl = URL.createObjectURL(resp.data)
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = fileName || 'download'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(blobUrl)
}

/**
 * 批量请求（控制并发数）
 * @param {Array<() => Promise>} tasks  返回 Promise 的函数数组
 * @param {number}               limit  并发上限
 */
export async function batchRequest(tasks, limit = 3) {
  const results = []
  const executing = new Set()

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task())
    results.push(p)
    executing.add(p)
    const clean = () => executing.delete(p)
    p.then(clean, clean)
    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }

  return Promise.allSettled(results)
}

export default http
