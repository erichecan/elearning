# DEV-PLAN · Audrey 2.0 循证对齐改造计划

> 生成日期：2026-06-06
> 性质：**改造现有 elearning React 项目**（非从零开发）
> 读取的文档：`PRD_补充版.md`、`PRD_循证修订版.md`、`docs/AAC_RESEARCH_EVIDENCE_2026-06.md`、`docs/FLOW_DIAGRAMS.html`、`docs/prototype.html`、`docs/DATA_MODEL.md`、`docs/TECH_AUDIT.md` + 全量代码盘点

---

## 0. 一句话现状结论

**核心 AAC 模块（固定核心词网格 + 句子条 + TTS + 场景切换 + AI推荐 + VSD + 代币）已是生产级，可直接复用。** 本计划的重点不是重写，而是三件事：① 把现有实现**对齐循证不可妥协约束**（尤其修掉"动态词区实时重排"）；② 补全**最小闭环**里还半成品的环节（任务 Focus、flashcard 学完即用、奖励兑换）；③ 补**安全底线**（清 Supabase 遗留 + 鉴权）。

---

## 1. 现状盘点（基于全量代码审查）

### ✅ 已生产级、直接复用
| 模块 | 现状 |
|------|------|
| 核心词网格 | `HomeScreen.tsx` 已实现，18 个固定核心词 + `core_word_positions(is_locked)` 持久化，无拖动 UI |
| 句子条 | 点词拼句、整句朗读、撤销、清空 全有 |
| TTS | edge-tts 预生成 MP3 + 缓存（`/api/tts`），前端 Web Speech fallback |
| 场景切换 | at home / at school，切换重载词与 VSD |
| AI 推荐 | `recommendation-service.ts`（330 行）+ 蓝圈高亮 |
| VSD | 场景图 + hotspots 点击发音，`vsd-service` 完整 |
| 代币奖励（后端） | `reward-service.ts` 完整：规则/兑换/历史 |
| 数据库 | 5 个迁移，所有核心表已建（见 `DATA_MODEL.md`） |
| 后端 API | 65 个端点，大多连真实 Neon |

### ⚠️ 半成品 / 需补全
| 模块 | 缺口 |
|------|------|
| 任务 Focus | `focus-data.ts`（62 行）逻辑简陋；步骤/计时/完成回写不完整 |
| flashcard 学习闭环 | `FlashcardsScreen` 半成品；学完无"加到词板"回流 |
| 奖励前端 | `RewardsScreen` 兑换逻辑简洁 |
| Admin 管理 | 多为框架级，生成→审核→发布流程不全 |

### ❌ 违反循证 / 风险（必须改）
| # | 问题 | 影响 |
|---|------|------|
| R1 | **动态词区"实时重排"** — HomeScreen 按语法(pronoun→verb→object)实时改变"动态区"词的位置 | 🟢 **直接违反运动规划约束**（位置必须固定）。最高优先级修订 |
| R2 | **flashcard 与 AAC 不同源** — `flashcards` 表无 `vocab_id` 外键，符号系统分离 | 违反"学完即用、同源"循证约束 |
| R3 | **场景切换可能动到 core** — 切换时"重新加载核心词"，需确认 core 词与位置不变 | 潜在违反运动规划 |
| R4 | **Supabase 遗留** — `admin-api.ts`、`BulkImportWizard.tsx` 仍直连 supabase | 前后端分离不彻底，停用 Supabase 会崩 |
| R5 | **鉴权薄弱** — `ADMIN_TOKEN` 未设则全部裸奔；无 JWT；child_id 客户端任意传入 | 违反 CLAUDE.md 第十节安全底线 + COPPA/GDPR |

---

## 2. 改造模块拆解（按循证优先级排序）

### 🟢 Phase A — 循证对齐（最高优先级，改造现有不破坏）
- **A1. 核心词网格全固定** ⭐ 最关键
  - 取消"动态词区实时重排"；改为**所有核心词位置固定**（固定区保留，动态区改为固定布局或固定槽位）。
  - AI 推荐保留，但**只高亮 + 推荐句，绝不改变任何词的位置**。
  - 对应循证：🟢 Thistle 2018 / LAMP；不可妥协清单 #1、#2。
- **A2. 场景切换只换 fringe**
  - 切 at home/at school 时，**core 网格的词与位置完全不变**，只换情境词（fringe）区与 VSD 背景。
  - 对应：不可妥协清单 #3。
- **A3. flashcard 与 AAC 同源**
  - `flashcards` 表加 `vocab_id`（FK→`vocabulary_items`，可空，向后兼容）。
  - flashcard 学完 → "加到我的词板" → 写入儿童 fringe/custom，回首页即可用（原型已验证此闭环）。
  - 对应：不可妥协清单 #4。

### 🔵 Phase B — 最小闭环补全
- **B1. 任务 Focus 闭环**：`focus-data` 接真实 `tasks/task_steps`，步骤推进 + 视觉计时 + 完成回写 `reminders.status` + 触发代币。
- **B2. flashcard 学习闭环**：`FlashcardsScreen` 接 `/api/public/flashcards`，听音 + 学会标记 + 加词板。
- **B3. 奖励兑换闭环**：`RewardsScreen` 接 `reward-service`，金币余额 + 兑换扣减。
- **B4. 沟通强化奖励**：正确使用 AAC（说出整句）→ `token_ledgers(source=aac_use)` 加币（呼应循证：强化功能性沟通本身）。

### ⛔ Phase C — 安全底线（CLAUDE.md 第十节强制，上线前必做）
- **C1. 清 Supabase 遗留**：`admin-api.ts`、`BulkImportWizard.tsx` 全改 `apiFetch`，删除 supabase 直连。
- **C2. 鉴权加固**：`ADMIN_TOKEN` 未设时**默认拒绝**（不再 fallthrough）；加 JWT 家长登录；写操作 + 儿童数据接口校验 child 所有权。

### 🔭 Phase D — 其他端（后续，先不做）
- 家长端配置（场景上传/词库/日程/奖励/审核）、治疗师端看板（AAC频率/独立沟通率/ABC）。先各做 HTML 原型再开发。

---

## 3. 数据库 schema 变更

最小变更（绝大多数表已存在）：
1. `flashcards` 增列 `vocab_id BIGINT REFERENCES vocabulary_items(id)`（可空，向后兼容）。
2. （可选）`vocabulary_items` 增 `owner_child_id`（区分通用 core vs 儿童 custom 词）。
3. Phase C：新增 `users` 鉴权相关（表已在 DATA_MODEL 设计，未落库）+ 密码列。

> 迁移用 `backend/migrations/00X_*.sql`，沿用现有迁移风格。

---

## 4. 页面 / API 清单（改造点）

### 前端 screens
| 文件 | 动作 |
|------|------|
| `HomeScreen.tsx` | 改：去动态重排（A1）、场景切换护住 core（A2） |
| `FlashcardsScreen.tsx` | 改：接真实数据 + 加词板（A3/B2） |
| `ScheduleFocusScreen.tsx` | 改：Focus 闭环（B1） |
| `RewardsScreen.tsx` | 改：兑换闭环（B3） |
| `services/admin-api.ts`、`admin/BulkImportWizard.tsx` | 改：去 Supabase（C1） |

### 后端 API（新增/改造）
| 端点 | 动作 |
|------|------|
| `POST /api/flashcards/add-to-board` | 新增：学完加词板（A3/B2） |
| `GET /api/focus/current-task` / `POST /api/focus/complete-task` | 改：深化数据链路（B1） |
| `POST /api/home/recommendations` | 确认：只返高亮/句子，**不返新坐标**（A1） |
| `GET /api/home/core-words` | 确认：场景切换 core 不变（A2） |
| 鉴权 middleware | 改：默认拒绝 + JWT + 所有权（C2） |

---

## 5. 大改三评估（CLAUDE.md 第十三节）

- **架构**：复用现有三层（React screens / Express services / Neon）。新边界清晰——A1 把"位置决策"从前端算法收敛为"配置态固定 + 运行态只读"，消除前端重排单点。无新增服务依赖。
- **质量**：优先复用（HomeScreen/recommendation/reward 已生产级），避免重写。主要 DRY 收益：flashcard 同源后消除"两套词/两套图"。R4 清理消除前后端割裂。
- **性能**：核心词/场景为读多写少，`/api/home/core-words` 建议加 `unstable_cache`/SWR；flashcard 列表分页；TTS 已做文件缓存。无明显 N+1（推荐算法在单次查询内）。

---

## 6. 风险点

1. **A1 改动影响现有行为**：去掉动态重排会改变现在的交互观感——这是**循证正确但可见的变化**，需你确认（见下方确认项）。
2. **鉴权改造波及面**：加 JWT 会影响所有现有接口调用，需配套前端登录态；建议放 Phase C 单独做、充分测试。
3. **Supabase 遗留清理**：`BulkImportWizard` 依赖较深，改造时需回归测试导入流程。

---

## 7. ⚠️ 需你确认后再动手（CLAUDE.md 要求）

1. **部署目标**：Audrey 2.0 要部署到 GCP 吗？若要，需 Project ID / Cloud Run 服务名 / 数据库实例（现有 Neon 连接串）。还是先纯本地开发？
2. **起始范围**：先做 **Phase A（循证对齐）**，还是 A+B（对齐 + 闭环补全）一起？
3. **动态词区决策（关键）**：现有"动态区按语法实时重排"——
   - 方案① 全固定（最贴循证，推荐）：所有核心词位置永不变。
   - 方案② 折中：动态区位置固定，但用"高亮/微标记"提示推荐词（不挪位）。
   - 选哪个？

> 确认以上三项后，我按 Phase 顺序执行，每个 Phase 完成自测后再进入下一个。
