import fs from 'fs';
import { chromium } from 'playwright';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:3001';
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function safeFetch(url, options = undefined) {
  try {
    return await fetch(url, options);
  } catch (error) {
    throw new Error(`fetch failed: ${url} :: ${error?.message || error}`);
  }
}

async function checkApi() {
  const healthRes = await safeFetch(`${BACKEND_URL}/api/health/db`);
  if (!healthRes.ok) throw new Error(`health/db API failed: ${healthRes.status}`);
  const healthJson = await healthRes.json();
  if (!healthJson.ok) throw new Error('health/db returned not ok');

  const coreRes = await safeFetch(`${BACKEND_URL}/api/home/core-words?scene=home`);
  if (!coreRes.ok) throw new Error(`core-words API failed: ${coreRes.status}`);
  const coreJson = await coreRes.json();
  const count = Array.isArray(coreJson.items) ? coreJson.items.length : 0;

  const ttsRes = await safeFetch(`${BACKEND_URL}/api/tts?text=hello`);
  if (!ttsRes.ok) throw new Error(`tts API failed: ${ttsRes.status}`);
  const ttsJson = await ttsRes.json();
  if (!ttsJson.url) throw new Error('tts API missing url');

  const recRes = await safeFetch(`${BACKEND_URL}/api/home/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scene: 'home', recentWords: ['I'] })
  });
  if (!recRes.ok) throw new Error(`recommendations API failed: ${recRes.status}`);
  const recJson = await recRes.json();
  const recCount = Array.isArray(recJson.recommendedIds) ? recJson.recommendedIds.length : 0;

  const shownRes = await safeFetch(`${BACKEND_URL}/api/recommendations/shown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scene: 'home', recommendedIds: recJson.recommendedIds || [], recentWords: ['I'] })
  });
  if (!shownRes.ok) throw new Error(`recommendations shown API failed: ${shownRes.status}`);

  return { healthOk: healthJson.ok, coreCount: count, ttsUrl: ttsJson.url, recCount };
}

async function checkUi() {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME_PATH });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);

  const home = await page.evaluate(() => {
    const title = Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.trim() === 'Core Words');
    const section = title?.closest('section');
    const buttons = section ? Array.from(section.querySelectorAll('button')) : [];
    const hasFixed = !!Array.from(section?.querySelectorAll('div') || []).find(n => n.textContent?.includes('固定区'));
    const hasDynamic = !!Array.from(section?.querySelectorAll('div') || []).find(n => n.textContent?.includes('动态区'));
    const hasScrollbar = !!section?.querySelector('.overflow-y-auto');
    const hint = section ? Array.from(section.querySelectorAll('div')).find(n => n.textContent?.includes('先选主语') || n.textContent?.includes('下一步推荐'))?.textContent || '' : '';
    const hasSpeakSentence = buttons.some((btn) => (btn.textContent || '').includes('朗读整句'));
    const hasUndoSentence = buttons.some((btn) => (btn.textContent || '').includes('撤销'));
    return { coreButtons: buttons.length, hasFixed, hasDynamic, hasScrollbar, hint, hasSpeakSentence, hasUndoSentence };
  });

  // Verify dynamic guidance changes after selecting "I"
  const clickedI = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const target = buttons.find((btn) => {
      const text = (btn.textContent || '').replace(/\s+/g, ' ').trim();
      return text.startsWith('I');
    });
    if (!target) return false;
    target.click();
    return true;
  });
  if (!clickedI) {
    throw new Error('core word "I" button not found');
  }
  await page.waitForTimeout(700);
  const afterI = await page.evaluate(() => {
    const allDivText = Array.from(document.querySelectorAll('div')).map((n) => n.textContent || '');
    const hint = allDivText.find((text) => text.includes('下一步推荐动作词')) || '';

    const sectionTitle = Array.from(document.querySelectorAll('h2')).find((h) => h.textContent?.trim() === 'Core Words');
    const section = sectionTitle?.closest('section');
    const buttons = section ? Array.from(section.querySelectorAll('button')) : [];
    const coreButtons = buttons.filter((btn) => !(btn.textContent || '').includes('清空'));
    const dynamicButtons = coreButtons.slice(18, 36);
    const dynamicWords = dynamicButtons
      .map((btn) => ((btn.textContent || '').replace(/\s+/g, ' ').trim().match(/^[A-Za-z][A-Za-z ]*/) || [''])[0].trim().toLowerCase())
      .filter(Boolean);

    return { hint, dynamicWords: dynamicWords.slice(0, 6) };
  });

  if (!afterI.hint) {
    throw new Error('dynamic hint did not update after selecting I');
  }

  const verbSet = new Set([
    'want', 'need', 'like', 'love', 'go', 'come', 'get', 'give', 'take', 'put', 'make', 'do', 'have', 'be',
    'see', 'look', 'hear', 'listen', 'feel', 'think', 'know', 'say', 'tell', 'ask', 'help', 'stop', 'start',
    'finish', 'wait', 'play', 'work', 'eat', 'drink', 'sleep', 'wake', 'wash', 'clean', 'open', 'close', 'turn'
  ]);
  const verbCount = afterI.dynamicWords.filter((w) => verbSet.has(w)).length;
  if (verbCount < 3) {
    throw new Error(`dynamic ordering weak after selecting I: verbs_in_top6=${verbCount}, words=${afterI.dynamicWords.join(',')}`);
  }

  // Verify density persistence and rendering for 8x8
  const densityCheck = await page.evaluate(() => {
    localStorage.setItem('coreGridDensity', '8x8');
    return localStorage.getItem('coreGridDensity');
  });
  if (densityCheck !== '8x8') {
    throw new Error('failed to persist 8x8 density');
  }
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const coreButtons8x8 = await page.evaluate(() => {
    const title = Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.trim() === 'Core Words');
    const section = title?.closest('section');
    return section ? Array.from(section.querySelectorAll('button')).length : 0;
  });
  if (coreButtons8x8 !== 64) {
    throw new Error(`8x8 density render mismatch: coreButtons=${coreButtons8x8}`);
  }
  await page.evaluate(() => localStorage.setItem('coreGridDensity', '6x6'));

  await page.getByRole('button', { name: /settings/i }).first().click();
  await page.waitForTimeout(900);

  const persisted = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    const target = inputs[2];
    if (!target) return { ok: false, reason: 'guard toggle missing' };
    const before = target.checked;
    const label = target.closest('label');
    if (!label) return { ok: false, reason: 'guard label missing' };
    label.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const stored = localStorage.getItem('fixedLongPressGuardEnabled');
    return { ok: true, before, stored };
  });

  await browser.close();
  return { home, afterI, persisted };
}

async function main() {
  const api = await checkApi();
  const ui = await checkUi();

  const report = {
    timestamp: new Date().toISOString(),
    frontend: FRONTEND_URL,
    backend: BACKEND_URL,
    api,
    ui
  };

  const outPath = '/Users/eric/Desktop/secondme/projects/Audrey2.0/output/playwright/smoke-corewords.json';
  fs.mkdirSync('/Users/eric/Desktop/secondme/projects/Audrey2.0/output/playwright', { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(JSON.stringify(report));
}

main().catch((error) => {
  console.error('[smoke-corewords] failed:', error.message || error);
  process.exit(1);
});
