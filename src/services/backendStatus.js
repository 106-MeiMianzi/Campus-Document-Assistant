/**
 * 后端连接状态检测 —— 定时 ping 后端，驱动导航栏状态指示灯。
 *
 * 用法：
 *   import { backendOnline, lastChecked } from '@/services/backendStatus.js'
 *   backendOnline.value  // true=已连接, false=离线, null=检测中
 */

import { ref } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export const backendOnline = ref(null)   // null=检测中, true=在线, false=离线
export const lastChecked = ref(null)     // 最近一次检测时间

let timer = null

async function check() {
  try {
    // 用 axios 直接发一个轻量请求，不走拦截器
    await axios.get(`${API_BASE}/user/info`, { timeout: 5000 })
    backendOnline.value = true
  } catch (e) {
    // 只要能连上后端（即使返回 401）也算在线；只有网络错误才算离线
    if (e.response) {
      backendOnline.value = true
    } else {
      backendOnline.value = false
    }
  }
  lastChecked.value = Date.now()
}

/** 启动定时检测（每 30 秒） */
export function startChecking() {
  stopChecking()
  check()
  timer = setInterval(check, 30000)
}

/** 停止检测 */
export function stopChecking() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
