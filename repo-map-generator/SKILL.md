---
name: repo-map-generator
description: 降级为辅助性深潜工具。仅针对特定模块提取抽象语法树（AST），用于辅助精细的系统设计，严禁用于项目整体宏观理解。
---
# Repository Map Generator (AST 局部解析钻探机)

## Core Purpose
此技能已经从"必经的全局扫描站"降级为"按需呼叫的局部侦察无人机"。它利用 AST（抽象语法树）为大模型提供精确到函数签名的文件结构，但为了避免 token 和时间浪费，它**只在明确缩小范围后使用**。

## Instructions

1. **克制调用 (Restraint)**：如果是想了解项目整体干嘛的，请调用 `project-context`。只有当 `system-architect` 或你在执行具体任务时，发现对某个局部目录内部到底导出了哪些钩子、函数接口两眼一抹黑时，才被允许启动此技能。
2. **严控准星 (Targeted Scan)**：运行同层目录的 `scripts/ast_extractor.js <具体的子目录或具体文件>`。绝对不允许运行 `ast_extractor.js ./` 去扫根目录引发爆炸。
3. **临时投递 (Volatile Output)**：结果可以导入 `.ai/tmp/local_map.txt`，供 `system-architect` 设计类图或组件契约时借鉴参考。
4. **阅后即焚 (Ephemeral)**：明确告知系统该文件只服务于本次设计，不用留档。
