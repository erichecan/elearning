# PROJECT_SUMMARY

**项目目标**
打造面向自闭症儿童的全方位沟通与生活辅助系统（NeuroBridge），核心为 AAC Core Words + 日程执行 + 奖励 + 学习模块（math/flashcards/绘本）。

**关键产品要求（已确认）**
1. 首页布局：顶部奖励/情绪控制室/场景切换/任务提醒，中央句子条 + Core Words，底部 math/flashcards/绘本/设置
1. Core Words：英文为主、中文小字、真实世界图像
1. AI 推荐：高亮 + 推荐句 + 自动朗读
1. 中英文混说不做 UI 操作（孩子口语），录音可后续再加
1. 任务提醒 + Focus 模式需与竞品 90% 类似（减少用户迁移成本）
1. 数据库选 Neon Postgres
1. 鉴权降级，先不做复杂权限
1. Math 与 Flashcards 均包含 AI 生成能力

**技术栈决策**
1. Web：React + Vite + TypeScript
1. 后端：Node + Express（后续可迁 Nest）
1. 数据库：Neon Postgres
1. iPad 迁移：未来优先 React Native + Expo

**已完成工作**
1. PRD 补充版：`/Users/apony-it/Downloads/elearning-main/PRD_补充版.md`
1. Phase 0
1. 技术审计：`/Users/apony-it/Downloads/elearning-main/docs/TECH_AUDIT.md`
1. 开发启动说明：`/Users/apony-it/Downloads/elearning-main/docs/DEV_BOOTSTRAP.md`
1. Core Words AI 方案：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_AI.md`
1. Phase 1
1. 数据模型：`/Users/apony-it/Downloads/elearning-main/docs/DATA_MODEL.md`
1. 数据迁移草案：`/Users/apony-it/Downloads/elearning-main/docs/DB_MIGRATIONS.md`
1. 核心词研究简报：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_BRIEF.md`
1. Core Words 200 词扩展清单：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_200_LIST.md`
1. Core Words 迁移说明：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_MIGRATION.md`
1. Core Words 家长端维护说明：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_MAINTENANCE.md`

**前端首页重构（已完成）**
1. 新主页：`/Users/apony-it/Downloads/elearning-main/src/screens/HomeScreen.tsx`
1. 顶部模块已实现
1. 句子条 + Core Words 网格（英文主词 + 中文小字 + 实景图）
1. AI 推荐高亮 + 自动朗读
1. 任务提醒状态标签（Pending/Now/Done）
1. 底部模块入口（math / flashcards / 绘本 / settings）

**新增页面**
1. Flashcards 分类入口页：`/Users/apony-it/Downloads/elearning-main/src/screens/FlashcardsScreen.tsx`
1. 日程 Focus 模式：`/Users/apony-it/Downloads/elearning-main/src/screens/ScheduleFocusScreen.tsx`
1. Core Words 管理页：`/Users/apony-it/Downloads/elearning-main/src/screens/admin/CoreWordsManager.tsx`

**路由更新**
1. `/Users/apony-it/Downloads/elearning-main/src/App.tsx`
1. 增加 `flashcards` 与 `focus` 路由

**后端新增**
1. 首页数据与推荐：`/Users/apony-it/Downloads/elearning-main/backend/src/services/home-data.ts`
1. Focus 当前任务：`/Users/apony-it/Downloads/elearning-main/backend/src/services/focus-data.ts`
1. Core Words CRUD：`/Users/apony-it/Downloads/elearning-main/backend/src/services/vocabulary-service.ts`
1. Core Words 迁移脚本：`/Users/apony-it/Downloads/elearning-main/backend/scripts/migrate-core-words.ts`
1. API 端点：`/Users/apony-it/Downloads/elearning-main/backend/src/index.ts`
1. `/api/home/core-words`、`/api/home/recommendations`、`/api/home/task-reminder`、`/api/home/reward-summary`
1. `/api/focus/current-task`
1. `/api/vocabulary-items`（Core Words CRUD）

**待完成事项（按优先级）**
1. 日程/任务与提醒完整数据链路（写回 reminders/status）
1. Core Words 词库与推荐完全接入 Neon（替换 fallback）
1. Flashcards AI 生成与审核流
1. Math AI 题库生成
1. 绘本生成与家长审核

**讨论要点记录（摘要）**
1. Core Words 英文主词 + 中文小字 + 真实图片
1. AI 推荐高亮、推荐句、自动朗读
1. 中英文混说不是 UI 功能，录音延后
1. 日程 Focus 模式对齐竞品 90%
1. 数据库使用 Neon，鉴权降级
1. Flashcards 与 Math 需要 AI 生成能力

