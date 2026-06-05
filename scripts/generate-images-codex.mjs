#!/usr/bin/env node
/**
 * Nightly image generation via Codex CLI.
 * Fetches words with missing images from Neon DB, calls `codex exec` for each,
 * copies the generated image to backend/public/images/, updates image_url in DB.
 *
 * Run manually: node scripts/generate-images-codex.mjs
 * Scheduled via launchd: com.elearning.imagegen.plist
 */

import { spawn } from 'child_process';
import { readdirSync, existsSync, mkdirSync, copyFileSync } from 'fs';
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

const CODEX_IMAGES_DIR = resolve(process.env.HOME, '.codex/generated_images');
const OUTPUT_DIR = join(ROOT, 'backend/public/images');
const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3002';

// How long to wait for codex to finish generating (ms)
const CODEX_TIMEOUT_MS = 120_000;

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

function listSessions() {
  if (!existsSync(CODEX_IMAGES_DIR)) return [];
  return readdirSync(CODEX_IMAGES_DIR).sort();
}

function findImageInSession(sessionDir) {
  const full = join(CODEX_IMAGES_DIR, sessionDir);
  if (!existsSync(full)) return null;
  const files = readdirSync(full).filter(f => /\.(png|jpg|webp)$/i.test(f));
  return files.length > 0 ? join(full, files[0]) : null;
}

function buildPrompt(word, chinese) {
  return `Use imagegen to create a photo-realistic image for an English learning flashcard. This image will be shown to a young child (age 3-5) to help them learn to speak English and understand the real world.

Word: "${word}" (${chinese})

Requirements:
- Photo-realistic style, like a real photograph
- Show exactly ONE clear subject: ${word} — nothing else competing for attention
- The subject fills most of the frame, centered
- Natural real-world context (e.g. on a table, in a hand, in its natural environment)
- Bright, warm, natural lighting — welcoming and friendly
- Clean simple background that does not distract from the subject
- No text, no watermarks, no cartoon style, no illustrations
- The image must be instantly and unambiguously recognizable as "${word}" to a 3-5 year old child who is learning about the real world

Generate the image directly. Do not explain or provide text output.`;
}

async function callCodex(word, chinese) {
  const prompt = buildPrompt(word, chinese);
  const knownSessions = new Set(listSessions());
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const child = spawn('codex', [
      'exec',
      '--ephemeral',
      '--skip-git-repo-check',
      '--sandbox', 'read-only',
      '--color', 'never',
      '-'
    ], { cwd: ROOT });

    let stdout = '';
    let stderr = '';

    child.stdin.write(prompt, 'utf-8');
    child.stdin.end();

    child.stdout.on('data', d => { stdout += d.toString(); });
    child.stderr.on('data', d => { stderr += d.toString(); });

    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`Codex timed out after ${CODEX_TIMEOUT_MS / 1000}s for "${word}"`));
    }, CODEX_TIMEOUT_MS);

    child.on('close', code => {
      clearTimeout(timer);

      // Method 1: parse image path directly from stdout
      const match = stdout.match(/generated_images\/([\w-]+)\/([\w.-]+\.(?:png|jpg|webp))/i);
      if (match) {
        const imagePath = join(CODEX_IMAGES_DIR, match[1], match[2]);
        if (existsSync(imagePath)) return resolve(imagePath);
      }

      // Method 2: find new session directory created after we started
      const newSessions = listSessions().filter(s => !knownSessions.has(s));
      if (newSessions.length > 0) {
        // Sort by ULID proximity to startTime (ULIDs are lexicographically time-ordered)
        newSessions.sort();
        for (const session of newSessions.reverse()) {
          const img = findImageInSession(session);
          if (img) return resolve(img);
        }
      }

      reject(new Error(`No image found for "${word}" (exit ${code})\nstdout: ${stdout.slice(0, 500)}`));
    });
  });
}

async function processWord(row) {
  const { id, word, chinese } = row;
  console.log(`\n[${word}] Generating image...`);

  const imagePath = await callCodex(word, chinese || word);
  console.log(`[${word}] Image generated: ${imagePath}`);

  const ext = imagePath.match(/\.(png|jpg|webp)$/i)?.[0] || '.png';
  const destFilename = `word-${id}${ext}`;
  const destPath = join(OUTPUT_DIR, destFilename);

  copyFileSync(imagePath, destPath);
  console.log(`[${word}] Copied to ${destPath}`);

  const imageUrl = `${BACKEND_BASE_URL}/images/${destFilename}`;
  await sql`UPDATE words SET image_url = ${imageUrl} WHERE id = ${id}`;
  console.log(`[${word}] DB updated: ${imageUrl}`);

  return imageUrl;
}

async function main() {
  console.log('=== Nightly Image Generation (Codex CLI) ===');
  console.log(`Started: ${new Date().toISOString()}`);

  const rows = await sql`
    SELECT id, word, chinese
    FROM words
    WHERE is_active = true
      AND (image_url IS NULL OR image_url = '')
    ORDER BY id ASC
  `;

  console.log(`Found ${rows.length} words without images`);

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
      // Small pause between calls to avoid hammering codex
      await new Promise(r => setTimeout(r, 3000));
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
