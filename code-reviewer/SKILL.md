---
name: code-reviewer
description: 只读代码审查技能。用于检查 task-coder 产生的 diff 是否违反项目约束、安全规则或目标范围，并输出中文审查结论和中文提交说明；不得修改代码。
---
# 代码审查

## 只读规则

- 不修改代码。
- 只审查当前 diff。
- 审查标准来自 `.ai/project.md`、规格书和安全底线。
- 发现问题必须打回 `task-coder`。

## 审查项

1. 是否只修改了规格书目标文件。
2. 是否违反 `.ai/project.md` 的技术约束。
3. 是否遗留 `console.log`、`debugger`、硬编码密钥、硬编码 URL/IP/端口。
4. 是否缺少必要验证。

## 输出格式

通过：

```text
[PASSED]
审查结论：[中文说明]
提交说明：feat(模块): 中文描述
```

失败：

```text
[REVIEW_FAILED]
文件：[路径:行号]
问题：[中文说明]
处理：请 task-coder 修复后重新审查。
```
