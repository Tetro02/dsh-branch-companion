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

		  // src/client/index.ts
		  var index_exports = {};
		  __export(index_exports, {
		    apply: () => apply,
		    inject: () => inject
		  });

		  // locale/en.json
		  var en_default = {
		    "action.add": "Add to new branch",
		    "action.hint": "Open a new branch that keeps this context",
		    "pill.empty": "\u2442 Branch",
		    "pill.count": "\u2442 Branch {count}",
		    "panel.title": "Conversation branches",
		    "panel.close": "Close panel",
		    "panel.collapse": "Collapse",
		    "panel.expand": "Expand",
		    "panel.collapseAll": "Collapse all",
		    "panel.expandAll": "Expand all",
		    "panel.current": "Current branch",
		    "panel.empty": 'Select text in an answer, then choose "Add to new branch" \u2014 the branch tree appears here.',
		    "panel.source": "Source session",
		    "panel.openSource": "Open the source session",
		    "panel.jump": "Open this branch",
		    "panel.remove": "Remove this node and its sub-branches (sessions are kept)",
		    "panel.hintOpen": "Click a title to open the chat, click an arrow to expand sub-branches.",
		    "panel.hintRemove": "Removing a node also removes its sub-branches from the list; the chats are kept.",
		    "marker.title": "Branch: {quote}\nClick to open",
		    "toast.created": "Branch created",
		    "toast.forkFailed": "Fork failed: {message}",
		    "toast.jumpFailed": "Navigation failed: {message}",
		    "toast.noSession": "No active conversation \u2014 open one first",
		    "composer.quote": "About this passage:\n\n> {quote}\n\n"
		  };

		  // locale/zh.json
		  var zh_default = {
		    "action.add": "\u6DFB\u52A0\u5230\u65B0\u7684\u5206\u652F",
		    "action.hint": "\u5E26\u7740\u8FD9\u6BB5\u4E0A\u4E0B\u6587\u5F00\u542F\u4E00\u4E2A\u65B0\u7684\u5206\u652F\u5BF9\u8BDD",
		    "pill.empty": "\u2442 \u5206\u652F",
		    "pill.count": "\u2442 \u5206\u652F {count}",
		    "panel.title": "\u5BF9\u8BDD\u5206\u652F",
		    "panel.close": "\u5173\u95ED\u9762\u677F",
		    "panel.collapse": "\u6298\u53E0",
		    "panel.expand": "\u5C55\u5F00",
		    "panel.collapseAll": "\u6298\u53E0\u5168\u90E8",
		    "panel.expandAll": "\u5C55\u5F00\u5168\u90E8",
		    "panel.current": "\u5F53\u524D\u5206\u652F",
		    "panel.empty": "\u6846\u9009\u56DE\u7B54\u91CC\u7684\u6587\u5B57\uFF0C\u70B9\u51FB\u300C\u6DFB\u52A0\u5230\u65B0\u7684\u5206\u652F\u300D\uFF0C\u8FD9\u91CC\u5C31\u4F1A\u51FA\u73B0\u53EF\u8DF3\u8F6C\u7684\u5206\u652F\u6811\u3002",
		    "panel.source": "\u6765\u6E90\u4F1A\u8BDD",
		    "panel.openSource": "\u70B9\u51FB\u6253\u5F00\u6765\u6E90\u4F1A\u8BDD",
		    "panel.jump": "\u70B9\u51FB\u8DF3\u8F6C\u5230\u8FD9\u4E2A\u5206\u652F",
		    "panel.remove": "\u79FB\u9664\u8FD9\u4E2A\u8282\u70B9\u53CA\u5176\u5B50\u5206\u652F\uFF08\u4E0D\u5220\u9664\u4F1A\u8BDD\uFF09",
		    "panel.hintOpen": "\u70B9\u51FB\u6807\u9898\u6253\u5F00\u804A\u5929\uFF0C\u70B9\u51FB\u7BAD\u5934\u5C55\u5F00\u5B50\u5206\u652F\u3002",
		    "panel.hintRemove": "\u79FB\u9664\u8282\u70B9\u4F1A\u8FDE\u540C\u5B50\u5206\u652F\u79FB\u51FA\u5217\u8868\uFF0C\u804A\u5929\u4ECD\u4FDD\u7559\u3002",
		    "marker.title": "\u5206\u652F\uFF1A{quote}\n\u70B9\u51FB\u524D\u5F80",
		    "toast.created": "\u5DF2\u521B\u5EFA\u5206\u652F",
		    "toast.forkFailed": "\u5206\u53C9\u5931\u8D25\uFF1A{message}",
		    "toast.jumpFailed": "\u8DF3\u8F6C\u5931\u8D25\uFF1A{message}",
		    "toast.noSession": "\u6CA1\u6709\u627E\u5230\u5F53\u524D\u4F1A\u8BDD\uFF0C\u8BF7\u5148\u6253\u5F00\u4E00\u4E2A\u5BF9\u8BDD",
		    "composer.quote": "\u5173\u4E8E\u8FD9\u6BB5\u5185\u5BB9\uFF1A\n\n> {quote}\n\n"
		  };

		  // src/client/quote.ts
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

		  // src/client/anchor.ts
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

		  // src/client/tree.ts
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
		  function sortByCreated(nodes) {
		    return [...nodes].sort((left, right) => left.createdAt - right.createdAt);
		  }

		  // src/client/overlay.ts
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
		`;
		  var MARKER_DEBOUNCE_MS = 220;
		  var PREFILL_ATTEMPTS = 15;
		  var SESSION_TICK_MS = 900;
		  var ICON_CHEVRON = '<path d="M4.5 6.25 8 9.75l3.5-3.5"/>';
		  var ICON_FOLDER = '<path d="M2.3 4.5c0-.7.6-1.2 1.2-1.2h3l1.4 1.6h5.6c.7 0 1.2.6 1.2 1.2v6.2c0 .7-.6 1.2-1.2 1.2H3.5c-.7 0-1.2-.6-1.2-1.2z"/>';
		  var ICON_COMMENT = '<path d="M2.8 4.4c0-.7.6-1.2 1.2-1.2h8c.7 0 1.2.6 1.2 1.2v4.6c0 .7-.6 1.2-1.2 1.2H7.4l-2.5 2.2v-2.2H4c-.7 0-1.2-.6-1.2-1.2z"/>';
		  var ICON_COLLAPSE = '<rect x="5.6" y="2.6" width="7.8" height="7.8" rx="1.6"/><path d="M3.1 6v5.2c0 .9.8 1.7 1.7 1.7h5.2"/><path d="M8.3 6.5h2.4"/>';
		  var ICON_CLOSE = '<path d="M4.6 4.6l6.8 6.8M11.4 4.6l-6.8 6.8"/>';
		  function createId() {
		    return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
		  }
		  function glyph(markup, className) {
		    const node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		    node.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		    node.setAttribute("viewBox", "0 0 16 16");
		    node.setAttribute("fill", "none");
		    node.setAttribute("stroke", "currentColor");
		    node.setAttribute("stroke-width", "1.4");
		    node.setAttribute("stroke-linecap", "round");
		    node.setAttribute("stroke-linejoin", "round");
		    node.setAttribute("aria-hidden", "true");
		    node.setAttribute("class", className);
		    node.innerHTML = markup;
		    return node;
		  }
		  function placeholderChevron() {
		    const pad = document.createElement("span");
		    pad.className = "dbc-chev placeholder";
		    pad.setAttribute("aria-hidden", "true");
		    return pad;
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
		      __publicField(this, "count");
		      __publicField(this, "collapseAll");
		      __publicField(this, "list");
		      __publicField(this, "foot");
		      __publicField(this, "toast");
		      __publicField(this, "nodes");
		      /** Group and node keys whose children are hidden in the panel. */
		      __publicField(this, "collapsed", /* @__PURE__ */ new Set());
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
		      title.className = "dbc-title";
		      title.textContent = t("panel.title");
		      this.count = document.createElement("span");
		      this.count.className = "dbc-count";
		      const spacer = document.createElement("span");
		      spacer.className = "dbc-spacer";
		      this.collapseAll = document.createElement("button");
		      this.collapseAll.type = "button";
		      this.collapseAll.className = "dbc-iconbtn";
		      this.collapseAll.title = t("panel.collapseAll");
		      this.collapseAll.setAttribute("aria-label", t("panel.collapseAll"));
		      this.collapseAll.appendChild(glyph(ICON_COLLAPSE, "dbc-glyph"));
		      const close = document.createElement("button");
		      close.type = "button";
		      close.className = "dbc-iconbtn";
		      close.title = t("panel.close");
		      close.setAttribute("aria-label", t("panel.close"));
		      close.appendChild(glyph(ICON_CLOSE, "dbc-glyph"));
		      head.append(title, this.count, spacer, this.collapseAll, close);
		      this.list = document.createElement("div");
		      this.list.className = "dbc-list";
		      this.foot = document.createElement("div");
		      this.foot.className = "dbc-foot";
		      const hintOpen = document.createElement("span");
		      hintOpen.textContent = t("panel.hintOpen");
		      const hintRemove = document.createElement("span");
		      hintRemove.textContent = t("panel.hintRemove");
		      this.foot.append(hintOpen, hintRemove);
		      this.panel.append(head, this.list, this.foot);
		      this.toast = document.createElement("div");
		      this.toast.className = "dbc-toast";
		      this.root.append(this.action, this.pill, this.panel, this.toast);
		      this.collapseAll.addEventListener("click", () => this.toggleAll());
		      close.addEventListener("click", () => {
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
		      this.count.textContent = count === 0 ? "" : String(count);
		      this.panel.classList.toggle("open", this.panelOpen);
		      const expanded = this.collapsed.size === 0;
		      this.collapseAll.title = expanded ? this.t("panel.collapseAll") : this.t("panel.expandAll");
		      this.collapseAll.setAttribute("aria-label", this.collapseAll.title);
		      this.list.replaceChildren();
		      this.foot.hidden = count === 0;
		      if (count === 0) {
		        const empty = document.createElement("div");
		        empty.className = "dbc-empty";
		        empty.textContent = this.t("panel.empty");
		        this.list.appendChild(empty);
		        return;
		      }
		      const sessionId = this.currentSessionId();
		      const known = new Set(this.nodes.map((node) => node.id));
		      const byParent = /* @__PURE__ */ new Map();
		      const roots = [];
		      for (const node of sortByCreated(this.nodes)) {
		        const parentId = node.parentId;
		        if (parentId !== void 0 && known.has(parentId)) {
		          const siblings = byParent.get(parentId);
		          if (siblings === void 0) byParent.set(parentId, [node]);
		          else siblings.push(node);
		        } else {
		          roots.push(node);
		        }
		      }
		      const groups = /* @__PURE__ */ new Map();
		      for (const node of roots) {
		        const group = groups.get(node.sourceSessionId);
		        if (group === void 0) groups.set(node.sourceSessionId, [node]);
		        else group.push(node);
		      }
		      for (const [sourceSessionId, group] of groups) {
		        this.list.appendChild(this.groupView(sourceSessionId, group, byParent, sessionId));
		      }
		    }
		    /** One source Session, plus its branches unless the group is collapsed. */
		    groupView(sourceSessionId, roots, byParent, sessionId) {
		      const group = document.createElement("div");
		      group.className = "dbc-group";
		      const key = `s:${sourceSessionId}`;
		      const isCollapsed = this.collapsed.has(key);
		      group.appendChild(this.rootRow(sourceSessionId, isCollapsed));
		      if (isCollapsed) return group;
		      const kids = document.createElement("div");
		      kids.className = "dbc-kids";
		      for (const node of roots) this.appendNode(node, byParent, sessionId, kids);
		      group.appendChild(kids);
		      return group;
		    }
		    /** Append one node and, recursively, its descendants. */
		    appendNode(node, byParent, sessionId, parent) {
		      const children = byParent.get(node.id) ?? [];
		      const hasChildren = children.length > 0;
		      const isCollapsed = this.collapsed.has(`n:${node.id}`);
		      parent.appendChild(this.nodeRow(node, sessionId, hasChildren, isCollapsed));
		      if (!hasChildren || isCollapsed) return;
		      const kids = document.createElement("div");
		      kids.className = "dbc-kids";
		      for (const child of children) this.appendNode(child, byParent, sessionId, kids);
		      parent.appendChild(kids);
		    }
		    /** Build the source-Session row that roots one group. */
		    rootRow(sessionId, isCollapsed) {
		      const row = document.createElement("div");
		      row.className = "dbc-row dbc-root";
		      const label = document.createElement("span");
		      label.className = "dbc-label";
		      label.textContent = this.sessionTitle(sessionId);
		      label.title = this.t("panel.openSource");
		      row.append(this.chevron(`s:${sessionId}`, isCollapsed), glyph(ICON_FOLDER, "dbc-glyph dbc-ico blue"), label);
		      row.addEventListener("click", () => this.open(sessionId));
		      return row;
		    }
		    /** Collapse every group when anything is open, otherwise expand everything. */
		    toggleAll() {
		      if (this.collapsed.size > 0) {
		        this.collapsed.clear();
		        this.render();
		        return;
		      }
		      const known = new Set(this.nodes.map((node) => node.id));
		      const hasChild = /* @__PURE__ */ new Set();
		      for (const node of this.nodes) {
		        if (node.parentId !== void 0 && known.has(node.parentId)) hasChild.add(node.parentId);
		      }
		      for (const node of this.nodes) {
		        if (hasChild.has(node.id)) this.collapsed.add(`n:${node.id}`);
		        if (node.parentId === void 0 || !known.has(node.parentId)) this.collapsed.add(`s:${node.sourceSessionId}`);
		      }
		      this.render();
		    }
		    /** A disclosure triangle that toggles one group and stops the row click. */
		    chevron(key, isCollapsed) {
		      const button = document.createElement("button");
		      button.type = "button";
		      button.className = isCollapsed ? "dbc-chev collapsed" : "dbc-chev";
		      button.title = isCollapsed ? this.t("panel.expand") : this.t("panel.collapse");
		      button.setAttribute("aria-label", button.title);
		      button.setAttribute("aria-expanded", String(!isCollapsed));
		      button.appendChild(glyph(ICON_CHEVRON, "dbc-glyph"));
		      button.addEventListener("click", (event) => {
		        event.stopPropagation();
		        if (this.collapsed.has(key)) this.collapsed.delete(key);
		        else this.collapsed.add(key);
		        this.render();
		      });
		      return button;
		    }
		    /** Durable Session title from the list projection, with a generic fallback. */
		    sessionTitle(sessionId) {
		      try {
		        const row = this.ctx.sessions.list?.getSnapshot?.()?.byId?.[sessionId];
		        const title = row?.projections?.values?.title;
		        if (typeof title === "string" && title.trim() !== "") return title;
		      } catch {
		      }
		      return this.t("panel.source");
		    }
		    /** Build one branch row: disclosure, icon, quote, status dot, remove. */
		    nodeRow(node, sessionId, hasChildren, isCollapsed) {
		      const row = document.createElement("div");
		      row.className = "dbc-row dbc-node";
		      const isCurrent = node.targetSessionId === sessionId;
		      if (isCurrent) row.classList.add("current");
		      const label = document.createElement("span");
		      label.className = "dbc-label";
		      label.textContent = node.quote.length > 26 ? `${node.quote.slice(0, 26)}\u2026` : node.quote;
		      label.title = `${node.quote}

		${this.t("panel.jump")}`;
		      const dot = document.createElement("span");
		      dot.className = "dbc-dot";
		      dot.title = isCurrent ? this.t("panel.current") : this.t("panel.jump");
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
		      row.append(
		        hasChildren ? this.chevron(`n:${node.id}`, isCollapsed) : placeholderChevron(),
		        glyph(hasChildren ? ICON_FOLDER : ICON_COMMENT, "dbc-glyph dbc-ico"),
		        label,
		        dot,
		        remove
		      );
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

		  // src/client/index.ts
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
