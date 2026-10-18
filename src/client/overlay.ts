/**
 * The overlay: selection action, surface markers, and the branch panel.
 *
 * Everything the plugin draws lives in one fixed, pointer-transparent layer
 * appended to `<body>`. The transcript itself is never mutated — markers are
 * re-measured against a Range on every paint, so React can re-render freely.
 *
 * @module dsh-branch-companion/client/overlay
 */

import { findQuoteRange } from './anchor.js'
import { normalizeQuote } from './quote.js'
import {
  STORAGE_KEY,
  parentOf,
  parseNodes,
  removeSubtree,
  serializeNodes,
  sortByCreated,
  type BranchNode
} from './tree.js'
import type { CapturedSelection, ClientContext, Translate } from './types.js'

/** Root element id; its presence also makes mounting idempotent. */
const ROOT_ID = 'dsh-branch-root'

/** Marker cap, so a huge document cannot turn every paint into a full scan. */
const MAX_MARKERS = 40

/** Attribution of the CSS tag, matching the module system's convention. */
const CSS_TAG = 'dsh-branch-companion/overlay.css'

const CSS = `
#${ROOT_ID}{position:fixed;inset:0;pointer-events:none;z-index:2147482000;font:inherit;color:var(--dsw-alias-label-primary,#1f2328)}
#${ROOT_ID} *{box-sizing:border-box}
.dbc-action{position:fixed;pointer-events:auto;display:none;align-items:center;gap:6px;height:30px;padding:0 12px;border:.5px solid var(--dsw-alias-border-l3,#c9ced6);border-radius:999px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 4px 16px rgba(0,0,0,.14);cursor:pointer;font-size:12.5px;line-height:18px;color:var(--dsw-alias-label-primary,#1f2328);white-space:nowrap}
.dbc-action:hover{background:linear-gradient(var(--dsw-alias-interactive-bg-hover,#eef1f5),var(--dsw-alias-interactive-bg-hover,#eef1f5)),var(--dsw-alias-bg-layer-1,#fff)}
.dbc-action:active{transform:translateY(.5px)}
.dbc-pill{position:fixed;right:14px;top:124px;pointer-events:auto;display:flex;align-items:center;gap:6px;height:32px;padding:0 14px;border:.5px solid var(--dsw-alias-border-l3,#c9ced6);border-radius:999px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 6px 20px rgba(0,0,0,.16);cursor:pointer;font-size:12.5px;color:var(--dsw-alias-label-primary,#1f2328)}
.dbc-pill:hover{background:linear-gradient(var(--dsw-alias-interactive-bg-hover,#eef1f5),var(--dsw-alias-interactive-bg-hover,#eef1f5)),var(--dsw-alias-bg-layer-1,#fff)}
.dbc-panel{position:fixed;right:14px;top:164px;width:340px;max-height:64vh;pointer-events:auto;display:none;flex-direction:column;border:.5px solid var(--dsw-alias-border-l3,#c9ced6);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 12px 36px rgba(0,0,0,.22);overflow:hidden}
.dbc-panel.open{display:flex}
.dbc-head{display:flex;align-items:center;gap:8px;padding:10px 10px 9px 14px;border-bottom:.5px solid var(--dsw-alias-border-l4,#e3e6ea)}
.dbc-title{font-size:13.5px;font-weight:600;line-height:20px;white-space:nowrap}
.dbc-count{font-size:12px;line-height:20px;color:var(--dsw-alias-label-caption,#6b7280)}
.dbc-spacer{flex:1}
.dbc-iconbtn{display:flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border:0;border-radius:6px;background:0 0;color:var(--dsw-alias-label-caption,#6b7280);cursor:pointer}
.dbc-iconbtn:hover{background:var(--dsw-alias-interactive-bg-hover,#eef1f5);color:var(--dsw-alias-label-primary,#1f2328)}
.dbc-glyph{display:block;flex:none}
.dbc-iconbtn .dbc-glyph{width:16px;height:16px}
.dbc-list{overflow:auto;padding:6px}
.dbc-empty{padding:10px 8px 12px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-caption,#6b7280)}
.dbc-group + .dbc-group{margin-top:2px}
.dbc-row{display:flex;align-items:center;gap:8px;height:32px;padding:0 8px;border-radius:8px;cursor:pointer;font-size:13px;line-height:18px;color:var(--dsw-alias-label-primary,#1f2328)}
.dbc-row:hover{background:var(--dsw-alias-interactive-bg-hover,#eef1f5)}
.dbc-root{font-weight:600}
.dbc-chev{display:flex;align-items:center;justify-content:center;width:16px;height:16px;flex:none;padding:0;border:0;border-radius:4px;background:0 0;color:var(--dsw-alias-label-caption,#6b7280);cursor:pointer;transition:transform .15s ease}
.dbc-chev.collapsed{transform:rotate(-90deg)}
.dbc-chev.placeholder{visibility:hidden;pointer-events:none}
.dbc-chev .dbc-glyph{width:14px;height:14px}
.dbc-ico{width:16px;height:16px;color:var(--dsw-alias-label-caption,#6b7280)}
.dbc-ico.blue{color:var(--dsw-alias-state-business-primary,#3b6ef0)}
.dbc-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dbc-node.current .dbc-label{color:var(--dsw-alias-label-secondary,#4b5563)}
.dbc-dot{width:6px;height:6px;border-radius:50%;flex:none;background:var(--dsw-alias-state-business-primary,#3b6ef0)}
.dbc-del{opacity:0;flex:none;border:0;background:0 0;cursor:pointer;color:var(--dsw-alias-label-caption,#6b7280);font-size:12px;line-height:1;padding:2px 3px;border-radius:4px}
.dbc-row:hover .dbc-del{opacity:1}
.dbc-del:hover{color:#d14343;background:rgba(209,67,67,.1)}
.dbc-kids{margin-left:15px;padding-left:9px;border-left:1px solid var(--dsw-alias-border-l4,#e3e6ea)}
.dbc-foot{display:flex;flex-direction:column;gap:1px;padding:8px 14px 10px;border-top:.5px solid var(--dsw-alias-border-l4,#e3e6ea);font-size:11.5px;line-height:1.7;color:var(--dsw-alias-label-caption,#6b7280)}
.dbc-foot[hidden]{display:none}
.dbc-badge{position:fixed;pointer-events:auto;display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;border:.5px solid var(--dsw-alias-state-business-primary,#3b6ef0);background:rgba(59,110,240,.1);color:var(--dsw-alias-state-business-primary,#3b6ef0);font-size:11px;line-height:1;cursor:pointer;padding:0}
.dbc-badge:hover{background:rgba(59,110,240,.22)}
.dbc-toast{position:fixed;left:50%;bottom:64px;transform:translateX(-50%);pointer-events:none;background:rgba(24,26,30,.92);color:#fff;font-size:12.5px;line-height:18px;padding:8px 14px;border-radius:8px;opacity:0;transition:opacity .18s}
.dbc-toast.show{opacity:1}
`

/** Marker repaint coalescing window, in milliseconds. */
const MARKER_DEBOUNCE_MS = 220

/** How long composer prefill keeps retrying while the child Session mounts. */
const PREFILL_ATTEMPTS = 15

/** Interval that notices a Session switch, in milliseconds. */
const SESSION_TICK_MS = 900

/** Inline 16×16 glyph paths, stroked with `currentColor`. */
const ICON_CHEVRON = '<path d="M4.5 6.25 8 9.75l3.5-3.5"/>'
const ICON_FOLDER = '<path d="M2.3 4.5c0-.7.6-1.2 1.2-1.2h3l1.4 1.6h5.6c.7 0 1.2.6 1.2 1.2v6.2c0 .7-.6 1.2-1.2 1.2H3.5c-.7 0-1.2-.6-1.2-1.2z"/>'
const ICON_COMMENT = '<path d="M2.8 4.4c0-.7.6-1.2 1.2-1.2h8c.7 0 1.2.6 1.2 1.2v4.6c0 .7-.6 1.2-1.2 1.2H7.4l-2.5 2.2v-2.2H4c-.7 0-1.2-.6-1.2-1.2z"/>'
const ICON_COLLAPSE = '<rect x="5.6" y="2.6" width="7.8" height="7.8" rx="1.6"/><path d="M3.1 6v5.2c0 .9.8 1.7 1.7 1.7h5.2"/><path d="M8.3 6.5h2.4"/>'
const ICON_CLOSE = '<path d="M4.6 4.6l6.8 6.8M11.4 4.6l-6.8 6.8"/>'

/** Create a node id that is unique enough for a per-browser document. */
function createId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** Build one inline SVG glyph from raw markup. */
function glyph(markup: string, className: string): SVGSVGElement {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  node.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  node.setAttribute('viewBox', '0 0 16 16')
  node.setAttribute('fill', 'none')
  node.setAttribute('stroke', 'currentColor')
  node.setAttribute('stroke-width', '1.4')
  node.setAttribute('stroke-linecap', 'round')
  node.setAttribute('stroke-linejoin', 'round')
  node.setAttribute('aria-hidden', 'true')
  node.setAttribute('class', className)
  node.innerHTML = markup
  return node
}

/** Leaf rows keep the disclosure column so icons line up by depth. */
function placeholderChevron(): HTMLElement {
  const pad = document.createElement('span')
  pad.className = 'dbc-chev placeholder'
  pad.setAttribute('aria-hidden', 'true')
  return pad
}

/** The overlay controller: one instance per mounted plugin. */
export class BranchOverlay {
  private readonly ctx: ClientContext
  private readonly t: Translate
  private readonly root: HTMLElement
  private readonly style: HTMLStyleElement
  private readonly action: HTMLButtonElement
  private readonly pill: HTMLButtonElement
  private readonly panel: HTMLElement
  private readonly count: HTMLElement
  private readonly collapseAll: HTMLButtonElement
  private readonly list: HTMLElement
  private readonly foot: HTMLElement
  private readonly toast: HTMLElement
  private nodes: BranchNode[]
  /** Group and node keys whose children are hidden in the panel. */
  private readonly collapsed = new Set<string>()
  private panelOpen = false
  private selection: CapturedSelection | null = null
  private markers: HTMLElement[] = []
  private lastSession: string | undefined
  private paintQueued = false
  private toastTimer = 0
  private tickTimer = 0
  private readonly mutation: MutationObserver

  /**
   * @param ctx - client root context.
   * @param t - translation bound to this plugin's namespace.
   */
  constructor(ctx: ClientContext, t: Translate) {
    this.ctx = ctx
    this.t = t
    this.nodes = parseNodes(this.readStored())
    this.style = document.createElement('style')
    this.style.dataset.plugin = 'dsh-branch-companion'
    this.style.dataset.pluginCss = CSS_TAG
    this.style.textContent = CSS

    this.root = document.createElement('div')
    this.root.id = ROOT_ID

    this.action = document.createElement('button')
    this.action.type = 'button'
    this.action.className = 'dbc-action'
    this.action.textContent = t('action.add')
    this.action.title = t('action.hint')

    this.pill = document.createElement('button')
    this.pill.type = 'button'
    this.pill.className = 'dbc-pill'

    this.panel = document.createElement('div')
    this.panel.className = 'dbc-panel'
    const head = document.createElement('div')
    head.className = 'dbc-head'
    const title = document.createElement('span')
    title.className = 'dbc-title'
    title.textContent = t('panel.title')
    this.count = document.createElement('span')
    this.count.className = 'dbc-count'
    const spacer = document.createElement('span')
    spacer.className = 'dbc-spacer'
    this.collapseAll = document.createElement('button')
    this.collapseAll.type = 'button'
    this.collapseAll.className = 'dbc-iconbtn'
    this.collapseAll.title = t('panel.collapseAll')
    this.collapseAll.setAttribute('aria-label', t('panel.collapseAll'))
    this.collapseAll.appendChild(glyph(ICON_COLLAPSE, 'dbc-glyph'))
    const close = document.createElement('button')
    close.type = 'button'
    close.className = 'dbc-iconbtn'
    close.title = t('panel.close')
    close.setAttribute('aria-label', t('panel.close'))
    close.appendChild(glyph(ICON_CLOSE, 'dbc-glyph'))
    head.append(title, this.count, spacer, this.collapseAll, close)

    this.list = document.createElement('div')
    this.list.className = 'dbc-list'

    this.foot = document.createElement('div')
    this.foot.className = 'dbc-foot'
    const hintOpen = document.createElement('span')
    hintOpen.textContent = t('panel.hintOpen')
    const hintRemove = document.createElement('span')
    hintRemove.textContent = t('panel.hintRemove')
    this.foot.append(hintOpen, hintRemove)

    this.panel.append(head, this.list, this.foot)

    this.toast = document.createElement('div')
    this.toast.className = 'dbc-toast'

    this.root.append(this.action, this.pill, this.panel, this.toast)

    this.collapseAll.addEventListener('click', () => this.toggleAll())
    close.addEventListener('click', () => {
      this.panelOpen = false
      this.render()
    })
    this.pill.addEventListener('click', () => {
      this.panelOpen = !this.panelOpen
      this.render()
    })
    this.action.addEventListener('mousedown', (event) => event.preventDefault())
    this.action.addEventListener('click', (event) => {
      event.preventDefault()
      void this.createBranch()
    })

    this.mutation = new MutationObserver(() => this.scheduleMarkers())
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.onSelectionChange = this.onSelectionChange.bind(this)
  }

  /** Attach the layer and every listener. */
  mount(): void {
    document.head.appendChild(this.style)
    document.body.appendChild(this.root)
    document.addEventListener('mouseup', this.onMouseUp, true)
    document.addEventListener('mousedown', this.onMouseDown, true)
    document.addEventListener('keyup', this.onKeyUp, true)
    document.addEventListener('selectionchange', this.onSelectionChange)
    window.addEventListener('scroll', this.onScroll, true)
    window.addEventListener('resize', this.onScroll)
    this.mutation.observe(document.body, { childList: true, subtree: true })
    this.tickTimer = window.setInterval(() => this.tick(), SESSION_TICK_MS)
    this.render()
    this.scheduleMarkers()
  }

  /** Detach everything and drop this instance's DOM. */
  dispose(): void {
    document.removeEventListener('mouseup', this.onMouseUp, true)
    document.removeEventListener('mousedown', this.onMouseDown, true)
    document.removeEventListener('keyup', this.onKeyUp, true)
    document.removeEventListener('selectionchange', this.onSelectionChange)
    window.removeEventListener('scroll', this.onScroll, true)
    window.removeEventListener('resize', this.onScroll)
    this.mutation.disconnect()
    window.clearInterval(this.tickTimer)
    window.clearTimeout(this.toastTimer)
    this.style.remove()
    this.root.remove()
  }

  /** Read the persisted document, tolerating a blocked `localStorage`. */
  private readStored(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  }

  /** Persist the document, tolerating quota and private-mode failures. */
  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, serializeNodes(this.nodes))
    } catch {
      /* storage unavailable: the current page still works */
    }
  }

  /** Show a transient message. */
  private notify(message: string): void {
    this.toast.textContent = message
    this.toast.classList.add('show')
    window.clearTimeout(this.toastTimer)
    this.toastTimer = window.setTimeout(() => this.toast.classList.remove('show'), 2600)
  }

  /** The Session shown in the main pane, from the DOM or the Session list. */
  private currentSessionId(): string | undefined {
    const content = document.querySelector('[data-conversation-content]')
    const fromDom = content?.getAttribute('data-conversation-session')
    if (typeof fromDom === 'string' && fromDom !== '') return fromDom
    const snapshot = this.ctx.sessions.list?.getSnapshot?.()
    const rows = Object.values(snapshot?.byId ?? {})
    return rows.find((row) => (row.retainedBy?.mainView ?? 0) > 0)?.id
  }

  /** Render the pill, panel visibility, and the tree rows. */
  private render(): void {
    const count = this.nodes.length
    this.pill.textContent = count === 0 ? this.t('pill.empty') : this.t('pill.count', { count })
    this.count.textContent = count === 0 ? '' : String(count)
    this.panel.classList.toggle('open', this.panelOpen)
    const expanded = this.collapsed.size === 0
    this.collapseAll.title = expanded ? this.t('panel.collapseAll') : this.t('panel.expandAll')
    this.collapseAll.setAttribute('aria-label', this.collapseAll.title)
    this.list.replaceChildren()
    this.foot.hidden = count === 0
    if (count === 0) {
      const empty = document.createElement('div')
      empty.className = 'dbc-empty'
      empty.textContent = this.t('panel.empty')
      this.list.appendChild(empty)
      return
    }
    const sessionId = this.currentSessionId()
    const known = new Set(this.nodes.map((node) => node.id))
    const byParent = new Map<string, BranchNode[]>()
    const roots: BranchNode[] = []
    for (const node of sortByCreated(this.nodes)) {
      const parentId = node.parentId
      if (parentId !== undefined && known.has(parentId)) {
        const siblings = byParent.get(parentId)
        if (siblings === undefined) byParent.set(parentId, [node])
        else siblings.push(node)
      } else {
        roots.push(node)
      }
    }
    const groups = new Map<string, BranchNode[]>()
    for (const node of roots) {
      const group = groups.get(node.sourceSessionId)
      if (group === undefined) groups.set(node.sourceSessionId, [node])
      else group.push(node)
    }
    for (const [sourceSessionId, group] of groups) {
      this.list.appendChild(this.groupView(sourceSessionId, group, byParent, sessionId))
    }
  }

  /** One source Session, plus its branches unless the group is collapsed. */
  private groupView(
    sourceSessionId: string,
    roots: readonly BranchNode[],
    byParent: Map<string, BranchNode[]>,
    sessionId: string | undefined
  ): HTMLElement {
    const group = document.createElement('div')
    group.className = 'dbc-group'
    const key = `s:${sourceSessionId}`
    const isCollapsed = this.collapsed.has(key)
    group.appendChild(this.rootRow(sourceSessionId, isCollapsed))
    if (isCollapsed) return group
    const kids = document.createElement('div')
    kids.className = 'dbc-kids'
    for (const node of roots) this.appendNode(node, byParent, sessionId, kids)
    group.appendChild(kids)
    return group
  }

  /** Append one node and, recursively, its descendants. */
  private appendNode(
    node: BranchNode,
    byParent: Map<string, BranchNode[]>,
    sessionId: string | undefined,
    parent: HTMLElement
  ): void {
    const children = byParent.get(node.id) ?? []
    const hasChildren = children.length > 0
    const isCollapsed = this.collapsed.has(`n:${node.id}`)
    parent.appendChild(this.nodeRow(node, sessionId, hasChildren, isCollapsed))
    if (!hasChildren || isCollapsed) return
    const kids = document.createElement('div')
    kids.className = 'dbc-kids'
    for (const child of children) this.appendNode(child, byParent, sessionId, kids)
    parent.appendChild(kids)
  }

  /** Build the source-Session row that roots one group. */
  private rootRow(sessionId: string, isCollapsed: boolean): HTMLElement {
    const row = document.createElement('div')
    row.className = 'dbc-row dbc-root'
    const label = document.createElement('span')
    label.className = 'dbc-label'
    label.textContent = this.sessionTitle(sessionId)
    label.title = this.t('panel.openSource')
    row.append(this.chevron(`s:${sessionId}`, isCollapsed), glyph(ICON_FOLDER, 'dbc-glyph dbc-ico blue'), label)
    row.addEventListener('click', () => this.open(sessionId))
    return row
  }

  /** Collapse every group when anything is open, otherwise expand everything. */
  private toggleAll(): void {
    if (this.collapsed.size > 0) {
      this.collapsed.clear()
      this.render()
      return
    }
    const known = new Set(this.nodes.map((node) => node.id))
    const hasChild = new Set<string>()
    for (const node of this.nodes) {
      if (node.parentId !== undefined && known.has(node.parentId)) hasChild.add(node.parentId)
    }
    for (const node of this.nodes) {
      if (hasChild.has(node.id)) this.collapsed.add(`n:${node.id}`)
      if (node.parentId === undefined || !known.has(node.parentId)) this.collapsed.add(`s:${node.sourceSessionId}`)
    }
    this.render()
  }

  /** A disclosure triangle that toggles one group and stops the row click. */
  private chevron(key: string, isCollapsed: boolean): HTMLButtonElement {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = isCollapsed ? 'dbc-chev collapsed' : 'dbc-chev'
    button.title = isCollapsed ? this.t('panel.expand') : this.t('panel.collapse')
    button.setAttribute('aria-label', button.title)
    button.setAttribute('aria-expanded', String(!isCollapsed))
    button.appendChild(glyph(ICON_CHEVRON, 'dbc-glyph'))
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      if (this.collapsed.has(key)) this.collapsed.delete(key)
      else this.collapsed.add(key)
      this.render()
    })
    return button
  }

  /** Durable Session title from the list projection, with a generic fallback. */
  private sessionTitle(sessionId: string): string {
    try {
      const row = this.ctx.sessions.list?.getSnapshot?.()?.byId?.[sessionId]
      const title = row?.projections?.values?.title
      if (typeof title === 'string' && title.trim() !== '') return title
    } catch {
      /* the list store is optional; fall back to a generic label */
    }
    return this.t('panel.source')
  }

  /** Build one branch row: disclosure, icon, quote, status dot, remove. */
  private nodeRow(
    node: BranchNode,
    sessionId: string | undefined,
    hasChildren: boolean,
    isCollapsed: boolean
  ): HTMLElement {
    const row = document.createElement('div')
    row.className = 'dbc-row dbc-node'
    const isCurrent = node.targetSessionId === sessionId
    if (isCurrent) row.classList.add('current')

    const label = document.createElement('span')
    label.className = 'dbc-label'
    label.textContent = node.quote.length > 26 ? `${node.quote.slice(0, 26)}…` : node.quote
    label.title = `${node.quote}\n\n${this.t('panel.jump')}`

    const dot = document.createElement('span')
    dot.className = 'dbc-dot'
    dot.title = isCurrent ? this.t('panel.current') : this.t('panel.jump')

    const remove = document.createElement('button')
    remove.type = 'button'
    remove.className = 'dbc-del'
    remove.textContent = '✕'
    remove.title = this.t('panel.remove')
    remove.addEventListener('click', (event) => {
      event.stopPropagation()
      this.nodes = removeSubtree(this.nodes, node.id)
      this.persist()
      this.render()
      this.scheduleMarkers()
    })

    row.append(
      hasChildren ? this.chevron(`n:${node.id}`, isCollapsed) : placeholderChevron(),
      glyph(hasChildren ? ICON_FOLDER : ICON_COMMENT, 'dbc-glyph dbc-ico'),
      label,
      dot,
      remove
    )
    row.addEventListener('click', () => {
      if (isCurrent) return
      this.open(node.targetSessionId)
    })
    return row
  }

  /** Navigate to a Session, reporting a rejected navigation once. */
  private open(sessionId: string): void {
    try {
      this.ctx.uiWorkspace.openSession(sessionId)
    } catch (error) {
      this.notify(this.t('toast.jumpFailed', { message: messageOf(error) }))
    }
  }

  /** Draw one marker per branch whose quote still exists in this Session. */
  private paintMarkers(): void {
    for (const marker of this.markers) marker.remove()
    this.markers = []
    const content = document.querySelector('[data-conversation-content]')
    const sessionId = content?.getAttribute('data-conversation-session')
    if (content === null || typeof sessionId !== 'string') return
    let painted = 0
    for (const node of this.nodes) {
      if (painted >= MAX_MARKERS) break
      if (node.sourceSessionId !== sessionId) continue
      const range = findQuoteRange(content, node.quote)
      if (range === null) continue
      const rect = range.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) continue
      const marker = document.createElement('button')
      marker.type = 'button'
      marker.className = 'dbc-badge'
      marker.textContent = '⑂'
      marker.title = this.t('marker.title', { quote: node.quote.slice(0, 40) })
      marker.style.left = `${Math.min(window.innerWidth - 28, rect.right + 6)}px`
      marker.style.top = `${Math.max(4, rect.top)}px`
      marker.addEventListener('click', (event) => {
        event.stopPropagation()
        this.open(node.targetSessionId)
      })
      this.root.appendChild(marker)
      this.markers.push(marker)
      painted += 1
    }
  }

  /** Coalesce marker repaints triggered by scrolling, resizing, or streaming. */
  private scheduleMarkers(): void {
    if (this.paintQueued) return
    this.paintQueued = true
    window.setTimeout(() => {
      this.paintQueued = false
      try {
        this.paintMarkers()
      } catch {
        /* a re-render raced us; the next scroll or tick repaints */
      }
    }, MARKER_DEBOUNCE_MS)
  }

  /** Detect a Session switch so the panel and markers follow it. */
  private tick(): void {
    const sessionId = this.currentSessionId()
    if (sessionId !== this.lastSession) {
      this.lastSession = sessionId
      this.render()
    }
    this.scheduleMarkers()
  }

  /** Hide the selection action. */
  private hideAction(): void {
    this.action.style.display = 'none'
    this.selection = null
  }

  /** Show the selection action under a selection rect. */
  private showAction(rect: DOMRect, selection: CapturedSelection): void {
    this.selection = selection
    this.action.style.display = 'flex'
    this.action.style.left = `${Math.min(window.innerWidth - 170, Math.max(8, rect.right - 40))}px`
    this.action.style.top = `${Math.min(window.innerHeight - 40, rect.bottom + 8)}px`
  }

  /** Offer the branch action for a fresh, non-empty transcript selection. */
  private updateSelection(): void {
    const selection = window.getSelection()
    if (selection === null || selection.isCollapsed || selection.rangeCount === 0) {
      this.hideAction()
      return
    }
    const quote = normalizeQuote(selection.toString())
    if (quote.length < 2) {
      this.hideAction()
      return
    }
    const range = selection.getRangeAt(0)
    const anchorNode = range.startContainer
    const anchor = anchorNode.nodeType === Node.ELEMENT_NODE
      ? (anchorNode as Element)
      : anchorNode.parentElement
    const content = anchor?.closest?.('[data-conversation-content]') ?? null
    if (content === null || !content.contains(range.commonAncestorContainer)) {
      this.hideAction()
      return
    }
    if (anchor !== null && anchor.closest('[data-composer-input], [data-composer-card], textarea') !== null) {
      this.hideAction()
      return
    }
    const sessionId = content.getAttribute('data-conversation-session') ?? undefined
    this.showAction(range.getBoundingClientRect(), { sessionId, quote })
  }

  /** Fork the current Session and record the branch node. */
  private async createBranch(): Promise<void> {
    const selection = this.selection
    if (selection === null) return
    if (selection.sessionId === undefined) {
      this.notify(this.t('toast.noSession'))
      return
    }
    this.action.disabled = true
    try {
      const childId = await this.ctx.sessions.fork({
        sessionId: selection.sessionId,
        increaseTitle: true
      })
      this.nodes.push({
        id: createId(),
        parentId: parentOf(this.nodes, selection.sessionId),
        sourceSessionId: selection.sessionId,
        targetSessionId: childId,
        quote: selection.quote,
        createdAt: Date.now()
      })
      this.persist()
      this.render()
      this.ctx.uiWorkspace.openSession(childId)
      this.prefill(childId, selection.quote)
      this.notify(this.t('toast.created'))
    } catch (error) {
      this.notify(this.t('toast.forkFailed', { message: messageOf(error) }))
    } finally {
      this.action.disabled = false
      this.hideAction()
    }
  }

  /**
   * Best-effort composer prefill in the child Session.
   *
   * The composer mounts only after navigation has retained the Session, and it
   * refuses initialization while a submission is in flight, so this retries for
   * a few seconds and then gives up silently.
   */
  private prefill(childId: string, quote: string, attempt = 0): void {
    if (attempt > PREFILL_ATTEMPTS) return
    const binding = this.ctx.sessions.binding?.(childId)
    const conversation = this.ctx.get?.('conversation') as
      | { input?: { requestDraftInitialization?: (binding: unknown, options: { prompt?: string; clearPreviousDraft?: boolean }) => string } }
      | undefined
    if (binding !== undefined && conversation?.input?.requestDraftInitialization !== undefined) {
      try {
        const prompt = this.t('composer.quote', { quote: quote.replace(/\n/gu, '\n> ') })
        const result = conversation.input.requestDraftInitialization(binding, {
          prompt,
          clearPreviousDraft: true
        })
        if (result === 'applied' || result === 'preserved') return
      } catch {
        /* composer still mounting; retry below */
      }
    }
    window.setTimeout(() => this.prefill(childId, quote, attempt + 1), 200)
  }

  private onMouseUp(event: MouseEvent): void {
    const target = event.target
    if (target instanceof Element && target.closest(`#${ROOT_ID}`) !== null) return
    window.setTimeout(() => this.updateSelection(), 0)
  }

  private onMouseDown(event: MouseEvent): void {
    const target = event.target
    if (target instanceof Element && target.closest(`#${ROOT_ID}`) !== null) return
    this.hideAction()
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.shiftKey || event.key === 'Shift') window.setTimeout(() => this.updateSelection(), 0)
  }

  private onSelectionChange(): void {
    const selection = window.getSelection()
    if (selection === null || selection.isCollapsed) this.hideAction()
  }

  private onScroll(): void {
    this.scheduleMarkers()
  }
}

/** Message text for any thrown value. */
function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
