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
export declare const STORAGE_KEY = "dsh-branch-companion.nodes.v1";
/** One branch: a quote in a source Session that opened a target Session. */
export interface BranchNode {
    /** Stable node id. */
    id: string;
    /** Parent node id, when this branch grew out of another branch. */
    parentId?: string;
    /** Session the quote was selected in. */
    sourceSessionId: string;
    /** Session the branch opened. */
    targetSessionId: string;
    /** Normalized quoted text. */
    quote: string;
    /** Creation time in epoch milliseconds. */
    createdAt: number;
}
/**
 * Parse the persisted document.
 * @param raw - raw storage value.
 * @returns valid nodes; malformed entries are dropped.
 */
export declare function parseNodes(raw: string | null): BranchNode[];
/**
 * Serialize nodes for storage.
 * @param nodes - branch nodes.
 * @returns the JSON document.
 */
export declare function serializeNodes(nodes: readonly BranchNode[]): string;
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
export declare function parentOf(nodes: readonly BranchNode[], sessionId: string): string | undefined;
/**
 * Collect a node and every descendant.
 * @param nodes - branch nodes.
 * @param nodeId - subtree root.
 * @returns ids to remove.
 */
export declare function descendantIds(nodes: readonly BranchNode[], nodeId: string): Set<string>;
/**
 * Remove a node and its descendants.
 * @param nodes - branch nodes.
 * @param nodeId - subtree root.
 * @returns the surviving nodes.
 */
export declare function removeSubtree(nodes: readonly BranchNode[], nodeId: string): BranchNode[];
/**
 * Indentation depth of a node in the tree.
 * @param nodes - branch nodes.
 * @param node - the node to measure.
 * @returns the number of ancestors, capped so a corrupt document cannot loop.
 */
export declare function depthOf(nodes: readonly BranchNode[], node: BranchNode): number;
/**
 * Creation order, which is the order the panel lists siblings in.
 * @param nodes - branch nodes.
 * @returns a sorted copy.
 */
export declare function sortByCreated(nodes: readonly BranchNode[]): BranchNode[];
