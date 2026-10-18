/**
 * Branch tree bookkeeping: persistence and parent/child queries.
 *
 * Nodes are owned by the browser (one `localStorage` document per origin), so
 * every operation here is pure and takes the node list as input. Losing the
 * document only loses the panel and its markers; the sessions themselves are
 * Host state and stay untouched.
 *
 * @module dsh-branch-companion/client/tree
 */

/** Storage key owning the node document. */
export const STORAGE_KEY = 'dsh-branch-companion.nodes.v1'

/** One branch: a quote in a source Session that opened a target Session. */
export interface BranchNode {
  /** Stable node id. */
  id: string
  /** Parent node id, when this branch grew out of another branch. */
  parentId?: string
  /** Session the quote was selected in. */
  sourceSessionId: string
  /** Session the branch opened. */
  targetSessionId: string
  /** Normalized quoted text. */
  quote: string
  /** Creation time in epoch milliseconds. */
  createdAt: number
}

/**
 * Parse the persisted document.
 * @param raw - raw storage value.
 * @returns valid nodes; malformed entries are dropped.
 */
export function parseNodes(raw: string | null): BranchNode[] {
  if (raw === null) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((entry): entry is BranchNode => {
      if (entry === null || typeof entry !== 'object') return false
      const node = entry as Partial<BranchNode>
      return typeof node.id === 'string'
        && typeof node.sourceSessionId === 'string'
        && typeof node.targetSessionId === 'string'
        && typeof node.quote === 'string'
        && typeof node.createdAt === 'number'
    })
  } catch {
    return []
  }
}

/**
 * Serialize nodes for storage.
 * @param nodes - branch nodes.
 * @returns the JSON document.
 */
export function serializeNodes(nodes: readonly BranchNode[]): string {
  return JSON.stringify(nodes)
}

/**
 * The node that opened a Session, if any.
 *
 * Several nodes can target one Session only through a stale document, so the
 * earliest one wins deterministically.
 *
 * @param nodes - branch nodes.
 * @param sessionId - the Session to trace back.
 * @returns the owning node id.
 */
export function parentOf(nodes: readonly BranchNode[], sessionId: string): string | undefined {
  let best: BranchNode | undefined
  for (const node of nodes) {
    if (node.targetSessionId !== sessionId) continue
    if (best === undefined || node.createdAt < best.createdAt) best = node
  }
  return best?.id
}

/**
 * Collect a node and every descendant.
 * @param nodes - branch nodes.
 * @param nodeId - subtree root.
 * @returns ids to remove.
 */
export function descendantIds(nodes: readonly BranchNode[], nodeId: string): Set<string> {
  const doomed = new Set<string>([nodeId])
  let grew = true
  while (grew) {
    grew = false
    for (const node of nodes) {
      if (node.parentId !== undefined && doomed.has(node.parentId) && !doomed.has(node.id)) {
        doomed.add(node.id)
        grew = true
      }
    }
  }
  return doomed
}

/**
 * Remove a node and its descendants.
 * @param nodes - branch nodes.
 * @param nodeId - subtree root.
 * @returns the surviving nodes.
 */
export function removeSubtree(nodes: readonly BranchNode[], nodeId: string): BranchNode[] {
  const doomed = descendantIds(nodes, nodeId)
  return nodes.filter((node) => !doomed.has(node.id))
}

/**
 * Indentation depth of a node in the tree.
 * @param nodes - branch nodes.
 * @param node - the node to measure.
 * @returns the number of ancestors, capped so a corrupt document cannot loop.
 */
export function depthOf(nodes: readonly BranchNode[], node: BranchNode): number {
  let depth = 0
  let cursor: BranchNode | undefined = node
  const seen = new Set<string>([node.id])
  while (cursor?.parentId !== undefined && depth < 32) {
    const parent = nodes.find((candidate) => candidate.id === cursor?.parentId)
    if (parent === undefined || seen.has(parent.id)) break
    seen.add(parent.id)
    cursor = parent
    depth += 1
  }
  return depth
}

/**
 * Creation order, which is the order the panel lists siblings in.
 * @param nodes - branch nodes.
 * @returns a sorted copy.
 */
export function sortByCreated(nodes: readonly BranchNode[]): BranchNode[] {
  return [...nodes].sort((left, right) => left.createdAt - right.createdAt)
}
