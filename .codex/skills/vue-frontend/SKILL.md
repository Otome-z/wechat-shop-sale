---
name: vue-frontend
description: 用于 Vue 3 + Vite + TypeScript + Vue Router + Pinia + Axios 项目的前端开发规范。
---

# Vue Frontend Skill

本项目使用：

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Axios

## 推荐目录结构

src/
├─ views/
├─ components/
├─ router/
├─ stores/
├─ api/
├─ utils/
└─ types/

## 页面与组件

- 页面组件放在 `views/`
- 可复用组件放在 `components/`

## 路由

- 路由定义统一放在 `router/`
- 受保护页面通过路由守卫处理

## 状态管理

- 全局用户状态、登录态、基础共享状态放到 Pinia
- 页面局部状态优先使用组件内部状态，不要过度全局化

## API 请求

- 不要在页面里直接散落写 axios
- 统一通过 `api/` 目录封装请求
- 页面只调用 API 封装函数
