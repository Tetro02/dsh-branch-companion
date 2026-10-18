/**
 * The overlay: selection action, surface markers, and the branch panel.
 *
 * Everything the plugin draws lives in one fixed, pointer-transparent layer
 * appended to `<body>`. The transcript itself is never mutated — markers are
 * re-measured against a Range on every paint, so React can re-render freely.
 *
 * @module dsh-branch-companion/client/overlay
 */
import type { ClientContext, Translate } from './types.js';
/** The overlay controller: one instance per mounted plugin. */
export declare class BranchOverlay {
    private readonly ctx;
    private readonly t;
    private readonly root;
    private readonly style;
    private readonly action;
    private readonly pill;
    private readonly panel;
    private readonly count;
    private readonly collapseAll;
    private readonly list;
    private readonly foot;
    private readonly toast;
    private nodes;
    /** Group and node keys whose children are hidden in the panel. */
    private readonly collapsed;
    private panelOpen;
    private selection;
    private markers;
    private lastSession;
    private paintQueued;
    private toastTimer;
    private tickTimer;
    private readonly mutation;
    /**
     * @param ctx - client root context.
     * @param t - translation bound to this plugin's namespace.
     */
    constructor(ctx: ClientContext, t: Translate);
    /** Attach the layer and every listener. */
    mount(): void;
    /** Detach everything and drop this instance's DOM. */
    dispose(): void;
    /** Read the persisted document, tolerating a blocked `localStorage`. */
    private readStored;
    /** Persist the document, tolerating quota and private-mode failures. */
    private persist;
    /** Show a transient message. */
    private notify;
    /** The Session shown in the main pane, from the DOM or the Session list. */
    private currentSessionId;
    /** Render the pill, panel visibility, and the tree rows. */
    private render;
    /** One source Session, plus its branches unless the group is collapsed. */
    private groupView;
    /** Append one node and, recursively, its descendants. */
    private appendNode;
    /** Build the source-Session row that roots one group. */
    private rootRow;
    /** Collapse every group when anything is open, otherwise expand everything. */
    private toggleAll;
    /** A disclosure triangle that toggles one group and stops the row click. */
    private chevron;
    /** Durable Session title from the list projection, with a generic fallback. */
    private sessionTitle;
    /** Build one branch row: disclosure, icon, quote, status dot, remove. */
    private nodeRow;
    /** Navigate to a Session, reporting a rejected navigation once. */
    private open;
    /** Draw one marker per branch whose quote still exists in this Session. */
    private paintMarkers;
    /** Coalesce marker repaints triggered by scrolling, resizing, or streaming. */
    private scheduleMarkers;
    /** Detect a Session switch so the panel and markers follow it. */
    private tick;
    /** Hide the selection action. */
    private hideAction;
    /** Show the selection action under a selection rect. */
    private showAction;
    /** Offer the branch action for a fresh, non-empty transcript selection. */
    private updateSelection;
    /** Fork the current Session and record the branch node. */
    private createBranch;
    /**
     * Best-effort composer prefill in the child Session.
     *
     * The composer mounts only after navigation has retained the Session, and it
     * refuses initialization while a submission is in flight, so this retries for
     * a few seconds and then gives up silently.
     */
    private prefill;
    private onMouseUp;
    private onMouseDown;
    private onKeyUp;
    private onSelectionChange;
    private onScroll;
}
