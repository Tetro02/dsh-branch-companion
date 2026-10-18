/**
 * Anchoring a stored quote to a live transcript.
 *
 * Anchors are deliberately DOM-read-only: the plugin never wraps, moves, or
 * splits transcript text nodes, because those nodes belong to React. Instead it
 * locates the quote's first matching span and hands the caller a Range, which
 * is measured and discarded.
 *
 * @module dsh-branch-companion/client/anchor
 */
/**
 * Locate a stored quote in the transcript and return its Range.
 * @param root - transcript content element.
 * @param quote - normalized quote text.
 * @returns the matching Range, or null when the text is gone.
 */
export declare function findQuoteRange(root: Element, quote: string): Range | null;
