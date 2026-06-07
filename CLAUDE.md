# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Audrey 2.0** — 面向自闭症儿童的沟通与生活辅助 App，包含 AAC（辅助沟通）、日程管理、奖励系统、数学练习、故事书等模块。目标用户：儿童（主要）、照护者/治疗师（次要）。

## Commands

### Frontend (root)
```bash
npm install
npm run dev              # http://127.0.0.1:3000（Vite，端口3000）
npm run build            # tsc + vite build
npm run lint
```

### Backend (`backend/`)
```bash
cd backend && npm install
npm run dev              # nodemon，http://127.0.0.1:3001
npm run start            # ts-node（生产）
```

### Smoke test
```bash
npm run smoke:corewords  # scripts/smoke-corewords.mjs
```

### DB / Seed scripts (backend)
```bash
npm run migrate:phase1
npm run seed:initial
npm run build:symbol-pack:core200
```

## Environment Variables

前端根目录 `.env`：
- `VITE_API_BASE_URL` — 后端地址（默认 `http://127.0.0.1:3001`）

后端 `backend/.env`：
- `DATABASE_URL` — Neon Postgres 连接串
- `GOOGLE_API_KEY` — Gemini（词库生成）
- `OPENAI_API_KEY` / `REPLICATE_API_TOKEN` — 图片生成
- `PORT=3001`
- `ADMIN_TOKEN` — 后端管理接口鉴权

## Architecture

### Frontend (React 18 + TypeScript + Vite + Tailwind)

- **路由**：无路由库，`App.tsx` 通过 `currentScreen` state + `navigateTo()` 手动切换 Screen 组件
- **Screens**：`src/screens/` — Home、Category（词汇闪卡）、Flashcards、Math、ScheduleFocus、Emotion、Storybooks、Rewards、Settings、Admin
- **Admin**：`/admin` 路径 → `AdminScreen`，子模块在 `src/screens/admin/`（CoreWordsManager、FlashcardsManager、VSDManager 等）
- **API 层**：`src/services/api-client.ts` 提供 `apiFetch()`，统一注入 `x-admin-token` header；`src/services/api.ts` 封装业务 API，部分调用仍直连 Supabase（待迁移）

### Backend (Express + TypeScript + Neon Postgres)

- 入口：`backend/src/index.ts`，Express + CORS + 静态文件（`public/`）
- 服务层：`backend/src/services/` — 每个功能域一个 service 文件（vocabulary、schedule、flashcard、math-exercise、storybook、vsd、analytics、child、reward、tts、symbol-pack 等）
- DB 连接：`backend/src/lib/db-pool.ts` + `db-retry.ts`（Neon serverless pool，带重试）
- 鉴权：`adminGuard` middleware，读取 `x-admin-token` header 对比 `ADMIN_TOKEN` 环境变量

### Data Model (Neon Postgres)

核心实体：
- `child_profiles` — 以儿童为中心
- `vocabulary_items` — 词汇（type: core | context | custom）
- `core_word_positions` — 儿童专属 AAC 核心词位置（4x4/5x5/6x6 grid）
- `vsd_scenes` / `vsd_hotspots` — 视觉场景图（VSD）
- `schedules` / `tasks` / `task_steps` — 日程管理
- `token_ledgers` / `reward_rules` / `redemptions` — 代币奖励
- `flashcards` / `math_exercises` / `storybooks` — 学习内容（status: draft | approved | published）
- `analytics_events` / `abc_logs` — 行为数据
- `symbol_assets` / `symbol_packs` — ARASAAC 符号资源

### Symbol Pipeline

ARASAAC 符号下载 → 索引 → `seed:symbol-assets:arasaac` → `bootstrap:coreword-symbol-mapping` → 人工审核 → `apply:coreword-manual-mapping` → `build:symbol-pack:core200`。详见 `docs/SYMBOL_PACK_PIPELINE.md`。

## Key Conventions

- 使用 `127.0.0.1`（不用 `localhost`），避免端口映射冲突
- 前端通过 `VITE_API_BASE_URL` 指定后端；未设置时 fallback 到 `http://127.0.0.1:3001`
- Admin token 存在 `localStorage('adminToken')`，由 `apiFetch` 自动注入
- 后端 `public/tts/` 存放生成的 TTS 音频，通过静态文件服务对外
- 所有 AI 内容（flashcard/math/storybook）默认 `status: draft`，需经 Admin 审核后发布
