# SpecOS 技能组

给 AI 编程新手用的“王牌程序员”。你只管说需求，它负责先想清楚、再改代码、最后检查。

```text
/ace-programmer，帮我实现 [你的需求]
```

## 解决什么问题

- **AI 改偏了**：先写清楚要改什么、改哪些文件、怎么验收，再动代码。
- **AI 乱改无关文件**：真正写代码的只有 `task-coder`，而且只能按计划改。
- **前后端漏同步**：先检查影响范围，再执行。
- **AI 拿旧代码瞎分析**：保持最新代码地图，高效检索依赖关系。
- **越修越坏**：同一个问题反复修不好就停下说明原因。
- **交付看不懂**：计划、恢复方案、审查结论、注释、提交说明默认中文。

## 怎么用

```text
/ace-programmer，帮我给用户资料新增年龄字段，前后端、校验和测试一起同步。
```

```text
/ace-programmer，修复订单详情页刷新后状态丢失的问题。
```

```text
/ace-programmer，把支付模块重复的校验逻辑整理成公共方法，但不要改无关文件。
```

## 在线安装

Windows：

```powershell
irm https://raw.githubusercontent.com/mosshello/spec-os/master/scripts/install-from-release.ps1 | iex; Install-SpecOS
```

macOS / Linux：

```bash
curl -fsSL https://raw.githubusercontent.com/mosshello/spec-os/master/scripts/install-from-release.sh | bash -s
```

## 本地安装

Windows：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-skills.ps1 -Target all
```

macOS / Linux：

```bash
bash scripts/install-skills.sh all
```

Cursor 默认安装到：

```text
C:\Users\用户名\.cursor\skills-cursor
```

自定义 Cursor 目录：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-skills.ps1 -Target cursor -CursorPath "D:\your\cursor\skills"
```

## 包含的技能

| 技能 | 作用 |
|---|---|
| `ace-programmer` | 唯一入口，负责安排整个过程 |
| `project-context` | 保存项目基本信息 |
| `system-architect` | 写中文改动计划 |
| `repo-map-generator` | 查看相关代码并检查是否过期 |
| `task-coder` | 唯一真正改代码的技能 |
| `code-reviewer` | 最后检查有没有乱改、漏改、硬编码 |
