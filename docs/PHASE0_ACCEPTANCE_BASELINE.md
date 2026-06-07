# Phase 0：需求冻结与验收基线

## 1. 基线规则
- 基线 PRD：`/Users/eric/Desktop/secondme/projects/Audrey2.0/PRD_补充版.md`
- 结论来源：当前仓库代码与可运行接口，不以旧讨论中的路径为准。
- 验收环境标准
- 前端：`http://127.0.0.1:<vite_port>`
- 后端：`http://127.0.0.1:3001`
- DB：Neon（当前 `DATABASE_URL`）
- 通过标准
- `P0 主链路`必须全部通过。
- `P1/P2 能力`允许部分完成，但每项要有明确差距与下一步任务。

## 2. PRD→验收矩阵（首版）

| 编号 | PRD 能力点 | 当前状态 | 验收动作 | 通过标准 | 证据位 |
|---|---|---|---|---|---|
| A01 | 首页顶部结构（奖励/情绪/场景/任务） | 部分完成 | 打开首页检查模块可见与可点击 | 5 个模块可见，至少 4 个有真实链路 | 待补 |
| A02 | 句子条拼句 | 已完成 | 点击 3 个词 | 句子条按顺序显示 | 待补 |
| A03 | 句子条整句朗读 | 未完成 | 点击“整句朗读”按钮 | 可播放整句 TTS | 待补 |
| A04 | 句子条删除最后一个词 | 未完成 | 点击“撤销”按钮 | 仅移除最后 token | 待补 |
| A05 | Core Words 固定区运动记忆 | 已完成 | 重开页面后检查位置 | 固定区词位稳定 | 待补 |
| A06 | Core Words 多密度网格 | 未完成 | 在设置切换密度 | 网格实时切换且无布局破坏 | 待补 |
| A07 | Fitzgerald 词性配色 | 部分完成 | 检查词性颜色映射 | 词性配色一致且可读 | 待补 |
| A08 | 场景感知推荐（home/school） | 部分完成 | 切换 scene 比较推荐 | 推荐结果有明显差异 | 待补 |
| A09 | 历史反馈学习（shown/accept/complete） | 已完成 | 触发三个事件并查库 | 事件可写入且影响后续推荐 | 待补 |
| A10 | VSD 前台交互 | 已完成 | 点击热区 | 播放热区 utterance | 待补 |
| A11 | VSD 管理端可视化拖拽 | 已完成 | 新建热区并拖拽 | 坐标变更并持久化 | 待补 |
| B01 | 任务提醒→Focus | 已完成 | 首页点击提醒进入 Focus | 正确进入任务页 | 待补 |
| B02 | Task Analysis（子步骤/GIF/视频） | 部分完成 | 查看任务步骤展示 | 至少支持子步骤；媒体引导待补 | 待补 |
| B03 | Time Timer 扇形倒计时 | 未完成 | 进入 Focus | 可见扇形倒计时并与任务关联 | 待补 |
| C01 | 情绪控制室（Zones） | 未完成 | 首页进入情绪页 | 蓝绿黄红可选并记录 | 待补 |
| C02 | 生物反馈接入 | 未完成 | 接入设备模拟事件 | 可触发调节建议 | 待补 |
| D01 | 奖励规则管理 | 已完成 | 后台新建/更新规则 | CRUD 正常 | 待补 |
| D02 | 完成任务自动奖励 | 已完成 | 完成任务 | token_ledgers 入账 | 待补 |
| D03 | 兑换机制 | 部分完成 | 后台触发 redeem | 有记录；儿童端兑换流程待补 | 待补 |
| E01 | Flashcards 儿童端学习闭环 | 部分完成 | 进入 flashcards 学习 | 分类可进；学习闭环待补 | 待补 |
| E02 | Flashcards 家长上传/审核 | 部分完成 | 后台生成并审核 | 管理可做；前台发布态联动待补 | 待补 |
| E03 | Math 低/中高阶段训练闭环 | 部分完成 | 进入数学训练 | 有游戏；题库驱动与分级待补 | 待补 |
| E04 | AI 绘本生成+儿童阅读器 | 部分完成 | 后台生成、前台阅读 | 后台可生成；阅读器待补 | 待补 |
| F01 | 家长端独立工作台（移动优先） | 未完成 | 用家长身份登录 | 独立 IA 和流程可用 | 待补 |
| F02 | 治疗师端看板 | 部分完成 | 查看 analytics | 有汇总；专业指标看板待补 | 待补 |
| G01 | 多角色权限体系 | 部分完成 | 不同 token 访问接口 | admin token 有；RBAC 待补 | 待补 |
| G02 | 离线优先（AAC/提醒） | 未完成 | 断网验证 | 核心链路可用并可恢复同步 | 待补 |
| G03 | 同步与冲突解决 | 未完成 | 多端写入冲突测试 | 符合“家长优先”策略 | 待补 |
| G04 | 合规与安全（COPPA/GDPR） | 未完成 | 检查策略与实现 | 有可执行控制与文档 | 待补 |

## 3. Phase 0 期间输出件
- 已输出：执行总计划 `EXECUTION_PLAN_2026_Q2.md`
- 已输出：每日验收清单 `DAILY_ACCEPTANCE_CHECKLIST.md`
- 进行中：首日基线结果（smoke + 手工核查截图清单）

## 4. Phase 0 完成标准（Gate）
- 验收矩阵中每项都有“下一动作”与“负责人位”。
- P0 主链路用例在同一环境可重复执行。
- 风险清单有明确规避动作（端口冲突、历史 TS 报错、外部依赖）。

## 5. Day2：负责人位与证据位映射（已建立）

### 5.1 负责人分配规则
- FE：所有儿童端/家长端 UI 验收点（A/B/C/E/F 类前端项）
- BE：所有 API、数据写回、权限与同步项（G 类、A09/B03/D 类后端项）
- QA：主链路回归、每日清单执行与阻塞升级
- PO：验收口径与“通过/不通过”裁决

### 5.2 P0 主链路证据命令（可直接执行）
- 环境健康
- `curl -s http://127.0.0.1:3001/api/health/db`
- AAC 词库
- `curl -s 'http://127.0.0.1:3001/api/home/core-words?scene=home' | jq '{count:(.items|length),first:(.items[0].en)}'`
- 推荐生成
- `curl -s -X POST http://127.0.0.1:3001/api/home/recommendations -H 'Content-Type: application/json' -d '{"scene":"home","recentWords":["I"],"taskTitle":"吃饭"}'`
- 推荐反馈（shown）
- `curl -s -X POST http://127.0.0.1:3001/api/recommendations/shown -H 'Content-Type: application/json' -d '{"scene":"home","recommendedIds":[31,62,63],"recentWords":["I"]}'`
- 任务提醒
- `curl -s 'http://127.0.0.1:3001/api/home/task-reminder'`
- Focus 当前任务
- `curl -s 'http://127.0.0.1:3001/api/focus/current-task'`
- 完成任务
- `curl -s -X POST http://127.0.0.1:3001/api/focus/complete-task -H 'Content-Type: application/json' -d '{"taskId":1}'`
- 奖励汇总
- `curl -s 'http://127.0.0.1:3001/api/home/reward-summary'`
- VSD 前台场景
- `curl -s 'http://127.0.0.1:3001/api/public/vsd/scenes?context=home'`

### 5.3 Day2 基线快照（2026-02-28）
- `health/db`：`ok=true`
- `core-words`：`count=64, first=I`
- `recommendations`：返回 `recommendedIds + sentence` 正常
- `task-reminder`：返回 `pending task` 正常
- `public vsd scenes`：当前 `0`（数据空，非接口失败）
