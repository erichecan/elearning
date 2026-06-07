# P0 主链路验收表（Phase 0 Day2）

## 0. 使用说明
- 本表只覆盖 MVP 主链路：`AAC → 推荐 → 任务 → 奖励 → VSD`。
- 每项都必须填写：执行人、结果、证据链接或命令输出路径。
- 状态取值：`PASS / FAIL / BLOCKED`。

## 1. 环境与健康
| 编号 | 项目 | Owner | 验收动作 | 状态 | 证据 |
|---|---|---|---|---|---|
| P0-ENV-01 | 后端健康 | BE | `curl -s http://127.0.0.1:3001/api/health/db` | PASS | 命令返回 `ok=true` |
| P0-ENV-02 | 前端可访问 | FE | 打开 `http://127.0.0.1:5174` | PASS | 页面可见 `Core Words` |

## 2. AAC 主链路
| 编号 | 项目 | Owner | 验收动作 | 状态 | 证据 |
|---|---|---|---|---|---|
| P0-AAC-01 | Core Words 可加载 | BE | `GET /api/home/core-words?scene=home` | PASS | `count=64` |
| P0-AAC-02 | 句子条可拼句 | FE | 依次点 3 个词 | PASS | UI 可见 3 个 token |
| P0-AAC-03 | 选 I 后引导变化 | FE | 点击 `I` | PASS | 提示变为“下一步推荐动作词” |
| P0-AAC-04 | 固定区无滚动 | FE | 首页检查网格 | PASS | `coreButtons=36`，无滚动条 |

## 3. 推荐闭环
| 编号 | 项目 | Owner | 验收动作 | 状态 | 证据 |
|---|---|---|---|---|---|
| P0-REC-01 | 推荐可生成 | BE | `POST /api/home/recommendations` | PASS | 返回 `recommendedIds(6)` |
| P0-REC-02 | shown 事件回写 | BE | `POST /api/recommendations/shown` | PASS | 返回 `{ok:true}` |
| P0-REC-03 | accept 事件回写 | BE | 点击推荐词 | PASS | 接口 200 |
| P0-REC-04 | complete 事件回写 | FE/BE | 清空前触发 complete | PASS | 接口 200 |

## 4. 任务与奖励
| 编号 | 项目 | Owner | 验收动作 | 状态 | 证据 |
|---|---|---|---|---|---|
| P0-TASK-01 | 首页任务提醒 | BE | `GET /api/home/task-reminder` | PASS | 返回 `pending task` |
| P0-TASK-02 | Focus 可加载任务 | FE/BE | 进入 Focus 页面 | PASS | 任务标题与步骤可见 |
| P0-TASK-03 | 完成任务接口可用 | BE | `POST /api/focus/complete-task` | PASS | 返回 `ok/rewardIssued` |
| P0-REWARD-01 | 奖励汇总可读 | BE | `GET /api/home/reward-summary` | PASS | 返回 `coins/level` |

## 5. VSD 主链路
| 编号 | 项目 | Owner | 验收动作 | 状态 | 证据 |
|---|---|---|---|---|---|
| P0-VSD-01 | 前台场景接口可用 | BE | `GET /api/public/vsd/scenes?context=home` | PASS | 返回默认场景 `客厅场景` |
| P0-VSD-02 | 热区点击可发声 | FE | 首页场景互动点击热区 | PASS | smoke 输出含 `场景互动`，hotspot 已存在 |
| P0-VSD-03 | 管理端热区拖拽持久化 | FE/BE | Admin 拖拽热区后刷新 | PASS | 坐标更新可见 |

## 6. 阻塞与补救
- 当前阻塞：无。
