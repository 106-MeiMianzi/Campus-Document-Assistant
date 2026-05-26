<template>
  <div class="home">
    <Navbar />

    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-bg-decor"></div>
      <div class="container hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          福州大学 · 校园智能文档助手
        </div>
        <h1 class="hero-title">
          你的校园<span class="highlight">智能文档</span>助手
        </h1>
        <p class="hero-desc">
          快速查询校内制度、办事流程与通知公告，让每一份文件都触手可及
        </p>

        <!-- 搜索框 -->
        <div class="search-wrap">
          <div class="search-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              v-model="searchQuery"
              class="search-input"
              placeholder="输入问题，搜索制度、流程、通知..."
              @keyup.enter="goSearch"
            />
            <button class="search-btn" @click="goSearch">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
          <div class="search-hints">
            <span v-for="hint in searchHints" :key="hint" class="hint-tag" @click="searchQuery = hint">{{ hint }}</span>
          </div>
        </div>

        <!-- 数据指标 -->
        <div class="hero-stats">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 快捷入口 -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">快捷服务</h2>
          <p class="section-subtitle">常用校园事务，一键直达</p>
        </div>
        <div class="quick-grid">
          <div
            v-for="item in quickEntries"
            :key="item.title"
            class="quick-card card card-clickable"
            @click="goService(item.title)"
          >
            <div class="quick-icon" :style="{ background: item.gradient }">
              <div v-html="item.icon"></div>
            </div>
            <div class="quick-info">
              <h3 class="quick-title">{{ item.title }}</h3>
              <p class="quick-desc">{{ item.desc }}</p>
            </div>
            <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门问题 + 最新通知 双栏 -->
    <section class="section">
      <div class="container two-col">
        <!-- 热门问题 -->
        <div class="col-main">
          <div class="section-header">
            <h2 class="section-title">热门问题</h2>
            <a href="/chat" class="section-more">查看全部 →</a>
          </div>
          <div class="question-list">
            <div
              v-for="(q, idx) in hotQuestions"
              :key="idx"
              class="question-card card card-clickable"
              @click="goChat(q.question)"
            >
              <span class="q-rank" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</span>
              <div class="q-content">
                <p class="q-text">{{ q.question }}</p>
                <div class="q-meta">
                  <span class="q-tag">{{ q.category }}</span>
                  <span class="q-count">{{ q.views }} 次浏览</span>
                </div>
              </div>
              <svg class="q-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 最新通知 -->
        <div class="col-side">
          <div class="section-header">
            <h2 class="section-title">最新通知</h2>
            <a href="/docs" class="section-more">查看全部 →</a>
          </div>
          <div class="notice-list card">
            <div
              v-for="notice in notices"
              :key="notice.id"
              class="notice-item"
            >
              <div class="notice-tag" :class="'tag-' + notice.type">{{ notice.tag }}</div>
              <div class="notice-body">
                <p class="notice-title">{{ notice.title }}</p>
                <span class="notice-date">{{ notice.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">校问必答</span>
          <p class="footer-desc">面向福州大学师生的校园文档智能助手</p>
        </div>
        <div class="footer-links">
          <div class="footer-col" v-for="col in footerCols" :key="col.title">
            <h4>{{ col.title }}</h4>
            <a v-for="link in col.links" :key="link" href="#">{{ link }}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 校问必答 · 福州大学</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const router = useRouter()
const searchQuery = ref('')

const searchHints = [
  '国家奖学金申请条件',
  '转专业流程',
  '宿舍报修',
  '休学办理'
]

const stats = [
  { value: '2,860+', label: '规章制度' },
  { value: '1,240+', label: '办事指南' },
  { value: '580+', label: '通知公告' },
  { value: '15', label: '覆盖部门' }
]

const quickEntries = [
  {
    title: '奖学金申请',
    desc: '国家奖学金、学业奖学金申请条件与流程',
    gradient: 'linear-gradient(135deg, #FDF0E8, #FBE8D8)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8673A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>'
  },
  {
    title: '转专业',
    desc: '转专业条件、申请时间与审批流程',
    gradient: 'linear-gradient(135deg, #F0F2EB, #E8ECE0)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7B5A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>'
  },
  {
    title: '休学复学',
    desc: '休学申请条件、复学办理流程说明',
    gradient: 'linear-gradient(135deg, #EEF2F7, #E4EAF3)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A5568" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>'
  },
  {
    title: '宿舍管理',
    desc: '宿舍申请、调换、报修一站式服务',
    gradient: 'linear-gradient(135deg, #FDF5F0, #FBEEE4)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8673A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    title: '校园卡',
    desc: '校园卡办理、挂失、补办与充值',
    gradient: 'linear-gradient(135deg, #F0F4F8, #E6ECF3)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A5568" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
  },
  {
    title: '培养方案',
    desc: '各专业培养计划、课程设置与学分要求',
    gradient: 'linear-gradient(135deg, #F2F4EE, #E9ECE3)',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7B5A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  }
]

const hotQuestions = [
  { question: '国家奖学金什么时候开始申请？需要准备哪些材料？', category: '奖助学金', views: '2.3k' },
  { question: '转专业需要满足什么条件？什么时候可以申请？', category: '学籍管理', views: '1.8k' },
  { question: '休学后如何办理复学？需要哪些手续？', category: '学籍管理', views: '1.5k' },
  { question: '宿舍报修流程是什么？维修响应时间是多久？', category: '宿舍管理', views: '1.2k' },
  { question: '毕业学分要求是多少？选修课学分怎么算？', category: '培养方案', views: '980' }
]

const notices = [
  { id: 1, title: '关于2026年国家奖学金评审工作的通知', date: '2026-05-18', tag: '奖学金', type: 'scholarship' },
  { id: 2, title: '2026-2027学年第一学期选课通知', date: '2026-05-15', tag: '教务', type: 'academic' },
  { id: 3, title: '关于做好2026届毕业生离校工作的通知', date: '2026-05-12', tag: '学工', type: 'student' },
  { id: 4, title: '关于学生宿舍空调清洗维护的通知', date: '2026-05-10', tag: '后勤', type: 'logistics' },
  { id: 5, title: '关于开展校园安全隐患排查的通知', date: '2026-05-08', tag: '安全', type: 'safety' }
]

const footerCols = [
  {
    title: '服务导航',
    links: ['AI问答', '知识库', '办事大厅', '收藏记录']
  },
  {
    title: '常用链接',
    links: ['福州大学官网', '教务处', '学生工作部', '信息门户']
  },
  {
    title: '关于我们',
    links: ['项目介绍', '使用帮助', '反馈建议', '联系我们']
  }
]

function goSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/chat', query: { q: searchQuery.value } })
  }
}

function goChat(question) {
  router.push({ path: '/chat', query: { q: question } })
}

function goService(title) {
  router.push({ path: '/service', query: { item: title } })
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* ===== Hero ===== */
.hero {
  position: relative;
  padding: 140px 0 100px;
  overflow: hidden;
}

.hero-bg-decor {
  position: absolute;
  top: -200px;
  right: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(200, 103, 58, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-bg-decor::after {
  content: '';
  position: absolute;
  bottom: -100px;
  left: -300px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(74, 85, 104, 0.04) 0%, transparent 70%);
  border-radius: 50%;
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 28px;
  box-shadow: var(--shadow-xs);
}

.badge-dot {
  width: 7px;
  height: 7px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.hero-title {
  font-size: clamp(2.4rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 20px;
}

.highlight {
  background: var(--gradient-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 1.15rem;
  color: var(--text-secondary);
  max-width: 520px;
  margin: 0 auto 44px;
  line-height: 1.7;
}

/* 搜索框 */
.search-wrap {
  max-width: 620px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 8px 20px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  transition: all var(--transition);
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: var(--shadow-md), 0 0 0 6px rgba(200, 103, 58, 0.06);
}

.search-icon {
  flex-shrink: 0;
  color: var(--text-tertiary);
}

.search-input {
  flex: 1;
  font-size: 1rem;
  color: var(--text);
  background: transparent;
  border: none;
  outline: none;
  padding: 8px 0;
}

.search-input::placeholder {
  color: var(--text-placeholder);
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--gradient-warm);
  color: #fff;
  flex-shrink: 0;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 8px rgba(200, 103, 58, 0.3);
}

.search-btn:hover {
  box-shadow: 0 4px 16px rgba(200, 103, 58, 0.4);
  transform: scale(1.04);
}

.search-hints {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.hint-tag {
  padding: 5px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.hint-tag:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

/* 数据指标 */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 56px;
  padding-top: 44px;
  border-top: 1px solid var(--border-light);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-top: 4px;
}

/* ===== Section 通用 ===== */
.section {
  padding: 64px 0;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.section-subtitle {
  font-size: 0.95rem;
  color: var(--text-tertiary);
  margin-top: 4px;
}

.section-more {
  font-size: 0.9rem;
  color: var(--primary);
  font-weight: 500;
  transition: opacity var(--transition-fast);
}

.section-more:hover {
  opacity: 0.75;
}

/* ===== 快捷入口 ===== */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 24px;
}

.quick-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  flex-shrink: 0;
}

.quick-info {
  flex: 1;
  min-width: 0;
}

.quick-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 2px;
}

.quick-desc {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-arrow {
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: transform var(--transition-fast);
}

.quick-card:hover .quick-arrow {
  transform: translateX(3px);
  color: var(--primary);
}

/* ===== 双栏布局 ===== */
.two-col {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  align-items: start;
}

/* 热门问题 */
.question-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
}

.q-rank {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 700;
  background: var(--bg-warm);
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.rank-1 { background: #FDF0E8; color: #C8673A; }
.rank-2 { background: #F5F2EC; color: #A08060; }
.rank-3 { background: #F0F2EE; color: #6B7B5A; }

.q-content {
  flex: 1;
  min-width: 0;
}

.q-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.q-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.q-tag {
  font-size: 0.75rem;
  padding: 2px 10px;
  background: var(--bg-warm);
  border-radius: var(--radius-full);
  color: var(--text-tertiary);
}

.q-count {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.q-arrow {
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: transform var(--transition-fast);
}

.question-card:hover .q-arrow {
  transform: translateX(3px);
  color: var(--primary);
}

/* 最新通知 */
.notice-list {
  padding: 6px;
  overflow: hidden;
}

.notice-item {
  display: flex;
  gap: 14px;
  padding: 14px 18px;
  border-radius: var(--radius);
  transition: background var(--transition-fast);
  cursor: pointer;
}

.notice-item:hover {
  background: var(--bg-warm);
}

.notice-tag {
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
  height: fit-content;
  margin-top: 2px;
}

.tag-scholarship { background: #FDF0E8; color: #C8673A; }
.tag-academic { background: #EEF2F7; color: #4A5568; }
.tag-student { background: #E8F0E8; color: #5A7A5A; }
.tag-logistics { background: #F5F0EB; color: #8B7355; }
.tag-safety { background: #FDE8E8; color: #C84A4A; }

.notice-body {
  flex: 1;
  min-width: 0;
}

.notice-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notice-date {
  display: block;
  font-size: 0.78rem;
  color: var(--text-tertiary);
  margin-top: 4px;
}

/* ===== 底部 ===== */
.footer {
  border-top: 1px solid var(--border-light);
  margin-top: 40px;
  padding: 48px 0 0;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 60px;
  padding-bottom: 40px;
}

.footer-brand {
  flex-shrink: 0;
}

.footer-logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
}

.footer-desc {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-top: 8px;
}

.footer-links {
  display: flex;
  gap: 64px;
}

.footer-col h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 14px;
}

.footer-col a {
  display: block;
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-bottom: 8px;
  transition: color var(--transition-fast);
}

.footer-col a:hover {
  color: var(--primary);
}

.footer-bottom {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid var(--border-light);
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .two-col {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 110px 0 60px;
  }

  .hero-stats {
    flex-wrap: wrap;
    gap: 24px;
    margin-top: 36px;
    padding-top: 32px;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }

  .footer-inner {
    flex-direction: column;
    gap: 32px;
  }

  .footer-links {
    gap: 32px;
  }
}
</style>
