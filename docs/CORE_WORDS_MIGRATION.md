# Core Words 迁移到 vocabulary_items

**目标**
将现有 `words` 表中属于 core 分类的词迁移到 `vocabulary_items`（type='core'）。

**前置条件**
1. `DATABASE_URL` 已配置在 `/Users/apony-it/Downloads/elearning-main/backend/.env`
2. `vocabulary_items` 表已创建

**脚本**
- `/Users/apony-it/Downloads/elearning-main/backend/scripts/migrate-core-words.ts`

**运行方式**
```bash
cd /Users/apony-it/Downloads/elearning-main/backend
npm install
npx ts-node scripts/migrate-core-words.ts
```

**说明**
1. 脚本会从 `words + categories(core|core_words)` 读取
1. 若 `vocabulary_items` 已存在同名 `word_en` 则跳过

