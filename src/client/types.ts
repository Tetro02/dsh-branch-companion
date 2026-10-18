/**
 * The slice of the client runtime this plugin depends on.
 *
 * The browser half is compiled by its own build, so it does not import DSH
 * packages (their types live in the installation checkout, and importing them
 * would also add module externals to the bundle). These structural types pin
 * exactly the members used here; anything else is deliberately absent.
 *
 * @module dsh-branch-companion/client/types
 */

/** Translation function bound to this plugin's dictionary namespace. */
export type Translate = (key: string, params?: Record<string, string | number>) => string

/** The `locale` service. */
export interface LocaleService {
  /** Register dictionaries; returns their disposer. */
  register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void
  /** Bind a namespace to a translation function. */
  bind(namespace: string): Translate
}

/** One row of the Session list snapshot. */
export interface SessionRow {
  /** Session id. */
  id: string
  /** Retention counters; `mainView` marks the Session shown in the main pane. */
  retainedBy?: { mainView?: number }
}

/** The `sessions` service (Session controller client half). */
export interface SessionsService {
  /** Fork a Session; resolves with the child id. */
  fork(options: { sessionId: string; increaseTitle?: boolean; atSeq?: number }): Promise<string>
  /** The materialized binding for a retained Session, when one exists. */
  binding?(sessionId: string): unknown
  /** Live Session list. */
  list?: { getSnapshot?(): { byId?: Record<string, SessionRow> } }
}

/** The `uiWorkspace` service: navigation owned by the workspace plugin. */
export interface UiWorkspaceService {
  /** Replace the main view with one Session. */
  openSession(sessionId: string): void
}

/** The `conversation` service, used for composer prefill only. */
export interface ConversationService {
  input?: {
    requestDraftInitialization?(
      binding: unknown,
      options: { prompt?: string; clearPreviousDraft?: boolean }
    ): 'applied' | 'preserved' | 'blocked'
  }
}

/** The client root context members used by this plugin. */
export interface ClientContext {
  sessions: SessionsService
  uiWorkspace: UiWorkspaceService
  locale: LocaleService
  /** Optional service lookup for the composer half. */
  get?(name: string): unknown
  /** Register a disposer owned by this plugin fiber. */
  effect?(setup: () => () => void, label?: string): void
}

/** A captured selection: the quote plus the Session it came from. */
export interface CapturedSelection {
  sessionId?: string
  quote: string
}
