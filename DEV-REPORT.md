# 开发完成报告 · Phase A 循证对齐（第一阶段）

> 日期：2026-06-06
> 范围：DEV-PLAN 的 **Phase A 循证对齐**（用户已确认：先本地开发 / 先做 Phase A / 动态词区方案①全固定）

## 本次做了什么（一句话）

把现有 AAC 首页**对齐循证不可妥协约束**——核心词位置不再随交互或场景变化（保护运动规划记忆），并顺带修好了让整个项目编译失败的历史遗留问题。

## 完成情况

| 任务 | 状态 | 说明 |
|------|------|------|
| **A1 动态词区改为全固定** | ✅ 完成 | 原来"动态区会按语法实时重排词序"已移除；现在所有核心词位置**确定性、永不随点击变化**。AI 推荐保留，但只高亮、不挪位。 |
| **A2 场景切换不动核心词** | ✅ 完成 | 核心词加载与 at home/at school **彻底解耦**；切场景只换 VSD 背景与 AI 推荐高亮，核心词网格不重载、位置不变。 |
| **R4 修复 Supabase 遗留（额外）** | ✅ 完成 | `admin-api.ts` 5 处引用了不存在的 `supabase`（这是 `npm run build` 失败的根因），已改为调用后端 `apiFetch`；并清掉 12 个未使用变量。**项目 build 从失败→成功。** |
| **A3 flashcard 与 AAC 同源** | ⏳ 待联调 | 涉及数据库迁移（flashcards 加 vocab_id）+ "加到词板"数据流 + 端到端联调，需先确认数据库（Neon）状态再做，避免在云端库上冒进。 |

## 改了哪些文件

| 文件 | 改动 |
|------|------|
| `src/screens/HomeScreen.tsx` | A1：`gridState` 去掉 `sentence` 依赖，扩展词区改确定性排序；A2：核心词加载从 `[scene]` 改为 `[activeChildId]`；两处文案去掉"会变/系统调整"暗示 |
| `src/services/admin-api.ts` | 5 处 `supabase` 直连 → `apiFetch` 后端端点 |
| `src/lib/neon-database.ts`、`src/screens/admin/BulkImportWizard.tsx`、`src/screens/AdminScreen.tsx`、`src/screens/SettingsScreen.tsx` | 清除未使用变量/导入 |

## 验证结果

- ✅ `npx tsc --noEmit`：**0 错误**（改动前有 17 个错误，项目本就编译不过）
- ✅ `npm run build`：**成功**（vite ✓ built in 1.22s）
- ⏳ 行为级验证（浏览器实际点击确认核心词不重排/切场景不变）：需后端连 Neon 且库内有 core 词数据，建议本地起服务确认；A1/A2 的约束已在代码层面确定性保证。

## 已知问题 / 待办

1. **A3 flashcard 同源**：待确认数据库后做（迁移 + 加词板 + 联调）。
2. **行为级验证**：需 `cd backend && npm run dev` + `npm run dev`（前端），且 Neon 库有 core 词种子数据。
3. **Phase B/C/D 未开始**：任务 Focus 深化、奖励兑换、鉴权加固、其他端原型，按计划在后续阶段。

## 下一步建议

- 先本地起服务，实际点几下确认 A1/A2 手感（核心词点击后位置不动、切 at school 核心词不变）。
- 确认 Neon 数据库状态后，我接着做 A3（flashcard 学完即用闭环）。
