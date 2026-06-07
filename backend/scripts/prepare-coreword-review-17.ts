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

const outputJsonPath = path.join(__dirname, 'coreword-review-17.candidates.json')
const outputHtmlPath = path.join(__dirname, 'coreword-review-17.html')
const metadataPath = path.join(__dirname, '../assets/symbols/arasaac/raw/meta/metadata.en.json')
const priorCandidatesPath = path.join(__dirname, 'coreword-manual-mapping.candidates.json')

type MetadataRow = { filename: string; keywords?: string[]; categories?: string[] }
type DbWord = { id: number; word_en: string; word_zh: string | null; symbol_key: string | null }
type Candidate = { filename: string; reason: string; score: number }

const reviewIds = [26, 65, 90, 100, 102, 103, 106, 107, 108, 121, 157, 159, 160, 166, 180, 186, 199]

const searchTerms: Record<number, string[]> = {
  26: ['each', 'every', 'all'],
  65: ['wake up', 'wake', 'awake'],
  90: ['pull', 'tug', 'drag'],
  100: ['cannot', 'can not', 'unable', 'not able', 'no'],
  102: ['should', 'must', 'need'],
  103: ['need to', 'need', 'must'],
  106: ['not', 'no'],
  107: ["don't", 'do not', 'not want'],
  108: ["can't", 'cannot', 'unable'],
  121: ['loud', 'noisy'],
  157: ['down', 'descend', 'lower'],
  159: ['off', 'turn off', 'switch off'],
  160: ['away', 'far', 'run away'],
  166: ['into', 'inside', 'in'],
  180: ['which', 'what'],
  186: ['excuse me', 'sorry', 'pardon'],
  199: ['all done', 'finished', 'finish', 'done']
}

const metadata: MetadataRow[] = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
const priorCandidates = fs.existsSync(priorCandidatesPath)
  ? JSON.parse(fs.readFileSync(priorCandidatesPath, 'utf-8'))
  : []
const priorById = new Map<number, any>(priorCandidates.map((row: any) => [Number(row.id), row]))

function scoreByTerms(item: MetadataRow, terms: string[]) {
  const filename = item.filename.toLowerCase()
  const kws = (item.keywords || []).map(k => k.toLowerCase())
  let score = 0
  for (const term of terms) {
    const t = term.toLowerCase()
    const tFile = t.replace(/\s+/g, '_').replace(/'/g, '')
    if (filename.includes(tFile)) score += 6
    if (kws.some(k => k === t)) score += 8
    if (kws.some(k => k.includes(t))) score += 3
  }
  return score
}

function collectCandidates(word: DbWord): Candidate[] {
  const terms = searchTerms[word.id] || [word.word_en]
  const out = new Map<string, Candidate>()

  if (word.symbol_key) {
    out.set(word.symbol_key, { filename: word.symbol_key, reason: 'current', score: 100 })
  }

  const prior = priorById.get(word.id)
  if (prior?.candidates?.length) {
    for (const c of prior.candidates.slice(0, 8)) {
      if (!out.has(c.filename)) {
        out.set(c.filename, { filename: c.filename, reason: 'prior-candidate', score: Number(c.score || 40) })
      }
    }
  }

  for (const item of metadata) {
    const score = scoreByTerms(item, terms)
    if (score <= 0) continue
    const prev = out.get(item.filename)
    if (!prev || score > prev.score) {
      out.set(item.filename, { filename: item.filename, reason: 'term-match', score })
    }
  }

  return Array.from(out.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
}

function buildHtml(items: Array<DbWord & { candidates: Candidate[] }>, baseUrl: string) {
  const data = JSON.stringify(items).replace(/</g, '\\u003c')
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Core Word Review 17</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 18px; background: #f8fafc; color: #0f172a; }
    h1 { margin: 0; }
    p { margin: 6px 0 14px; color: #475569; }
    .bar { position: sticky; top: 0; background: #f8fafc; padding: 10px 0; z-index: 5; display: flex; gap: 8px; align-items: center; }
    button { border: 0; border-radius: 10px; background: #0f766e; color: white; padding: 10px 14px; font-weight: 700; cursor: pointer; }
    .muted { background: #334155; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-bottom: 14px; }
    .title { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
    .sub { color: #64748b; font-size: 12px; margin-bottom: 10px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
    .opt { border: 1px solid #cbd5e1; border-radius: 10px; padding: 6px; background: #fff; }
    .opt img { width: 100%; height: 110px; object-fit: contain; background: #f1f5f9; border-radius: 8px; }
    .meta { margin-top: 5px; font-size: 11px; color: #475569; word-break: break-all; }
    pre { background: #0f172a; color: #e2e8f0; border-radius: 10px; padding: 10px; max-height: 280px; overflow: auto; }
  </style>
</head>
<body>
  <h1>Core Words 17 Review</h1>
  <p>Review and adjust only the 17 manually mapped words. Export JSON and apply with script.</p>
  <div class="bar">
    <button id="export">Export Selected JSON</button>
    <button id="current" class="muted">Export Current-as-is</button>
  </div>
  <div id="list"></div>
  <h3>Export Preview</h3>
  <pre id="out">[]</pre>

  <script>
    const data = ${data};
    const base = ${JSON.stringify(baseUrl)};
    const selected = new Map();
    data.forEach(item => { if (item.symbol_key) selected.set(item.id, item.symbol_key); });

    const list = document.getElementById('list');
    const out = document.getElementById('out');
    const renderOut = () => {
      const rows = data.map(item => ({ id: item.id, word_en: item.word_en, symbol_key: selected.get(item.id) || null })).filter(x => x.symbol_key);
      out.textContent = JSON.stringify(rows, null, 2);
    };

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = '<div class="title">' + item.word_en + (item.word_zh ? ' <span style="font-size:13px;color:#64748b;">' + item.word_zh + '</span>' : '') + '</div>' +
                       '<div class="sub">Current: ' + (item.symbol_key || '(none)') + '</div>';

      const grid = document.createElement('div');
      grid.className = 'grid';

      item.candidates.forEach(c => {
        const box = document.createElement('label');
        box.className = 'opt';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'word_' + item.id;
        input.value = c.filename;
        if ((selected.get(item.id) || '') === c.filename) input.checked = true;
        input.onchange = () => { selected.set(item.id, c.filename); renderOut(); };

        const img = document.createElement('img');
        img.src = base + '/symbols/arasaac/raw/' + encodeURIComponent(c.filename);
        img.alt = c.filename;

        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = c.filename + ' | ' + c.reason + ' | score=' + c.score;

        box.appendChild(input);
        box.appendChild(img);
        box.appendChild(meta);
        grid.appendChild(box);
      });

      card.appendChild(grid);
      list.appendChild(card);
    });

    document.getElementById('export').onclick = () => {
      const rows = data.map(item => ({ id: item.id, word_en: item.word_en, symbol_key: selected.get(item.id) || null })).filter(x => x.symbol_key);
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'coreword-manual-mapping.selected.json';
      a.click();
    };

    document.getElementById('current').onclick = () => {
      const rows = data.map(item => ({ id: item.id, word_en: item.word_en, symbol_key: item.symbol_key || null })).filter(x => x.symbol_key);
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'coreword-manual-mapping.selected.json';
      a.click();
    };

    renderOut();
  </script>
</body>
</html>`
}

async function run() {
  const pool = new Pool({ connectionString })
  const client = await pool.connect()
  try {
    const result = await client.query<DbWord>(
      `SELECT id, word_en, word_zh, symbol_key
       FROM vocabulary_items
       WHERE type = 'core' AND is_active = true AND id = ANY($1::bigint[])
       ORDER BY id ASC`,
      [reviewIds]
    )

    const rows = result.rows.map(row => ({
      ...row,
      candidates: collectCandidates(row)
    }))

    fs.writeFileSync(outputJsonPath, JSON.stringify(rows, null, 2), 'utf-8')
    const baseUrl = (process.env.BACKEND_PUBLIC_BASE_URL || 'http://127.0.0.1:3001').replace(/\/$/, '')
    fs.writeFileSync(outputHtmlPath, buildHtml(rows, baseUrl), 'utf-8')

    console.log(`Generated review JSON: ${outputJsonPath}`)
    console.log(`Generated review HTML: ${outputHtmlPath}`)
    console.log(`Rows: ${rows.length}`)
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch(error => {
  console.error('Failed to prepare 17-word review', error)
  process.exit(1)
})

