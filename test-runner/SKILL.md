---
name: test-runner
description: 自动探测项目测试框架并运行测试。解析测试结果，失败时驱动 task-coder 修复。
---
# Test Runner (测试执行者)

## Core Purpose (核心目标)
此技能负责在 task-coder 编码完成后，自动发现并运行项目测试，验证代码改动的正确性。保障代码交付前通过环境验证。

## 武器库执行令 (Scripts Payload)
👉 **运行方式**：
```bash
node C:\Users\mr_zh\.gemini\antigravity\skills\test-runner\scripts\run_tests.js
```

## Workflow (工作流)
1. **执行测试 (Run Tests)**：调用执行令，脚本会自动探测项目语言（如 `npm test`, `go test`）并运行。
2. **分析结果 (Analyze Results)**：
   - **通过**：确认测试完毕，通知用户进入下游 `code-reviewer` 环节。
   - **失败**：提取失败堆栈，将报错反馈给 `task-coder` 要求精准修复。
3. **熔断机制 (Circuit Breaker)**：若循环修复超过 3 次依旧失败，立即停止并输出 `[BLOCKED]`，交还给人类介入。
