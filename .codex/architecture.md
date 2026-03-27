# 项目架构说明

本项目采用单仓全栈方案，在同一个仓库内同时维护微信小程序前端和 Node.js 后端。

目标：

- 前端以微信小程序为核心交付形态
- 后端提供统一业务 API、鉴权、数据校验和核心业务逻辑
- 前后端统一使用 TypeScript，降低联调和维护成本
- 工程化以 ESLint、Prettier 为基础，优先保证代码规范和可维护性

## 技术选型

前端：

- Vue 3
- uni-app
- TypeScript
- Pinia
- Axios
- Sass / SCSS
- ESLint
- Prettier
- Husky
- lint-staged

后端：

- Node.js
- Express
- TypeScript
- Prisma
- MySQL

推荐补充依赖：

- `dayjs`：时间格式化
- `zod` 或同类方案：参数校验和类型边界约束
- `dotenv`：环境变量管理
- `pino` 或同类方案：服务端日志

## 项目目录建议

```text
project/
├─ frontend/                     # 微信小程序前端（uni-app）
│  ├─ src/
│  │  ├─ pages/                  # 页面
│  │  ├─ subpackages/            # 分包页面
│  │  ├─ components/             # 通用组件
│  │  ├─ layouts/                # 布局容器，可选
│  │  ├─ store/                  # Pinia 状态管理
│  │  ├─ api/                    # 接口定义
│  │  ├─ hooks/                  # 复用逻辑
│  │  ├─ utils/                  # 工具函数
│  │  ├─ constants/              # 常量
│  │  ├─ types/                  # 前端类型定义
│  │  ├─ styles/                 # 全局样式和变量
│  │  ├─ static/                 # 静态资源
│  │  ├─ App.vue
│  │  ├─ main.ts
│  │  ├─ manifest.json
│  │  ├─ pages.json
│  │  └─ uni.scss
│  └─ package.json
├─ backend/                      # Node.js 服务端
│  ├─ src/
│  │  ├─ app.ts
│  │  ├─ server.ts
│  │  ├─ routes/                 # 路由层
│  │  ├─ controllers/            # 控制器层
│  │  ├─ services/               # 业务服务层
│  │  ├─ repositories/           # 数据访问层，可选
│  │  ├─ middleware/             # 中间件
│  │  ├─ validators/             # 参数校验
│  │  ├─ utils/                  # 通用工具
│  │  ├─ constants/              # 常量
│  │  ├─ types/                  # 服务端类型定义
│  │  └─ config/                 # 配置管理
│  ├─ prisma/
│  │  └─ schema.prisma
│  └─ package.json
├─ docs/                         # 非 .codex 业务文档，可选
└─ .codex/                       # 协作规范文档
```

## 前后端职责划分

前端负责：

- 页面展示和交互
- 页面状态和本地缓存管理
- 表单收集、基础校验和错误提示
- 调用后端 API

后端负责：

- 登录态管理和鉴权
- 权限控制
- 核心业务逻辑
- 数据校验和幂等控制
- 数据库读写
- 风险逻辑和审计日志

明确约束：

- 商品价格、库存、订单金额、优惠计算等高风险逻辑必须放在后端
- 前端不直接信任任何本地状态或价格计算结果
- 前端页面不直接拼接请求细节，统一通过 `api` 层访问后端

## 请求链路

```text
微信小程序页面
↓
页面 / 组件事件
↓
store / hooks / api
↓
Axios 请求封装
↓
Express Route
↓
Controller
↓
Service
↓
Prisma / MySQL
↓
统一响应结构返回
↓
前端根据 code / message / data 渲染
```

## 前端架构原则

1. 页面层只负责展示、交互、生命周期管理
2. 通用业务状态统一进入 Pinia
3. 接口请求统一通过 Axios 实例和拦截器处理
4. 页面、组件、store、api、types 按职责分层
5. 新增业务模块时优先复用现有组件、hooks 和工具函数
6. 前端默认使用 TypeScript，接口类型、页面状态类型、组件 props 类型尽量显式声明

前端推荐模块划分：

- `pages/product`：商品列表、商品详情
- `pages/cart`：购物车
- `pages/order`：下单、订单列表、订单详情
- `pages/user`：登录、用户信息、收货地址
- `store/modules`：用户、购物车、全局配置

## 后端架构原则

1. Route 只负责路径注册和中间件编排
2. Controller 负责请求解析和响应输出
3. Service 承担核心业务逻辑
4. Prisma 统一负责数据库访问
5. 参数校验、鉴权、权限校验必须在服务端执行
6. 服务端使用 TypeScript，DTO、返回值、数据库实体边界保持清晰

推荐业务模块：

- `auth`：登录、token、用户身份
- `user`：用户资料、地址管理
- `product`：商品、分类、库存
- `cart`：购物车
- `order`：下单、订单状态流转
- `common`：上传、配置、字典项

## 工程化要求

基础要求：

- 前后端统一使用 ESLint 和 Prettier
- 提交前通过 Husky + lint-staged 执行最小检查
- TypeScript 配置优先保证类型安全，不鼓励滥用 `any`
- 环境变量按前后端分别管理

推荐最低工程化能力：

- `lint`：代码检查
- `format`：代码格式化
- `typecheck`：类型检查
- `test`：后端可优先补 service 层测试，前端按业务复杂度补充

## 数据与接口约定

- 所有业务请求统一走 `/api/*`
- 响应结构保持统一，避免每个接口返回风格不一致
- 分页接口统一字段命名
- 鉴权接口和业务接口分层清晰

建议统一返回结构：

```ts
type ApiResponse<T> = {
  code: number
  message: string
  data: T
  requestId?: string
}
```

分页返回建议：

```ts
type PageData<T> = {
  list: T[]
  page: number
  pageSize: number
  total: number
}
```

更细的接口约束见 `.codex/api-convention.md`。

## MVP 业务范围

第一阶段建议只覆盖商城核心链路：

1. 微信登录或账号体系接入
2. 用户信息获取
3. 商品列表
4. 商品详情
5. 购物车
6. 提交订单
7. 订单列表和订单详情

暂不默认纳入：

- CMS
- 管理后台
- 秒杀、拼团、分销等复杂营销系统
- 微服务拆分
- CI/CD 和部署方案

## 演进路线

阶段 1：单仓全栈基础架构搭建

- 初始化 uni-app 小程序前端
- 初始化 Node.js + Express + Prisma 后端
- 打通登录、商品、购物车、订单主链路

阶段 2：稳定性和规范补强

- 统一错误处理
- 日志和请求追踪
- 参数校验
- 权限控制
- 类型收敛

阶段 3：业务扩展

- 优惠券
- 地址管理
- 售后流程
- 订单状态机优化

阶段 4：性能和架构升级

- 热点数据缓存
- 消息队列
- 管理后台
- 按业务边界继续拆分模块
