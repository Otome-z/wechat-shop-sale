# 项目架构说明

本项目建议使用技术栈：

前端：
- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Axios

后端：
- Node.js
- Express
- TypeScript

数据库：
- MySQL
- Prisma

## 项目结构建议

project/
├─ frontend/
│  └─ src/
│     ├─ views/
│     ├─ components/
│     ├─ router/
│     ├─ stores/
│     ├─ api/
│     ├─ utils/
│     └─ types/
└─ backend/
   ├─ src/
   │  ├─ routes/
   │  ├─ controllers/
   │  ├─ services/
   │  ├─ middleware/
   │  ├─ utils/
   │  └─ types/
   └─ prisma/
      └─ schema.prisma

## 请求流程

浏览器
↓
Vue 页面
↓
调用后端 `/api/*`
↓
Express 路由
↓
Controller
↓
Service
↓
Prisma / MySQL
↓
返回结果

## 架构原则

1. 页面层只负责展示、交互、调用 API
2. 业务逻辑优先放在后端 service
3. 数据库操作统一走 Prisma
4. 鉴权、权限、参数校验必须在后端做
5. 高风险逻辑必须放在服务端
6. 前期保持单体简单架构，不做过度拆分

## 推荐演进路线

阶段 1：前后端分离基础架构
阶段 2：登录、用户信息、基础业务表
阶段 3：增加业务能力和日志记录
阶段 4：根据瓶颈再做缓存、队列、拆服务
