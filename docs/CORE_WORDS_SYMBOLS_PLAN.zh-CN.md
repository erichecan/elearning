# Core Words 转向 ARASAAC 符号集：迁移与长期计划（中文）

日期：2026-02-16

## 1. 目标与边界

- Core Words 的目标仍是“帮助孩子快速成句”，不是做一个 13000+ 的全量词典浏览器。
- ARASAAC 作为默认且统一的符号来源。
- 大规模主题词（节日、学科、情境）主要放到 Flashcards；Core Words 只保留句子构建所需高频核心词。

## 2. 本地存储策略（分层）

采用两层存储：

- A 层：全量离线源（仅用于工具和映射）
  - 路径：`backend/assets/symbols/arasaac/raw/png/`（13,717 张）
  - 用途：离线检索、映射生成、人工筛选工具。
- B 层：运行时发布包（用于实际应用）
  - 路径：`backend/public/symbols/arasaac/<pack-version>/...`
  - 仅包含经过审核、真正用于产品体验的符号。

建议本地预存：

- `core-36`：固定核心 36
- `core-120`：扩展句子构建词
- `starter-600`：高频 fringe 词（可选）

若设备容量或网络有限，最低保证：

- 本地必须有 `core-120` + 必要 UI 图标（通常小于 30MB，取决于压缩策略）。

## 3. 线上调用模型

采用版本化静态资源（CDN / 对象存储）：

- Base URL 示例：`https://cdn.example.com/aac/symbols/arasaac/v1/`
- 资源模式：`{base}/{pack}/{filename}`
- 清单模式：`{base}/manifest/{pack}.json`

客户端加载顺序：

1. 本地缓存 manifest
2. CDN 资源
3. 本地占位图兜底

原则：运行时不做在线搜索，只消费“预审核 manifest”。

## 4. 三维分类模型

每条词-图映射保留 3 个维度：

- 语法角色（grammar role）
  - `pronoun | verb | noun | adjective | adverb | preposition | question | social | helper`
- 语义域（semantic domain）
  - `people | actions | food | places | school | health | feelings | play | holiday`
- 使用包（usage pack）
  - `core-fixed | core-dynamic | flashcards | scene-overrides`

Core Words 的推荐和排布优先使用语法角色，语义域用于二级筛选。

## 5. 数据模型变更

建议新增/扩展字段：

- `vocabulary_items.symbol_provider`（默认 `arasaac`）
- `vocabulary_items.symbol_key`（文件名或稳定 ID）
- `vocabulary_items.grammar_role`
- `vocabulary_items.semantic_domain`
- `vocabulary_items.usage_pack`
- `vocabulary_items.is_core_fixed`（用于运动记忆固定格）

新增表：`symbol_assets`

- 字段建议：
  - `provider`, `symbol_key`, `cdn_url`, `local_path`, `license`, `version`, `tags`, `is_active`

## 6. 映射流水线

离线流水线（脚本化）：

1. 标准化词条文本（lemma、小写、标点清洗）
2. 用 `index/keyword_lookup.en.json` 做精确关键词匹配
3. 多候选时，按语法角色 + 语义域规则消歧
4. 导出 `packs/<pack>/manifest.json`
5. 在人工审核页面确认后发布

验收标准：

- Core-36：100% 人工审核
- Core-120：100% 人工审核
- Flashcards 扩展包：仅新增词做人工审核

## 7. 产品分工：Core Words 与 Flashcards

- Core Words
  - 固定锚点格：代词 + 高频动词 + 社交必需词
  - 动态区：根据句子状态推荐名词/形容词/疑问词
- Flashcards
  - 主题扩展（Halloween、Thanksgiving、校园单元）
  - 独立掌握度追踪

这样可避免主题词挤占 Core Words 的成句效率。

## 8. 实施阶段

Phase 0（已完成）

- ARASAAC 本地目录重构完成
- 元数据与检索索引生成完成

Phase 1

- 数据库迁移：增加 symbol 与分类字段
- 新增 `symbol_assets` 表并从 ARASAAC 清单导入
- 前后端从 `image_url` 迁移到 `symbol_provider + symbol_key` 解析

Phase 2

- 构建符号筛选工具页
  - 左：词表
  - 中：候选符号
  - 右：最终选中图 + 标签
- 导出 `core-36` 与 `core-120` manifest

Phase 3

- Core Words 前端只消费已审核 manifest
- 固定位置与锁定策略生效（保护运动记忆）
- 基于语法状态的动态推荐策略上线

Phase 4

- 发布包上传 CDN
- 版本化灰度与回滚（`v1`、`v1.1`）

## 9. 运维与治理

- 所有符号更新必须走 manifest 版本化
- 禁止直接在 DB 行里随意改图
- 每个包维护 changelog
  - 新增词
  - 替换图
  - 废弃图

## 10. 风险与控制

- 风险：抽象动词图意不清
  - 控制：Core 包内所有动词强制人工审核
- 风险：布局频繁变化破坏运动记忆
  - 控制：`is_core_fixed=true` 词固定位置锁定
- 风险：CDN 故障
  - 控制：App 内置本地 `core-120` 包作为离线兜底
