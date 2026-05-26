<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-decor">
      <div class="decor-circle c1"></div>
      <div class="decor-circle c2"></div>
      <div class="decor-circle c3"></div>
      <div class="decor-grid"></div>
    </div>

    <!-- 主卡片 -->
    <div class="auth-card">
      <!-- 左侧品牌区 -->
      <div class="card-brand">
        <div class="brand-inner">
          <div class="brand-logo">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1>校问必答</h1>
          <p class="brand-sub">校园文档智能助手</p>
          <div class="brand-features">
            <div class="bf-item">
              <div class="bf-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <span>查得到 — 统一检索校内制度文件</span>
            </div>
            <div class="bf-item">
              <div class="bf-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span>答得对 — 基于文档的智能问答</span>
            </div>
            <div class="bf-item">
              <div class="bf-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <span>给依据 — 每一条结论可追溯原文</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧表单区 -->
      <div class="card-form">
        <!-- 标签切换 -->
        <div class="form-tabs">
          <button
            class="form-tab"
            :class="{ active: mode === 'login' }"
            @click="mode = 'login'; clearError()"
          >登录</button>
          <div class="tab-divider"></div>
          <button
            class="form-tab"
            :class="{ active: mode === 'register' }"
            @click="mode = 'register'; clearError()"
          >注册</button>
        </div>

        <div class="form-scroll">
          <!-- 登录表单 -->
          <div v-if="mode === 'login'" class="form-fields">
            <div class="field">
              <label>学号 / 工号</label>
              <div class="field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  v-model="loginForm.userId"
                  type="text"
                  placeholder="请输入学号或工号"
                  @keyup.enter="focusEl('loginPwd')"
                />
              </div>
            </div>
            <div class="field">
              <label>密码</label>
              <div class="field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  ref="loginPwdRef"
                  v-model="loginForm.password"
                  :type="showPwd ? 'text' : 'password'"
                  placeholder="请输入密码"
                  autocomplete="off"
                  @keyup.enter="doLogin"
                />
                <button class="pwd-btn" @click="showPwd = !showPwd" tabindex="-1">
                  <svg v-if="showPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="errorMsg" class="error-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {{ errorMsg }}
            </div>

            <button class="submit-btn" :class="{ loading }" :disabled="loading" @click="doLogin">
              <span v-if="loading" class="spinner"></span>
              <span v-else>登 录</span>
            </button>
          </div>

          <!-- 注册表单 -->
          <div v-if="mode === 'register'" class="form-fields">
            <div class="field">
              <label>学号 / 工号</label>
              <div class="field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  v-model="registerForm.userId"
                  type="text"
                  placeholder="请输入学号或工号"
                  @keyup.enter="focusEl('regPwd1')"
                />
              </div>
            </div>
            <div class="field">
              <label>设置密码</label>
              <div class="field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  ref="regPwd1Ref"
                  v-model="registerForm.password"
                  :type="showRegPwd ? 'text' : 'password'"
                  placeholder="请设置密码（至少4位）"
                  autocomplete="off"
                  @keyup.enter="focusEl('regPwd2')"
                />
                <button class="pwd-btn" @click="showRegPwd = !showRegPwd" tabindex="-1">
                  <svg v-if="showRegPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="field">
              <label>确认密码</label>
              <div class="field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  ref="regPwd2Ref"
                  v-model="registerForm.confirmPwd"
                  :type="showRegPwd2 ? 'text' : 'password'"
                  placeholder="请再次输入密码"
                  autocomplete="off"
                  @keyup.enter="doRegister"
                />
                <button class="pwd-btn" @click="showRegPwd2 = !showRegPwd2" tabindex="-1">
                  <svg v-if="showRegPwd2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="errorMsg" class="error-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {{ errorMsg }}
            </div>
            <div v-if="successMsg" class="success-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {{ successMsg }}
            </div>

            <button class="submit-btn" :class="{ loading }" :disabled="loading" @click="doRegister">
              <span v-if="loading" class="spinner"></span>
              <span v-else>注 册</span>
            </button>
          </div>
        </div>

        <div class="form-footer">
          <template v-if="mode === 'login'">
            <p>首次使用请先注册账号</p>
          </template>
          <template v-else>
            <p>注册即表示同意《校问必答使用协议》</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { registerApi } from '../api/index.js'

const router = useRouter()
const auth = useAuthStore()

const mode = ref('login')
const showPwd = ref(false)
const showRegPwd = ref(false)
const showRegPwd2 = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)

const loginPwdRef = ref(null)
const regPwd1Ref = ref(null)
const regPwd2Ref = ref(null)

const loginForm = reactive({ userId: '', password: '' })
const registerForm = reactive({ userId: '', password: '', confirmPwd: '' })

function focusEl(refName) {
  const map = { loginPwd: loginPwdRef, regPwd1: regPwd1Ref, regPwd2: regPwd2Ref }
  map[refName]?.value?.focus()
}

function clearError() {
  errorMsg.value = ''
  successMsg.value = ''
}

async function doLogin() {
  errorMsg.value = ''
  if (!loginForm.userId.trim()) { errorMsg.value = '请输入学号或工号'; return }
  if (!loginForm.password) { errorMsg.value = '请输入密码'; return }

  loading.value = true
  const result = await auth.login(loginForm.userId.trim(), loginForm.password)
  loading.value = false

  if (result.ok) {
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  } else {
    errorMsg.value = result.msg
  }
}

async function doRegister() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!registerForm.userId.trim()) { errorMsg.value = '请输入学号或工号'; return }
  if (!/^\d{6,12}$/.test(registerForm.userId.trim())) {
    errorMsg.value = '学号/工号格式不正确，请输入6-12位数字'; return
  }
  if (!registerForm.password || registerForm.password.length < 4) {
    errorMsg.value = '密码长度至少4位'; return
  }
  if (registerForm.password !== registerForm.confirmPwd) {
    errorMsg.value = '两次输入的密码不一致'; return
  }

  loading.value = true
  try {
    // 1. 先调用后端注册接口
    await registerApi(registerForm.userId.trim(), registerForm.password)
  } catch (e) {
    // 注册失败（如用户名已存在），显示错误信息
    const msg = e.message || '注册失败，请稍后再试'
    errorMsg.value = msg
    loading.value = false
    return
  }

  // 2. 注册成功后自动登录
  const result = await auth.login(registerForm.userId.trim(), registerForm.password)
  loading.value = false

  if (result.ok) {
    successMsg.value = '注册成功，正在跳转...'
    await new Promise(r => setTimeout(r, 800))
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: var(--bg);
  position: relative;
  overflow: hidden;
}

/* ===== 背景装饰 ===== */
.bg-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.decor-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
}

.c1 {
  width: 400px;
  height: 400px;
  top: -80px;
  left: -120px;
  background: radial-gradient(circle, rgba(200, 103, 58, 0.08) 0%, transparent 70%);
}

.c2 {
  width: 300px;
  height: 300px;
  bottom: -60px;
  right: -80px;
  background: radial-gradient(circle, rgba(74, 85, 104, 0.06) 0%, transparent 70%);
}

.c3 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 15%;
  background: radial-gradient(circle, rgba(180, 140, 100, 0.06) 0%, transparent 70%);
}

.decor-grid {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(200, 103, 58, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(160, 120, 80, 0.03) 0%, transparent 50%);
}

/* ===== 主卡片 ===== */
.auth-card {
  position: relative;
  z-index: 1;
  display: flex;
  width: 960px;
  max-width: 100%;
  min-height: 560px;
  background: var(--surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

/* ===== 左侧品牌区 ===== */
.card-brand {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: linear-gradient(135deg, #FDF5F0 0%, #F9F4EE 50%, #F5F2EC 100%);
  border-right: 1px solid var(--border-light);
}

.brand-inner {
  max-width: 360px;
}

.brand-logo {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-warm);
  border-radius: var(--radius);
  color: #fff;
  margin-bottom: 20px;
}

.brand-inner h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: 0.03em;
  margin-bottom: 8px;
}

.brand-sub {
  font-size: 0.95rem;
  color: var(--text-tertiary);
  margin-bottom: 36px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bf-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bf-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border-radius: var(--radius-sm);
  color: var(--primary);
  flex-shrink: 0;
  box-shadow: var(--shadow-xs);
}

.bf-item span {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ===== 右侧表单区 ===== */
.card-form {
  width: 440px;
  display: flex;
  flex-direction: column;
  padding: 40px;
}

.form-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 32px;
}

.form-tab {
  padding: 8px 20px;
  background: transparent;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
  border-radius: var(--radius-sm);
}

.form-tab:hover {
  color: var(--text);
}

.form-tab.active {
  color: var(--primary);
  background: var(--primary-light);
}

.tab-divider {
  width: 1px;
  height: 20px;
  background: var(--border);
  margin: 0 4px;
}

.form-scroll {
  flex: 1;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field label {
  display: block;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.field-input {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.field-input:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(200, 103, 58, 0.08);
}

.field-input svg:first-child {
  flex-shrink: 0;
  color: var(--text-tertiary);
}

.field-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.93rem;
  background: transparent;
  color: var(--text);
  min-width: 0;
}

.field-input input::placeholder {
  color: var(--text-placeholder);
}

/* 隐藏浏览器原生密码眼睛 */
.field-input input[type="password"]::-ms-reveal,
.field-input input[type="password"]::-ms-clear {
  display: none;
}

.pwd-btn {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: transparent;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.pwd-btn:hover {
  background: var(--bg-warm);
  color: var(--text);
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  color: #C84A4A;
  animation: shake 0.4s ease;
}

.success-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  color: #16A34A;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.submit-btn {
  width: 100%;
  padding: 13px;
  border-radius: var(--radius-sm);
  background: var(--gradient-warm);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  margin-top: 4px;
  box-shadow: 0 2px 12px rgba(200, 103, 58, 0.3);
  transition: all var(--transition-fast);
}

.submit-btn:hover:not(:disabled) {
  box-shadow: 0 4px 20px rgba(200, 103, 58, 0.4);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.form-footer {
  margin-top: 24px;
  text-align: center;
}

.form-footer p {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  line-height: 1.6;
}

/* ===== 响应式 ===== */
@media (max-width: 800px) {
  .login-page {
    padding: 20px;
  }

  .auth-card {
    flex-direction: column;
    width: 100%;
  }

  .card-brand {
    padding: 32px 24px;
    border-right: none;
    border-bottom: 1px solid var(--border-light);
  }

  .brand-inner {
    text-align: center;
  }

  .brand-logo {
    margin: 0 auto 16px;
  }

  .bf-item {
    justify-content: center;
  }

  .card-form {
    width: 100%;
    padding: 28px 24px;
  }

  .form-tabs {
    justify-content: center;
  }
}
</style>
