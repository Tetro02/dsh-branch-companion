/**
 * Quote matching: the pure half of branch anchoring.
 *
 * A quote is captured from a live DOM selection, but it must be found again
 * after React re-renders the transcript, where layout whitespace can change.
 * Matching therefore collapses whitespace on both sides and tolerates any
 * whitespace run of the rendered text; offsets always refer to the original
 * rendered string so the caller can map them back to text nodes.
 *
 * @module dsh-branch-companion/client/quote
 */

/** Upper bound on a stored quote, in characters. */
export const MAX_QUOTE = 600

/** A matched span in the rendered text. */
export interface QuoteMatch {
  /** Offset of the first matched character. */
  start: number
  /** Offset just past the last matched character. */
  end: number
}

/** One text node's slice of the concatenated rendered text. */
export interface TextChunk {
  /** Offset of this chunk in the concatenated string. */
  start: number
  /** Length of this chunk, in characters. */
  length: number
}

/**
 * Collapse layout whitespace and cap the stored length.
 * @param text - raw selection or stored quote.
 * @returns the normalized quote.
 */
export function normalizeQuote(text: string): string {
  return text.replace(/\s+/gu, ' ').trim().slice(0, MAX_QUOTE)
}

/**
 * Escape a literal for inclusion in a RegExp.
 * @param text - literal text.
 * @returns the escaped pattern source.
 */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
}

/**
 * Locate a quote inside rendered text.
 *
 * The full quote is tried first; a quote longer than 24 characters falls back to
 * its first 24 characters, which survives edits inside the tail of a long
 * paragraph. Both patterns allow any whitespace run between words.
 *
 * @param text - concatenated rendered text of the transcript.
 * @param quote - stored or freshly selected quote.
 * @returns the matched span, or null when the quote no longer appears.
 */
export function matchQuote(text: string, quote: string): QuoteMatch | null {
  const target = normalizeQuote(quote)
  if (target === '') return null
  const words = target.split(' ').filter((word) => word !== '').map(escapeRegExp)
  const patterns = [words.join('\\s+')]
  if (target.length > 24) {
    patterns.push(escapeRegExp(target.slice(0, 24)).replace(/\\ /gu, '\\s+'))
  }
  for (const pattern of patterns) {
    const match = new RegExp(pattern, 'u').exec(text)
    if (match !== null) return { start: match.index, end: match.index + match[0].length }
  }
  return null
}

/**
 * Find the chunk containing one offset.
 * @param chunks - chunk table in document order.
 * @param offset - offset into the concatenated text.
 * @returns the chunk index, or -1 when the offset is out of range.
 */
export function chunkIndexAt(chunks: readonly TextChunk[], offset: number): number {
  for (let index = chunks.length - 1; index >= 0; index -= 1) {
    const chunk = chunks[index]
    if (offset >= chunk.start && offset < chunk.start + chunk.length) return index
  }
  return -1
}
