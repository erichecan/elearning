# 全部内容总览

本文件汇总当前项目所有关键文档与实现内容，便于离线继续开发。

---

## 1. 需求与研究
1. PRD 补充版：`/Users/apony-it/Downloads/elearning-main/PRD_补充版.md`
2. 核心词研究简报（中英文对照）：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_BRIEF.md`
3. Core Words AI 方案：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_AI.md`
4. Core Words 200 词扩展清单：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_200_LIST.md`

---

## 2. 开发规划与讨论记录
1. 技术审计：`/Users/apony-it/Downloads/elearning-main/docs/TECH_AUDIT.md`
2. 启动与环境说明：`/Users/apony-it/Downloads/elearning-main/docs/DEV_BOOTSTRAP.md`
3. 数据模型：`/Users/apony-it/Downloads/elearning-main/docs/DATA_MODEL.md`
4. 数据库迁移草案：`/Users/apony-it/Downloads/elearning-main/docs/DB_MIGRATIONS.md`
5. 项目总结：`/Users/apony-it/Downloads/elearning-main/docs/PROJECT_SUMMARY.md`
6. 讨论记录：`/Users/apony-it/Downloads/elearning-main/docs/DISCUSSION_LOG.md`
7. Core Words 迁移说明：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_MIGRATION.md`
8. Core Words 家长端维护说明：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_MAINTENANCE.md`

---

## 3. 前端改动（关键文件）
1. 首页重构：`/Users/apony-it/Downloads/elearning-main/src/screens/HomeScreen.tsx`
2. Flashcards 分类入口：`/Users/apony-it/Downloads/elearning-main/src/screens/FlashcardsScreen.tsx`
3. Focus 模式：`/Users/apony-it/Downloads/elearning-main/src/screens/ScheduleFocusScreen.tsx`
4. Core Words 管理页：`/Users/apony-it/Downloads/elearning-main/src/screens/admin/CoreWordsManager.tsx`
5. 路由：`/Users/apony-it/Downloads/elearning-main/src/App.tsx`

---

## 4. 后端改动（关键文件）
1. 首页数据与推荐：`/Users/apony-it/Downloads/elearning-main/backend/src/services/home-data.ts`
2. Focus 当前任务：`/Users/apony-it/Downloads/elearning-main/backend/src/services/focus-data.ts`
3. Core Words 维护 API：`/Users/apony-it/Downloads/elearning-main/backend/src/services/vocabulary-service.ts`
4. API 注册：`/Users/apony-it/Downloads/elearning-main/backend/src/index.ts`
5. Core Words 迁移脚本：`/Users/apony-it/Downloads/elearning-main/backend/scripts/migrate-core-words.ts`

---

## 5. 下一步建议
1. 家长端 UI 接入 Core Words 批量导入
2. 任务提醒状态与完成写回数据库
3. Core Words/推荐/奖励数据逐步接入 Neon 表

