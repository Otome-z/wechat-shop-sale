---
name: node-backend
description: 用于 Node.js + Express + TypeScript 后端开发规范，包括 routes、controllers、services、middleware 分层。
---

# Node Backend Skill

后端使用：

- Node.js
- Express
- TypeScript

## 推荐目录结构

src/
├─ routes/
├─ controllers/
├─ services/
├─ middleware/
├─ utils/
└─ types/

## 分层建议

routes
↓
controllers
↓
services
↓
database

## 分层职责

### routes
- 负责注册路由
- 不写业务逻辑

### controllers
- 接收请求
- 调用 service
- 返回统一响应

### services
- 承载业务逻辑
- 处理数据库读写
- 做核心判断

### middleware
- 鉴权
- 参数校验
- 错误处理
- 日志处理

## 规则

- 控制器尽量薄
- 业务逻辑尽量放 service
- 不要把所有逻辑堆到一个文件里
