import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { Pool } from '@neondatabase/serverless'

dotenv.config({ path: path.join(__dirname, '../.env') })
dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const lookupPath = path.join(__dirname, '../assets/symbols/arasaac/index/keyword_lookup.en.json')
const metadataPath = path.join(__dirname, '../assets/symbols/arasaac/raw/meta/metadata.en.json')
const outputJsonPath = path.join(__dirname, 'coreword-manual-mapping.candidates.json')
const outputHtmlPath = path.join(__dirname, 'coreword-manual-mapping.html')

if (!fs.existsSync(lookupPath) || !fs.existsSync(metadataPath)) {
  console.error('Lookup or metadata missing. Run symbols:index:arasaac first.')
  process.exit(1)
}

type LookupCandidate = { id: number; filename: string; categories: string[] }
type MetadataRow = { id: number; filename: string; keywords?: string[]; categories?: string[] }
type UnmappedWord = { id: number; word_en: string; word_zh: string | null }

type Candidate = {
  filename: string
  arasaac_id: number
  score: number
  categories: string[]
  keywords: string[]
}

const lookup: Record<string, LookupCandidate[]> = JSON.parse(fs.readFileSync(lookupPath, 'utf-8'))
const metadata: MetadataRow[] = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
const metadataByFilename = new Map(metadata.map(item => [item.filename, item]))

const pool = new Pool({ connectionString })

function normalize(word: string) {
  return word.trim().toLowerCase()
}

function tokenize(word: string) {
  return normalize(word)
    .replace(/[^a-z0-9' ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function scoreCandidate(word: string, candidate: LookupCandidate, isExact: boolean) {
  const lowerWord = normalize(word)
  const categories = (candidate.categories || []).map(c => c.toLowerCase())
  const filename = candidate.filename.toLowerCase()
  let score = 0
  if (isExact) score += 100
  if (filename.includes(lowerWord.replace(/\s+/g, '_'))) score += 25
  if (categories.some(c => c.includes('core vocabulary'))) score += 15
  if (categories.includes('verb') || categories.includes('usual verbs')) score += 8
  return score
}

function buildCandidates(word: string, limit = 8): Candidate[] {
  const key = normalize(word)
  const bucket = new Map<string, Candidate>()

  const exact = lookup[key] || []
  for (const c of exact) {
    const meta = metadataByFilename.get(c.filename)
    bucket.set(c.filename, {
      filename: c.filename,
      arasaac_id: c.id,
      score: scoreCandidate(word, c, true),
      categories: c.categories || [],
      keywords: meta?.keywords || []
    })
  }

  const tokens = tokenize(word)
  for (const token of tokens) {
    const list = lookup[token] || []
    for (const c of list.slice(0, 30)) {
      const meta = metadataByFilename.get(c.filename)
      const prev = bucket.get(c.filename)
      const nextScore = scoreCandidate(word, c, false)
      if (!prev || nextScore > prev.score) {
        bucket.set(c.filename, {
          filename: c.filename,
          arasaac_id: c.id,
          score: Math.max(prev?.score || 0, nextScore),
          categories: c.categories || [],
          keywords: meta?.keywords || []
        })
      }
    }
  }

  return Array.from(bucket.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function buildHtml(items: any[], baseUrl: string) {
  const data = JSON.stringify(items).replace(/</g, '\\u003c')
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Core Word Manual Mapping</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 20px; background: #f8fafc; color: #111827; }
h1 { margin: 0 0 8px; }
.desc { color: #4b5563; margin-bottom: 16px; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; margin-bottom: 14px; }
.word { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
.word small { font-size: 14px; color: #6b7280; margin-left: 8px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
.opt { border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; background: #fff; }
.opt img { width: 100%; height: 110px; object-fit: contain; background: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb; }
.opt .meta { font-size: 11px; color: #4b5563; margin-top: 6px; word-break: break-word; }
.actions { position: sticky; top: 0; background: #f8fafc; padding: 12px 0; margin-bottom: 14px; }
button { background: #0f766e; color: white; border: 0; border-radius: 8px; padding: 10px 14px; font-weight: 600; cursor: pointer; }
pre { background: #111827; color: #f9fafb; padding: 12px; border-radius: 8px; overflow: auto; max-height: 260px; }
</style>
</head>
<body>
  <h1>Core Words Manual Symbol Mapping</h1>
  <p class="desc">Select one symbol per word. Then export JSON and run apply script.</p>
  <div class="actions">
    <button id="export">Export Selected JSON</button>
  </div>
  <div id="list"></div>
  <h3>Export Preview</h3>
  <pre id="out">[]</pre>
<script>
const data = ${data};
const base = ${JSON.stringify(baseUrl)};
const selected = new Map();
const list = document.getElementById('list');
const out = document.getElementById('out');

function refreshOut() {
  const rows = data
    .map(item => ({ id: item.id, word_en: item.word_en, symbol_key: selected.get(item.id) || null }))
    .filter(x => x.symbol_key);
  out.textContent = JSON.stringify(rows, null, 2);
}

for (const item of data) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('div');
  title.className = 'word';
  title.innerHTML = item.word_en + (item.word_zh ? '<small>' + item.word_zh + '</small>' : '');
  card.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'grid';

  for (const cand of item.candidates) {
    const box = document.createElement('label');
    box.className = 'opt';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'w_' + item.id;
    input.value = cand.filename;
    input.onchange = () => {
      selected.set(item.id, cand.filename);
      refreshOut();
    };

    const img = document.createElement('img');
    img.src = base + '/symbols/arasaac/raw/' + encodeURIComponent(cand.filename);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = cand.filename + ' | score=' + cand.score;

    box.appendChild(input);
    box.appendChild(img);
    box.appendChild(meta);
    grid.appendChild(box);
  }

  card.appendChild(grid);
  list.appendChild(card);
}

document.getElementById('export').onclick = () => {
  const rows = data
    .map(item => ({ id: item.id, word_en: item.word_en, symbol_key: selected.get(item.id) || null }))
    .filter(x => x.symbol_key);
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'coreword-manual-mapping.selected.json';
  a.click();
};

refreshOut();
</script>
</body>
</html>`
}

async function run() {
  const client = await pool.connect()
  try {
    const result = await client.query<UnmappedWord>(
      `SELECT id, word_en, word_zh
       FROM vocabulary_items
       WHERE type = 'core' AND is_active = true AND (symbol_key IS NULL OR symbol_key = '')
       ORDER BY id ASC`
    )

    const baseUrl = (process.env.BACKEND_PUBLIC_BASE_URL || 'http://127.0.0.1:3001').replace(/\/$/, '')
    const rows = result.rows.map(row => ({
      ...row,
      candidates: buildCandidates(row.word_en)
    }))

    fs.writeFileSync(outputJsonPath, JSON.stringify(rows, null, 2), 'utf-8')
    fs.writeFileSync(outputHtmlPath, buildHtml(rows, baseUrl), 'utf-8')

    console.log(`Generated candidate JSON: ${outputJsonPath}`)
    console.log(`Generated review HTML: ${outputHtmlPath}`)
    console.log(`Unmapped words: ${rows.length}`)
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch(error => {
  console.error('Failed to prepare manual mapping', error)
  process.exit(1)
})
