---
name: repo-map-generator
description: 只读局部代码侦察技能。用于在设计或执行前生成指定文件/目录的 AST 地图，并用脚本校验地图是否过期；不得扫描仓库根目录，不得修改代码。
---
# 局部代码侦察

## 必须使用的场景

- 规格书涉及不熟悉的模块。
- 需求跨前后端、接口、数据模型或状态管理。
- 上次生成地图后发生过提交、目标文件修改或路径移动。
- 分析需要依赖函数、类型、导出结构。

## 强制流程

1. 先选定具体文件或子目录，禁止使用仓库根目录。
2. 生成地图：

```bash
node repo-map-generator/scripts/ast_extractor.js <具体文件或目录> --out .ai/tmp/repo-map.md
```

3. 使用地图前必须校验：

```bash
node repo-map-generator/scripts/check_map_freshness.js .ai/tmp/repo-map.md
```

4. 校验失败就重新生成地图。没有新鲜地图，不允许继续做结构分析。

## 过期判定

`check_map_freshness.js` 会拦截这些情况：

- 地图文件不存在。
- 地图缺少元数据。
- 当前 git 提交号和生成地图时不同。
- 地图记录的任意文件不存在或 hash 变化。

## 输出用途

- 只给本次规格书或执行前确认使用。
- 不写入长期记忆。
- 不替代测试、类型检查或代码审查。
