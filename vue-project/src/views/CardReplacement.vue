<template>
  <div class="card-replace-page">
    <Navbar />

    <div class="page-content">
      <div class="container">
        <button ref="backBtnRef" class="back-btn" @click="router.push('/service')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          返回办事大厅
        </button>

        <div ref="heroRef" class="page-hero">
          <div ref="heroIconRef" class="hero-icon" style="background: linear-gradient(135deg, #FDF5F0, #FBEEE4)">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8673A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <div>
            <h1>校园卡补办</h1>
            <p>校园卡挂失、补办、解挂的快速办理通道</p>
          </div>
          <button class="todo-add-btn" :class="{ added: inTodo }" @click="toggleTodo">
            <svg v-if="!inTodo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ inTodo ? '已加入待办' : '加入待办' }}
          </button>
        </div>

        <section class="content-section">
          <h2 ref="flowTitleRef" class="section-title">办理流程</h2>
          <div ref="timelineRef" class="timeline">
            <div v-for="(step, sIdx) in steps" :key="sIdx" class="timeline-item">
              <div class="timeline-marker">
                <div class="marker-dot" :class="{ done: step.status === 'done' }">
                  <svg v-if="step.status === 'done'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span v-else>{{ sIdx + 1 }}</span>
                </div>
                <div v-if="sIdx < steps.length - 1" class="marker-line"></div>
              </div>
              <div class="timeline-content">
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-desc">{{ step.desc }}</p>
                <div class="step-meta" v-if="step.dept || step.time || step.material">
                  <span v-if="step.dept" class="meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                    {{ step.dept }}
                  </span>
                  <span v-if="step.time" class="meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ step.time }}
                  </span>
                  <span v-if="step.material" class="meta-item material">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {{ step.material }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="content-section">
          <h2 ref="applyTitleRef" class="section-title">在线申请</h2>

          <div ref="applyContentRef">
          <div v-if="!auth.isAuthenticated" class="login-hint card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <p>登录后可提交补办申请并查看办理进度</p>
            <button class="btn btn-primary" @click="goLogin">去登录</button>
          </div>

          <template v-else>
            <form class="apply-form card" @submit.prevent="submitApply">
              <div class="form-row">
                <label>申请类型</label>
                <select v-model="form.requestType" required>
                  <option value="LOST">挂失补办</option>
                  <option value="DAMAGED">损坏补办</option>
                  <option value="UNFREEZE">解冻</option>
                </select>
              </div>
              <div class="form-row">
                <label>联系电话</label>
                <input v-model="form.contactPhone" type="tel" placeholder="请输入手机号" required />
              </div>
              <div class="form-row">
                <label>领取地点</label>
                <input v-model="form.pickupLocation" type="text" placeholder="默认：一卡通中心" />
              </div>
              <p v-if="error" class="form-error">{{ error }}</p>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? '提交中...' : '提交申请' }}
              </button>
            </form>

            <div class="requests-section card">
              <div class="requests-header">
                <h3>我的申请</h3>
                <button class="btn-text" :disabled="listLoading" @click="loadRequests">刷新</button>
              </div>
              <p v-if="listLoading" class="requests-empty">加载中...</p>
              <p v-else-if="requests.length === 0" class="requests-empty">暂无申请记录</p>
              <ul v-else class="request-list">
                <li v-for="req in requests" :key="req.id" class="request-item">
                  <div class="request-main">
                    <span class="request-type">{{ typeLabel(req.requestType) }}</span>
                    <span class="request-status" :class="statusClass(req.status)">{{ statusLabel(req.status) }}</span>
                  </div>
                  <div class="request-meta">
                    <span>{{ req.pickupLocation }}</span>
                    <span>{{ formatTime(req.createdAt) }}</span>
                  </div>
                  <button
                    v-if="req.status === 'SUBMITTED'"
                    type="button"
                    class="btn btn-outline btn-sm"
                    :disabled="cancelingId === req.id"
                    @click="cancelReq(req.id)"
                  >
                    {{ cancelingId === req.id ? '取消中...' : '取消申请' }}
                  </button>
                </li>
              </ul>
            </div>
          </template>
          </div>
        </section>

        <section class="content-section">
          <h2 ref="contactTitleRef" class="section-title">联系方式</h2>
          <div ref="contactRef" class="contact-card">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>校园卡服务中心：0591-2286XXXX</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { useAuthStore } from '../stores/auth'
import { useTodoStore } from '../stores/todo'
import { createCardReplacement, getCardReplacementList, cancelCardReplacement } from '../api'
import { getToken } from '../api/request'
import { gsap } from '../plugins/gsap'

const router = useRouter()
const auth = useAuthStore()
const todoStore = useTodoStore()

const backBtnRef = ref(null)
const heroRef = ref(null)
const heroIconRef = ref(null)
const flowTitleRef = ref(null)
const timelineRef = ref(null)
const applyTitleRef = ref(null)
const applyContentRef = ref(null)
const contactTitleRef = ref(null)
const contactRef = ref(null)
let ctx

const steps = [
  { title: '挂失', desc: '通过校园卡自助服务终端、校园APP或致电服务中心进行挂失', status: 'done', dept: '校园卡服务中心', time: '即时生效' },
  { title: '准备材料', desc: '携带本人身份证或学生证原件', status: 'done', material: '身份证或学生证' },
  { title: '前往服务中心', desc: '到校园卡服务中心窗口办理补办手续，缴纳工本费', status: 'pending', dept: '校园卡服务中心', time: '工作日 9:00-17:00', material: '工本费15元' },
  { title: '领取新卡', desc: '现场制卡，立等可取；原卡余额自动转入新卡', status: 'pending', dept: '校园卡服务中心', time: '当场领取' }
]

const form = ref({ requestType: 'LOST', contactPhone: '', pickupLocation: '一卡通中心' })
const error = ref('')
const submitting = ref(false)
const requests = ref([])
const listLoading = ref(false)
const cancelingId = ref(null)

// ---- 加入待办 ----
const SERVICE_ROUTE = '/service/card-replacement'
const SERVICE_ID = 'card-replacement'
const inTodo = computed(() => todoStore.hasTodo(SERVICE_ROUTE, SERVICE_ID))
function toggleTodo() {
  if (inTodo.value) {
    const item = todoStore.items.find(t => t.serviceRoute === SERVICE_ROUTE && t.serviceId === SERVICE_ID && !t.done)
    if (item) todoStore.removeTodo(item.id)
  } else {
    todoStore.addTodo({
      title: '校园卡补办',
      tag: '校园卡',
      deadline: '工作日 9:00-17:00',
      urgent: false,
      serviceRoute: SERVICE_ROUTE,
      serviceId: SERVICE_ID
    })
  }
}

const TYPE_LABELS = { LOST: '挂失补办', DAMAGED: '损坏补办', UNFREEZE: '解冻' }
const STATUS_LABELS = { SUBMITTED: '已提交', PROCESSING: '处理中', READY: '待领取', COMPLETED: '已完成', CANCELLED: '已取消' }

function typeLabel(t) { return TYPE_LABELS[t] || t }
function statusLabel(s) { return STATUS_LABELS[s] || s }
function statusClass(s) { return 'status-' + (s || '').toLowerCase() }
function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function goLogin() {
  router.push({ path: '/login', query: { redirect: '/service/card-replacement' } })
}

async function loadRequests() {
  if (!getToken()) return
  listLoading.value = true
  error.value = ''
  try {
    const { data } = await getCardReplacementList({ page: 1, size: 20 })
    requests.value = data?.list || []
  } catch (err) {
    error.value = err.message || '加载失败'
  } finally {
    listLoading.value = false
  }
}

async function submitApply() {
  if (!getToken()) { goLogin(); return }
  submitting.value = true
  error.value = ''
  try {
    await createCardReplacement({
      requestType: form.value.requestType,
      contactPhone: form.value.contactPhone.trim(),
      pickupLocation: form.value.pickupLocation?.trim() || undefined
    })
    await loadRequests()
    form.value.requestType = 'LOST'
    if (auth.user?.phone) form.value.contactPhone = auth.user.phone
    if (!form.value.pickupLocation) form.value.pickupLocation = '一卡通中心'
  } catch (err) {
    error.value = err.message || '提交失败'
  } finally {
    submitting.value = false
  }
}

async function cancelReq(id) {
  cancelingId.value = id
  error.value = ''
  try {
    await cancelCardReplacement(id)
    await loadRequests()
  } catch (err) {
    error.value = err.message || '取消失败'
  } finally {
    cancelingId.value = null
  }
}

onMounted(() => {
  if (auth.user?.phone) form.value.contactPhone = auth.user.phone
  if (auth.isAuthenticated && getToken()) loadRequests()

  nextTick(() => {
    ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { duration: 0.45, ease: 'power2.out' } })

      tl.from(backBtnRef.value, { y: -12, opacity: 0, duration: 0.35 }, 0)
      tl.from(heroIconRef.value, { x: -20, opacity: 0, duration: 0.4 }, 0.06)
      tl.from(heroRef.value.querySelectorAll('h1, p'), { y: 16, opacity: 0, stagger: 0.06, duration: 0.4 }, 0.1)
      tl.from(flowTitleRef.value, { y: 12, opacity: 0, duration: 0.35 }, 0.2)
      tl.from(timelineRef.value.querySelectorAll('.timeline-item'), { x: -16, opacity: 0, stagger: 0.08, duration: 0.45 }, 0.28)
      tl.from(applyTitleRef.value, { y: 12, opacity: 0, duration: 0.35 }, 0.4)
      tl.from(applyContentRef.value, { y: 12, opacity: 0, duration: 0.4 }, 0.46)
      tl.from(contactTitleRef.value, { y: 12, opacity: 0, duration: 0.35 }, 0.55)
      tl.from(contactRef.value, { y: 12, opacity: 0, duration: 0.4 }, 0.6)
    })
  })
})

onUnmounted(() => { ctx?.revert() })
</script>

<style scoped>
.card-replace-page {
  min-height: 100vh;
  background: var(--bg);
}

.page-content {
  padding-top: var(--navbar-height);
  padding-bottom: 80px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  margin-top: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--bg-warm);
}

.page-hero {
  margin: 32px 0 40px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-hero h1 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.page-hero p {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.todo-add-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 18px;
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); font-size: 0.88rem; font-weight: 500;
  color: var(--text-secondary); cursor: pointer; font-family: inherit;
  transition: all var(--transition-fast); margin-left: auto; flex-shrink: 0;
}
.todo-add-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
.todo-add-btn.added { background: #E8F0E8; border-color: #6B9A6B; color: #4A8A4A; }
.todo-add-btn.added:hover { background: #D8E8D8; }

.content-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border-light);
}

.timeline { padding-left: 4px; }

.timeline-item { display: flex; gap: 16px; }

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 28px;
}

.marker-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  color: var(--text-tertiary);
  font-size: 0.78rem;
  font-weight: 700;
  border: 2px solid var(--border);
  flex-shrink: 0;
}

.marker-dot.done {
  background: #E8F0E8;
  border-color: #6B9A6B;
  color: #4A8A4A;
}

.marker-line {
  width: 2px;
  flex: 1;
  min-height: 28px;
  background: var(--border-light);
  margin: 4px 0;
}

.timeline-content { padding-bottom: 24px; flex: 1; }

.step-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.step-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 8px;
}

.step-meta { display: flex; flex-wrap: wrap; gap: 8px; }

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: var(--bg-warm);
  border-radius: var(--radius-full);
  font-size: 0.73rem;
  color: var(--text-tertiary);
}

.meta-item.material { background: #FFF8E8; color: #8B7355; }

.login-hint {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.login-hint p { flex: 1; font-size: 0.9rem; color: var(--text-secondary); }

.apply-form { padding: 24px; margin-bottom: 20px; }

.form-row { margin-bottom: 16px; }

.form-row label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-tertiary);
  margin-bottom: 6px;
}

.form-row input,
.form-row select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  background: var(--bg);
  color: var(--text);
  box-sizing: border-box;
}

.form-row input:focus,
.form-row select:focus { outline: none; border-color: var(--primary); }

.form-error { font-size: 0.82rem; color: #c45c3a; margin-bottom: 10px; }

.apply-form .btn-primary { width: 100%; }

.requests-section { padding: 20px 24px; }

.requests-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.requests-header h3 { font-size: 0.92rem; font-weight: 600; color: var(--text); }

.btn-text {
  font-size: 0.82rem;
  color: var(--primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
}

.btn-text:disabled { opacity: 0.5; cursor: not-allowed; }

.requests-empty { font-size: 0.88rem; color: var(--text-tertiary); padding: 8px 0; }

.request-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }

.request-item { padding: 12px 0; border-bottom: 1px solid var(--border-light); }
.request-item:last-child { border-bottom: none; }

.request-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.request-type { font-weight: 600; font-size: 0.92rem; color: var(--text); }

.request-status {
  font-size: 0.75rem;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.status-submitted { background: #fff4e6; color: #b86e00; }
.status-processing { background: #eef2f7; color: #4a5568; }
.status-ready { background: #e8f4e8; color: #4a8a4a; }
.status-completed { background: #e8f0e8; color: #3d6b3d; }
.status-cancelled { background: var(--bg-warm); color: var(--text-tertiary); }

.request-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: var(--text-tertiary);
  margin-bottom: 10px;
}

.btn-sm { padding: 6px 14px; font-size: 0.82rem; }

.contact-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@media (max-width: 600px) {
  .container { padding: 0 16px; }
  .page-hero { flex-direction: column; align-items: flex-start; gap: 12px; }
  .page-hero h1 { font-size: 1.5rem; }
}
</style>