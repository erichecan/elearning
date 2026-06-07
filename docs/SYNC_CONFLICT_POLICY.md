# 同步与冲突策略（Phase 6 Day2）

## 目标
- 离线优先使用本地缓存。
- 恢复联网后执行增量同步。
- 冲突统一按“家长端优先（parent wins）”处理。

## 策略
- 同步模式：`offline-first`
- 主写入方：`parent`
- 冲突规则：
- `core_word_positions`：按更新时间，家长端写入优先
- `vsd_hotspots`：按更新时间，家长端写入优先
- `reward_rules`：按更新时间，家长端写入优先
- 重试退避：`200/500/1000/2000/5000ms`

## 接口
- `GET /api/sync/policy`
- 作用：向前端返回同步与冲突策略，用于客户端同步引擎配置。

