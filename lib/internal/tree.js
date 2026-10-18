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
export {
  STORAGE_KEY,
  depthOf,
  descendantIds,
  parentOf,
  parseNodes,
  removeSubtree,
  serializeNodes,
  sortByCreated
};
