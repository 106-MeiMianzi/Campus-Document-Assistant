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
