# DEV_BOOTSTRAP

**目标**
提供本地开发启动步骤与环境说明。此文档不包含任何真实密钥。

**前置条件**
1. Node.js 18+（建议 LTS）
1. npm

**环境变量（建议放在 `/Users/apony-it/Downloads/elearning-main/.env` 与 `/Users/apony-it/Downloads/elearning-main/backend/.env`）**
1. `DATABASE_URL`（Neon Postgres）
1. `GOOGLE_API_KEY`（Gemini 词库生成）
1. `OPENAI_API_KEY` 或 `REPLICATE_API_TOKEN`（如使用图片生成）
1. `PORT=3001`（后端端口，可选）

**本地启动（前端）**
1. `cd /Users/apony-it/Downloads/elearning-main`
1. `npm install`
1. `npm run dev`
1. 默认访问：`http://localhost:5173`

**本地启动（后端）**
1. `cd /Users/apony-it/Downloads/elearning-main/backend`
1. `npm install`
1. `npm run dev`
1. 默认访问：`http://localhost:3001`

**当前 API 约定（后端）**
1. `POST /api/generate-content`（AI 生成词列表）
1. `POST /api/generate-image`（AI 生成图片）
1. `POST /api/search-image`（搜索图片）
1. `POST /api/scrape-image`（抓取图片）
1. `GET /api/categories`、`GET /api/words`、`POST /api/words`

**注意事项**
1. 前端目前存在硬编码数据库连接，后续应移除并统一通过后端 API 访问 Neon。
1. `node_modules` 已被移动到 `backup`，首次运行需重新 `npm install`。
1. `.env` 中不要提交真实密钥。

