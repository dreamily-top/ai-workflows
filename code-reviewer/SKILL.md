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
2. **语义与坏味道审查 (Semantic & Smell Review)**：除了被动的脚本当底座，你还必须主动结合项目根目录的 `.ai/conventions.md`（或 `-zh.md`），对**变量命名规范**、**过长或过深的嵌套函数**、**生硬的硬编码逻辑**、以及**潜在的内存泄漏点**进行一次纯语义级别的强制 Review。
3. **出具最终结果打回或通过 (Analyze All Outputs)**：
   - 🔴 只要脚本日志打印了 `status: fail`，或者你在语义层面审查中发现明确违反了 `conventions.md` 的代码坏味道：必须提取错误行号和原因，输出 `[REVIEW_FAILED]` 并立即打回给 `task-coder` 要求重新修改。不允许妥协或放行。
   - 🟢 当且仅当脚本 `status: pass` 且语义层面合规：确认代码合规并放行通过。
4. **生成 Commit 提交 (Generate Commit Info)**：如果在审核全通过的情况下，请直接输出一条符合 Conventional Commits 标准的英文 Commit Message，例如 `feat(module): description...`。

## Example Usage
用户：“请审查一下当前的改动，准备提交。”
助手：“我正在调用代码审计辅助脚本...”
(脚本运行 diff_linter.js 后发现违规项)
助手：“❌ 审计未通过：在 `config.ts` 的第 30 行检测到硬编码的配置项。请 @task-coder 立刻将其修改为从环境变量读取。”
