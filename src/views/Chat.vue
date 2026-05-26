<template>
  <div class="chat-page">
    <Navbar />

    <div class="chat-layout">
      <!-- 左侧：对话历史 -->
      <aside class="sidebar">
        <button class="new-chat-btn" @click="startNewChat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          新对话
        </button>

        <div class="history-label">最近对话</div>
        <div class="history-list">
          <div
            v-for="conv in chatHistory"
            :key="conv.id"
            class="history-item"
            :class="{ active: currentChatId === conv.id }"
            @click="switchChat(conv.id)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="history-title">{{ conv.title }}</span>
            <button class="history-del" @click.stop="deleteChat(conv.id)" title="删除">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div v-if="chatHistory.length === 0" class="history-empty">
            暂无对话记录
          </div>
        </div>
      </aside>

      <!-- 中间：对话区域 -->
      <main class="chat-main">
        <div class="chat-messages" ref="chatRef">
          <!-- 欢迎提示 -->
          <div v-if="messages.length === 0" class="welcome">
            <div class="welcome-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3>校问必答</h3>
            <p>基于校园文档库的智能问答助手，所有回答均可追溯引用来源</p>
            <div class="welcome-hints">
              <button
                v-for="hint in welcomeHints"
                :key="hint"
                class="welcome-hint"
                @click="sendMessage(hint)"
              >{{ hint }}</button>
            </div>
          </div>

          <!-- 消息列表 -->
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            class="msg-wrap"
            :class="msg.role"
          >
            <div class="msg-avatar">
              <template v-if="msg.role === 'user'">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </template>
              <template v-else>
                <div class="ai-avatar-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </template>
            </div>
            <div class="msg-body">
              <div class="msg-bubble">
                <div v-if="msg.role === 'ai'" v-html="msg.content" class="ai-content"></div>
                <div v-else class="user-content">{{ msg.content }}</div>

                <!-- AI 引用的来源 -->
                <div v-if="msg.role === 'ai' && msg.citations && msg.citations.length" class="msg-citations">
                  <div class="citation-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    引用来源
                  </div>
                  <div
                    v-for="(cite, cIdx) in msg.citations"
                    :key="cIdx"
                    class="citation-chip"
                    @click="showCitationDetail(cite)"
                  >
                    <span class="cite-doc">{{ cite.doc }}</span>
                    <span class="cite-loc">{{ cite.location }}</span>
                  </div>
                </div>
              </div>

              <div v-if="msg.role === 'ai'" class="msg-actions">
                <button class="action-btn" title="复制">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
                <button class="action-btn" title="有用">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="thinking" class="msg-wrap ai">
            <div class="msg-avatar">
              <div class="ai-avatar-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
            <div class="msg-body">
              <div class="msg-bubble thinking-bubble">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入框 -->
        <div class="chat-input-area">
          <div class="chat-input-box">
            <input
              v-model="inputText"
              class="chat-input"
              placeholder="输入你的问题，我会从校园文档库中查找..."
              @keyup.enter="sendMessage()"
            />
            <button
              class="send-btn"
              :class="{ active: inputText.trim() }"
              :disabled="!inputText.trim()"
              @click="sendMessage()"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p class="input-hint">校问必答基于校园官方文档回答，所有信息可追溯来源</p>
        </div>
      </main>

      <!-- 右侧：引用详情与相关文档 -->
      <aside class="ref-panel">
        <div v-if="selectedCitation">
          <div class="ref-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <span>引用详情</span>
          </div>
          <div class="ref-detail-card">
            <h4 class="ref-doc-title">{{ selectedCitation.doc }}</h4>
            <div class="ref-meta">
              <span>{{ selectedCitation.department }}</span>
              <span>·</span>
              <span>{{ selectedCitation.date }}</span>
            </div>
            <div class="ref-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              {{ selectedCitation.location }}
            </div>
            <div class="ref-excerpt">
              <div class="ref-excerpt-label">原文片段</div>
              <p>{{ selectedCitation.excerpt }}</p>
            </div>
          </div>
        </div>
        <div v-else class="ref-empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <p>点击左侧引用来源<br/>查看详细依据</p>
        </div>

        <div class="ref-related" v-if="relatedDocs.length > 0">
          <div class="ref-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>匹配到的文档</span>
          </div>
          <div
            v-for="doc in relatedDocs"
            :key="doc.title"
            class="related-doc-item"
          >
            <div class="related-doc-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div class="related-doc-info">
              <p class="related-doc-title">{{ doc.title }}</p>
              <span class="related-doc-dept">{{ doc.department }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { askQuestion as apiAsk, getConversationList, getConversationMessages, deleteConversation } from '../api/index.js'
import { getAllDocs, searchDocs } from '../services/knowledgeBase.js'
import { marked } from 'marked'

const route = useRoute()
const chatRef = ref(null)
const inputText = ref('')

function renderMarkdown(text) {
  if (!text) return ''
  return marked.parse(text)
}
const thinking = ref(false)
const selectedCitation = ref(null)
const currentChatId = ref(1)
let chatIdCounter = 1

const chatStore = reactive({
  1: []
})

// 本地 chatId → 后端 conversation id 映射（null = 未同步到后端）
const conversationIdMap = reactive({})

// 标记某会话的消息是否已从后端加载过
const messagesLoaded = reactive({})

const chatHistory = ref([
  { id: 1, title: '新对话' }
])

const messages = ref(chatStore[currentChatId.value])

const welcomeHints = [
  '国家奖学金什么时候申请？',
  '转专业需要什么条件？',
  '如何办理休学？',
  '宿舍报修流程是什么？'
]

const relatedDocs = ref([])

// 预置高频问题的精炼回答（作为文档搜索无结果时的兜底）
const mockAnswers = {
  '国家奖学金': {
    content: `<p>国家奖学金通常于<strong>每年9月开学后</strong>开始申请，具体时间节点如下：</p>
<ul><li><strong>申请时间：</strong>每年9月1日—9月30日</li><li><strong>学院初审：</strong>10月1日—10月15日</li><li><strong>学校评审：</strong>10月16日—10月31日</li><li><strong>结果公示：</strong>11月上旬（不少于5个工作日）</li></ul>
<p>基本条件：二年级及以上全日制本科生，学习成绩排名与综合考评成绩排名均位于前10%。</p>`,
    citations: [
      { doc: '《福州大学本科生奖学金管理办法》', location: '教务处 · 2025-09-01', department: '教务处', date: '2025-09-01', excerpt: '国家奖学金评审工作于每年秋季学期启动，申请学生须在9月30日前通过学院提交完整申请材料。学习成绩排名与综合考评成绩排名均需位于前10%。' }
    ]
  },
  '转专业': {
    content: `<p>福州大学转专业工作一般在<strong>每学年第二学期第12-16周</strong>进行：</p>
<ul><li><strong>申请资格：</strong>在校一年级或二年级本科生</li><li><strong>成绩要求：</strong>成绩排名在本专业前30%</li><li><strong>无违纪记录</strong></li></ul>
<p>流程：学生申请 → 学院审核 → 接收学院考核 → 教务处审批 → 公示。</p>`,
    citations: [
      { doc: '《关于退役复学学生转专业的通知》', location: '教务处 · 2026-03-01', department: '教务处', date: '2026-03-01', excerpt: '转专业学生应当在校期间无违纪处分记录，且成绩排名在本专业前30%。' }
    ]
  },
  '休学': {
    content: `<p>休学办理流程：</p><ol><li><strong>提交申请：</strong>填写《休学申请表》，附相关证明材料</li><li><strong>学院审批：</strong>辅导员、学院分管领导签字</li><li><strong>部门审核：</strong>学生处/教务处审核</li><li><strong>办理离校</strong></li></ol>
<p>休学一般以学年为单位，累计不超过2年。</p>`,
    citations: [
      { doc: '《福州大学本科生学籍管理条例》', location: '教务处', department: '教务处', date: '2025-01-10', excerpt: '学生因伤病或特殊原因需要休学的，应当由本人提出书面申请，经所在学院审核同意，报教务处批准。休学期限一般为一年，累计不得超过两年。' }
    ]
  },
  '宿舍': {
    content: `<p>宿舍报修方式：</p><ol><li><strong>线上报修：</strong>登录校园服务大厅 → 宿舍报修</li><li><strong>电话报修：</strong>拨打后勤服务热线</li><li><strong>楼管登记：</strong>在宿舍楼值班室登记</li></ol>
<p>一般维修24小时内响应，紧急维修2小时内到场。</p>`,
    citations: [
      { doc: '《福州大学学生住宿管理办法》', location: '后勤管理处 · 2025-02-01', department: '后勤管理处', date: '2025-02-01', excerpt: '学生宿舍设施设备出现故障时，学生应当及时通过线上报修系统或向楼管员报修。后勤部门接到报修后应在24小时内安排维修人员上门处理。' }
    ]
  }
}

function findAnswer(question) {
  const docs = getAllDocs()
  let targetDocs = docs

  // 1. 搜索已缓存的文档文本
  const results = searchDocs(question, targetDocs)
  if (results.length > 0) {
    relatedDocs.value = results.map(r => ({
      title: r.doc.title,
      department: r.doc.department
    }))
    return {
      content: buildSearchResponse(question, results),
      citations: results.map(r => ({
        doc: `《${r.doc.title}》`,
        location: r.doc.department + ' · ' + r.doc.date,
        department: r.doc.department,
        date: r.doc.date,
        excerpt: r.snippets[0] || ''
      }))
    }
  }

  // 2. 兜底：预置问答
  for (const [key, answer] of Object.entries(mockAnswers)) {
    if (question.includes(key)) {
      relatedDocs.value = []
      return answer
    }
  }

  // 3. 无结果
  relatedDocs.value = []
  return {
    content: `<p>抱歉，我目前的知识库中暂时没有找到与"<strong>${question}</strong>"直接相关的文档。</p>
<p>建议您：</p>
<ul>
  <li>尝试使用不同的关键词重新提问</li>
  <li>在<a href="/docs" style="color:var(--primary)">知识库</a>中浏览相关分类</li>
  <li>联系相关部门获取最新信息：教务处 0591-2286XXXX、学生处 0591-2286XXXX</li>
</ul>`,
    citations: []
  }
}

function buildSearchResponse(question, results) {
  let html = `<p>根据文档库检索，找到以下与"<strong>${question}</strong>"相关的内容：</p>`
  for (const r of results.slice(0, 3)) {
    html += `<p style="font-weight:600;margin-top:14px;color:var(--primary)">《${r.doc.title}》</p>`
    for (const s of r.snippets.slice(0, 2)) {
      html += `<blockquote style="border-left:2.5px solid var(--primary);padding-left:12px;margin:6px 0;color:var(--text-secondary);font-size:0.85rem;line-height:1.7;">${s}</blockquote>`
    }
  }
  html += `<p style="margin-top:14px;font-size:0.85rem;color:var(--text-tertiary);">以上为文档关键词匹配结果，如需更精准的回答，建议查看原文或<router-link to="/docs" style="color:var(--primary);">浏览知识库</router-link>。</p>`
  return html
}

async function startNewChat() {
  chatIdCounter++
  const newId = chatIdCounter
  chatStore[newId] = []
  chatHistory.value.unshift({ id: newId, title: '新对话' })
  currentChatId.value = newId
  messages.value = chatStore[newId]
  selectedCitation.value = null
  conversationIdMap[newId] = null
  messagesLoaded[newId] = true
}

async function switchChat(id) {
  currentChatId.value = id
  messages.value = chatStore[id]
  selectedCitation.value = null

  // 如果还没从后端加载过，尝试拉取消息
  const convId = conversationIdMap[id]
  if (convId && !messagesLoaded[id]) {
    try {
      const { data } = await getConversationMessages(convId)
      const list = Array.isArray(data) ? data : (data?.messages || data?.list || [])
      if (list.length) {
        chatStore[id] = list.map(m => ({
          role: m.role === 'assistant' ? 'ai' : 'user',
          content: m.role === 'assistant' ? renderMarkdown(m.content || '') : (m.content || ''),
          citations: (m.citations || []).map(c => ({
            doc: c.title || c.doc || '',
            location: c.location || c.department || '',
            department: c.department || '',
            date: c.date || '',
            excerpt: c.excerpt || c.snippet || ''
          }))
        }))
        messages.value = chatStore[id]
      }
    } catch (e) {
      console.warn('加载会话消息失败:', e.message)
    }
    messagesLoaded[id] = true
  }
}

async function deleteChat(id) {
  const idx = chatHistory.value.findIndex(c => c.id === id)
  if (idx < 0) return

  // 先更新本地 UI（不等待后端）
  chatHistory.value.splice(idx, 1)
  delete chatStore[id]
  const convId = conversationIdMap[id]
  delete conversationIdMap[id]
  delete messagesLoaded[id]

  // 异步删后端（静默失败，不影响 UI）
  if (convId) {
    deleteConversation(convId).catch(() => {})
  }

  if (currentChatId.value === id) {
    currentChatId.value = null
    if (chatHistory.value.length > 0) {
      await switchChat(chatHistory.value[0].id)
    } else {
      startNewChat()
    }
  }
}

async function sendMessage(question) {
  const text = (question || inputText.value).trim()
  if (!text || thinking.value) return

  const userMsg = { role: 'user', content: text }
  messages.value.push(userMsg)

  const histItem = chatHistory.value.find(c => c.id === currentChatId.value)
  if (histItem && histItem.title === '新对话') {
    histItem.title = text.length > 20 ? text.slice(0, 20) + '…' : text
  }

  inputText.value = ''
  thinking.value = true
  await scrollToBottom()

  const docId = route.query.docId

  // 1. 优先尝试后端 AI 问答
  let answer = null
  try {
    const convId = conversationIdMap[currentChatId.value] || undefined
    const { data } = await apiAsk(text, docId || undefined, convId)
    if (data) {
      // 保存后端返回的 conversationId，保证后续消息归属同一会话
      if (data.conversationId && !conversationIdMap[currentChatId.value]) {
        conversationIdMap[currentChatId.value] = data.conversationId
      }
      answer = {
        content: renderMarkdown(data.answer || data.content || ''),
        citations: (data.citations || data.references || []).map(c => ({
          doc: c.title || c.doc || '',
          location: c.location || c.department || '',
          department: c.department || '',
          date: c.date || '',
          excerpt: c.excerpt || c.snippet || ''
        }))
      }
      if (data.related_docs) {
        relatedDocs.value = data.related_docs.map(d => ({
          title: d.title || d,
          department: d.department || ''
        }))
      }
    }
  } catch (apiErr) {
    console.warn('后端 AI 问答不可用，使用客户端搜索:', apiErr.message)
  }

  // 2. 兜底：客户端文档搜索
  if (!answer) {
    answer = findAnswer(text)
  }

  thinking.value = false
  messages.value.push({
    role: 'ai',
    content: answer.content,
    citations: answer.citations
  })

  await scrollToBottom()

  if (answer.citations && answer.citations.length > 0) {
    selectedCitation.value = answer.citations[0]
  }
}

function showCitationDetail(cite) {
  selectedCitation.value = cite
}

async function scrollToBottom() {
  await nextTick()
  if (chatRef.value) {
    chatRef.value.scrollTop = chatRef.value.scrollHeight
  }
}

onMounted(async () => {
  // 从后端加载会话历史
  try {
    const { data } = await getConversationList()
    const convList = Array.isArray(data) ? data : (data?.list || data?.conversations || [])
    if (convList.length > 0) {
      // 清空默认会话
      chatHistory.value = []
      chatIdCounter = 0
      convList.forEach(conv => {
        chatIdCounter++
        const localId = chatIdCounter
        chatStore[localId] = []
        chatHistory.value.unshift({ id: localId, title: conv.title || '新会话' })
        conversationIdMap[localId] = conv.id || conv.conversationId || conv.conversation_id
        messagesLoaded[localId] = false
      })
      // 切换到第一个会话
      if (chatHistory.value.length > 0) {
        switchChat(chatHistory.value[0].id)
      }
    }
  } catch (e) {
    console.warn('加载会话列表失败:', e.message)
  }

  if (route.query.q) {
    startNewChat()
    const q = route.query.q.trim()
    if (route.query.docId) {
      sendMessage('请根据《' + q + '》的内容，总结其主要条款和要点')
    } else {
      sendMessage(q)
    }
  }
})
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.chat-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 260px 1fr 340px;
  overflow: hidden;
  padding-top: var(--navbar-height);
}

/* ===== 左侧栏：历史记录 ===== */
.sidebar {
  border-right: 1px solid var(--border-light);
  background: var(--bg-cool);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.new-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px;
  padding: 10px;
  border-radius: var(--radius-sm);
  border: 1.5px dashed var(--border);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.new-chat-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.history-label {
  padding: 0 16px 8px;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.84rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.history-item:hover {
  background: var(--bg-warm);
}

.history-item.active {
  background: var(--primary-light);
  color: var(--primary);
}

.history-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-del {
  opacity: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: transparent;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.history-item:hover .history-del {
  opacity: 1;
}

.history-del:hover {
  background: rgba(200, 80, 50, 0.1);
  color: #C85032;
}

.history-empty {
  padding: 20px 12px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

/* ===== 中间聊天区 ===== */
.chat-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  scroll-behavior: smooth;
}

/* 欢迎界面 */
.welcome {
  text-align: center;
  padding: 80px 40px 40px;
}

.welcome-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-warm);
  border-radius: var(--radius-lg);
  color: #fff;
}

.welcome h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.welcome p {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  margin-bottom: 28px;
}

.welcome-hints {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.welcome-hint {
  padding: 9px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.welcome-hint:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

/* 消息 */
.msg-wrap {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  animation: msgIn 0.35s ease;
}

@keyframes msgIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.msg-wrap.user { flex-direction: row-reverse; }

.msg-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--bg-warm);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.ai-avatar-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-warm);
  border-radius: var(--radius-sm);
  color: #fff;
}

.msg-bubble {
  max-width: 640px;
  padding: 14px 20px;
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
  line-height: 1.7;
}

.msg-wrap.user .msg-bubble {
  background: var(--primary-light);
  color: var(--text);
  border-bottom-right-radius: var(--radius-sm);
}

.msg-wrap.ai .msg-bubble {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border-light);
  border-bottom-left-radius: var(--radius-sm);
}

.ai-content :deep(h1), .ai-content :deep(h2), .ai-content :deep(h3), .ai-content :deep(h4) {
  margin: 16px 0 8px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text);
}
.ai-content :deep(h1) { font-size: 1.25rem; }
.ai-content :deep(h2) { font-size: 1.15rem; }
.ai-content :deep(h3) { font-size: 1.05rem; }
.ai-content :deep(p) { margin-bottom: 10px; line-height: 1.7; }
.ai-content :deep(p:last-child) { margin-bottom: 0; }
.ai-content :deep(ul), .ai-content :deep(ol) { margin: 8px 0 12px; padding-left: 22px; }
.ai-content :deep(li) { margin-bottom: 4px; line-height: 1.6; }
.ai-content :deep(strong) { font-weight: 600; color: var(--primary); }
.ai-content :deep(em) { font-style: italic; }
.ai-content :deep(a) { color: var(--primary); text-decoration: underline; }
.ai-content :deep(blockquote) {
  margin: 10px 0;
  padding: 8px 14px;
  border-left: 3px solid var(--primary);
  background: var(--bg-warm);
  color: var(--text-secondary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
.ai-content :deep(code) {
  padding: 2px 6px;
  background: var(--bg);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.87em;
}
.ai-content :deep(pre) {
  margin: 10px 0;
  padding: 14px;
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.5;
}
.ai-content :deep(pre code) {
  padding: 0;
  background: none;
  border: none;
  font-size: inherit;
  color: inherit;
}
.ai-content :deep(table) {
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.ai-content :deep(th), .ai-content :deep(td) {
  padding: 8px 12px;
  border: 1px solid var(--border-light);
  text-align: left;
}
.ai-content :deep(th) {
  background: var(--bg-warm);
  font-weight: 600;
}
.ai-content :deep(hr) {
  margin: 16px 0;
  border: none;
  border-top: 1px solid var(--border-light);
}

.msg-citations {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.citation-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-tertiary);
  margin-bottom: 8px;
}

.citation-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  background: var(--bg-warm);
  border-radius: var(--radius-sm);
  margin-bottom: 6px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.citation-chip:hover { background: var(--primary-light); }

.cite-doc { font-size: 0.82rem; font-weight: 500; color: var(--text); }
.cite-loc { font-size: 0.75rem; color: var(--primary); font-weight: 600; white-space: nowrap; }

.msg-actions {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  padding-left: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: transparent;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.action-btn:hover { background: var(--bg-warm); color: var(--text); }

.thinking-bubble {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 16px 24px;
}

.dot {
  width: 7px;
  height: 7px;
  background: var(--text-tertiary);
  border-radius: 50%;
  animation: bounce 1.4s infinite both;
}
.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); }
  40% { transform: scale(1); }
}

/* 输入框 — 固定在底部 */
.chat-input-area {
  flex-shrink: 0;
  padding: 16px 24px 20px;
  border-top: 1px solid var(--border-light);
  background: var(--surface);
}

.chat-input-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 6px 6px 20px;
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition);
}

.chat-input-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(200, 103, 58, 0.06);
}

.chat-input {
  flex: 1;
  padding: 10px 0;
  border: none;
  outline: none;
  font-size: 0.95rem;
  background: transparent;
  color: var(--text);
}

.chat-input::placeholder { color: var(--text-placeholder); }

.send-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--border);
  color: #fff;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.send-btn.active {
  background: var(--gradient-warm);
  box-shadow: 0 2px 8px rgba(200, 103, 58, 0.3);
}

.send-btn.active:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 14px rgba(200, 103, 58, 0.4);
}

.input-hint {
  text-align: center;
  font-size: 0.72rem;
  color: var(--text-tertiary);
  margin-top: 8px;
}

/* ===== 右侧引用栏 ===== */
.ref-panel {
  border-left: 1px solid var(--border-light);
  background: var(--bg-cool);
  padding: 20px;
  overflow-y: auto;
}

.ref-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 14px;
}

.ref-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-tertiary);
}

.ref-empty svg { margin-bottom: 12px; color: var(--border); }
.ref-empty p { font-size: 0.85rem; line-height: 1.6; }

.ref-detail-card {
  padding: 16px;
  background: var(--surface);
  border-radius: var(--radius);
  border-left: 3px solid var(--primary);
  margin-bottom: 20px;
}

.ref-doc-title { font-size: 0.9rem; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.ref-meta { font-size: 0.78rem; color: var(--text-tertiary); display: flex; gap: 6px; margin-bottom: 10px; }

.ref-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 12px;
}

.ref-excerpt {
  padding: 10px 12px;
  background: var(--bg-warm);
  border-radius: var(--radius-sm);
}

.ref-excerpt-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.ref-excerpt p { font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary); }

.ref-related { margin-top: 24px; }

.related-doc-item {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.related-doc-item:hover { background: var(--bg-warm); }

.related-doc-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-warm);
  border-radius: 8px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.related-doc-title { font-size: 0.85rem; font-weight: 500; color: var(--text); }
.related-doc-dept { font-size: 0.75rem; color: var(--text-tertiary); }

/* ===== 响应式 ===== */
@media (max-width: 1200px) {
  .chat-layout { grid-template-columns: 240px 1fr 300px; }
}

@media (max-width: 900px) {
  .chat-layout { grid-template-columns: 1fr; }
  .sidebar, .ref-panel { display: none; }
}
</style>
