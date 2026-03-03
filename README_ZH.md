<div align="center">

# ⚙️ SpecOS

*下一代“无人值守”的全栈自动化 AI 编程引擎*

_让大模型褪去随性，化身为精密运转的自动化软件生产线_

<div>
  <a href="README.md">🇺🇸 English</a> | <a href="README_ZH.md">🇨🇳 简体中文</a>
</div>

<br>
</div>

**当前处于第一阶段 (Phase 1)**：通过将底层验证探针封装为 AI 技能 (Skills) 运行，为现有的 AI 助手 (如 Gemini / Claude) 提供物理级角色隔离与闭环开发工作流。后续更深度的、独立的“自动化编程引擎客户端”正在积极编码研发中。

## 📖 目录 (Table of Contents)

- [✨ 核心特性](#-核心特性)
- [⚖️ 方案对比：我们处于 SDD 生态的哪个位置？](#️-方案对比我们处于-sdd-生态的哪个位置)
- [📦 安装指南 (Installation)](#-安装指南-installation)
- [🧩 可用技能 (Available Skills)](#-可用技能-available-skills)
- [🚀 快速接入 (Quick Start)](#-快速接入-quick-start)
- [🙏 致谢与灵感来源 (Acknowledgments)](#-致谢与灵感来源-acknowledgments)

***


## ✨ 核心特性

- 🌉 **跨端一致性 (Cross-Stack Consistency)**：强制推演全局修改联动。底层 Schema、后端 API 与前端视图在生成的 Spec 清单中必须保持强同步进化。
- 🛡️ **隔离防幻觉 (Zero Hallucination)**：通过实体脚本划定代码修改白名单。彻底切断大模型在开发中发散重构无关文件的越轨行为。
- 🔄 **闭环自愈纠错 (Self-Healing Loop)**：内置自动化验证探针。物理抓取测试阶段的编译/类型约束报错堆栈，回传给 AI 触发准确定位与自我修复。
- 🧩 **生态热插拔 (Plug & Play)**：极轻量架构。无需强制绑定专有 IDE，可通过 MCP 协议或命令行原生挂载至 Cursor、Claude 及各种终端流中。

## ⚖️ 方案对比：我们处于 SDD 生态的哪个位置？

随着规范驱动开发 (Spec-Driven Development, SDD) 的爆发，业界涌现了多种解法。秉承开源的真诚态度，我们与目前最优秀的几个开源项目进行了横向对比：

| 框架 / 工具 | 它的形态 | 核心理念 | 优势 | 相比本框架的区别与劣势 |
|:---|:---|:---|:---|:---|
| **[Spec-Kit](https://github.com/spec-kit) / OpenSpec** | CLI 工具 + Markdown 协议 | 为每个需求创建一个标准化的 `.md` 规格书，然后用 CLI 引导通用 AI (如 Claude/Copilot) 按步骤阅读并实现代码。 | 非常轻量，专注于将“人类意图”结构化，完美规范团队的需求提交流程。 | 它依然依赖“单一全能大模型”的注意力。大模型在阅读长长的规格书写代码时，极易中途失焦、忘掉前置约束。|
| **Kiro (AWS)** | 绑定 AI 的原生 IDE | 亚马逊开源的一整个编辑器，里面原生集成了 Agent 钩子（Hooks），能自动把规格书拆解成原子任务执行。| 极强的 IDE 上下文一体化体验，多智能体调度十分顺滑。 | 太重了。为了实现 SDD，你必须彻底放弃你现在的 VSCode/Cursor，搬家去用它的编辑器。 |
| **智能 AI IDE <br>(Cursor / Windsurf)** | 补全强化型编辑器 | 通过全局索引、侧边栏聊天与代码库问答，实现“随问随写 (Chat & Apply)”式的敏捷编码流。| 日常小动作极度轻量且门槛极低，适合写工具函数或修复单纯 Bug。| **难以执行复杂的跨栈一致性修改**。极易发生“改了后端文件，但模型忘了滚去另一个目录改前端”的漏单现象。必须高度依赖人在旁边做纠偏保姆。|
| **`SpecOS`** *(本框架)* | 轻量级可执行指令系统 | **物理脚本隔离 + 多重防线**。不单纯指望大模型读规格书，而是把“架构规划”、“任务写码”、“测试验证”通过 Node.js 脚本物理剥离互斥。| 极度抗“幻觉”。架构图纸、代码 Diff、跑测报错全部都是底层脚本实体抓取的。可随时插拔到你现有的模型配置中。| 需要物理宿主机环境支持基本的 Node.js / 命令行生态运行上述验证脚本。|

## 📦 安装指南 (Installation)

由于本系统自带可以直接执行的 JS 脚本（用于读取项目、跑测、静态分析），你需要将本仓库集成进你的 AI 本地 Agent 工具箱（Tools/Skills）目录下。

**🔹 Gemini 工作区 (AntiGravity):**
```bash
# 放置于全局的技能目录下：
C:\Users\<你的名字>\.gemini\antigravity\skills\
```

**🔹 Claude Code / Claude Desktop:**
```bash
# 拷贝至 Claude 的本地自定义工具链目录：
~/.claude/skills/ 
```

**🔹 Cursor / Windsurf 接入建议:**
Cursor 主要是基于规则文件，如果你想接入可执行文件，建议通过其 MCP (Model Context Protocol) 或者自定义工具命令的方式指向我们的脚本集：
```json
// 在项目的 .cursor/mcp.json 中注册本地工具，允许 AI 直接调用：
{
  "command": "node",
  "args": ["<本仓库路径>/code-reviewer/scripts/diff_linter.js"]
}
```
配置完成后，在任意工作区唤起 AI 对话时即可使用以下 `@` 指令。

## 🧩 可用技能 (Available Skills)

本套件内置以下 5 个必须协同使用的技能卡片：

| 技能指令 | 角色定位 | 功能描述 |
|---|---|---|
| `@repo-map-generator` | 上下文提取器 | 基于 AST 解析代码骨架，为下游提供精准的全栈视野（支持 Go/Python/Java/TS）。 |
| `@system-architect` | 系统架构师 | 结合 `conventions.md` 和需求，生成跨栈的架构规格书（Specs）并划定受波及的修改文件清单。 |
| `@task-coder` | 任务执行员 | 严格依照 Specs 规格说明书内的限制清单进行受控修改，拦截发散修改行为。 |
| `@test-runner` | 自动化测试验证 | 自动探测环境跑测并拦截编译、类型等错误，将报错堆栈自动打回给 Coder 触发自我修复。 |
| `@code-reviewer` | 静态代码审查 | 执行机器级 Diff 审计，拦截遗漏的硬编码 URL/IP、明文密码以及违反全局约定的缺陷。 |

## 🚀 快速接入 (Quick Start)

### 1. 配置全局宪法 (Global Constitution)
在使用 SDD 流程前，你必须先在目标项目的根目录下创建一个 `.ai/conventions.md`（或含 `-zh.md` 的双语约束）宪法文件。在里面书写你项目特有的技术栈限制和安全红线。
*本框架强制要求任务编码与架构 AI 在启动前，必须前置读取该规则。*

### 2. 标准 SDD 工作流示例 (Usage)

在平时开发时，你可以将以下指令顺次提供给你的 AI 辅助工具，以一条龙完成高质量的跨平台改动：

**Step 1. 全局地图提取**
> "@repo-map-generator，为我提取当前仓库的 AST 结构地图准备上下文。"

**Step 2. 影响面推演与契约生成 (Specs)**
> "@system-architect，查阅上下文地图和全局约束（.ai/conventions.md）。需求：在用户信息中新增 age 字段。请帮我进行全栈影响面分析，在 `.ai/specs/` 目录下输出一份包含受影响文件清单及完整契约的技术规格书。"

**Step 3. 隔离受控的编码执行**
> "@task-coder，读取 `.ai/specs/[刚才生成的文件名].md` 文件。严格根据被列出的文件清单及要求进行代码实现，不准偏离。"

**Step 4. 自动化测试与验证兜底**
> "@test-runner，执行本地自动化类型检查和单元测试。如果捕获到抛错堆栈，立刻将堆栈信息反馈给 task-coder 自动修复。"

**Step 5. 合并前最终审计**
> "@code-reviewer，审查本次变更 Diff。检查是否存在违规的硬编码（IP/密码）及异常引入，确认无误后输出最终 Commit。"

## 🙏 致谢与灵感来源 (Acknowledgments)

开源世界的繁荣离不开前驱者的探索。**SpecOS** 框架中的角色隔离理念与运行机制深受以下杰出开源项目的启发：

- **[Aider](https://github.com/paul-gauthier/aider)**：Aider 开创性的 AST 仓库地图提取 (Repomap) 与局灶隔离编辑模式，直接启发了本项目中 `@repo-map-generator` 与 `@task-coder` 的工程化设计。
- **[Spec-Kit](https://github.com/spec-kit) 体系**：极大地普及了规范驱动开发 (SDD) 的核心心智模型，让大家意识到“工程构建”比“单纯提示大模型”更重要。
- **[awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)** 等技能库：为本地 AI 提供外挂验证流的“Skills 协议封装”提供了绝佳的格式参考和接入灵感。
