<template>
  <div class="docs-page">
    <Navbar />

    <div class="docs-layout">
      <!-- 左侧分类导航 -->
      <aside class="docs-sidebar card">
        <div class="sidebar-title">文档分类</div>
        <nav class="category-nav">
          <button
            v-for="cat in categories"
            :key="cat.name"
            class="category-item"
            :class="{ active: activeCategory === cat.name }"
            @click="activeCategory = cat.name"
          >
            <span class="cat-icon" v-html="cat.icon"></span>
            <span class="cat-name">{{ cat.name }}</span>
            <span class="cat-badge">{{ cat.count }}</span>
          </button>
        </nav>

        <div class="sidebar-divider"></div>

        <div class="sidebar-title">发布单位</div>
        <div class="dept-filter">
          <label
            v-for="dept in departments"
            :key="dept"
            class="dept-check"
            :class="{ checked: activeDepts.includes(dept) }"
            @click="toggleDept(dept)"
          >
            <span class="check-box"></span>
            {{ dept }}
          </label>
        </div>
      </aside>

      <!-- 中间文档列表 -->
      <main class="docs-main">
        <!-- 搜索栏 -->
        <div class="docs-search-bar">
          <div class="docs-search-input">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              v-model="searchText"
              placeholder="搜索文档标题、关键词、发布单位..."
              @input="filterDocs"
            />
            <button v-if="searchText" class="search-clear" @click="searchText = ''; filterDocs()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <button v-if="auth.isTeacher" class="import-btn" @click="showImport = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            导入
          </button>
          <div class="docs-view-tabs">
            <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 结果计数 -->
        <div class="docs-result-info">
          <template v-if="loadingDocs">
            正在加载文档列表…
          </template>
          <template v-else>
            共找到 <strong>{{ filteredDocs.length }}</strong> 份文档
            <span v-if="activeCategory !== '全部分类'"> · 当前分类：{{ activeCategory }}</span>
            <span v-if="searchText"> · 关键词："{{ searchText }}"</span>
          </template>
        </div>

        <!-- 文档列表 -->
        <div :class="['docs-grid', viewMode]">
          <article
            v-for="doc in filteredDocs"
            :key="doc.id"
            class="doc-card card card-clickable"
            @click="selectedDoc = doc"
          >
            <div class="doc-card-header">
              <div class="doc-type-badge" :class="'type-' + doc.format">
                {{ doc.format.toUpperCase() }}
              </div>
              <div class="doc-tags">
                <span v-for="tag in doc.tags" :key="tag" class="doc-tag">{{ tag }}</span>
              </div>
            </div>
            <h3 class="doc-title">{{ doc.title }}</h3>
            <p class="doc-desc">{{ doc.description }}</p>
            <div class="doc-meta">
              <span class="doc-dept">{{ doc.department }}</span>
              <span class="doc-date">{{ doc.date }}</span>
              <span class="doc-version">{{ doc.version }}</span>
            </div>
          </article>

          <!-- 加载中 -->
          <div v-if="loadingDocs" class="docs-empty">
            <div class="docs-loading-spinner"></div>
            <p>正在加载文档列表…</p>
          </div>

          <!-- 空状态 -->
          <div v-else-if="filteredDocs.length === 0" class="docs-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <p>没有找到匹配的文档</p>
            <span>尝试更换关键词或切换分类</span>
          </div>
        </div>
      </main>

      <!-- 右侧预览区 -->
      <aside class="docs-preview card" v-if="selectedDoc">
        <div class="preview-header">
          <h3>文档预览</h3>
          <button class="preview-close" @click="selectedDoc = null">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="pdf-preview">
          <div class="pdf-page">
            <div class="pdf-header-bar">
              <span class="pdf-title-text">{{ selectedDoc.title }}</span>
            </div>
            <div class="pdf-body">
              <div class="pdf-department">
                <span>{{ selectedDoc.department }}</span>
                <span>{{ selectedDoc.date }}</span>
              </div>
              <div class="pdf-divider"></div>

              <!-- 加载中 -->
              <div v-if="previewLoading" class="preview-loading">
                <div class="progress-spinner"></div>
                <p>正在加载文档内容...</p>
              </div>

              <!-- PDF iframe 真实预览 -->
              <div v-else-if="isPDF && pdfPreviewSrc" class="preview-iframe-wrap">
                <iframe :src="pdfPreviewSrc" class="preview-iframe" :title="selectedDoc.title"></iframe>
              </div>

              <!-- DOCX HTML 预览 -->
              <div v-else-if="isDOCX && previewHtml" class="preview-docx-wrap">
                <div class="preview-docx-content" v-html="previewHtml"></div>
              </div>

              <!-- XLSX HTML 表格预览 -->
              <div v-else-if="isXLSX && previewHtml" class="preview-xlsx-wrap">
                <div class="preview-xlsx-content" v-html="previewHtml"></div>
              </div>

              <!-- 纯文本预览（导入的无文件文档） -->
              <div v-else-if="previewText" class="preview-text-content">
                <p>{{ previewText.slice(0, 4000) }}</p>
                <p v-if="previewText.length > 4000" class="text-truncated">… 内容已截断，请下载原文查看完整内容</p>
              </div>

              <!-- 无法预览的格式 -->
              <div v-else class="preview-unavailable">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>此格式暂不支持在线预览</p>
                <span>请下载文件后查看完整内容</span>
              </div>
            </div>
            <div class="pdf-footer-bar">
              <span>{{ selectedDoc.version }}</span>
              <span>{{ selectedDoc.format.toUpperCase() }} · {{ selectedDoc.pages || '?' }} 页</span>
            </div>
          </div>
        </div>

        <div class="preview-actions">
          <button v-if="isPDF && selectedDoc.backendFile" class="btn btn-outline" @click="openPdfInNewTab">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            在新窗口打开
          </button>
          <a v-else-if="isPDF && selectedDoc.file" :href="selectedDoc.file" target="_blank" class="btn btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            在新窗口打开
          </a>
          <button v-if="selectedDoc.backendFile" class="btn btn-outline" @click="downloadBackendDoc(selectedDoc)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            下载原文
          </button>
          <a v-else-if="selectedDoc.file" :href="selectedDoc.file" class="btn btn-outline" download>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            下载原文
          </a>
          <button v-else class="btn btn-outline" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            暂无文件
          </button>
          <button
            v-if="auth.isTeacher && selectedDoc.status"
            class="btn btn-outline btn-danger"
            :disabled="deletingDoc"
            @click="removeDoc(selectedDoc)"
          >
            删除文档
          </button>
          <button class="btn btn-primary" @click="goChat(selectedDoc)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            询问此文档
          </button>
        </div>
      </aside>

      <!-- 无选中时 -->
      <aside class="docs-preview card preview-empty" v-else>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>选择左侧文档<br/>查看详细内容</p>
      </aside>
    </div>

    <!-- 导入弹窗 -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="showImport" class="import-overlay" @click.self="showImport = false">
          <div class="import-modal">
            <div class="import-header">
              <h3>导入文档</h3>
              <p>支持 PDF / DOCX / XLSX 格式，可批量导入，系统将自动解析文本并提取元数据</p>
              <button class="import-close" @click="showImport = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- 拖拽上传区 -->
            <div
              v-if="!importing"
              class="import-dropzone"
              @dragover="onDragOver"
              @drop="onDrop"
              @click="$refs.fileInput.click()"
            >
              <div class="dropzone-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p class="dropzone-title">拖拽文件到此处，或点击选择</p>
              <p class="dropzone-hint">支持 .pdf / .docx / .xlsx 格式，可同时选择多个文件</p>
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,.docx,.doc,.xlsx,.xls"
                multiple
                class="file-input-hidden"
                @change="handleFileSelect"
              />
            </div>

            <!-- 解析进度 -->
            <div v-else class="import-progress">
              <div class="progress-spinner"></div>
              <p class="progress-text">{{ importProgress }}</p>
              <p v-if="importedCount > 0" class="progress-done">已成功导入 {{ importedCount }} 个文档</p>
            </div>

          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { uploadDocument, getDocumentList, deleteDocument, fetchDocumentFile, getDocumentPreviewToken } from '../api/index.js'
import { downloadFile, buildDocumentFileUrl } from '../api/request.js'
import { getDefaultDocs, getDocText, getDOCXHtml, getXLSXHtml } from '../services/knowledgeBase.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()
const searchText = ref('')
const activeCategory = ref('全部分类')
const activeDepts = ref([])
const viewMode = ref('grid')
const selectedDoc = ref(null)
const previewLoading = ref(false)
const previewText = ref('')
const previewHtml = ref('')
const previewFileUrl = ref('')
const loadingDocs = ref(true)
const showImport = ref(false)
const importing = ref(false)
const importFiles = ref([])
const importProgress = ref('')
const importedCount = ref(0)
const deletingDoc = ref(false)

const categoryDefs = [
  { name: '全部分类', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { name: '教务管理', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
  { name: '学生事务', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { name: '宿舍管理', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { name: '奖助学金', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>' },
  { name: '培养方案', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>' },
  { name: '校园通知', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
  { name: '学院信息', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' }
]

const categories = computed(() =>
  categoryDefs.map(cat => ({
    ...cat,
    count: cat.name === '全部分类' ? allDocs.value.length : (categoryCounts.value[cat.name] || 0)
  }))
)

const departments = ['教务处', '学生处', '后勤管理处', '各学院']

// ---- 文档数据：从后端加载，合并默认文档元数据 ----
const allDocs = ref([])

// 默认文档的文件名→元数据映射（用于补全后端数据的预览路径等）
const defaultDocMap = new Map(
  getDefaultDocs().map(d => {
    const name = (d.file || '').split('/').pop() || ''
    return [name, d]
  })
)

function mapBackendDoc(doc) {
  const defaultMeta = defaultDocMap.get(doc.fileName) || {}
  const ext = (doc.fileName || '').split('.').pop().toLowerCase()
  const hasLocalFile = !!defaultMeta.file
  return {
    id: doc.id,
    title: (doc.fileName || '').replace(/\.[^.]+$/, ''),
    department: defaultMeta.department || '未知单位',
    date: (doc.createdAt || '').slice(0, 10),
    format: ext,
    version: 'v1.0',
    pages: defaultMeta.pages || 0,
    category: defaultMeta.category || '校园通知',
    tags: defaultMeta.tags || [],
    description: defaultMeta.description || '',
    file: hasLocalFile ? defaultMeta.file : (doc.id ? `/document/${doc.id}/file` : null),
    backendFile: !hasLocalFile && !!doc.id,
    status: doc.status || 'UNKNOWN'
  }
}

async function loadDocs() {
  loadingDocs.value = true
  try {
    const { data } = await getDocumentList({ size: 100 })
    const list = data?.list || data || []
    allDocs.value = Array.isArray(list) ? list.map(mapBackendDoc) : []
  } catch {
    allDocs.value = getDefaultDocs()
  } finally {
    loadingDocs.value = false
  }
}

onMounted(() => {
  loadDocs()
})


const filteredDocs = computed(() => {
  let docs = allDocs.value
  if (activeCategory.value !== '全部分类') {
    docs = docs.filter(d => d.category === activeCategory.value)
  }
  if (activeDepts.value.length > 0) {
    docs = docs.filter(d => activeDepts.value.includes(d.department))
  }
  if (searchText.value.trim()) {
    const q = searchText.value.toLowerCase()
    docs = docs.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.department.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q)) ||
      d.description.toLowerCase().includes(q)
    )
  }
  return docs
})

// 更新分类计数
const categoryCounts = computed(() => {
  const counts = {}
  allDocs.value.forEach(d => {
    counts[d.category] = (counts[d.category] || 0) + 1
  })
  return counts
})

function filterDocs() { /* computed 自动处理 */ }

const isPDF = computed(() => {
  if (!selectedDoc.value) return false
  const doc = selectedDoc.value
  const f = doc.file || ''
  return f.toLowerCase().endsWith('.pdf') || doc.format === 'pdf'
})

const pdfPreviewSrc = computed(() => {
  if (!selectedDoc.value) return ''
  // 后端 PDF 必须等 preview-token 换好短效 URL，不能回退到无 token 的 file 路径
  if (selectedDoc.value.backendFile) return previewFileUrl.value
  if (previewFileUrl.value) return previewFileUrl.value
  return selectedDoc.value.file || ''
})

const isDOCX = computed(() => {
  if (!selectedDoc.value) return false
  const doc = selectedDoc.value
  const src = doc.file || doc.format || ''
  const ext = src.toLowerCase()
  return ext.endsWith('.docx') || ext.endsWith('.doc')
})

const isXLSX = computed(() => {
  if (!selectedDoc.value) return false
  const doc = selectedDoc.value
  const src = doc.file || doc.format || ''
  const ext = src.toLowerCase()
  return ext.endsWith('.xlsx') || ext.endsWith('.xls')
})

function clearPreviewFileUrl() {
  previewFileUrl.value = ''
}

async function loadBackendFileBlob(doc) {
  const { data } = await fetchDocumentFile(doc.id)
  return data
}

async function downloadBackendDoc(doc) {
  const fileName = doc.fileName || `${doc.title}.${doc.format}`
  await downloadFile(`/document/${doc.id}/file`, fileName)
}

function openPdfInNewTab() {
  const url = pdfPreviewSrc.value
  if (url) window.open(url, '_blank')
}

watch(selectedDoc, async (doc) => {
  previewText.value = ''
  previewHtml.value = ''
  clearPreviewFileUrl()
  if (!doc) return

  const ext = (doc.format || (doc.file || '').split('.').pop() || '').toLowerCase()

  // 本地静态 PDF 可直接 iframe 预览
  if (doc.file && !doc.backendFile && ext === 'pdf') return

  previewLoading.value = true
  try {
    // 后端 PDF：先调 preview-token 拿短效 token（勿用登录 JWT）
    if (doc.backendFile && ext === 'pdf') {
      const { data } = await getDocumentPreviewToken(doc.id)
      const previewToken = typeof data === 'string' ? data : data?.token
      if (!previewToken || String(previewToken).startsWith('eyJ')) {
        throw new Error('预览 token 获取失败')
      }
      previewFileUrl.value = buildDocumentFileUrl(doc.id, previewToken)
      return
    }

    const source = doc.backendFile ? await loadBackendFileBlob(doc) : doc.file

    if (ext === 'docx' || ext === 'doc') {
      const html = await getDOCXHtml(source)
      if (html) {
        previewHtml.value = html
      } else {
        const text = await getDocText(doc)
        previewText.value = text || ''
      }
    } else if (ext === 'xlsx' || ext === 'xls') {
      previewHtml.value = await getXLSXHtml(source)
    } else if (source) {
      const text = await getDocText(doc)
      previewText.value = text || ''
    }
  } catch {
    previewText.value = ''
    previewHtml.value = ''
  } finally {
    previewLoading.value = false
  }
})

onUnmounted(() => {
  clearPreviewFileUrl()
})

function toggleDept(dept) {
  const idx = activeDepts.value.indexOf(dept)
  if (idx >= 0) {
    activeDepts.value.splice(idx, 1)
  } else {
    activeDepts.value.push(dept)
  }
}

function goChat(doc) {
  const title = typeof doc === 'string' ? doc : doc.title
  const docId = typeof doc === 'object' && doc.id != null ? String(doc.id) : ''
  router.push({ path: '/chat', query: { q: title, docId } })
}

async function removeDoc(doc) {
  if (!doc?.id || deletingDoc.value) return
  if (!confirm(`确定删除《${doc.title}》？删除后无法恢复。`)) return
  deletingDoc.value = true
  try {
    await deleteDocument(doc.id)
    allDocs.value = allDocs.value.filter(d => d.id !== doc.id)
    if (selectedDoc.value?.id === doc.id) {
      selectedDoc.value = null
    }
  } catch (err) {
    alert(err.message || '删除失败')
  } finally {
    deletingDoc.value = false
  }
}

// ---- 文件导入 ----
async function handleFileSelect(e) {
  const files = Array.from(e.target.files || e.dataTransfer?.files || [])
  if (!files.length) return
  importFiles.value = files
  await processFiles(files)
}

async function processFiles(files) {
  importing.value = true
  importedCount.value = 0

  for (const file of files) {
    importProgress.value = `正在上传：${file.name}`
    try {
      await uploadDocument(file)
      importedCount.value++
    } catch (err) {
      console.error('上传失败:', file.name, err.message)
      importProgress.value = `上传失败：${file.name} — ${err.message}`
    }
  }

  // 上传完成后刷新后端文档列表
  if (importedCount.value > 0) {
    await loadDocs()
  }

  importing.value = false
  importProgress.value = ''
  importFiles.value = []

  if (importedCount.value > 0) {
    setTimeout(() => {
      showImport.value = false
    }, 1500)
  }
}


// 拖拽处理
function onDragOver(e) {
  e.preventDefault()
}
function onDrop(e) {
  e.preventDefault()
  handleFileSelect(e)
}
</script>

<style scoped>
.docs-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.docs-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 240px 1fr 420px;
  gap: 0;
  margin-top: var(--navbar-height);
  overflow: hidden;
}

/* ===== 左侧分类导航 ===== */
.docs-sidebar {
  border-radius: 0;
  border: none;
  border-right: 1px solid var(--border-light);
  box-shadow: none;
  padding: 20px;
  overflow-y: auto;
  background: var(--bg-cool);
}

.sidebar-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.category-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: transparent;
  font-size: 0.88rem;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  width: 100%;
  text-align: left;
}

.category-item:hover {
  background: var(--bg-warm);
  color: var(--text);
}

.category-item.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.cat-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.cat-badge {
  margin-left: auto;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--text-tertiary);
  background: var(--bg-warm);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.sidebar-divider {
  height: 1px;
  background: var(--border-light);
  margin: 18px 0;
}

.dept-filter {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dept-check {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dept-check:hover {
  background: var(--bg-warm);
}

.dept-check.checked {
  color: var(--primary);
}

.check-box {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border);
  border-radius: 4px;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.dept-check.checked .check-box {
  background: var(--primary);
  border-color: var(--primary);
}

/* ===== 中间文档列表 ===== */
.docs-main {
  padding: 20px 24px;
  overflow-y: auto;
  min-width: 0;
}

.docs-search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.docs-search-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.docs-search-input:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(200, 103, 58, 0.08);
}

.docs-search-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
  background: transparent;
  color: var(--text);
}

.docs-search-input input::placeholder {
  color: var(--text-placeholder);
}

.docs-search-input svg {
  flex-shrink: 0;
  color: var(--text-tertiary);
}

.search-clear {
  background: var(--bg-warm);
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.search-clear:hover {
  background: var(--border);
  color: var(--text);
}

.docs-view-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-warm);
  padding: 3px;
  border-radius: var(--radius-sm);
}

.docs-view-tabs button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: transparent;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.docs-view-tabs button.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-xs);
}

.docs-result-info {
  font-size: 0.82rem;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

.docs-result-info strong {
  color: var(--text);
}

/* 文档网格 */
.docs-grid.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.docs-grid.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.docs-grid.list .doc-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
}

.docs-grid.list .doc-card-header {
  flex-shrink: 0;
}

.docs-grid.list .doc-title {
  flex: 1;
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.docs-grid.list .doc-desc {
  display: none;
}

.docs-grid.list .doc-meta {
  flex-shrink: 0;
}

.doc-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.doc-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.doc-type-badge {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.type-pdf { background: #FDE8E8; color: #C84A4A; }
.type-docx { background: #E8EEF8; color: #4A6FA5; }
.type-doc { background: #E8EEF8; color: #4A6FA5; }
.type-xlsx { background: #E8F5E9; color: #388E3C; }

.doc-tags {
  display: flex;
  gap: 6px;
}

.doc-tag {
  padding: 2px 8px;
  background: var(--bg-warm);
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  color: var(--text-tertiary);
}

.doc-tag.has-file {
  background: #E8F5E9;
  color: #388E3C;
  font-weight: 600;
}

.doc-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.doc-desc {
  font-size: 0.82rem;
  color: var(--text-tertiary);
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
  font-size: 0.78rem;
  color: var(--text-tertiary);
}

.doc-dept {
  font-weight: 500;
  color: var(--text-secondary);
}

.doc-version {
  margin-left: auto;
  padding: 2px 8px;
  background: var(--bg-warm);
  border-radius: var(--radius-full);
}

/* 空状态 */
.docs-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 64px 20px;
  color: var(--text-tertiary);
}

.docs-empty svg { margin-bottom: 16px; }
.docs-empty p { font-size: 0.95rem; margin-bottom: 4px; }
.docs-empty span { font-size: 0.82rem; }

.docs-loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== 右侧预览 ===== */
.docs-preview {
  border-radius: 0;
  border: none;
  border-left: 1px solid var(--border-light);
  box-shadow: none;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg-cool);
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.docs-preview.preview-empty {
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-tertiary);
}

.preview-empty svg { margin-bottom: 12px; }
.preview-empty p { font-size: 0.85rem; line-height: 1.6; }

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.preview-header h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
}

.preview-close {
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

.preview-close:hover {
  background: var(--bg-warm);
  color: var(--text);
}

/* PDF 预览模拟 */
.pdf-preview {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
}

.pdf-page {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.pdf-header-bar {
  padding: 10px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e5e5e5;
}

.pdf-title-text {
  font-size: 0.72rem;
  font-weight: 600;
  color: #555;
}

.pdf-body {
  padding: 20px 18px;
}

.pdf-department {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #999;
  margin-bottom: 10px;
}

.pdf-divider {
  height: 1px;
  background: #eee;
  margin-bottom: 16px;
}

/* 预览加载 / iframe / 文本 */
.preview-loading {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.preview-loading .progress-spinner {
  margin: 0 auto 12px;
  width: 28px;
  height: 28px;
  border-width: 2px;
}

.preview-iframe-wrap {
  width: 100%;
  height: 460px;
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* DOCX HTML 预览 */
.preview-docx-wrap {
  max-height: 460px;
  overflow-y: auto;
  overflow-x: hidden;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 4px;
}

.preview-docx-content {
  padding: 20px 24px;
  font-size: 0.82rem;
  line-height: 1.8;
  color: #333;
}

.preview-docx-content :deep(h1) { font-size: 1.3rem; margin: 16px 0 10px; }
.preview-docx-content :deep(h2) { font-size: 1.15rem; margin: 14px 0 8px; }
.preview-docx-content :deep(h3) { font-size: 1.05rem; margin: 12px 0 6px; }
.preview-docx-content :deep(p) { margin: 6px 0; }
.preview-docx-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
  font-size: 0.76rem;
}
.preview-docx-content :deep(th),
.preview-docx-content :deep(td) {
  border: 1px solid #ddd;
  padding: 6px 10px;
  text-align: left;
}
.preview-docx-content :deep(th) { background: #f5f5f5; font-weight: 600; }
.preview-docx-content :deep(ul), .preview-docx-content :deep(ol) { padding-left: 20px; margin: 6px 0; }
.preview-docx-content :deep(li) { margin: 2px 0; }
.preview-docx-content :deep(img) { max-width: 100%; height: auto; }

/* XLSX HTML 表格预览 */
.preview-xlsx-wrap {
  max-height: 460px;
  overflow: auto;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 4px;
}

.preview-xlsx-content {
  padding: 8px;
}

.xlsx-sheet {
  margin-bottom: 4px;
}

.xlsx-sheet-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
  padding: 6px 10px;
  background: #f0f4f8;
  border-radius: 4px 4px 0 0;
  margin: 0;
}

.preview-xlsx-content :deep(table) {
  border-collapse: collapse;
  font-size: 0.74rem;
  width: auto;
  min-width: 100%;
}

.preview-xlsx-content :deep(th),
.preview-xlsx-content :deep(td) {
  border: 1px solid #d0d0d0;
  padding: 4px 10px;
  text-align: left;
  white-space: nowrap;
}

.preview-xlsx-content :deep(th) {
  background: #e8ecf0;
  font-weight: 600;
  color: #333;
}

.preview-xlsx-content :deep(td) {
  background: #fff;
}

.preview-xlsx-content :deep(tr:nth-child(even) td) {
  background: #fafbfc;
}

.preview-text-content {
  max-height: 460px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 0.78rem;
  line-height: 1.8;
  color: var(--text-secondary);
  padding: 8px 4px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
}

.text-truncated {
  color: var(--text-tertiary);
  font-style: italic;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--border);
}

.preview-unavailable {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.preview-unavailable svg { margin-bottom: 10px; color: var(--border); }
.preview-unavailable p { font-size: 0.88rem; margin-bottom: 4px; }
.preview-unavailable span { font-size: 0.78rem; }

.pdf-footer-bar {
  padding: 8px 16px;
  background: #f5f5f5;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: #999;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.preview-actions .btn {
  flex: 1;
  font-size: 0.82rem;
  padding: 8px 12px;
}

/* ===== 导入按钮 ===== */
.import-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.import-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

/* ===== 导入弹窗 ===== */
.import-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.import-modal {
  width: 520px;
  max-width: 100%;
  background: var(--surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.import-header {
  position: relative;
  padding: 28px 28px 20px;
  border-bottom: 1px solid var(--border-light);
}

.import-header h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
}

.import-header p {
  font-size: 0.84rem;
  color: var(--text-tertiary);
}

.import-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: transparent;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.import-close:hover {
  background: var(--bg-warm);
  color: var(--text);
}

/* 拖拽区 */
.import-dropzone {
  margin: 24px;
  padding: 56px 24px;
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition);
  background: var(--bg);
}

.import-dropzone:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.dropzone-icon {
  color: var(--text-tertiary);
  margin-bottom: 16px;
  transition: color var(--transition);
}

.import-dropzone:hover .dropzone-icon {
  color: var(--primary);
}

.dropzone-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.dropzone-hint {
  font-size: 0.82rem;
  color: var(--text-tertiary);
}

.file-input-hidden {
  display: none;
}

/* 进度 */
.import-progress {
  padding: 56px 24px;
  text-align: center;
}

.progress-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.progress-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.progress-done {
  font-size: 0.88rem;
  color: #388E3C;
  font-weight: 600;
}

/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .import-modal,
.modal-leave-active .import-modal {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from .import-modal {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

.modal-leave-to .import-modal {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 1200px) {
  .docs-layout {
    grid-template-columns: 200px 1fr 380px;
  }
  .docs-grid.grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .docs-layout {
    grid-template-columns: 1fr;
  }
  .docs-sidebar, .docs-preview {
    display: none;
  }
}
</style>
