---
description: "Selection branching for the Web client: grow a Session branch from selected transcript text, with source markers and a navigable branch tree."
kind: package-reference
---

# dsh-branch-companion

English | [中文](README.zh.md)

## Overview

`dsh-branch-companion` adds one path the Web client does not have: growing a branch out of a passage. Selecting text in a transcript reveals **Add to new branch**; choosing it forks the current Session through the Host, opens the child, records the reference, leaves a clickable ⑂ marker beside the quoted text, and keeps a navigable tree in the top-right corner.

The node document lives in the browser (`localStorage`). The Host gains no service and no event; removing the plugin takes away the panel and the markers and nothing else.

## Table of contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further exploration](#further-exploration)
- [Model experience](#model-experience)
- [Known limitations and deferred work](#known-limitations-and-deferred-work)
- [Dev note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

### Interactions

| Action | Result |
|---|---|
| Select text in a transcript | **Add to new branch** appears under the selection |
| Choose it | Forks the current Session, opens the child, prefills `About this passage: "…"` |
| ⑂ marker beside the quote | Jumps to the branch; re-anchors on scroll, re-render, and streaming output |
| **⑂ Branch** pill, top right | Opens the tree; click a node to jump, hover ✕ to remove it and its sub-branches |
| Branch from inside a branch | The child node hangs under its parent and indents accordingly |

### Installation

This package is itself a DSH bundle: it declares `dsh.bundle`, ships its own `cordis.patch.yml`, and needs no manual Loader edit.

Install it with the plugin manager (`plugin_manager`, `action: install_bundle`), passing either spec:

- the repository URL: `https://github.com/Tetro02/dsh-branch-companion`
- a local checkout: `file:C:\path\to\dsh-branch-companion`

The manager writes the profile dependency, selects the bundle, and applies its patch layer live; `remove_bundle` reverts the profile completely. A DSH 0.2.x runtime and the Web UI are required — the Host half exists only so the client half can be composed.

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation details — click to expand</summary>

### Design

The plugin does three things, all in the browser: turn a selection into a fork, record the fork relationship, and draw that record back beside the source text. It registers no slot and renders no React node, so the transcript's own tree is untouched; the price is a dependency on DOM contracts (`[data-conversation-content]`, `[data-conversation-session]`).

Markers never wrap text. The plugin concatenates the transcript's text nodes, matches the stored quote with whitespace-insensitive patterns, builds a Range to measure `getBoundingClientRect()`, and positions an absolutely placed badge to its right. When React re-renders, the next paint measures the new nodes.

### Source map

| File | Responsibility |
|---|---|
| `src/index.ts` | Host half: exists so the Loader can compose the client bundle; no services, no state |
| `src/client/index.ts` | Browser entry: registers dictionaries, mounts the overlay, hands teardown to the plugin fiber |
| `src/client/overlay.ts` | Selection action, source markers, branch panel, prefill retry |
| `src/client/anchor.ts` | Re-anchors a stored quote to the live transcript and returns a Range |
| `src/client/quote.ts` | Quote normalization and whitespace-tolerant matching (pure, unit-tested) |
| `src/client/tree.ts` | Node document parsing, parent/child queries, subtree removal, depth (pure, unit-tested) |
| `src/client/types.ts` | Structural types for the client services used here (no DSH type imports) |
| `scripts/build.mjs` | esbuild emits the Host ESM and the wrapped browser bundle; tsc emits declarations |

### Flow

Selection → `sessions.fork({ sessionId, increaseTitle: true })` → child id → append and persist the node → `uiWorkspace.openSession(childId)` → poll `sessions.binding(childId)` and `conversation.input.requestDraftInitialization` to prefill (up to 15 attempts, 200 ms apart, silent on failure).

</details>

-----

<a id="further-exploration"></a>
## Further exploration

- Fork semantics belong to `sessions.fork` in `@deepseek-ai/dsh-api-session-controller`; title increment and the `atSeq` boundary come from there.
- Navigation belongs to `uiWorkspace.openSession` in `@deepseek-ai/dsh-client-ui-workspace`.
- Composer prefill belongs to `conversation.input.requestDraftInitialization` in `@deepseek-ai/dsh-client-ui-conversation`.

<a id="model-experience"></a>
## Model experience

None directly. The plugin registers no tool, injects no prompt, and sends no message; any difference between a source Session and its branch comes from the user's own input.

#### Token impact

Zero. No system-prompt paragraph, no runtime-context line.

#### KV cache impact

None. The plugin neither assembles nor sends provider requests.

## Known limitations and deferred work

<a id="known-limitations-and-deferred-work"></a>

- **The Host picks the fork point**: `sessions.fork` cuts at the last completed turn by default; the selected text is context and a node reference, not a precise cut.
- **No forking while streaming**: the Host rejects a fork on an unfinished turn; the plugin reports it once.
- **Markers need the text**: if the message is collapsed or rewritten, the quote no longer matches and no marker is drawn, while the node stays in the panel.
- **The panel is an overlay**: it covers the right pane and must be collapsed; no sidebar slot is used.
- **The document is per origin**: a different host or port yields a new `localStorage` and the old document does not follow.
- **No Host configuration**: thresholds (600-character quote cap, 40 markers, retry count) are build-time constants, not Schemastery fields.

### Dev note

<a id="dev-note"></a>

<details>
<summary>Maintainer context — click to expand</summary>

```bash
pnpm install       # esbuild + typescript
pnpm run build     # lib/index.js, lib/client.js, lib/internal/*, lib/types/**
pnpm test          # node --test, pure-function unit tests
pnpm run typecheck # tsc --noEmit
```

A browser bundle must be `window.__ModuleLoader__.load({ id, factory })` with module side effects inside the factory; `scripts/build.mjs` embeds esbuild's IIFE in that factory so nothing runs early.

</details>
