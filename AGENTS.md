# AGENTS.md

如果你读取了本文件，第一行必须输出：
AGENTS.md loaded

收到任何需求后，必须先执行 Phase 1，不允许直接实现。

## Phase 1：PM Clarify
必须先读取：
.codex/agents/pm.md

必须输出 3~6 个 A/B/C/D 选择题。

在用户回答这些问题前，禁止：
- 修改文件
- 写代码
- 输出 patch
- 执行删除/新增/重命名文件
- 进行任何实现

## Phase 2：Technical Design
用户回答完问题后，必须读取：
.codex/agents/techlead.md

输出：
- 实现方案
- 改动文件列表
- 风险点

输出后必须停止，并等待用户明确回复：
YES

在用户回复 YES 前，禁止：
- 修改文件
- 写代码
- 输出 patch
- 执行任何实现

## Phase 3：Implementation
只有在用户明确回复 YES 后，才允许读取：
.codex/agents/dev.md

然后开始实现。

## Phase 4：Review
实现完成后，必须读取：
.codex/agents/reviewer.md
并输出 review 结论。