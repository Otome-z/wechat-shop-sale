# 接口约定（API Convention）

本文件用于统一小程序前端和 Node.js 后端的接口设计与联调约定。

## 基础原则

1. 所有业务接口统一挂在 `/api` 前缀下
2. 接口命名优先表达业务语义，不使用模糊路径
3. 前后端统一使用 TypeScript 定义请求和响应类型
4. 后端负责最终数据校验，前端只做辅助校验
5. 不信任前端上传的价格、库存、权限等关键字段

## 推荐接口路径风格

```text
/api/auth/login
/api/auth/profile
/api/products
/api/products/:id
/api/cart
/api/orders
/api/orders/:id
```

## 响应结构

统一返回：

```ts
type ApiResponse<T> = {
  code: number
  message: string
  data: T
  requestId?: string
}
```

约定：

- `code = 0` 表示成功
- 非 `0` 表示失败
- `message` 用于展示或日志定位
- `requestId` 用于排查问题

## 分页结构

```ts
type PageData<T> = {
  list: T[]
  page: number
  pageSize: number
  total: number
}
```

## 鉴权约定

- 登录成功后返回 token 或会话标识
- 前端通过 Axios 请求拦截器统一注入鉴权信息
- token 失效时，前端统一清理登录态并跳转登录流程
- 鉴权失败由后端返回明确错误码，不通过前端猜测状态

## 错误处理约定

前端：

- 统一处理网络错误
- 统一处理业务错误码
- 页面只处理和当前交互相关的提示

后端：

- Controller 不直接散落 try/catch 业务分支
- 统一错误处理中间件收敛异常输出
- 记录必要日志，避免向前端暴露敏感堆栈

## 类型约定

- 请求参数定义为 DTO
- 响应数据定义为独立类型
- 列表项、详情项、表单项不要混用同一个宽泛类型
- 不使用无边界的 `Record<string, any>`

## 电商场景特别约束

- 订单金额以后端计算结果为准
- 商品库存以后端校验结果为准
- 优惠、折扣、运费规则以后端返回为准
- 下单接口必须考虑幂等和重复提交问题
