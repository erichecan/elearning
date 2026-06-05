#!/usr/bin/env node
/**
 * Nightly audio generation via Edge TTS.
 * Fetches words with missing audio from Neon DB, calls edge-tts for each,
 * saves mp3 to backend/public/audio/, updates audio_url in DB.
 *
 * Run manually: node scripts/generate-audio.mjs
 * Scheduled via launchd: runs after generate-images-codex.mjs
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

dotenv.config({ path: join(ROOT, '.env') });
dotenv.config({ path: join(ROOT, '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set. Check .env or .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const OUTPUT_DIR = join(ROOT, 'backend/public/audio');
const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const VOICE = 'en-US-JennyNeural';

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

function generateMp3(text, outputPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('edge-tts', [
      '--voice', VOICE,
      '--text', text,
      '--write-media', outputPath,
    ]);

    let stderr = '';
    child.stderr.on('data', d => { stderr += d.toString(); });

    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`edge-tts timed out for "${text}"`));
    }, 30_000);

    child.on('close', code => {
      clearTimeout(timer);
      if (code === 0 && existsSync(outputPath)) {
        resolve();
      } else {
        reject(new Error(`edge-tts exited ${code} for "${text}": ${stderr.slice(0, 200)}`));
      }
    });
  });
}

async function processWord(row) {
  const { id, word } = row;
  console.log(`[${word}] Generating audio...`);

  const destFilename = `word-${id}.mp3`;
  const destPath = join(OUTPUT_DIR, destFilename);

  await generateMp3(word, destPath);
  console.log(`[${word}] Saved: ${destPath}`);

  const audioUrl = `${BACKEND_BASE_URL}/audio/${destFilename}`;
  await sql`UPDATE words SET audio_url = ${audioUrl} WHERE id = ${id}`;
  console.log(`[${word}] DB updated: ${audioUrl}`);

  return audioUrl;
}

async function main() {
  console.log('=== Nightly Audio Generation (Edge TTS / Jenny) ===');
  console.log(`Started: ${new Date().toISOString()}`);

  const rows = await sql`
    SELECT id, word
    FROM words
    WHERE is_active = true
      AND (audio_url IS NULL OR audio_url = '')
    ORDER BY id ASC
  `;

  console.log(`Found ${rows.length} words without audio`);

  if (rows.length === 0) {
    console.log('Nothing to do. Exiting.');
    return;
  }

  let succeeded = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      await processWord(row);
      succeeded++;
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`[${row.word}] FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=== Done: ${succeeded} succeeded, ${failed} failed ===`);
  console.log(`Finished: ${new Date().toISOString()}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
