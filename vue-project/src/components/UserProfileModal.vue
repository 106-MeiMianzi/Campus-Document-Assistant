<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="visible" class="profile-overlay" @click.self="close">
        <div class="profile-modal card">
          <div class="profile-header">
            <h3>个人资料</h3>
            <button class="profile-close" @click="close" aria-label="关闭">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="profile-avatar-section">
            <div class="profile-avatar" @click="triggerAvatarPick">
              <img v-if="avatarPreview" :src="avatarPreview" alt="头像" />
              <svg v-else width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <button type="button" class="btn btn-outline btn-sm" @click="triggerAvatarPick">更换头像</button>
            <input ref="avatarInput" type="file" accept="image/*" class="hidden-input" @change="onAvatarFile" />
          </div>

          <dl class="profile-fields">
            <div class="field-row">
              <dt>姓名</dt>
              <dd>{{ profile.name || '—' }}</dd>
            </div>
            <div class="field-row">
              <dt>{{ profile.identity === '教师' ? '工号' : '学号' }}</dt>
              <dd>{{ profile.id || '—' }}</dd>
            </div>
            <div class="field-row">
              <dt>身份</dt>
              <dd>{{ profile.identity || profile.role || '—' }}</dd>
            </div>
            <div class="field-row">
              <dt>学院</dt>
              <dd>{{ profile.college || '—' }}</dd>
            </div>
            <template v-if="profile.identity === '教师'">
              <div class="field-row">
                <dt>职称</dt>
                <dd>{{ profile.title || '—' }}</dd>
              </div>
              <div class="field-row">
                <dt>邮箱</dt>
                <dd>{{ profile.email || '—' }}</dd>
              </div>
            </template>
            <template v-else>
              <div class="field-row">
                <dt>年级</dt>
                <dd>{{ profile.grade || '—' }}</dd>
              </div>
              <div class="field-row">
                <dt>专业</dt>
                <dd>{{ profile.major || '—' }}</dd>
              </div>
              <div class="field-row">
                <dt>班级</dt>
                <dd>{{ profile.className || '—' }}</dd>
              </div>
              <div class="field-row">
                <dt>电话</dt>
                <dd>{{ profile.phone || '—' }}</dd>
              </div>
            </template>
          </dl>

          <p v-if="avatarError" class="avatar-error">{{ avatarError }}</p>
          <p v-if="avatarSaving" class="avatar-saving">正在保存头像…</p>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { updateAvatar } from '../api/index.js'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible'])

const auth = useAuthStore()
const avatarInput = ref(null)
const avatarPreview = ref(null)
const avatarSaving = ref(false)
const avatarError = ref('')

const profile = computed(() => auth.user || {})

watch(() => props.visible, (open) => {
  if (open) {
    avatarPreview.value = auth.avatarUrl || null
    avatarError.value = ''
  }
})

function close() {
  emit('update:visible', false)
}

function triggerAvatarPick() {
  avatarInput.value?.click()
}

async function onAvatarFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 512 * 1024) {
    avatarError.value = '图片请小于 512KB'
    return
  }
  const reader = new FileReader()
  reader.onload = async () => {
    const dataUrl = reader.result
    avatarPreview.value = dataUrl
    avatarSaving.value = true
    avatarError.value = ''
    try {
      const { data } = await updateAvatar(dataUrl)
      auth.setUser(data)
    } catch (err) {
      avatarError.value = err.message || '头像保存失败'
    } finally {
      avatarSaving.value = false
    }
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}
</script>

<style scoped>
.profile-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  padding: 24px;
}

.profile-modal {
  width: 100%;
  max-width: 420px;
  padding: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.profile-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.profile-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
}

.profile-close:hover {
  background: var(--bg-warm);
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.profile-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-warm);
  color: var(--text-tertiary);
  cursor: pointer;
  border: 2px solid var(--border);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hidden-input {
  display: none;
}

.profile-fields {
  margin: 0;
}

.field-row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
}

.field-row dt {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.field-row dd {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text);
}

.avatar-error {
  color: #c85032;
  font-size: 0.82rem;
  margin-top: 12px;
}

.avatar-saving {
  color: var(--text-tertiary);
  font-size: 0.82rem;
  margin-top: 12px;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 0.82rem;
}
</style>
