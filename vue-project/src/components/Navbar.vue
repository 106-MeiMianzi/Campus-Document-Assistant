<template>
  <nav class="navbar">
    <div ref="navbarInnerRef" class="navbar-inner">
      <!-- Logo -->
      <router-link to="/" class="logo-group">
        <div class="logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span class="logo-text">校问必答</span>
      </router-link>

      <!-- 导航链接 -->
      <div class="nav-links">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>首页</span>
        </router-link>
        <router-link to="/chat" class="nav-link" :class="{ active: $route.path === '/chat' }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>AI问答</span>
        </router-link>
        <router-link to="/docs" class="nav-link" :class="{ active: $route.path === '/docs' }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span>知识库</span>
        </router-link>
        <router-link to="/service" class="nav-link" :class="{ active: $route.path === '/service' }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <span>办事大厅</span>
        </router-link>
      </div>

      <!-- 右侧操作 -->
      <div class="nav-actions">
        <!-- 通知 -->
        <div class="action-wrap" ref="notifWrapRef">
          <button class="icon-btn" :class="{ active: showNotif }" @click.stop="toggleNotif">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span v-if="notifStore.unreadCount" class="notif-dot">{{ notifStore.unreadCount }}</span>
          </button>
          <!-- 通知下拉 -->
          <Transition name="drop">
            <div v-if="showNotif" class="dropdown notif-dropdown" ref="notifDropdownRef">
              <div class="drop-header">
                <span>最新通知</span>
								<div class="drop-header-actions">
									<button v-if="notifStore.unreadCount > 0" class="drop-mark-read" @click="notifStore.markAllRead()">全部已读</button>
                </div>
								<button class="drop-close" @click="showNotif = false">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div v-if="notifStore.notifications.length > 0" class="drop-list">
                <div
                  v-for="item in notifStore.notifications.slice(0, 6)"
                  :key="item.id"
                  class="drop-item"
                  :class="{ unread: notifStore.isUnread(item.id) }"
                  @click="goNotif(item)"
                >
                  <span class="drop-dot" v-if="notifStore.isUnread(item.id)"></span>
                  <div class="drop-content">
                    <p class="drop-title">{{ item.title }}</p>
                    <span class="drop-time">{{ item.time }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="drop-empty">暂无通知</div>
              <router-link to="/docs" class="drop-footer" @click="showNotif = false">查看全部文档 →</router-link>
            </div>
          </Transition>
        </div>

        <!-- 我的 -->
        <div class="action-wrap" ref="userWrapRef">
          <div class="user-trigger" @click.stop="toggleUserMenu">
            <div class="avatar" :class="{ 'has-img': auth.avatarUrl }">
              <img v-if="auth.avatarUrl" :src="auth.avatarUrl" alt="avatar" />
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="user-info">
              <span class="user-name">{{ user?.name || '用户' }}</span>
            </div>
          </div>
          <!-- 用户下拉 -->
          <Transition name="drop">
            <div v-if="showUserMenu" class="dropdown user-dropdown" ref="userDropdownRef">
              <!-- 头像区 -->
              <div class="profile-head" @click="triggerAvatarUpload">
                <div class="profile-avatar" :class="{ 'has-img': auth.avatarUrl }">
                  <img v-if="auth.avatarUrl" :src="auth.avatarUrl" alt="avatar" />
                  <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="profile-name-row">
                  <span class="profile-name">{{ user?.name }}</span>
                  <span class="profile-change">点击更换头像</span>
                </div>
                <input ref="avatarInputRef" type="file" accept="image/*" class="avatar-input" @change="onAvatarChange" />
              </div>

              <!-- 学生信息 -->
              <div v-if="user?.identity === '学生'" class="profile-info">
                <div class="info-row"><span class="info-label">学号</span><span class="info-val">{{ user?.id }}</span></div>
                <div class="info-row"><span class="info-label">身份</span><span class="info-val">{{ user?.role }}</span></div>
                <div class="info-row"><span class="info-label">学院</span><span class="info-val">{{ user?.college }}</span></div>
                <div class="info-row"><span class="info-label">专业</span><span class="info-val">{{ user?.major }}</span></div>
                <div class="info-row"><span class="info-label">年级</span><span class="info-val">{{ user?.grade }}</span></div>
                <div class="info-row"><span class="info-label">班级</span><span class="info-val">{{ user?.className }}</span></div>
                <div class="info-row"><span class="info-label">电话</span><span class="info-val">{{ user?.phone }}</span></div>
              </div>

              <!-- 教师信息 -->
              <div v-if="user?.identity === '教师'" class="profile-info">
                <div class="info-row"><span class="info-label">工号</span><span class="info-val">{{ user?.id }}</span></div>
                <div class="info-row"><span class="info-label">职称</span><span class="info-val">{{ user?.title }}</span></div>
                <div class="info-row"><span class="info-label">学院</span><span class="info-val">{{ user?.college }}</span></div>
                <div class="info-row"><span class="info-label">邮箱</span><span class="info-val">{{ user?.email }}</span></div>
              </div>

              <button class="profile-logout" @click="doLogout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                退出登录
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <UserProfileModal v-model:visible="showProfile" />
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import { updateAvatar } from '../api/index.js'
import { gsap } from '../plugins/gsap'
import UserProfileModal from './UserProfileModal.vue'

const router = useRouter()
const notifStore = useNotificationStore()
const auth = useAuthStore()
const showProfile = ref(false)
const user = computed(() => auth.user)

const showNotif = ref(false)
const showUserMenu = ref(false)
const notifWrapRef = ref(null)
const notifDropdownRef = ref(null)
const userWrapRef = ref(null)
const userDropdownRef = ref(null)
const avatarInputRef = ref(null)
const navbarInnerRef = ref(null)

// ---- 模拟通知数据：最新导入的文档 ----

// ---- Toggle ----
function toggleNotif() {
  showNotif.value = !showNotif.value
  if (showUserMenu.value) showUserMenu.value = false
  if (showNotif.value) animateIn(notifDropdownRef.value)
}
function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
  if (showNotif.value) showNotif.value = false
  if (showUserMenu.value) animateIn(userDropdownRef.value)
}

function animateIn(el) {
  if (!el) return
  gsap.fromTo(el, { opacity: 0, y: -8, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' })
}

// ---- Click outside ----
function onDocClick(e) {
  if (notifWrapRef.value && !notifWrapRef.value.contains(e.target)) showNotif.value = false
  if (userWrapRef.value && !userWrapRef.value.contains(e.target)) showUserMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  nextTick(() => {
    if (navbarInnerRef.value) {
      gsap.from(navbarInnerRef.value, {
        y: -24,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.05
      })
    }
  })
})
onUnmounted(() => document.removeEventListener('click', onDocClick))

// ---- 导航 ----
function goNotif(item) {
  showNotif.value = false
  notifStore.markRead(item.id)
  if (item.docId) {
    router.push({ path: '/docs', query: { doc: item.title } })
  } else {
    router.push('/docs')
  }
}

function doLogout() {
  showUserMenu.value = false
  auth.logout()
  router.push('/login')
}

// ---- 头像上传 ----
function triggerAvatarUpload() {
  avatarInputRef.value?.click()
}
function onAvatarChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    try {
      const { data } = await updateAvatar(reader.result)
      auth.setUser(data)
    } catch (err) {
      // 后端可能暂不支持，至少先更新本地
      console.warn('头像后端保存失败，仅本地生效:', err.message)
      auth.updateAvatar(reader.result)
    }
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.navbar-inner {
  width: 100%;
  max-width: var(--max-width);
  margin: 12px 24px 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  pointer-events: auto;
}

/* Logo */
.logo-group {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-warm);
  border-radius: var(--radius-sm);
  color: #fff;
}

.logo-text {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.02em;
}

/* 导航链接 */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.nav-link:hover {
  color: var(--text);
  background: var(--bg-warm);
}

.nav-link.active {
  color: var(--primary);
  background: var(--primary-light);
}

.nav-link.active svg {
  stroke: var(--primary);
}

/* 右侧操作 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-wrap { position: relative; }

.icon-btn {
  position: relative;
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-sm);
  background: transparent; color: var(--text-secondary);
  border: none; cursor: pointer; font-family: inherit;
  transition: all var(--transition-fast);
}
.icon-btn:hover, .icon-btn.active { background: var(--bg-warm); color: var(--text); }

.notif-dot {
  position: absolute; top: 4px; right: 2px;
  min-width: 17px; height: 17px; padding: 0 5px;
  background: #E85D3A; color: #fff;
  border-radius: 9px; font-size: 0.65rem; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  line-height: 1;
}

/* 用户触发 */
.user-trigger {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 8px 4px 4px; border-radius: var(--radius-sm);
  cursor: pointer; transition: background var(--transition-fast);
}
.user-trigger:hover { background: var(--bg-warm); }
.user-info { line-height: 1.2; }
.user-name { display: block; font-size: 0.84rem; font-weight: 600; color: var(--text); }

.avatar {
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--bg-warm); color: var(--text-secondary);
  overflow: hidden; flex-shrink: 0;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar.has-img { background: transparent; }

/* ===== 下拉面板通用 ===== */
.dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  width: 340px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); box-shadow: var(--shadow-lg);
  z-index: 200; overflow: hidden;
}

.drop-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-bottom: 1px solid var(--border-light);
  font-size: 0.88rem; font-weight: 600; color: var(--text);
}
.drop-close {
  width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
  border-radius: 6px; background: transparent; color: var(--text-tertiary);
  cursor: pointer; border: none;
}
.drop-close:hover { background: var(--bg-warm); }

.drop-list { padding: 4px; }
.drop-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 14px; border-radius: var(--radius-sm);
  cursor: pointer; transition: background var(--transition-fast);
}
.drop-item:hover { background: var(--bg-warm); }

.drop-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #E85D3A; flex-shrink: 0; margin-top: 5px;
}
.drop-item:not(.unread) .drop-dot { visibility: hidden; }

.drop-content { flex: 1; min-width: 0; }
.drop-title { font-size: 0.84rem; font-weight: 500; color: var(--text); line-height: 1.4; }
.drop-time { font-size: 0.72rem; color: var(--text-tertiary); margin-top: 3px; display: block; }

.drop-footer {
  display: block; text-align: center; padding: 12px;
  font-size: 0.8rem; color: var(--primary); font-weight: 500;
  border-top: 1px solid var(--border-light); text-decoration: none;
}

/* 通知下拉宽度 */
.notif-dropdown { width: 340px; }

.drop-header-actions { display: flex; align-items: center; gap: 8px; }

.drop-mark-read {
  font-size: 0.72rem; color: var(--primary); background: none; border: none;
  cursor: pointer; padding: 2px 8px; border-radius: 4px; font-family: inherit;
  transition: background var(--transition-fast);
}
.drop-mark-read:hover { background: var(--primary-light); }

.drop-empty {
  padding: 32px 20px; text-align: center; font-size: 0.85rem; color: var(--text-tertiary);
}

/* 用户下拉 */
.user-dropdown { width: 310px; }

.profile-head {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 18px 16px; cursor: pointer; position: relative;
  transition: background var(--transition-fast);
}
.profile-head:hover { background: var(--bg-warm); }

.profile-avatar {
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius);
  background: var(--bg-warm); color: var(--text-secondary);
  overflow: hidden; flex-shrink: 0;
}
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.profile-avatar.has-img { background: transparent; }

.profile-name-row { flex: 1; }
.profile-name { display: block; font-size: 0.95rem; font-weight: 700; color: var(--text); }
.profile-change { display: block; font-size: 0.72rem; color: var(--text-tertiary); margin-top: 2px; }

.avatar-input { display: none; }

.profile-info {
  padding: 4px 18px 12px;
  display: flex; flex-direction: column; gap: 1px;
}

.info-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
}
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 0.8rem; color: var(--text-tertiary); }
.info-val { font-size: 0.84rem; font-weight: 500; color: var(--text); }

.profile-logout {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: calc(100% - 28px); margin: 8px 14px 14px; padding: 10px 0;
  border-radius: var(--radius-sm); background: var(--bg-warm);
  color: var(--text-secondary); font-size: 0.84rem; font-weight: 500;
  cursor: pointer; border: none; font-family: inherit;
  transition: all var(--transition-fast);
}
.profile-logout:hover { background: rgba(200,80,50,0.08); color: #C85032; }

/* 下拉动画 */
.drop-enter-active { transition: all 0.22s cubic-bezier(0.4,0,0.2,1); }
.drop-leave-active { transition: all 0.15s ease-in; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-8px) scale(0.95); }

/* 移动端适配 */
@media (max-width: 768px) {
  .navbar-inner { padding: 0 14px; margin-top: 8px; }
  .nav-link span { display: none; }
  .nav-link { padding: 8px 10px; }
  .logo-text { display: none; }
  .user-info { display: none; }
  .dropdown { width: 280px; right: -40px; }
}
</style>
