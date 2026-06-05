#!/usr/bin/env node
/**
 * Seed sentences for all words, then generate Jenny audio for each sentence.
 * Run: node scripts/seed-sentences.mjs
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
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = neon(DATABASE_URL);

const OUTPUT_DIR = join(ROOT, 'backend/public/audio');
const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const VOICE = 'en-US-JennyNeural';

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

// word → [sentence, sentence_cn]
const SENTENCES = {
  // Fruits & Veggies
  apple:       ['I eat a red apple.',                    '我吃一个红苹果。'],
  banana:      ['The banana is yellow and soft.',        '香蕉是黄色的，软软的。'],
  orange:      ['I peel the orange with my hands.',      '我用手剥橙子皮。'],
  grape:       ['These grapes are sweet.',               '这些葡萄很甜。'],
  strawberry:  ['The strawberry is red and yummy.',      '草莓是红色的，很好吃。'],
  watermelon:  ['We eat watermelon in summer.',          '夏天我们吃西瓜。'],
  carrot:      ['Rabbits love to eat carrots.',          '兔子喜欢吃胡萝卜。'],
  tomato:      ['The tomato is round and red.',          '番茄是圆圆的，红红的。'],
  // Animals
  cat:         ['The cat is sleeping on the sofa.',      '猫在沙发上睡觉。'],
  dog:         ['The dog is wagging its tail.',          '狗在摇尾巴。'],
  bird:        ['The bird is singing in the tree.',      '鸟在树上唱歌。'],
  fish:        ['The fish swims in the water.',          '鱼在水里游泳。'],
  rabbit:      ['The rabbit has big soft ears.',         '兔子有大大的软耳朵。'],
  elephant:    ['The elephant has a very long nose.',    '大象有很长的鼻子。'],
  lion:        ['The lion roars very loudly.',           '狮子叫得很响。'],
  penguin:     ['The penguin loves cold weather.',       '企鹅喜欢冷天气。'],
  // Family
  mother:      ['My mother gives me a big hug.',         '妈妈给了我一个大大的拥抱。'],
  father:      ['My father reads me a bedtime story.',   '爸爸给我讲睡前故事。'],
  sister:      ['My sister and I play together.',        '我和姐姐一起玩。'],
  brother:     ['My brother makes me laugh.',            '哥哥让我笑。'],
  grandma:     ['Grandma makes yummy cookies.',          '奶奶做好吃的饼干。'],
  grandpa:     ['Grandpa takes me to the park.',         '爷爷带我去公园。'],
  // Small Numbers
  one:         ['I have one apple.',                     '我有一个苹果。'],
  two:         ['I have two hands.',                     '我有两只手。'],
  three:       ['There are three little birds.',         '有三只小鸟。'],
  four:        ['I see four cats.',                      '我看到四只猫。'],
  five:        ['I have five fingers on each hand.',     '每只手有五根手指。'],
  six:         ['There are six eggs in the basket.',     '篮子里有六个鸡蛋。'],
  seven:       ['I count seven stars in the sky.',       '我数到天上有七颗星星。'],
  eight:       ['The spider has eight legs.',            '蜘蛛有八条腿。'],
  nine:        ['Nine little ducks are swimming.',       '九只小鸭子在游泳。'],
  ten:         ['I can count all the way to ten.',       '我能从一数到十。'],
  // Colors
  red:         ['The apple is red.',                     '苹果是红色的。'],
  blue:        ['The sky is bright blue.',               '天空是明亮的蓝色。'],
  green:       ['The grass is green.',                   '草是绿色的。'],
  yellow:      ['The sun is big and yellow.',            '太阳又大又黄。'],
  orange:      ['The pumpkin is orange.',                '南瓜是橙色的。'],
  purple:      ['The grapes are purple.',                '葡萄是紫色的。'],
  pink:        ['The flower is pretty and pink.',        '花是漂亮的粉色。'],
  white:       ['The cloud is white and fluffy.',        '云是白色蓬松的。'],
  black:       ['The night sky is black.',               '夜空是黑色的。'],
  // Clothes
  shirt:       ['I wear a blue shirt today.',            '我今天穿一件蓝色衬衫。'],
  pants:       ['My pants have two big pockets.',        '我的裤子有两个大口袋。'],
  shoes:       ['I put on my shoes by myself.',          '我自己穿上鞋子。'],
  hat:         ['I wear a hat when it is sunny.',        '晴天我戴帽子。'],
  dress:       ['She wears a pretty pink dress.',        '她穿一条漂亮的粉色裙子。'],
  socks:       ['My socks keep my feet warm.',           '袜子让我的脚保持温暖。'],
  // My Body
  head:        ['I shake my head to say no.',            '我摇摇头表示不。'],
  eyes:        ['I close my eyes to go to sleep.',       '我闭上眼睛去睡觉。'],
  nose:        ['I smell flowers with my nose.',         '我用鼻子闻花香。'],
  mouth:       ['I open my mouth to eat.',               '我张开嘴巴吃东西。'],
  ears:        ['I hear music with my ears.',            '我用耳朵听音乐。'],
  hands:       ['I wash my hands before eating.',        '吃饭前我洗手。'],
  feet:        ['I jump with my feet.',                  '我用脚跳跳。'],
  // Vehicles
  car:         ['Dad drives the car to work.',           '爸爸开车去上班。'],
  bus:         ['I take the bus to school.',             '我坐公共汽车去学校。'],
  train:       ['The train goes very fast.',             '火车开得很快。'],
  airplane:    ['The airplane flies high in the sky.',   '飞机在高空飞翔。'],
  bicycle:     ['I ride my bicycle in the park.',        '我在公园里骑自行车。'],
  boat:        ['The boat floats on the water.',         '船在水上漂。'],
  // Feelings
  happy:       ['I am happy when I play with you.',      '和你玩的时候我很开心。'],
  sad:         ['I feel sad when I miss Mommy.',         '想妈妈的时候我很难过。'],
  angry:       ['I feel angry when someone takes my toy.', '有人拿走我的玩具我会生气。'],
  scared:      ['I feel scared when it is dark.',        '黑暗的时候我很害怕。'],
  tired:       ['I am tired and want to sleep.',         '我很累，想睡觉。'],
  excited:     ['I am so excited about my birthday!',   '我对生日感到非常兴奋！'],
};

function generateMp3(text, outputPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('edge-tts', ['--voice', VOICE, '--text', text, '--write-media', outputPath]);
    let stderr = '';
    child.stderr.on('data', d => { stderr += d.toString(); });
    const timer = setTimeout(() => { child.kill(); reject(new Error(`timeout for: ${text}`)); }, 30_000);
    child.on('close', code => {
      clearTimeout(timer);
      if (code === 0 && existsSync(outputPath)) resolve();
      else reject(new Error(`exit ${code}: ${stderr.slice(0, 200)}`));
    });
  });
}

async function main() {
  console.log('=== Seeding sentences + generating audio ===');

  const rows = await sql`SELECT id, word FROM words WHERE is_active = true ORDER BY id`;
  console.log(`Found ${rows.length} words\n`);

  let ok = 0, skip = 0, fail = 0;

  for (const { id, word } of rows) {
    const entry = SENTENCES[word];
    if (!entry) {
      console.log(`[${word}] no sentence defined — skipping`);
      skip++;
      continue;
    }
    const [sentence, sentence_cn] = entry;

    // Update sentence text
    await sql`UPDATE words SET sentence = ${sentence}, sentence_cn = ${sentence_cn} WHERE id = ${id}`;

    // Generate audio
    const filename = `sentence-${id}.mp3`;
    const destPath = join(OUTPUT_DIR, filename);
    try {
      await generateMp3(sentence, destPath);
      const audioUrl = `${BACKEND_BASE_URL}/audio/${filename}`;
      await sql`UPDATE words SET sentence_audio_url = ${audioUrl} WHERE id = ${id}`;
      console.log(`✅ [${word}] ${sentence}`);
      ok++;
    } catch (err) {
      console.error(`❌ [${word}] audio failed: ${err.message}`);
      fail++;
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== Done: ${ok} ok, ${skip} skipped, ${fail} failed ===`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
