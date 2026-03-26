---
name: api
description: 用于统一 API 设计、参数校验、错误格式、接口命名、返回结构。
---

# API 设计 Skill

所有 API 应遵循统一规范，尽量简单、稳定、可维护。

## API 路径建议

- `/api/health`
- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/me`
- `/api/auth/logout`
- `/api/user/profile`
- `/api/records`

## 请求方式

- `GET`：查询数据
- `POST`：创建或执行动作
- `PUT/PATCH`：更新数据
- `DELETE`：删除数据

## 返回格式建议

成功：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

失败：

```json
{
  "code": 400,
  "message": "invalid params"
}
```

## 设计原则

1. 参数校验必须在服务端做
2. 错误信息要明确，但不要泄露敏感信息
3. 接口命名语义化
4. 一个接口尽量只做一件事
5. 返回结构保持统一
