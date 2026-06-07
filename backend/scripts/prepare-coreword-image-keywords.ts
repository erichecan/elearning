import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { Pool } from '@neondatabase/serverless'

dotenv.config({ path: path.join(__dirname, '../.env') })

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set. Please check your .env file.')
  process.exit(1)
}

const outputPath = path.join(__dirname, 'coreword-image-keywords.json')
const outputHtml = path.join(__dirname, 'coreword-image-keywords.html')

async function run() {
  const pool = new Pool({ connectionString })
  try {
    const result = await pool.query(
      `SELECT id, word_en, word_zh FROM vocabulary_items WHERE type = 'core' AND is_active = true ORDER BY id ASC`
    )

    const rows = result.rows.map((row: any) => ({
      id: Number(row.id),
      word_en: row.word_en,
      word_zh: row.word_zh || '',
      query: row.word_en
    }))

    const payload = { generatedAt: new Date().toISOString(), items: rows }
    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2))

    const html = `<!doctype html>
<html lang="zh">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Core Words 图片关键词编辑</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; padding: 24px; background: #f5f5f5; }
      h1 { margin: 0 0 8px; }
      .meta { color: #666; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; background: #fff; }
      th, td { border: 1px solid #e0e0e0; padding: 8px; font-size: 14px; }
      th { background: #fafafa; text-align: left; }
      input { width: 100%; padding: 6px 8px; border: 1px solid #ddd; border-radius: 6px; }
      .actions { margin: 16px 0; display: flex; gap: 12px; }
      button { padding: 8px 14px; border: none; border-radius: 6px; background: #2563eb; color: #fff; cursor: pointer; }
      button.secondary { background: #64748b; }
      textarea { width: 100%; height: 140px; margin-top: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    </style>
  </head>
  <body>
    <h1>Core Words 图片关键词编辑</h1>
    <div class="meta">生成时间: ${payload.generatedAt} | 总数: ${rows.length}</div>
    <div class="actions">
      <button onclick="exportJson()">下载 JSON</button>
      <button class="secondary" onclick="copyJson()">复制 JSON</button>
    </div>
    <table id="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>英文</th>
          <th>中文</th>
          <th>搜索关键词 (query)</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            <td>${row.id}</td>
            <td>${row.word_en}</td>
            <td>${row.word_zh}</td>
            <td><input data-id="${row.id}" value="${row.query.replace(/"/g, '&quot;')}" /></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <textarea id="jsonOutput" readonly></textarea>
    <script>
      const original = ${JSON.stringify(payload)};
      function buildPayload() {
        const inputs = Array.from(document.querySelectorAll('input[data-id]'));
        const map = new Map(inputs.map(input => [Number(input.dataset.id), input.value.trim()]));
        const items = original.items.map(item => ({ ...item, query: map.get(item.id) || item.query }));
        return { generatedAt: original.generatedAt, items };
      }
      function exportJson() {
        const payload = buildPayload();
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'coreword-image-keywords.json';
        a.click();
        URL.revokeObjectURL(url);
        document.getElementById('jsonOutput').value = JSON.stringify(payload, null, 2);
      }
      function copyJson() {
        const payload = buildPayload();
        const text = JSON.stringify(payload, null, 2);
        navigator.clipboard.writeText(text);
        document.getElementById('jsonOutput').value = text;
      }
    </script>
  </body>
</html>`;

    fs.writeFileSync(outputHtml, html)
    console.log(`Wrote ${rows.length} keyword entries to ${outputPath}`)
    console.log(`Open in browser to edit: ${outputHtml}`)
  } finally {
    await pool.end()
  }
}

run().catch((error) => {
  console.error('Failed to prepare keywords', error)
  process.exit(1)
})
