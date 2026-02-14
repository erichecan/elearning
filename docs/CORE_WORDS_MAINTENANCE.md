# Core Words 家长端维护说明

**目标**
将 Core Words 从硬编码迁移到 `vocabulary_items`，并通过家长端管理（后端提供 CRUD API）。

**已提供后端 API**
- `GET /api/vocabulary-items?type=core`
- `POST /api/vocabulary-items`
- `PUT /api/vocabulary-items/:id`
- `DELETE /api/vocabulary-items/:id`（软删除）

**建议的家长端功能（后续前端实现）**
1. Core Words 列表管理
1. 新增/编辑：英文、中文、图片、难度
1. 启用/禁用
1. 批量导入（对接现有 Flashcards 生成能力）

**迁移方式**
1. 使用脚本将 `words` 表里 core 类别导入 `vocabulary_items`
1. 迁移脚本：`/Users/apony-it/Downloads/elearning-main/backend/scripts/migrate-core-words.ts`
1. 说明文档：`/Users/apony-it/Downloads/elearning-main/docs/CORE_WORDS_MIGRATION.md`

