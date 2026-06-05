import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'app_notifications'
const READ_KEY = 'app_notifications_read'

function loadNotifications() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}
function loadReadIds() {
  try { return new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]')) }
  catch { return new Set() }
}
function saveNotifications(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}
function saveReadIds(set) {
  localStorage.setItem(READ_KEY, JSON.stringify([...set]))
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref(loadNotifications())
  const readIds = ref(loadReadIds())

  const unreadCount = computed(() =>
    notifications.value.filter(n => !readIds.value.has(n.id)).length
  )

  /** 添加一条通知 */
  function addNotification({ title, time, type, docId }) {
    const id = Date.now()
    const item = {
      id, title,
      time: time || formatRelativeTime(new Date()),
      type: type || 'info',
      tag: typeLabel(type || 'info'),
      docId: docId || id,
      createdAt: new Date().toISOString()
    }
    notifications.value.unshift(item)
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
    saveNotifications(notifications.value)
  }

  /** 标记单条已读 */
  function markRead(id) {
    readIds.value.add(id)
    saveReadIds(readIds.value)
  }

  /** 全部已读 */
  function markAllRead() {
    notifications.value.forEach(n => readIds.value.add(n.id))
    saveReadIds(readIds.value)
  }

  function isUnread(id) {
    return !readIds.value.has(id)
  }

  // 初始化种子数据：如果为空则填充默认通知
  if (notifications.value.length === 0) {
    const seeds = [
      { title: '福州大学国家奖学金管理办法（2026修订版）', time: '2小时前', type: 'scholarship' },
      { title: '本科生转专业实施细则', time: '昨天 14:30', type: 'academic' },
      { title: '学生宿舍管理规定', time: '昨天 09:15', type: 'logistics' },
      { title: '2026年夏季小学期选课指南', time: '3天前', type: 'academic' },
    ]
    seeds.forEach(s => addNotification(s))
  }

  return { notifications, readIds, unreadCount, addNotification, markRead, markAllRead, isUnread }
})

function typeLabel(t) {
  const map = { scholarship: '奖学金', academic: '教务', student: '学工', logistics: '后勤', safety: '安全', info: '通知' }
  return map[t] || '通知'
}

function formatRelativeTime(date) {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}
