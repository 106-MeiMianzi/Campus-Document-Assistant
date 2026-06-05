/**
 * 客户端知识库 —— 管理文档文本缓存 & 关键词检索。
 * 在 Docs.vue 中点击文档时懒解析 PDF/DOCX，文本缓存到 localStorage，
 * Chat.vue 中基于已缓存文本做关键词搜索。
 */

const CACHE_KEY = 'xwbd_doc_texts'
const DOCS_LIST_KEY = 'xwbd_imported_docs'

/* ---- 缓存读写 ---- */
function getCache() {
  try {
    const data = localStorage.getItem(CACHE_KEY)
    return data ? JSON.parse(data) : {}
  } catch { return {} }
}

function setCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {}
}

/** 获取所有文档列表（合并默认文档 & 导入文档） */
export function getAllDocs() {
  try {
    const raw = localStorage.getItem(DOCS_LIST_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return getDefaultDocs()
}

export function saveAllDocs(docs) {
  try {
    localStorage.setItem(DOCS_LIST_KEY, JSON.stringify(docs))
  } catch {}
}

/* ---- PDF / DOCX 解析 ---- */
export async function parsePDF(source) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = ''

  let data
  if (typeof source === 'string') {
    const resp = await fetch(source)
    if (!resp.ok) throw new Error(`无法获取文件: ${resp.status}`)
    data = new Uint8Array(await resp.arrayBuffer())
  } else {
    data = new Uint8Array(await source.arrayBuffer())
  }

  const pdf = await pdfjsLib.getDocument({ data }).promise
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map(item => item.str).join(' ') + '\n'
  }
  return fullText.trim()
}

export async function parseDOCX(source) {
  const mammoth = await import('mammoth')
  let buffer
  if (typeof source === 'string') {
    const resp = await fetch(source)
    if (!resp.ok) throw new Error(`无法获取文件: ${resp.status}`)
    buffer = await resp.arrayBuffer()
  } else {
    buffer = await source.arrayBuffer()
  }
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value.trim()
}

export async function parseXLSX(source) {
  const XLSX = await import('xlsx')
  let buffer
  if (typeof source === 'string') {
    const resp = await fetch(source)
    if (!resp.ok) throw new Error(`无法获取文件: ${resp.status}`)
    buffer = await resp.arrayBuffer()
  } else {
    buffer = await source.arrayBuffer()
  }
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' })
  const texts = []
  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name]
    const csv = XLSX.utils.sheet_to_csv(sheet)
    texts.push(`[${name}]\n${csv}`)
  }
  return texts.join('\n\n')
}

/* ---- DOCX / XLSX HTML 预览 ---- */
export async function getDOCXHtml(source) {
  const mammoth = await import('mammoth')
  let buffer
  if (typeof source === 'string') {
    const resp = await fetch(source)
    if (!resp.ok) throw new Error(`无法获取文件: ${resp.status}`)
    buffer = await resp.arrayBuffer()
  } else {
    buffer = await source.arrayBuffer()
  }
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer })
  return result.value
}

export async function getXLSXHtml(source) {
  const XLSX = await import('xlsx')
  let buffer
  if (typeof source === 'string') {
    const resp = await fetch(source)
    if (!resp.ok) throw new Error(`无法获取文件: ${resp.status}`)
    buffer = await resp.arrayBuffer()
  } else {
    buffer = await source.arrayBuffer()
  }
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' })
  const parts = workbook.SheetNames.map(name => {
    const sheet = workbook.Sheets[name]
    const html = XLSX.utils.sheet_to_html(sheet, { id: '', editable: false })
    return `<div class="xlsx-sheet"><h3 class="xlsx-sheet-name">${name}</h3>${html}</div>`
  })
  return parts.join('')
}

/* ---- 文档文本获取（带缓存） ---- */
export async function getDocText(doc) {
  const cache = getCache()
  const cacheKey = doc.file || `uploaded_${doc.id}`

  if (cache[cacheKey]) return cache[cacheKey]

  // 已上传的文件自带 textContent
  if (doc.textContent) {
    cache[cacheKey] = doc.textContent
    setCache(cache)
    return doc.textContent
  }

  // 从 /docs/ 路径加载并解析
  if (doc.file) {
    const ext = doc.file.split('.').pop().toLowerCase()
    let text = ''
    if (ext === 'pdf') {
      text = await parsePDF(doc.file)
    } else if (ext === 'docx') {
      text = await parseDOCX(doc.file)
    } else if (ext === 'doc') {
      try { text = await parseDOCX(doc.file) } catch { text = '' }
    } else if (ext === 'xlsx' || ext === 'xls') {
      text = await parseXLSX(doc.file)
    }
    if (text) {
      cache[cacheKey] = text
      setCache(cache)
    }
    return text
  }

  return null
}

/** 批量预加载文档文本（限制并发） */
export async function preloadDocs(docs, onProgress) {
  const cache = getCache()
  let loaded = 0
  const toLoad = docs.filter(d => {
    const key = d.file || `uploaded_${d.id}`
    return d.file && !cache[key]
  })

  for (const doc of toLoad) {
    try {
      await getDocText(doc)
      loaded++
      if (onProgress) onProgress(loaded, toLoad.length)
    } catch {}
  }
}

/* ---- 关键词搜索 ---- */
export function searchDocs(query, docs) {
  const cache = getCache()
  // 分词：按空格、标点切分，过滤停用词 & 短词
  const rawKeywords = query.split(/[\s,，、。！？：；\n]+/).filter(k => k.length >= 2)
  // 合并相邻关键词做短语匹配
  const keywords = [...rawKeywords]
  if (rawKeywords.length >= 2) {
    keywords.push(rawKeywords.join('')) // 短语连写
  }

  const results = []

  for (const doc of docs) {
    const cacheKey = doc.file || `uploaded_${doc.id}`
    const text = cache[cacheKey] || doc.textContent || ''
    if (!text) continue

    const textNorm = text.replace(/\s+/g, ' ')
    let score = 0
    const snippets = []
    const seen = new Set()

    for (const kw of keywords) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escaped, 'gi')
      let match
      while ((match = regex.exec(textNorm)) !== null) {
        score++
        const start = Math.max(0, match.index - 60)
        const end = Math.min(textNorm.length, match.index + kw.length + 60)
        const snippet = (start > 0 ? '…' : '') + textNorm.slice(start, end).trim() + (end < textNorm.length ? '…' : '')
        const dedup = snippet.slice(0, 30)
        if (!seen.has(dedup)) {
          seen.add(dedup)
          snippets.push(snippet)
        }
        if (snippets.length >= 3) break
      }
      if (snippets.length >= 3) break
    }

    if (score > 0) {
      results.push({ doc, score, snippets })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 5)
}

/** 检查是否有已缓存的文档文本 */
export function hasAnyCachedText() {
  const cache = getCache()
  return Object.keys(cache).length > 0
}

/* ---- 默认文档列表（与 Docs.vue 中一致） ---- */
export function getDefaultDocs() {
  return [
    { id: 1, title: '福州大学2026-2027学年校历', department: '教务处', date: '2026-05-01', format: 'pdf', version: 'v1.0', pages: 3, category: '教务管理', tags: ['校历', '教学安排'], description: '福州大学2026—2027学年学期起止时间、假期安排及重要教学节点。', file: '/docs/福州大学关于印发2026—2027学年校历的通知-福州大学教务处.pdf' },
    { id: 2, title: '《习近平新时代中国特色社会主义思想概论》课程期末考试安排', department: '教务处', date: '2026-05-01', format: 'pdf', version: 'v1.0', pages: 3, category: '教务管理', tags: ['考试', '思政课'], description: '2025-2026学年第二学期课程期末考试时间、考场安排及注意事项。', file: '/docs/关于2025-2026学年第二学期《习近平新时代中国特色社会主义思想概论》课程期末考试安排的通知-福州大学教务处.pdf' },
    { id: 3, title: '《线性代数》课程期末考试安排', department: '教务处', date: '2026-05-01', format: 'pdf', version: 'v1.0', pages: 3, category: '教务管理', tags: ['考试', '数学'], description: '2025-2026学年第二学期线性代数及线性代数与解析几何课程期末考试安排通知。', file: '/docs/关于2025-2026学年第二学期《线性代数》、《线性代数与解析几何》课程期末考试安排的通知-福州大学教务处.pdf' },
    { id: 4, title: '本科生德育测评加减分参考细则', department: '教务处', date: '2025-06-01', format: 'pdf', version: 'v1.0', pages: 4, category: '教务管理', tags: ['德育', '测评'], description: '福州大学本科学生德育测评加减分项目、分值标准及认定程序。', file: '/docs/福州大学本科学生德育测评加减分参考细则-福州大学教务处.pdf' },
    { id: 5, title: '考场违纪报送及处理暂行规定', department: '教务处', date: '2025-03-01', format: 'pdf', version: 'v1.0', pages: 2, category: '教务管理', tags: ['考试', '违纪', '处分'], description: '考试违纪行为认定标准、报送流程及处理办法。', file: '/docs/考场违纪报送及处理暂行规定-福州大学教务处.pdf' },
    { id: 6, title: '本科生学生证补办流程', department: '教务处', date: '2026-05-01', format: 'pdf', version: 'v1.0', pages: 2, category: '教务管理', tags: ['学生证', '补办'], description: '本科生学生证遗失补办的条件、流程及所需材料说明。', file: '/docs/关于本科生学生证补办的通知-福州大学教务处.pdf' },
    { id: 7, title: '教材内容审核流程', department: '教务处', date: '2025-09-01', format: 'pdf', version: 'v1.0', pages: 3, category: '教务管理', tags: ['教材', '审核'], description: '教材选用及内容审核的标准、流程和责任人说明。', file: '/docs/教材内容审核流程-福州大学教务处.pdf' },
    { id: 8, title: '关于退役复学学生转专业的通知', department: '教务处', date: '2026-03-01', format: 'pdf', version: 'v1.0', pages: 2, category: '学生事务', tags: ['退役', '转专业', '复学'], description: '2026年3月退役复学学生转专业申请条件、流程及时间安排。', file: '/docs/关于做好2026年3月退役复学学生转专业的通知-福州大学教务处.pdf' },
    { id: 9, title: '调整专业培养方案审批表', department: '教务处', date: '2025-05-01', format: 'docx', version: 'v1.0', pages: 1, category: '学生事务', tags: ['培养方案', '调专业', '审批'], description: '福州大学学生调整专业后培养方案变更审批表模板。', file: '/docs/福州大学调整专业培养方案.docx' },
    { id: 10, title: '本科生奖学金管理办法', department: '教务处', date: '2025-09-01', format: 'pdf', version: 'v1.0', pages: 8, category: '奖助学金', tags: ['奖学金', '管理办法'], description: '福州大学本科生奖学金种类、申请条件、评审程序及发放管理规定。', file: '/docs/福州大学本科生奖学金管理办法-福州大学教务处.pdf' },
    { id: 11, title: '本科生奖学金评定管理办法', department: '教务处', date: '2025-09-01', format: 'pdf', version: 'v1.0', pages: 6, category: '奖助学金', tags: ['奖学金', '评定标准'], description: '本科生奖学金评定的详细评分标准、加分项认定及审核流程。', file: '/docs/福州大学本科生奖学金评定管理办法-福州大学教务处.pdf' },
    { id: 12, title: '国家励志奖学金评审实施细则', department: '教务处', date: '2025-06-01', format: 'pdf', version: 'v1.0', pages: 4, category: '奖助学金', tags: ['励志奖学金', '评审'], description: '国家励志奖学金申请条件、评审标准、名额分配及材料提交要求。', file: '/docs/福州大学国家励志奖学金评审实施细则-福州大学教务处.pdf' },
    { id: 13, title: '勤工助学管理办法（试行）', department: '教务处', date: '2025-03-01', format: 'pdf', version: 'v1.0', pages: 5, category: '奖助学金', tags: ['勤工助学', '岗位'], description: '校内勤工助学岗位设置、申请条件、酬金标准及管理考核办法（试行）。', file: '/docs/福州大学勤工助学管理办法（试行）-福州大学教务处.pdf' },
    { id: 14, title: '学生住宿管理办法', department: '教务处', date: '2025-02-01', format: 'pdf', version: 'v1.0', pages: 10, category: '宿舍管理', tags: ['宿舍', '住宿', '管理条例'], description: '宿舍分配、调换、退宿、安全管理、设施报修等住宿管理相关规定。', file: '/docs/福州大学学生住宿管理办法-福州大学教务处.pdf' },
    { id: 15, title: '实验班培养方案修订工作推进会', department: '教务处', date: '2026-05-01', format: 'pdf', version: 'v1.0', pages: 2, category: '培养方案', tags: ['培养方案', '实验班', '修订'], description: '福州大学实验班培养方案修订工作推进会议纪要及后续工作安排。', file: '/docs/福州大学召开实验班培养方案修订工作推进会-福州大学教务处.pdf' },
    { id: 16, title: '《大学物理实验》绪论课安排', department: '教务处', date: '2026-03-01', format: 'xlsx', version: 'v1.0', pages: 1, category: '校园通知', tags: ['物理实验', '绪论课', '安排'], description: '2026年春季学期大学物理实验绪论课时间安排表。', file: '/docs/2026年春季学期《大学物理实验A（上）》、《大学物理实验C》绪论课安排.xlsx' },
    { id: 17, title: '梅努斯大学-福州大学联合学术研讨会', department: '各学院', date: '2026-05-01', format: 'pdf', version: 'v1.0', pages: 2, category: '校园通知', tags: ['国际合作', '研讨会', '学术'], description: '梅努斯大学与福州大学联合学术研讨会顺利召开的新闻通稿。', file: '/docs/梅努斯大学-福州大学联合学术研讨会在福州大学顺利召开-梅努斯国际工程学院.pdf' },
    { id: 18, title: '电气工程与自动化学院硕士研究生报考咨询', department: '各学院', date: '2026-05-01', format: 'pdf', version: 'v1.0', pages: 1, category: '学院信息', tags: ['研究生', '报考', '电气学院'], description: '电气工程与自动化学院硕士研究生报考咨询联系方式汇总。', file: '/docs/电气工程与自动化学院硕士研究生报考咨询联系方式-福州大学电气工程与自动化学院.pdf' },
    { id: 19, title: '化学学院2026年博士研究生招生复试方案', department: '各学院', date: '2026-05-01', format: 'pdf', version: 'v1.0', pages: 3, category: '学院信息', tags: ['博士', '复试', '化学学院'], description: '福州大学化学学院2026年博士研究生第二轮招生复试方案及考生须知。', file: '/docs/福州大学化学学院2026年博士研究生第二轮招生复试方案-福州大学化学学院.pdf' },
    { id: 20, title: '电气工程与自动化学院港澳台博士研究生复试结果公示', department: '各学院', date: '2026-05-01', format: 'pdf', version: 'v1.0', pages: 2, category: '学院信息', tags: ['港澳台', '博士', '复试结果'], description: '福州大学电气工程与自动化学院2026年港澳台博士研究生复试结果公示名单。', file: '/docs/福州大学电气工程与自动化学院2026年港澳台博士研究生复试结果公示-福州大学电气工程与自动化学院.pdf' }
  ]
}
