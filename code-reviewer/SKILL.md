---
name: code-reviewer
description: 对产生的 Git Diff 进行机器级审计。根据预设的拦截底座产生检验报告，决定驳回或生成 Commit。对标 CodiumAI 的 PR-Agent。
---
# Code Reviewer (最终代码审计官)

## Core Purpose
此技能作为代码提交流水线的最后一环，进行自动化的**只读 (Read-Only)** 代码审查。它的职责是防守底线，坚决拦截硬编码 IP、密码泄露、中文字符错乱以及错误的国际化 i18n 写法。

## Context & Components
你被剥夺了仅凭肉眼阅读巨大代码库的权力，你必须依靠底层配套的静态层级扫描验证：本技能目录下的 `scripts/diff_linter.js`。

## Instructions
当你被要求 Review、审查、或提交代码之前，请严格按照以下步骤操作：

1. **执行静态差异审查 (Execute Diff Linting)**：使用终端命令执行本技能所在的目录下的底层脚本：`scripts/diff_linter.js`。脚本会自动提取当前的 Git 差异（Uncommitted Changes）并匹配核心约束。
2. **解析审查报告 (Analyze Linter Output)**：
   - 🔴 如果脚本日志打印了 `status: fail` 及其附带的 Violations (违规清单)：这说明代码存在违规项。必须提取报错的具体行号和错误原因，打回给 `task-coder` 要求重新修改。
   - 🟢 如果脚本打印 `status: pass`：确认代码合规，允许进入下一步。
3. **出具最终结果 (Generate Commit Info)**：如果在审核全通过的情况下，请直接输出一条符合 Conventional Commits 标准的英文 Commit Message，例如 `feat(module): description...`。

## Example Usage
用户：“请审查一下当前的改动，准备提交。”
助手：“我正在调用代码审计辅助脚本...”
(脚本运行 diff_linter.js 后发现违规项)
助手：“❌ 审计未通过：在 `config.ts` 的第 30 行检测到硬编码的配置项。请 @task-coder 立刻将其修改为从环境变量读取。”
