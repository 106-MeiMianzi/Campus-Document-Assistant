import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'app_todo_items'

function loadTodos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}
function saveTodos(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const useTodoStore = defineStore('todo', () => {
  const items = ref(loadTodos())

  const pendingCount = computed(() => items.value.filter(t => !t.done).length)

  /** 添加待办 */
  function addTodo({ title, tag, deadline, urgent, serviceRoute, serviceId }) {
    // 防重复：同一 serviceRoute + serviceId 已存在且未完成则跳过
    const dup = items.value.find(t =>
      t.serviceRoute === serviceRoute && t.serviceId === serviceId && !t.done
    )
    if (dup) return false

    const id = Date.now()
    items.value.push({
      id,
      title,
      tag: tag || '事务',
      deadline: deadline || '',
      urgent: urgent || false,
      done: false,
      serviceRoute: serviceRoute || '',
      serviceId: serviceId || '',
      createdAt: new Date().toISOString()
    })
    saveTodos(items.value)
    return true
  }

  /** 切换完成状态 */
  function toggleDone(id) {
    const item = items.value.find(t => t.id === id)
    if (item) {
      item.done = !item.done
      saveTodos(items.value)
    }
  }

  /** 删除待办 */
  function removeTodo(id) {
    items.value = items.value.filter(t => t.id !== id)
    saveTodos(items.value)
  }

  /** 检查某个服务是否已加入待办 */
  function hasTodo(serviceRoute, serviceId) {
    return items.value.some(t =>
      t.serviceRoute === serviceRoute && t.serviceId === serviceId && !t.done
    )
  }

  // 种子数据
  if (items.value.length === 0) {
    const seeds = [
      { title: '国家奖学金申请材料提交', tag: '奖学金', deadline: '6月15日 截止', urgent: true },
      { title: '2026秋学期选修课选课', tag: '教务', deadline: '6月10日 开始', urgent: true },
      { title: '图书馆借阅图书归还', tag: '图书馆', deadline: '6月8日 截止', urgent: false },
      { title: '体测成绩确认签字', tag: '体育', deadline: '6月5日 截止', urgent: false, done: true },
    ]
    seeds.forEach(s => {
      items.value.push({ id: Date.now() + Math.random(), ...s, done: s.done || false, serviceRoute: '', serviceId: '', createdAt: new Date().toISOString() })
    })
    saveTodos(items.value)
  }

  return { items, pendingCount, addTodo, toggleDone, removeTodo, hasTodo }
})
