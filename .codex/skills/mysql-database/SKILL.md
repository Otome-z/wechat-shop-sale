---
name: mysql-database
description: 用于 MySQL + Prisma 的数据库设计规范，包括用户表、业务表、日志表、索引和字段建议。
---

# MySQL Database Skill

数据库：

- MySQL

ORM：

- Prisma

## 推荐基础表

- users
- user_profiles
- operation_logs

如果后续有业务模块，可再增加：

- records
- tasks
- orders
- ai_logs

## 设计原则

1. 每张表都要有主键
2. 必须有时间字段，如 `created_at`、`updated_at`
3. 高频查询字段需要索引
4. 日志表要提前考虑增长
5. 不要过早做复杂分库分表

## 推荐字段思路

### users
- id
- email
- password_hash
- created_at
- updated_at

### user_profiles
- id
- user_id
- nickname
- avatar
- created_at
- updated_at

### operation_logs
- id
- user_id
- action
- detail
- created_at
