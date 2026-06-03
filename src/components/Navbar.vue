<template>
  <nav class="navbar">
    <div class="navbar-inner">
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
        <button class="icon-btn notification" aria-label="通知">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notif-dot"></span>
        </button>
        <div class="user-menu">
          <div class="user-info">
            <span class="user-name">{{ user?.name || '用户' }}</span>
            <span class="user-role">{{ user?.roleLabel || '' }}</span>
          </div>
          <div class="avatar" @click="showProfile = true" title="个人资料">
            <img v-if="user?.avatar" :src="user.avatar" alt="" class="avatar-img" />
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <button class="logout-btn" @click="doLogout" title="退出登录">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <UserProfileModal v-model:visible="showProfile" />
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import UserProfileModal from './UserProfileModal.vue'

const router = useRouter()
const auth = useAuthStore()
const showProfile = ref(false)

const user = computed(() => auth.user)

function doLogout() {
  auth.logout()
  router.push('/login')
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
  gap: 8px;
  flex-shrink: 0;
}

.icon-btn {
  position: relative;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  background: var(--bg-warm);
  color: var(--text);
}

.notif-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 7px;
  height: 7px;
  background: #E85D3A;
  border-radius: 50%;
  border: 2px solid #fff;
}

.avatar {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--bg-warm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.avatar:hover {
  background: var(--primary-light);
  color: var(--primary);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

/* 用户菜单 */
.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  text-align: right;
}

.user-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  line-height: 1.2;
}

.user-role {
  display: block;
  font-size: 0.72rem;
  color: var(--text-tertiary);
}

.logout-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.logout-btn:hover {
  background: rgba(200, 80, 50, 0.08);
  color: #C85032;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .navbar-inner {
    padding: 0 14px;
    margin-top: 8px;
  }

  .nav-link span {
    display: none;
  }

  .nav-link {
    padding: 8px 10px;
  }

  .logo-text {
    display: none;
  }

  .user-info {
    display: none;
  }
}
</style>
