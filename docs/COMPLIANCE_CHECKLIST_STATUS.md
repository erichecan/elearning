# 合规清单状态（Phase 6 Day5）

## COPPA
- 家长同意流程：已完成（接口 + 数据表）
- 儿童数据最小化：已部分完成
- 第三方共享限制：已部分完成

## GDPR
- 数据导出接口：已完成（管理员）
- 数据删除接口：已完成（管理员）
- 数据保留策略文档：已完成

## 安全
- 媒体静态加密：未完成
- 日志脱敏：已部分完成
- 角色访问控制：已有骨架（需落地到全接口）

## 接口
- `GET /api/compliance/checklist`
- `GET /api/compliance/consents/:childId`（管理员）
- `POST /api/compliance/consents`（管理员）
- `POST /api/compliance/consents/:id/revoke`（管理员）
- `GET /api/compliance/export/:childId`（管理员）
- `DELETE /api/compliance/child/:childId`（管理员）
- 用于前后台展示当前合规落地状态与缺口。
