<div align="center">

# ⚙️ SpecOS

*The Next-Generation "Unattended" Fully Automated AI Programming Engine.*

_Transform unpredictable LLMs into a deterministic, high-precision software manufacturing pipeline._

<div>
  <a href="README.md">🇺🇸 English</a> | <a href="README_ZH.md">🇨🇳 简体中文</a>
</div>

<br>
</div>

**Currently in Phase 1 (Skills Integration)**: The project currently operates by exposing local validation scripts as generic AI Skills/Tools. This brings physical role-isolation and a closed-loop SDD workflow to your existing AI workspaces (like Gemini or Claude). A fully standalone, unattended automated programming engine core is currently under active development.

## 📖 Table of Contents

- [✨ Key Features](#-key-features)
- [⚖️ Why This? (The SDD Ecosystem Comparison)](#️-why-this-the-sdd-ecosystem-comparison)
- [📦 Installation](#-installation)
- [🧩 Available Skills](#-available-skills)
- [🚀 Quick Start](#-quick-start)
- [🙏 Acknowledgments / Inspiration](#-acknowledgments--inspiration)

***

## ✨ Key Features

- 🌉 **Cross-Stack Consistency**: Forces continuous impact analysis. Ensures schemas, backend APIs, and frontend views evolve purely across synchronized generated specs.
- 🛡️ **Zero Hallucination Guardrails**: Employs physical file target lists to sandbox the AI. Mathematically blocks LLMs from executing unpredictable out-of-bounds refactoring.
- 🔄 **Self-Healing Loop**: Embeds automated test validation. Intercepts type-check or unit test stack traces and recursively feeds them back to the AI for accurate, autonomous remediation.
- 🧩 **Native Ecosystem Integration**: Ultra-lightweight and decoupled. Plugs directly into an existing CI system, CLI pipeline, or IDE via MCP protocol without forcing a heavy editor adoption.

## ⚖️ Why This? (The SDD Ecosystem Comparison)

Spec-Driven Development (SDD) for AI is rapidly evolving. While other incredible projects focus on standardizing the *format* of the specs or providing full IDEs, **`SpecOS`** focuses on **runtime multi-agent role isolation via executable scripts**.

Here is a sincere comparison within the current SDD landscape:

| Framework | What It Is | Core Philosophy | Pros | Cons vs. This Toolkit |
|:---|:---|:---|:---|:---|
| **[Spec-Kit](https://github.com/spec-kit) / OpenSpec** | CLI tool & Markdown formalization | Create a structured `.md` spec file per feature, then use a CLI to walk a general AI (Claude Code/Copilot) through implementing it. | Lightweight, agent-agnostic, excellent for standardizing human-AI intent. | Relies on a single, general AI session to follow the text. AI can easily lose focus or ignore the spec halfway. |
| **Kiro (AWS)** | Full AI-integrated IDE | A specialized Code-OSS fork where AI agents use "hooks" and native IDE integrations to break specs into atomic sub-tasks. | Incredibly powerful IDE integration; native context awareness. | Heavyweight. Forces you to switch your entire editor/IDE ecosystem. |
| **Smart AI IDEs <br>(Cursor / Windsurf)** | Specialized IDE | "Chat and Apply" style coding with deep workspace indexing and inline completions. | Extremely low-barrier, excellent for daily tasks, boilerplate, and isolated bug fixes within single files. | **Struggles with large, cross-stack migrations**. Prone to updating a backend interface but forgetting to trace and update the corresponding frontend UI unless actively babysat by a human. |
| **`SpecOS`** _(This Repo)_ | Executable Plugin System | **Roles & Physical Scripts**. System Architect outputs specs -> coder strictly executes -> test-runner instantly verifies. | Plugs natively into Gemini/Claude workspaces. Forces cross-stack impact analysis and physically isolates the "designing AI" from the "coding AI". | Requires Node.js scripting environment natively on the host machine. |

## 📦 Installation

This framework acts as external "Skills" or "Tools" for your local AI Agent workspace. You need to copy this repository's contents into your specific Assistant's configuration or skills directory.

**🔹 Gemini Workspace (AntiGravity):**
```bash
# Place inside the global skills folder
C:\Users\<Your_User>\.gemini\antigravity\skills\
```

**🔹 Claude Code / Claude Desktop:**
```bash
# Place inside your local Claude skills or MCP tools directory
~/.claude/skills/
```

**🔹 Cursor / Windsurf:**
While Cursor primarily uses `.cursorrules`, you can register these scripts as custom tools via MCP (Model Context Protocol) by placing them in your project or global config:
```json
// Example .cursor/mcp.json or workspace tools config pointing to:
{
  "command": "node",
  "args": ["<path-to-repo>/test-runner/scripts/run_tests.js"]
}
```

## 🧩 Available Skills

This framework comes with 5 synergistic skills designed to be used sequentially:

| Skill | Role | Description |
|---|---|---|
| `@repo-map-generator` | Context Extractor | Extracts a lightweight AST codebase map (JS/TS, Go, Python, Java) to provide global context. |
| `@system-architect` | Auth & Architect | Analyzes requirements against global conventions and generates cross-stack design Specs with file-level target limits. |
| `@task-coder` | Task Execution | Performs isolated code editing strictly based on the generated Spec. Cannot hallucinate files outside the target list. |
| `@test-runner` | Auto-Verifier | Auto-detects and runs unit test suites, feeding execution error stacks back to the coder for self-healing. |
| `@code-reviewer` | Code Auditor | Scans final code diffs to intercept hardcoded IPs/URLs, plaintext secrets, and invalid convention implementations. |

## 🚀 Quick Start

### 1. Setup Global Conventions (`constitution.md`)
Create an `.ai/conventions.md` file at the root of your target project. Define your architectural boundaries, state management rules, and strict linting constraints here. 
*Both the architect and coder agents are procedurally required to ingest this file before generating a single line of output.*

### 2. Standard SDD Workflow 

Use the following sequential prompt commands to guide your AI assistant through a zero-rework, full-stack workflow:

**Step 1. Extract Project Context**
> "@repo-map-generator, scan the repository and extract the overall AST map to establish context."

**Step 2. Architecture Planning & Impact Analysis**
> "@system-architect, review the context map and `.ai/conventions.md`. I need to add an 'age' field to the User payload. Perform a full-stack impact analysis and output a precise full-stack target list and design spec inside `.ai/specs/`."

**Step 3. Isolated Implementation**
> "@task-coder, implement the changes explicitly mapped out in `.ai/specs/[generated-spec-file].md` without modifying any files outside the defined scope."

**Step 4. Automated Verification**
> "@test-runner, run the automated tests and type-checks. If anything breaks, immediately kick the error stack back to the task-coder to fix it."

**Step 5. Final Code Audit**
> "@code-reviewer, audit the final generated diff. Reject the changes immediately if any global configurations (IPs/secrets) are hardcoded or if conventions are violated."

## 🙏 Acknowledgments / Inspiration

This project stands on the shoulders of giants. The concepts and architectural designs within **SpecOS** were heavily inspired by the following pioneers in the AI coding space:

- **[Aider](https://github.com/paul-gauthier/aider)**: Pioneered the concept of AST repo-mapping and isolated editing, which fundamentally inspired `/repo-map-generator` and `/task-coder`.
- **[Spec-Kit](https://github.com/spec-kit)**: Evangelized the critical importance of Spec-Driven Development (SDD), shifting the paradigm from "prompting" to "specification engineering."
- **[awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)**: Set the standard for how external tools and validation pipelines can be injected into local AI workspaces cleanly and modularly.
