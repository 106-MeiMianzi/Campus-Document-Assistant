/**
 * API 接口层 —— 对接 CampusDocAI 后端
 * 文档: https://s.apifox.cn/7679c008-d150-424e-a1c0-6b3087e44d91
 * Base: https://campusdocai.cpolar.top/api
 *
 * 所有接口路径以 / 开头，baseURL 由 request.js 注入（/api 或完整 URL）
 */

import http, { setToken } from './request'

/* ==============================
   Auth 认证
   ============================== */

/** 注册 */
export function registerApi(username, password) {
  return http.post('/auth/register', { username, password })
}

/** 登录 */
export async function loginApi(username, password) {
  const { data } = await http.post('/auth/login', { username, password })
  if (data.token) {
    setToken(data.token)
  }
  return data
}

/** 登出 */
export function logoutApi() {
  return http.post('/auth/logout')
}

/** 获取当前用户信息 */
export function getUserInfo() {
  return http.get('/user/info')
}

/** 更新头像（data URL 或图片 URL） */
export function updateAvatar(avatarUrl) {
  return http.patch('/user/avatar', { avatarUrl })
}

/* ==============================
   Document 文档
   ============================== */

/** 上传文档 */
export function uploadDocument(file, onProgress) {
  const form = new FormData()
  form.append('files', file)
  return http.post('/document/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
    onUploadProgress: onProgress
      ? (evt) => { if (evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100)) }
      : undefined
  })
}

/** 获取文档列表 */
export function getDocumentList(params) {
  return http.get('/document/list', { params })
}

/** 获取文档详情 */
export function getDocumentDetail(id) {
  return http.get(`/document/${id}`)
}

/** 删除文档 */
export function deleteDocument(id) {
  return http.delete(`/document/${id}`)
}

/** 重新解析文档 */
export function reparseDocument(id) {
  return http.post(`/document/${id}/reparse`)
}

/** 获取文档预览短效 token（供 iframe 直链加载 PDF） */
export function getDocumentPreviewToken(id) {
  return http.get(`/document/${id}/preview-token`)
}

/** 获取后端存储的文档文件（需登录，用于 DOCX/XLSX 等需 Blob 的场景） */
export function fetchDocumentFile(id) {
  return http.get(`/document/${id}/file`, { responseType: 'blob' })
}

/* ==============================
   Search 检索
   ============================== */

/** 语义搜索（向量检索） */
export function semanticSearch(question, topK = 5) {
  return http.post('/search/semantic', { question, topK })
}

/** 关键词搜索 */
export function keywordSearch(query) {
  return http.post('/search/keyword', { query })
}

// 兼容旧调用
export const vectorSearch = semanticSearch

/* ==============================
   Chat 问答
   ============================== */

/** AI 问答 */
export function askQuestion(question, docId, conversationId) {
  return http.post('/chat/ask', {
    question,
    documentId: docId || null,
    conversationId: conversationId || null
  })
}

/* ==============================
   Conversation 会话
   ============================== */

/** 创建新会话 */
export function createConversation(title) {
  return http.post('/conversation', { title })
}

/** 获取会话列表 */
export function getConversationList() {
  return http.get('/conversation/list')
}

/** 获取会话详情 */
export function getConversation(id) {
  return http.get(`/conversation/${id}`)
}

/** 获取会话消息 */
export function getConversationMessages(id) {
  return http.get(`/conversation/${id}/messages`)
}

/** 删除会话 */
export function deleteConversation(id) {
  return http.delete(`/conversation/${id}`)
}

// 兼容旧调用：chat/history → conversation/list
export async function getChatHistory() {
  return http.get('/conversation/list')
}

/* ==============================
   Service 办事大厅 — 校园卡补办
   ============================== */

/** 提交校园卡补办申请 */
export function createCardReplacement(payload) {
  return http.post('/service/card-replacement', payload)
}

/** 我的校园卡补办申请列表 */
export function getCardReplacementList(params) {
  return http.get('/service/card-replacement/list', { params })
}

/** 校园卡补办申请详情 */
export function getCardReplacementDetail(id) {
  return http.get(`/service/card-replacement/${id}`)
}

/** 取消校园卡补办申请 */
export function cancelCardReplacement(id) {
  return http.post(`/service/card-replacement/${id}/cancel`)
}
