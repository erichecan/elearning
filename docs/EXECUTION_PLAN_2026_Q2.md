# Audrey2.0 执行总计划（2026 Q2）

## 1. 目标与范围
- 目标：基于 `PRD_补充版.md`，补齐当前“部分完成 + 未完成”能力，形成可验收版本。
- 范围：儿童端（AAC/情绪/任务/学习/绘本）+ 家长端 + 治疗师端 + 后端权限/离线/合规。
- 不在本轮范围：`17 个词符号质量复核`（按你的决定暂缓）。

## 2. 阶段计划（顺序执行）
- Phase 0（需求冻结与验收基线，3-4 天）`已完成（2026-02-28）`
- Phase 1（AAC 闭环补齐，10 天）
- Phase 2（情绪与执行功能闭环，8 天）
- Phase 3（学习模块闭环，12 天）
- Phase 4（绘本闭环，7 天）
- Phase 5（家长端/治疗师端与权限，14 天）
- Phase 6（离线优先与合规上线准备，14 天）

## 3. 负责人位（Owner Slots）
- 产品负责人（PO）：`[待填写]`
- 技术负责人（TL）：`[待填写]`
- 前端负责人（FE）：`[待填写]`
- 后端负责人（BE）：`[待填写]`
- 数据与算法负责人（Data/Reco）：`[待填写]`
- 测试负责人（QA）：`[待填写]`
- 运营验收负责人（Ops）：`[待填写]`

## 4. 各阶段任务拆分与 DoD

### Phase 0：需求冻结与验收基线
- 任务
- 输出 PRD→验收点矩阵（功能点、验收动作、通过标准、证据位）。
- 固化“必须通过”的主链路用例（AAC 成句、推荐反馈、任务完成、奖励到账、VSD 交互）。
- 固化每日验收清单和风险记录模板。
- DoD
- `docs/PHASE0_ACCEPTANCE_BASELINE.md` 完成并可执行。
- `docs/DAILY_ACCEPTANCE_CHECKLIST.md` 完成并可复用。
- 产出首日基线记录（含 smoke 结果）。

### Phase 1：AAC 闭环补齐
- 任务
- 句子条补齐：整句朗读、删除最后一个词。
- 网格密度配置：至少支持 `4x4 / 6x6 / 8x8`。
- Fitzgerald 配色落地（词性一致配色）。
- 场景/时间段对动态推荐词池生效。
- DoD
- 句子构建与推荐路径可稳定复现（E2E）。
- 首页 AAC 链路回归通过。

### Phase 2：情绪与执行功能闭环
- 任务
- 上线 Zones（蓝/绿/黄/红）页面与快速干预动作。
- Time Timer 红色扇形倒计时接入 Focus。
- 任务提醒→Focus→完成→奖励链路全量回归。
- DoD
- 情绪事件可回写并可在分析端可见。
- 任务状态与奖励记录一致。

### Phase 3：学习模块闭环
- 任务
- Flashcards 儿童端学习闭环（学习、发声、收藏、进度）。
- Math 题库驱动训练闭环（难度、结果入库）。
- 后台“审核发布态”到前台“可学习态”打通。
- DoD
- 家长发布内容后，儿童端可消费且有进度统计。

### Phase 4：绘本闭环
- 任务
- 儿童端阅读器（逐页、朗读、收藏）。
- 家长端生成→审核→发布链路。
- DoD
- 绘本全链路可验收，失败场景有兜底提示。

### Phase 5：家长端/治疗师端与权限
- 任务
- 拆分家长端信息架构（移动优先）。
- 治疗师端最小看板：AAC 使用率、句子完成率、任务完成率。
- RBAC：`child / parent / therapist / admin`。
- DoD
- 权限矩阵通过 API 级回归验证。

### Phase 6：离线与合规
- 任务
- AAC/TTS/任务提醒离线可用。
- 增量同步与冲突策略（家长端优先）。
- 合规：数据最小化、导出删除、日志脱敏、媒体访问控制。
- DoD
- 断网关键路径可用，联网后同步一致。

## 5. 里程碑
- M1：Phase 1 完成（AAC MVP 2.0）
- M2：Phase 3 完成（儿童端沟通+学习闭环）
- M3：Phase 5 完成（多角色运营版）
- M4：Phase 6 完成（离线与合规上线候选版）

## 7. 当前状态
- 当前阶段：`全部阶段已完成（Phase 0-6）`
- Phase 0 签字文档：`/Users/eric/Desktop/secondme/projects/Audrey2.0/docs/phase0/PHASE0_SIGNOFF_2026-02-28.md`
- Phase 1 启动 backlog：`/Users/eric/Desktop/secondme/projects/Audrey2.0/docs/phase1/PHASE1_KICKOFF_BACKLOG.md`
- Phase 2 启动 backlog：`/Users/eric/Desktop/secondme/projects/Audrey2.0/docs/phase2/PHASE2_KICKOFF_BACKLOG.md`
- Phase 3 启动 backlog：`/Users/eric/Desktop/secondme/projects/Audrey2.0/docs/phase3/PHASE3_KICKOFF_BACKLOG.md`
- Phase 4 启动 backlog：`/Users/eric/Desktop/secondme/projects/Audrey2.0/docs/phase4/PHASE4_KICKOFF_BACKLOG.md`
- Phase 5 启动 backlog：`/Users/eric/Desktop/secondme/projects/Audrey2.0/docs/phase5/PHASE5_KICKOFF_BACKLOG.md`
- Phase 6 启动 backlog：`/Users/eric/Desktop/secondme/projects/Audrey2.0/docs/phase6/PHASE6_KICKOFF_BACKLOG.md`

## 6. 风险与依赖
- 端口与本地环境冲突导致验收误判（已要求统一 `127.0.0.1`）。
- 历史遗留 TS 报错会影响全量 build 信号质量（需单列治理）。
- 内容审核与词库版本（pack/manifest）流程需要强约束，避免线上回退困难。
