# TECH_AUDIT

**目标**
梳理当前代码与可复用能力，标记与新PRD差距和风险点，作为 Phase 0 基线文档。

**当前栈与结构**
1. 前端：React + Vite + TypeScript
1. 后端：Node.js + Express + TypeScript
1. 数据：Neon Postgres（部分硬编码）+ 历史 Supabase 接口残留

**前端结构盘点**
1. 入口与路由
1. `/Users/apony-it/Downloads/elearning-main/src/App.tsx`
1. 简单 URL 路由：`/admin` 进入后台
1. 主要界面
1. `/Users/apony-it/Downloads/elearning-main/src/screens/HomeScreen.tsx`（现有主页，偏“分类学习”）
1. `/Users/apony-it/Downloads/elearning-main/src/screens/CategoryScreen.tsx`（分类词汇展示）
1. `/Users/apony-it/Downloads/elearning-main/src/screens/MathScreen.tsx`（已有基础数学小游戏）
1. `/Users/apony-it/Downloads/elearning-main/src/screens/AdminScreen.tsx` + `/Users/apony-it/Downloads/elearning-main/src/screens/admin/*`（内容生成与管理）
1. 服务层
1. `/Users/apony-it/Downloads/elearning-main/src/services/api.ts`
1. `/Users/apony-it/Downloads/elearning-main/src/services/admin-api.ts`
1. `/Users/apony-it/Downloads/elearning-main/src/services/speech.ts`

**后端结构盘点**
1. 入口与路由
1. `/Users/apony-it/Downloads/elearning-main/backend/src/index.ts`
1. 现有 API
1. `POST /api/generate-content`（AI 生成词库）
1. `POST /api/generate-image`（AI 生成图片）
1. `POST /api/search-image`（图片搜索）
1. `POST /api/scrape-image`（图片抓取）
1. `GET /api/categories`、`GET/POST/PUT/DELETE /api/words`
1. 服务
1. `/Users/apony-it/Downloads/elearning-main/backend/src/services/content-generator.ts`
1. `/Users/apony-it/Downloads/elearning-main/backend/src/services/image-generator.ts`
1. `/Users/apony-it/Downloads/elearning-main/backend/src/services/image-scraper.ts`
1. `/Users/apony-it/Downloads/elearning-main/backend/src/services/word-service.ts`

**数据库与数据访问现状**
1. 前端使用 `NeonDatabase` 模拟 Supabase API：
1. `/Users/apony-it/Downloads/elearning-main/src/lib/neon-database.ts`
1. `/Users/apony-it/Downloads/elearning-main/src/lib/database.ts`
1. 前端仍存在对 Supabase 风格查询与 RPC 的依赖：
1. `/Users/apony-it/Downloads/elearning-main/src/services/api.ts`
1. 后端通过 `@neondatabase/serverless` 直连 Neon：
1. `/Users/apony-it/Downloads/elearning-main/backend/src/services/word-service.ts`

**可复用能力评估（Flashcards 相关）**
1. 可直接复用（约 60-70%）
1. 批量导入与生成流程 UI：`/Users/apony-it/Downloads/elearning-main/src/screens/admin/BulkImportWizard.tsx`
1. 文本生成服务：`/Users/apony-it/Downloads/elearning-main/backend/src/services/content-generator.ts`
1. 图片生成/搜索/抓取服务：`/Users/apony-it/Downloads/elearning-main/backend/src/services/image-generator.ts`、`image-scraper.ts`
1. 单词 CRUD：`/Users/apony-it/Downloads/elearning-main/backend/src/services/word-service.ts`
1. 需要改造的点
1. 词库结构需扩展到 PRD 的 Core Words + 情境词 + VSD
1. 需要家长端审核流与内容状态（草稿/已发布/已驳回）
1. Admin UI 需要改成“家长端内容管理”而非内部工具

**Math 现状评估**
1. 已有两个基础小游戏（非 AI 生成）
1. `/Users/apony-it/Downloads/elearning-main/src/components/math/MakeTenGame.tsx`
1. `/Users/apony-it/Downloads/elearning-main/src/components/math/CarryingGame.tsx`
1. AI 题目生成与分级能力尚未实现

**与 PRD 的主要差距**
1. 首页信息架构与 UX 需整体重做（当前是“分类卡片”学习页）
1. Core Words、句子条、情境切换（at home / at school）缺失
1. 任务提醒与日程模块缺失
1. 奖励系统与情绪控制室缺失
1. Flashcards/Math 需 AI 生成能力与审核流
1. 绘本（AI 生成社交故事）未实现

**风险与技术债**
1. 前端内置硬编码数据库连接（安全风险）
1. 前端仍使用部分 Supabase 查询与 RPC 逻辑，需统一到后端 API
1. 后端未区分儿童端/家长端权限

**Phase 0 输出结论**
1. Flashcards 相关服务可复用，但 UI 与数据模型需调整
1. Math 需要新增 AI 题库生成与分级机制
1. Core Words + 日程 + 奖励 是真正的 P0 新开发模块

