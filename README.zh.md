---
description: "划词分支助手：框选对话文字后从该处开新分支，保留原文标记与可跳转的分支树面板。"
kind: package-reference
---

# dsh-branch-companion

[English](README.md) | 中文

## 概述

`dsh-branch-companion` 给 Web 客户端加一条“从这段文字长出一个分支”的路径：选中回答或提问中的一段文字，浮出的**添加到新的分支**会以当前 Session 为源调用 Host 的 Session fork，随后打开子 Session、记录引用、在原文旁留一个可点击的 ⑂ 标记，并在右上角维护一棵可跳转的分支树。

节点由浏览器持有（`localStorage`），Host 不新增任何服务或事件；去掉这个插件只会带走面板与标记，不会动 Session、不会动历史。

## 目录

- [使用本包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [进一步探索](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

### 交互

| 操作 | 结果 |
|---|---|
| 在对话正文里框选文字 | 选区下方浮出**添加到新的分支** |
| 点击该按钮 | 以当前 Session 为源 fork 子 Session，打开它，并把 `关于这段内容：「…」` 预填进输入框 |
| 原文选区右侧的 ⑂ 标记 | 点击跳到对应分支；标记随滚动、重排、流式输出重新贴合 |
| 右上角**⑂ 分支**胶囊 | 展开分支树；点击节点跳转，悬停 ✕ 移除该节点及其子分支 |
| 分叉后继续分叉 | 子分支挂在父节点下，按层级缩进 |

### 安装

这个包本身就是一个 DSH bundle：声明了 `dsh.bundle`、自带 `cordis.patch.yml`，不需要手工改 Loader。

用插件管理器（`plugin_manager`，`action: install_bundle`）安装，target 传下面任一 spec：

- 仓库地址：`https://github.com/Tetro02/dsh-branch-companion`
- 本地目录：`file:C:\path\to\dsh-branch-companion`

管理器会写入 profile 依赖、选中该 bundle，并热应用它的 patch 层；`remove_bundle` 可整体回退。需要 DSH 0.2.x 与 Web UI——Host 半边只为让客户端半边能被组合出来。

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现细节——点击展开</summary>

### 设计思路

插件只做三件事，且都在浏览器里：把一次选区变成一次 fork、把 fork 关系记录下来、把记录画回原文旁边。它不注册 slot、不渲染 React 节点，因此不改动 transcript 的宿主结构；代价是依赖 DOM 契约（`[data-conversation-content]`、`[data-conversation-session]`）。

标记不包裹文字。它把 transcript 的文本节点拼成一个字符串，用去掉空白差异的匹配找到引用的片段，生成一个 Range 量出 `getBoundingClientRect()`，再把绝对定位的徽标放到右侧——React 重渲染后旧节点消失、新节点就位，下一次重绘自动贴合。

### 源码地图

| 文件 | 职责 |
|---|---|
| `src/index.ts` | Host 半侧：只为让 Loader 组合客户端 bundle 而存在，无服务、无状态 |
| `src/client/index.ts` | 浏览器入口：注册词典、挂载 overlay、把清理交给插件 fiber |
| `src/client/overlay.ts` | 选区动作、来源标记、分支树面板、预填重试 |
| `src/client/anchor.ts` | 把存储的引用重新锚定到当前 transcript，返回 Range |
| `src/client/quote.ts` | 引用规范化与空白容忍匹配（纯函数，可单测） |
| `src/client/tree.ts` | 节点文档的解析、父子关系、子树移除、深度（纯函数，可单测） |
| `src/client/types.ts` | 用到的客户端服务结构类型（不引入 DSH 类型依赖） |
| `scripts/build.mjs` | esbuild 产出 Host ESM 与包装后的浏览器 bundle，tsc 产出声明 |

### 主流程

选区 → `sessions.fork({ sessionId, increaseTitle: true })` → 子 Session id → 追加节点并落盘 → `uiWorkspace.openSession(childId)` → 轮询 `sessions.binding(childId)` 与 `conversation.input.requestDraftInitialization` 完成预填（最多 15 次、每次 200 ms，失败静默）。

</details>

-----

<a id="further-exploration"></a>
## 进一步探索

- Session fork 语义见 `@deepseek-ai/dsh-api-session-controller` 的客户端 `sessions.fork`；标题递增与 `atSeq` 边界都由它决定。
- 导航入口见 `@deepseek-ai/dsh-client-ui-workspace` 的 `uiWorkspace.openSession`。
- 文档预填见 `@deepseek-ai/dsh-client-ui-conversation` 的 `conversation.input.requestDraftInitialization`。

<a id="model-experience"></a>
## 模型体验

无直接内容。插件不注册工具、不注入提示词、不发送消息；分支会话之间的可见差异只来自用户自己的输入。

#### Token 影响

零。没有系统提示词段落，没有运行时上下文行。

#### KV Cache 影响

无。插件不组装也不发送提供方请求。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- **分叉点由 Host 决定**：`sessions.fork` 默认切在最后一个已完成轮次；选中的文字只作为上下文与节点引用，不是“精确到这条消息”的切面。
- **流式回答中不能分叉**：Host 拒绝在未完成轮次上 fork，插件只给出一次失败提示。
- **标记依赖文本还在**：消息被折叠（工作过程详情）或被改写时，引用匹配不到就不画标记，节点仍在面板里。
- **面板是浮层**：覆盖右栏内容，需要手动收起；没有接入侧边栏 slot。
- **文档按 Origin 存**：换 host/端口会得到新的 `localStorage`，旧的节点文档不会跟过去。
- **没有 Host 配置**：阈值（引用上限 600 字、标记上限 40、重试次数）是编译期常量，不是 Schemastery 配置项。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文——点击展开</summary>

```bash
pnpm install       # esbuild + typescript
pnpm run build     # lib/index.js、lib/client.js、lib/internal/*、lib/types/**
pnpm test          # node --test，纯函数单测
pnpm run typecheck # tsc --noEmit
```

浏览器 bundle 必须是 `window.__ModuleLoader__.load({ id, factory })` 形式，且模块副作用留在 factory 内；`scripts/build.mjs` 把 esbuild 的 IIFE 包进 factory，就是为了不提前执行。

</details>
