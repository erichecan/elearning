# DISCUSSION_LOG

**范围**
本文件整理了与产品需求、技术选型、实现顺序、已完成内容的讨论要点与决定，便于审核与持续开发。

---

**需求与设计确认**
1. 首页布局遵循截图：顶部奖励/情绪控制室/at school/at home/任务提醒；中间句子条 + Core Words；底部 math/flashcards/绘本/设置。
1. Core Words 卡片：英文为主，中文小字；图片为真实世界图像。
1. AI 功能：
1. 推荐词在 Grid 高亮显示。
1. 推荐可扩展为完整句子。
1. 推荐出现时自动朗读。
1. 中英文混说不做 UI 功能（由孩子口语表现），录音与行为追踪可后续再加。
1. 日程 Focus 模式需与竞品 90% 相似，降低用户迁移成本。
1. 数据库：Neon Postgres。
1. 鉴权：先降级，不做复杂权限。
1. Math 与 Flashcards 均需 AI 生成能力。
1. 需要 200 词核心词扩展清单、语义类别与频率建议、任务模板。

---

**技术选型与迁移策略**
1. Web 现状：React + Vite + TypeScript。
1. 后端现状：Node + Express + TypeScript。
1. iPad 迁移：优先 React Native + Expo（后续迁移）。

---

**阶段计划与执行**
1. Phase 0：技术审计与启动说明完成。
1. Phase 1：数据模型与迁移草案完成。
1. 前端首页重构完成（按最新需求）。
1. Flashcards 入口页新建，并可跳转到现有分类卡。
1. Focus 模式新建，包含任务拖拽完成箱交互。
1. 首页数据已接入后端 API。
1. Focus 当前任务已接入后端 API。
1. Core Words 后端 CRUD 与家长端 UI 已接入。
1. 推荐逻辑升级为场景+历史+任务规则版。
1. 任务提醒状态在前端显示。

---

**当前实现状态（概览）**
1. 前端
1. 首页：`/Users/apony-it/Downloads/elearning-main/src/screens/HomeScreen.tsx`
1. Flashcards 分类入口：`/Users/apony-it/Downloads/elearning-main/src/screens/FlashcardsScreen.tsx`
1. Focus 模式：`/Users/apony-it/Downloads/elearning-main/src/screens/ScheduleFocusScreen.tsx`
1. Core Words 管理页：`/Users/apony-it/Downloads/elearning-main/src/screens/admin/CoreWordsManager.tsx`
1. 路由更新：`/Users/apony-it/Downloads/elearning-main/src/App.tsx`
1. 后端
1. 首页数据：`/Users/apony-it/Downloads/elearning-main/backend/src/services/home-data.ts`
1. Focus 当前任务：`/Users/apony-it/Downloads/elearning-main/backend/src/services/focus-data.ts`
1. Core Words CRUD：`/Users/apony-it/Downloads/elearning-main/backend/src/services/vocabulary-service.ts`
1. API 端点：`/Users/apony-it/Downloads/elearning-main/backend/src/index.ts`

---

**待完成事项（近期）**
1. 任务提醒写回 reminders 状态链路
1. Core Words/推荐/奖励数据完全接入 Neon
1. Flashcards 与 Math 的 AI 生成与审核流
1. 绘本生成模块与家长审核

