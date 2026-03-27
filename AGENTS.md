# AGENTS.md

如果你读取了本文件，第一行必须输出：
AGENTS.md loaded

## 项目定位

本项目是单仓全栈项目：

- 前端是微信小程序
- 前端技术栈以 `Vue 3 + uni-app + TypeScript + Pinia + Axios` 为主
- 后端是 `Node.js + Express + TypeScript`
- 数据层使用 `Prisma + MySQL`
- 工程化以 `ESLint + Prettier + Husky + lint-staged` 为主

顶层协作流程以本文件为准，具体技术和实现规范以 `.codex` 下文档为准。

收到任何需求后，必须先执行 Phase 1，不允许直接实现。

## 文档读取原则

开始工作时，默认按以下顺序理解上下文：

1. `AGENTS.md`
2. `.codex/architecture.md`
3. `.codex/rules.md`
4. `.codex/workflow.md`
5. 与当前阶段对应的 `.codex/agents/*.md`
6. 当前任务直接相关的模板或补充文档，例如 `.codex/templates/*.md`、`.codex/api-convention.md`

不要一次性无差别读取所有文档，只读取当前任务必要内容。

## Phase 1：PM Clarify

必须先读取：

- `.codex/agents/pm.md`

必须输出 3~6 个 A/B/C/D 选择题。

问题要求：

- 问题必须围绕当前需求动态生成
- 不允许使用固定问卷模板敷衍提问
- 问题要能帮助明确范围、目标、约束或交付标准
- 用户应当可以用 `1A,2B,3C` 这种格式直接回答

在用户回答这些问题前，禁止：

- 修改文件
- 写代码
- 输出 patch
- 执行删除 / 新增 / 重命名文件
- 进行任何实现

## Phase 2：Technical Design

用户回答完问题后，必须读取：

- `.codex/agents/techlead.md`

输出内容至少包括：

- 实现方案
- 改动文件列表
- 风险点

建议补充：

- 是否需要新增 `.codex` 文档
- 实现顺序
- 对现有规范的影响范围

输出后必须停止，并等待用户明确回复：

`YES`

在用户回复 `YES` 前，禁止：

- 修改文件
- 写代码
- 输出 patch
- 执行任何实现

## Phase 3：Implementation

只有在用户明确回复 `YES` 后，才允许读取：

- `.codex/agents/dev.md`

然后开始实现。

实现阶段要求：

- 优先遵守 `.codex/architecture.md`
- 严格遵守 `.codex/rules.md`
- 执行顺序参考 `.codex/workflow.md`
- 涉及接口规范时参考 `.codex/api-convention.md`
- 尽量只改必要文件
- 保持实现简单清晰

允许的文档变更范围：

- 可以修改现有 `.codex` 文档
- 可以新增 `.codex` 下必要的规范文档
- 可以新增 `.codex/templates` 下必要模板文件

如果新增文档，必须满足：

- 有明确用途
- 与当前项目技术方向一致
- 不与已有文档冲突
- 不做无意义拆分

## Phase 4：Review

实现完成后，必须读取：

- `.codex/agents/reviewer.md`

并输出 review 结论。

review 至少要覆盖：

- 是否满足用户需求
- 是否偏离当前项目架构
- 是否存在明显安全风险
- 是否增加了不必要复杂度
- 是否还需要补类型、补校验、补测试或补文档

## 默认边界

默认不包含：

- 发布
- 部署
- CI/CD
- 管理后台
- 微服务拆分
- 复杂营销系统设计

如果用户明确要求，再单独进入对应需求澄清和设计流程。
