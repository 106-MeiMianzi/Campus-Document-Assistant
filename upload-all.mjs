/**
 * 批量上传 public/docs/ 下所有文件到后端
 * 用法: node upload-all.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DOCS_DIR = path.join(__dirname, 'public', 'docs')
const BASE = 'https://campusdocai.cpolar.top/api'

async function login() {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'campususer1', password: 'pass123456' })
  })
  const json = await res.json()
  if (json.code !== 0) throw new Error(`登录失败: ${json.message}`)
  console.log('登录成功, token:', json.data.token.slice(0, 30) + '...')
  return json.data.token
}

async function uploadFile(token, filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath)
  // 手动构造 multipart/form-data
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2)
  const CRLF = '\r\n'

  const header = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${encodeURIComponent(fileName)}"`,
    `Content-Type: application/octet-stream`,
    '', ''
  ].join(CRLF)

  const footer = `${CRLF}--${boundary}--${CRLF}`

  const headerBytes = Buffer.from(header, 'utf-8')
  const footerBytes = Buffer.from(footer, 'utf-8')
  const body = Buffer.concat([headerBytes, fileBuffer, footerBytes])

  const res = await fetch(`${BASE}/document/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body
  })
  const json = await res.json()
  return { success: json.code === 0, message: json.message, data: json.data }
}

async function main() {
  const files = fs.readdirSync(DOCS_DIR).filter(f => /\.(pdf|docx?|xlsx?)$/i.test(f))
  console.log(`找到 ${files.length} 个文件待上传\n`)

  const token = await login()

  let ok = 0
  let fail = 0
  const failures = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(DOCS_DIR, file)
    const size = (fs.statSync(filePath).size / 1024).toFixed(1)
    process.stdout.write(`[${i + 1}/${files.length}] ${file} (${size} KB) ... `)
    try {
      const result = await uploadFile(token, filePath, file)
      if (result.success) {
        console.log('OK', result.data?.id ? `(id=${result.data.id})` : '')
        ok++
      } else {
        console.log('FAIL:', result.message)
        fail++
        failures.push({ file, message: result.message })
      }
    } catch (e) {
      console.log('ERROR:', e.message)
      fail++
      failures.push({ file, message: e.message })
    }
  }

  console.log(`\n===== 完成: 成功 ${ok}, 失败 ${fail} =====`)
  if (failures.length) {
    console.log('失败列表:')
    failures.forEach(f => console.log(`  - ${f.file}: ${f.message}`))
  }
}

main().catch(e => { console.error(e); process.exit(1) })
