---
name: repo-map-generator
description: 提取存储库结构映射（AST/文件树），提供精确的上下文，避免加载完整文件内容。灵感来自 Aider 的 Repomap。
---
# Repository Map Generator (多语言代码库地形扫描仪)

## Core Purpose
此技能专用于在进行跨文件分析或大规模系统设计前，快速提取项目结构骨架（函数签名、类等）。**严禁采用全文抓取模式**，以此防止大模型注意力衰退和上下文 Token 的浪费。

## Context & Components
本技能利用内置的同目录底层脚本 `scripts/ast_extractor.js` 来完成静态扫图，目前支持解析 `.ts`, `.go`, `.py`, `.java` 等高频语言。

## Instructions
当你被要求熟悉新项目、搜寻上下文或者提取架构依赖时，请严格按照以下步骤操作：

1. **定位扫描区**：明确用户指令或你需要探索的目标目录相对路径。
2. **召唤硬件级探测**：调用命令行运行本技能所在目录的 `scripts/ast_extractor.js <目标目录>`，你将得到一棵纯净的依赖与对象签名树。绝对禁止使用普通的内容搜索工具去瞎猜上下文。
3. **组织分析结果**：将脚本输出的抽象语法树（AST），进行快速排版，形成清晰的 `Repo Map` 响应。
4. **传递上下文**：这张地图不仅供你个人查阅，更是下一步转交给 `system-architect` 设计契约时的基石。

## Example Usage
当用户说：“帮我梳理一下 apps/studio 里面的上下文。”
你应当执行节点脚本 `node <当前技能目录>/scripts/ast_extractor.js ./apps/studio`。
得到结果后，简洁明了地输出其树状概要。
