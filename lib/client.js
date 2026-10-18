window.__ModuleLoader__.load({
	id: "dsh-branch-companion",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		"use strict";
		var __dshBranchCompanion = (() => {
		  var __defProp = Object.defineProperty;
		  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		  var __getOwnPropNames = Object.getOwnPropertyNames;
		  var __hasOwnProp = Object.prototype.hasOwnProperty;
		  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
		  var __export = (target, all) => {
		    for (var name in all)
		      __defProp(target, name, { get: all[name], enumerable: true });
		  };
		  var __copyProps = (to, from, except, desc) => {
		    if (from && typeof from === "object" || typeof from === "function") {
		      for (let key of __getOwnPropNames(from))
		        if (!__hasOwnProp.call(to, key) && key !== except)
		          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
		    }
		    return to;
		  };
		  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
		  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

		  // plugins/dsh-branch-companion/src/client/index.ts
		  var index_exports = {};
		  __export(index_exports, {
		    apply: () => apply,
		    inject: () => inject
		  });

		  // plugins/dsh-branch-companion/locale/en.json
		  var en_default = {
		    "action.add": "Add to new branch",
		    "action.hint": "Open a new branch that keeps this context",
		    "pill.empty": "\u2442 Branch",
		    "pill.count": "\u2442 Branch {count}",
		    "panel.title": "Conversation branches",
		    "panel.collapse": "Collapse",
		    "panel.empty": 'Select text in an answer, then choose "Add to new branch" \u2014 the branch tree appears here.',
		    "panel.jump": "Open this branch",
		    "panel.remove": "Remove this node and its sub-branches (sessions are kept)",
		    "marker.title": "Branch: {quote}\nClick to open",
		    "toast.created": "Branch created",
		    "toast.forkFailed": "Fork failed: {message}",
		    "toast.jumpFailed": "Navigation failed: {message}",
		    "toast.noSession": "No active conversation \u2014 open one first",
		    "composer.quote": "About this passage:\n\n> {quote}\n\n"
		  };

		  // plugins/dsh-branch-companion/locale/zh.json
		  var zh_default = {
		    "action.add": "\u6DFB\u52A0\u5230\u65B0\u7684\u5206\u652F",
		    "action.hint": "\u5E26\u7740\u8FD9\u6BB5\u4E0A\u4E0B\u6587\u5F00\u542F\u4E00\u4E2A\u65B0\u7684\u5206\u652F\u5BF9\u8BDD",
		    "pill.empty": "\u2442 \u5206\u652F",
		    "pill.count": "\u2442 \u5206\u652F {count}",
		    "panel.title": "\u5BF9\u8BDD\u5206\u652F",
		    "panel.collapse": "\u6536\u8D77",
		    "panel.empty": "\u6846\u9009\u56DE\u7B54\u91CC\u7684\u6587\u5B57\uFF0C\u70B9\u51FB\u300C\u6DFB\u52A0\u5230\u65B0\u7684\u5206\u652F\u300D\uFF0C\u8FD9\u91CC\u5C31\u4F1A\u51FA\u73B0\u53EF\u8DF3\u8F6C\u7684\u5206\u652F\u6811\u3002",
		    "panel.jump": "\u70B9\u51FB\u8DF3\u8F6C\u5230\u8FD9\u4E2A\u5206\u652F",
		    "panel.remove": "\u79FB\u9664\u8FD9\u4E2A\u8282\u70B9\u53CA\u5176\u5B50\u5206\u652F\uFF08\u4E0D\u5220\u9664\u4F1A\u8BDD\uFF09",
		    "marker.title": "\u5206\u652F\uFF1A{quote}\n\u70B9\u51FB\u524D\u5F80",
		    "toast.created": "\u5DF2\u521B\u5EFA\u5206\u652F",
		    "toast.forkFailed": "\u5206\u53C9\u5931\u8D25\uFF1A{message}",
		    "toast.jumpFailed": "\u8DF3\u8F6C\u5931\u8D25\uFF1A{message}",
		    "toast.noSession": "\u6CA1\u6709\u627E\u5230\u5F53\u524D\u4F1A\u8BDD\uFF0C\u8BF7\u5148\u6253\u5F00\u4E00\u4E2A\u5BF9\u8BDD",
		    "composer.quote": "\u5173\u4E8E\u8FD9\u6BB5\u5185\u5BB9\uFF1A\n\n> {quote}\n\n"
		  };

		  // plugins/dsh-branch-companion/src/client/quote.ts
		  var MAX_QUOTE = 600;
		  function normalizeQuote(text) {
		    return text.replace(/\s+/gu, " ").trim().slice(0, MAX_QUOTE);
		  }
		  function escapeRegExp(text) {
		    return text.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		  }
		  function matchQuote(text, quote) {
		    const target = normalizeQuote(quote);
		    if (target === "") return null;
		    const words = target.split(" ").filter((word) => word !== "").map(escapeRegExp);
		    const patterns = [words.join("\\s+")];
		    if (target.length > 24) {
		      patterns.push(escapeRegExp(target.slice(0, 24)).replace(/\\ /gu, "\\s+"));
		    }
		    for (const pattern of patterns) {
		      const match = new RegExp(pattern, "u").exec(text);
		      if (match !== null) return { start: match.index, end: match.index + match[0].length };
		    }
		    return null;
		  }
		  function chunkIndexAt(chunks, offset) {
		    for (let index = chunks.length - 1; index >= 0; index -= 1) {
		      const chunk = chunks[index];
		      if (offset >= chunk.start && offset < chunk.start + chunk.length) return index;
		    }
		    return -1;
		  }

		  // plugins/dsh-branch-companion/src/client/anchor.ts
		  var SKIP_SELECTOR = "script, style, button, textarea, [data-approval-key], iframe, .xterm";
		  function collectRenderedText(root) {
		    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
		      acceptNode(node) {
		        const parent = node.parentElement;
		        if (parent === null || parent.closest(SKIP_SELECTOR) !== null) return NodeFilter.FILTER_REJECT;
		        return NodeFilter.FILTER_ACCEPT;
		      }
		    });
		    const chunks = [];
		    let text = "";
		    while (walker.nextNode()) {
		      const node = walker.currentNode;
		      const value = node.nodeValue ?? "";
		      chunks.push({ node, start: text.length, length: value.length });
		      text += value;
		    }
		    return { text, chunks };
		  }
		  function findQuoteRange(root, quote) {
		    const { text, chunks } = collectRenderedText(root);
		    const match = matchQuote(text, quote);
		    if (match === null) return null;
		    const startIndex = chunkIndexAt(chunks, match.start);
		    const endIndex = chunkIndexAt(chunks, match.end - 1);
		    if (startIndex < 0 || endIndex < 0) return null;
		    const start = chunks[startIndex];
		    const end = chunks[endIndex];
		    const range = document.createRange();
		    try {
		      range.setStart(start.node, match.start - start.start);
		      range.setEnd(end.node, match.end - end.start);
		    } catch {
		      return null;
		    }
		    return range;
		  }

		  // plugins/dsh-branch-companion/src/client/tree.ts
		  var STORAGE_KEY = "dsh-branch-companion.nodes.v1";
		  function parseNodes(raw) {
		    if (raw === null) return [];
		    try {
		      const parsed = JSON.parse(raw);
		      if (!Array.isArray(parsed)) return [];
		      return parsed.filter((entry) => {
		        if (entry === null || typeof entry !== "object") return false;
		        const node = entry;
		        return typeof node.id === "string" && typeof node.sourceSessionId === "string" && typeof node.targetSessionId === "string" && typeof node.quote === "string" && typeof node.createdAt === "number";
		      });
		    } catch {
		      return [];
		    }
		  }
		  function serializeNodes(nodes) {
		    return JSON.stringify(nodes);
		  }
		  function parentOf(nodes, sessionId) {
		    let best;
		    for (const node of nodes) {
		      if (node.targetSessionId !== sessionId) continue;
		      if (best === void 0 || node.createdAt < best.createdAt) best = node;
		    }
		    return best?.id;
		  }
		  function descendantIds(nodes, nodeId) {
		    const doomed = /* @__PURE__ */ new Set([nodeId]);
		    let grew = true;
		    while (grew) {
		      grew = false;
		      for (const node of nodes) {
		        if (node.parentId !== void 0 && doomed.has(node.parentId) && !doomed.has(node.id)) {
		          doomed.add(node.id);
		          grew = true;
		        }
		      }
		    }
		    return doomed;
		  }
		  function removeSubtree(nodes, nodeId) {
		    const doomed = descendantIds(nodes, nodeId);
		    return nodes.filter((node) => !doomed.has(node.id));
		  }
		  function depthOf(nodes, node) {
		    let depth = 0;
		    let cursor = node;
		    const seen = /* @__PURE__ */ new Set([node.id]);
		    while (cursor?.parentId !== void 0 && depth < 32) {
		      const parent = nodes.find((candidate) => candidate.id === cursor?.parentId);
		      if (parent === void 0 || seen.has(parent.id)) break;
		      seen.add(parent.id);
		      cursor = parent;
		      depth += 1;
		    }
		    return depth;
		  }
		  function sortByCreated(nodes) {
		    return [...nodes].sort((left, right) => left.createdAt - right.createdAt);
		  }

		  // plugins/dsh-branch-companion/src/client/overlay.ts
		  var ROOT_ID = "dsh-branch-root";
		  var MAX_MARKERS = 40;
		  var CSS_TAG = "dsh-branch-companion/overlay.css";
		  var CSS = `
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
		`;
		  var MARKER_DEBOUNCE_MS = 220;
		  var PREFILL_ATTEMPTS = 15;
		  var SESSION_TICK_MS = 900;
		  function createId() {
		    return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
		  }
		  var BranchOverlay = class {
		    /**
		     * @param ctx - client root context.
		     * @param t - translation bound to this plugin's namespace.
		     */
		    constructor(ctx, t) {
		      __publicField(this, "ctx");
		      __publicField(this, "t");
		      __publicField(this, "root");
		      __publicField(this, "style");
		      __publicField(this, "action");
		      __publicField(this, "pill");
		      __publicField(this, "panel");
		      __publicField(this, "list");
		      __publicField(this, "toast");
		      __publicField(this, "nodes");
		      __publicField(this, "panelOpen", false);
		      __publicField(this, "selection", null);
		      __publicField(this, "markers", []);
		      __publicField(this, "lastSession");
		      __publicField(this, "paintQueued", false);
		      __publicField(this, "toastTimer", 0);
		      __publicField(this, "tickTimer", 0);
		      __publicField(this, "mutation");
		      this.ctx = ctx;
		      this.t = t;
		      this.nodes = parseNodes(this.readStored());
		      this.style = document.createElement("style");
		      this.style.dataset.plugin = "dsh-branch-companion";
		      this.style.dataset.pluginCss = CSS_TAG;
		      this.style.textContent = CSS;
		      this.root = document.createElement("div");
		      this.root.id = ROOT_ID;
		      this.action = document.createElement("button");
		      this.action.type = "button";
		      this.action.className = "dbc-action";
		      this.action.textContent = t("action.add");
		      this.action.title = t("action.hint");
		      this.pill = document.createElement("button");
		      this.pill.type = "button";
		      this.pill.className = "dbc-pill";
		      this.panel = document.createElement("div");
		      this.panel.className = "dbc-panel";
		      const head = document.createElement("div");
		      head.className = "dbc-head";
		      const title = document.createElement("span");
		      title.textContent = t("panel.title");
		      const collapse = document.createElement("button");
		      collapse.type = "button";
		      collapse.textContent = t("panel.collapse");
		      head.append(title, collapse);
		      this.list = document.createElement("div");
		      this.list.className = "dbc-list";
		      this.panel.append(head, this.list);
		      this.toast = document.createElement("div");
		      this.toast.className = "dbc-toast";
		      this.root.append(this.action, this.pill, this.panel, this.toast);
		      collapse.addEventListener("click", () => {
		        this.panelOpen = false;
		        this.render();
		      });
		      this.pill.addEventListener("click", () => {
		        this.panelOpen = !this.panelOpen;
		        this.render();
		      });
		      this.action.addEventListener("mousedown", (event) => event.preventDefault());
		      this.action.addEventListener("click", (event) => {
		        event.preventDefault();
		        void this.createBranch();
		      });
		      this.mutation = new MutationObserver(() => this.scheduleMarkers());
		      this.onMouseUp = this.onMouseUp.bind(this);
		      this.onMouseDown = this.onMouseDown.bind(this);
		      this.onKeyUp = this.onKeyUp.bind(this);
		      this.onScroll = this.onScroll.bind(this);
		      this.onSelectionChange = this.onSelectionChange.bind(this);
		    }
		    /** Attach the layer and every listener. */
		    mount() {
		      document.head.appendChild(this.style);
		      document.body.appendChild(this.root);
		      document.addEventListener("mouseup", this.onMouseUp, true);
		      document.addEventListener("mousedown", this.onMouseDown, true);
		      document.addEventListener("keyup", this.onKeyUp, true);
		      document.addEventListener("selectionchange", this.onSelectionChange);
		      window.addEventListener("scroll", this.onScroll, true);
		      window.addEventListener("resize", this.onScroll);
		      this.mutation.observe(document.body, { childList: true, subtree: true });
		      this.tickTimer = window.setInterval(() => this.tick(), SESSION_TICK_MS);
		      this.render();
		      this.scheduleMarkers();
		    }
		    /** Detach everything and drop this instance's DOM. */
		    dispose() {
		      document.removeEventListener("mouseup", this.onMouseUp, true);
		      document.removeEventListener("mousedown", this.onMouseDown, true);
		      document.removeEventListener("keyup", this.onKeyUp, true);
		      document.removeEventListener("selectionchange", this.onSelectionChange);
		      window.removeEventListener("scroll", this.onScroll, true);
		      window.removeEventListener("resize", this.onScroll);
		      this.mutation.disconnect();
		      window.clearInterval(this.tickTimer);
		      window.clearTimeout(this.toastTimer);
		      this.style.remove();
		      this.root.remove();
		    }
		    /** Read the persisted document, tolerating a blocked `localStorage`. */
		    readStored() {
		      try {
		        return localStorage.getItem(STORAGE_KEY);
		      } catch {
		        return null;
		      }
		    }
		    /** Persist the document, tolerating quota and private-mode failures. */
		    persist() {
		      try {
		        localStorage.setItem(STORAGE_KEY, serializeNodes(this.nodes));
		      } catch {
		      }
		    }
		    /** Show a transient message. */
		    notify(message) {
		      this.toast.textContent = message;
		      this.toast.classList.add("show");
		      window.clearTimeout(this.toastTimer);
		      this.toastTimer = window.setTimeout(() => this.toast.classList.remove("show"), 2600);
		    }
		    /** The Session shown in the main pane, from the DOM or the Session list. */
		    currentSessionId() {
		      const content = document.querySelector("[data-conversation-content]");
		      const fromDom = content?.getAttribute("data-conversation-session");
		      if (typeof fromDom === "string" && fromDom !== "") return fromDom;
		      const snapshot = this.ctx.sessions.list?.getSnapshot?.();
		      const rows = Object.values(snapshot?.byId ?? {});
		      return rows.find((row) => (row.retainedBy?.mainView ?? 0) > 0)?.id;
		    }
		    /** Render the pill, panel visibility, and the tree rows. */
		    render() {
		      const count = this.nodes.length;
		      this.pill.textContent = count === 0 ? this.t("pill.empty") : this.t("pill.count", { count });
		      this.panel.classList.toggle("open", this.panelOpen);
		      this.list.replaceChildren();
		      if (count === 0) {
		        const empty = document.createElement("div");
		        empty.className = "dbc-empty";
		        empty.textContent = this.t("panel.empty");
		        this.list.appendChild(empty);
		        return;
		      }
		      const sessionId = this.currentSessionId();
		      for (const node of sortByCreated(this.nodes)) {
		        this.list.appendChild(this.row(node, sessionId));
		      }
		    }
		    /** Build one panel row. */
		    row(node, sessionId) {
		      const row = document.createElement("div");
		      row.className = "dbc-node";
		      row.style.paddingLeft = `${6 + depthOf(this.nodes, node) * 12}px`;
		      const isCurrent = node.targetSessionId === sessionId;
		      if (isCurrent) row.classList.add("current");
		      const label = document.createElement("span");
		      label.className = "dbc-label";
		      label.textContent = node.quote.length > 26 ? `${node.quote.slice(0, 26)}\u2026` : node.quote;
		      label.title = `${node.quote}

		${this.t("panel.jump")}`;
		      const remove = document.createElement("button");
		      remove.type = "button";
		      remove.className = "dbc-del";
		      remove.textContent = "\u2715";
		      remove.title = this.t("panel.remove");
		      remove.addEventListener("click", (event) => {
		        event.stopPropagation();
		        this.nodes = removeSubtree(this.nodes, node.id);
		        this.persist();
		        this.render();
		        this.scheduleMarkers();
		      });
		      row.append(label, remove);
		      row.addEventListener("click", () => {
		        if (isCurrent) return;
		        this.open(node.targetSessionId);
		      });
		      return row;
		    }
		    /** Navigate to a Session, reporting a rejected navigation once. */
		    open(sessionId) {
		      try {
		        this.ctx.uiWorkspace.openSession(sessionId);
		      } catch (error) {
		        this.notify(this.t("toast.jumpFailed", { message: messageOf(error) }));
		      }
		    }
		    /** Draw one marker per branch whose quote still exists in this Session. */
		    paintMarkers() {
		      for (const marker of this.markers) marker.remove();
		      this.markers = [];
		      const content = document.querySelector("[data-conversation-content]");
		      const sessionId = content?.getAttribute("data-conversation-session");
		      if (content === null || typeof sessionId !== "string") return;
		      let painted = 0;
		      for (const node of this.nodes) {
		        if (painted >= MAX_MARKERS) break;
		        if (node.sourceSessionId !== sessionId) continue;
		        const range = findQuoteRange(content, node.quote);
		        if (range === null) continue;
		        const rect = range.getBoundingClientRect();
		        if (rect.width === 0 && rect.height === 0) continue;
		        const marker = document.createElement("button");
		        marker.type = "button";
		        marker.className = "dbc-badge";
		        marker.textContent = "\u2442";
		        marker.title = this.t("marker.title", { quote: node.quote.slice(0, 40) });
		        marker.style.left = `${Math.min(window.innerWidth - 28, rect.right + 6)}px`;
		        marker.style.top = `${Math.max(4, rect.top)}px`;
		        marker.addEventListener("click", (event) => {
		          event.stopPropagation();
		          this.open(node.targetSessionId);
		        });
		        this.root.appendChild(marker);
		        this.markers.push(marker);
		        painted += 1;
		      }
		    }
		    /** Coalesce marker repaints triggered by scrolling, resizing, or streaming. */
		    scheduleMarkers() {
		      if (this.paintQueued) return;
		      this.paintQueued = true;
		      window.setTimeout(() => {
		        this.paintQueued = false;
		        try {
		          this.paintMarkers();
		        } catch {
		        }
		      }, MARKER_DEBOUNCE_MS);
		    }
		    /** Detect a Session switch so the panel and markers follow it. */
		    tick() {
		      const sessionId = this.currentSessionId();
		      if (sessionId !== this.lastSession) {
		        this.lastSession = sessionId;
		        this.render();
		      }
		      this.scheduleMarkers();
		    }
		    /** Hide the selection action. */
		    hideAction() {
		      this.action.style.display = "none";
		      this.selection = null;
		    }
		    /** Show the selection action under a selection rect. */
		    showAction(rect, selection) {
		      this.selection = selection;
		      this.action.style.display = "flex";
		      this.action.style.left = `${Math.min(window.innerWidth - 170, Math.max(8, rect.right - 40))}px`;
		      this.action.style.top = `${Math.min(window.innerHeight - 40, rect.bottom + 8)}px`;
		    }
		    /** Offer the branch action for a fresh, non-empty transcript selection. */
		    updateSelection() {
		      const selection = window.getSelection();
		      if (selection === null || selection.isCollapsed || selection.rangeCount === 0) {
		        this.hideAction();
		        return;
		      }
		      const quote = normalizeQuote(selection.toString());
		      if (quote.length < 2) {
		        this.hideAction();
		        return;
		      }
		      const range = selection.getRangeAt(0);
		      const anchorNode = range.startContainer;
		      const anchor = anchorNode.nodeType === Node.ELEMENT_NODE ? anchorNode : anchorNode.parentElement;
		      const content = anchor?.closest?.("[data-conversation-content]") ?? null;
		      if (content === null || !content.contains(range.commonAncestorContainer)) {
		        this.hideAction();
		        return;
		      }
		      if (anchor !== null && anchor.closest("[data-composer-input], [data-composer-card], textarea") !== null) {
		        this.hideAction();
		        return;
		      }
		      const sessionId = content.getAttribute("data-conversation-session") ?? void 0;
		      this.showAction(range.getBoundingClientRect(), { sessionId, quote });
		    }
		    /** Fork the current Session and record the branch node. */
		    async createBranch() {
		      const selection = this.selection;
		      if (selection === null) return;
		      if (selection.sessionId === void 0) {
		        this.notify(this.t("toast.noSession"));
		        return;
		      }
		      this.action.disabled = true;
		      try {
		        const childId = await this.ctx.sessions.fork({
		          sessionId: selection.sessionId,
		          increaseTitle: true
		        });
		        this.nodes.push({
		          id: createId(),
		          parentId: parentOf(this.nodes, selection.sessionId),
		          sourceSessionId: selection.sessionId,
		          targetSessionId: childId,
		          quote: selection.quote,
		          createdAt: Date.now()
		        });
		        this.persist();
		        this.render();
		        this.ctx.uiWorkspace.openSession(childId);
		        this.prefill(childId, selection.quote);
		        this.notify(this.t("toast.created"));
		      } catch (error) {
		        this.notify(this.t("toast.forkFailed", { message: messageOf(error) }));
		      } finally {
		        this.action.disabled = false;
		        this.hideAction();
		      }
		    }
		    /**
		     * Best-effort composer prefill in the child Session.
		     *
		     * The composer mounts only after navigation has retained the Session, and it
		     * refuses initialization while a submission is in flight, so this retries for
		     * a few seconds and then gives up silently.
		     */
		    prefill(childId, quote, attempt = 0) {
		      if (attempt > PREFILL_ATTEMPTS) return;
		      const binding = this.ctx.sessions.binding?.(childId);
		      const conversation = this.ctx.get?.("conversation");
		      if (binding !== void 0 && conversation?.input?.requestDraftInitialization !== void 0) {
		        try {
		          const prompt = this.t("composer.quote", { quote: quote.replace(/\n/gu, "\n> ") });
		          const result = conversation.input.requestDraftInitialization(binding, {
		            prompt,
		            clearPreviousDraft: true
		          });
		          if (result === "applied" || result === "preserved") return;
		        } catch {
		        }
		      }
		      window.setTimeout(() => this.prefill(childId, quote, attempt + 1), 200);
		    }
		    onMouseUp(event) {
		      const target = event.target;
		      if (target instanceof Element && target.closest(`#${ROOT_ID}`) !== null) return;
		      window.setTimeout(() => this.updateSelection(), 0);
		    }
		    onMouseDown(event) {
		      const target = event.target;
		      if (target instanceof Element && target.closest(`#${ROOT_ID}`) !== null) return;
		      this.hideAction();
		    }
		    onKeyUp(event) {
		      if (event.shiftKey || event.key === "Shift") window.setTimeout(() => this.updateSelection(), 0);
		    }
		    onSelectionChange() {
		      const selection = window.getSelection();
		      if (selection === null || selection.isCollapsed) this.hideAction();
		    }
		    onScroll() {
		      this.scheduleMarkers();
		    }
		  };
		  function messageOf(error) {
		    return error instanceof Error ? error.message : String(error);
		  }

		  // plugins/dsh-branch-companion/src/client/index.ts
		  var NS = "branch";
		  var inject = ["sessions", "uiWorkspace", "locale"];
		  function apply(ctx) {
		    if (typeof document === "undefined" || document.body === null) return;
		    if (document.getElementById("dsh-branch-root") !== null) return;
		    const disposeLocale = ctx.locale.register(NS, { zh: zh_default, en: en_default });
		    const overlay = new BranchOverlay(ctx, ctx.locale.bind(NS));
		    overlay.mount();
		    ctx.effect?.(() => () => {
		      overlay.dispose();
		      disposeLocale();
		    }, "dsh-branch-companion: overlay");
		  }
		  return __toCommonJS(index_exports);
		})();

		exports.apply = __dshBranchCompanion.apply;
		exports.inject = __dshBranchCompanion.inject;
		return module.exports;
	}
});
