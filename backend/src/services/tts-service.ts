import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const execFileAsync = promisify(execFile)

function safeName(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9_-]+/g, '_').slice(0, 40)
}

function hashText(text: string, voice: string, version: string) {
  return crypto.createHash('sha1').update(`${version}|${voice}|${text}`).digest('hex').slice(0, 10)
}

export async function generateTtsMp3(text: string) {
  const voice = process.env.EDGE_TTS_VOICE || 'en-US-JennyNeural'
  const cacheVersion = process.env.EDGE_TTS_CACHE_VERSION || 'v2'
  const filename = `${hashText(text, voice, cacheVersion)}_${safeName(text)}.mp3`
  const outputDir = path.join(process.cwd(), 'public', 'tts')
  const outputPath = path.join(outputDir, filename)

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
  if (fs.existsSync(outputPath)) return `/tts/${filename}`

  const scriptPath = path.join(process.cwd(), 'scripts', 'edge-tts-single.py')
  await execFileAsync('python3', [scriptPath, text, outputPath])

  return `/tts/${filename}`
}
