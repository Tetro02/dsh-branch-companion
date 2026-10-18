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
  depthOf,
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
.dbc-panel{position:fixed;right:14px;top:164px;width:280px;max-height:62vh;pointer-events:auto;display:none;flex-direction:column;border:.5px solid var(--dsw-alias-border-l3,#c9ced6);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 10px 32px rgba(0,0,0,.18);overflow:hidden}
.dbc-panel.open{display:flex}
.dbc-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:.5px solid var(--dsw-alias-border-l4,#e3e6ea);font-size:13px;font-weight:600}
.dbc-head button{border:0;background:0 0;cursor:pointer;color:var(--dsw-alias-label-caption,#6b7280);font-size:13px;padding:2px 4px;border-radius:4px}
.dbc-head button:hover{background:var(--dsw-alias-interactive-bg-hover,#eef1f5)}
.dbc-list{overflow:auto;padding:6px;display:flex;flex-direction:column;gap:2px}
.dbc-empty{padding:12px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-caption,#6b7280)}
.dbc-node{display:flex;align-items:center;gap:6px;border-radius:6px;padding:5px 6px;cursor:pointer;font-size:12.5px;line-height:18px}
.dbc-node:hover{background:var(--dsw-alias-interactive-bg-hover,#eef1f5)}
.dbc-node.current{cursor:default;color:var(--dsw-alias-label-secondary,#4b5563)}
.dbc-node .dbc-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dbc-node .dbc-del{opacity:0;border:0;background:0 0;cursor:pointer;color:var(--dsw-alias-label-caption,#6b7280);font-size:12px;padding:0 3px;border-radius:3px}
.dbc-node:hover .dbc-del{opacity:1}
.dbc-node .dbc-del:hover{color:#d14343;background:rgba(209,67,67,.1)}
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

/** Create a node id that is unique enough for a per-browser document. */
function createId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
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
  private readonly list: HTMLElement
  private readonly toast: HTMLElement
  private nodes: BranchNode[]
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
    title.textContent = t('panel.title')
    const collapse = document.createElement('button')
    collapse.type = 'button'
    collapse.textContent = t('panel.collapse')
    head.append(title, collapse)

    this.list = document.createElement('div')
    this.list.className = 'dbc-list'
    this.panel.append(head, this.list)

    this.toast = document.createElement('div')
    this.toast.className = 'dbc-toast'

    this.root.append(this.action, this.pill, this.panel, this.toast)

    collapse.addEventListener('click', () => {
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
    this.panel.classList.toggle('open', this.panelOpen)
    this.list.replaceChildren()
    if (count === 0) {
      const empty = document.createElement('div')
      empty.className = 'dbc-empty'
      empty.textContent = this.t('panel.empty')
      this.list.appendChild(empty)
      return
    }
    const sessionId = this.currentSessionId()
    for (const node of sortByCreated(this.nodes)) {
      this.list.appendChild(this.row(node, sessionId))
    }
  }

  /** Build one panel row. */
  private row(node: BranchNode, sessionId: string | undefined): HTMLElement {
    const row = document.createElement('div')
    row.className = 'dbc-node'
    row.style.paddingLeft = `${6 + depthOf(this.nodes, node) * 12}px`

    const isCurrent = node.targetSessionId === sessionId
    if (isCurrent) row.classList.add('current')

    const label = document.createElement('span')
    label.className = 'dbc-label'
    label.textContent = node.quote.length > 26 ? `${node.quote.slice(0, 26)}…` : node.quote
    label.title = `${node.quote}\n\n${this.t('panel.jump')}`

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

    row.append(label, remove)
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
