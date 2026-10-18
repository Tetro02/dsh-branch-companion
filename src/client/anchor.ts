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

import { chunkIndexAt, matchQuote, type TextChunk } from './quote.js'

/** One text node plus its slice of the concatenated text. */
interface TextNodeChunk extends TextChunk {
  node: Text
}

/** Subtrees whose text is never part of a quote. */
const SKIP_SELECTOR = 'script, style, button, textarea, [data-approval-key], iframe, .xterm'

/**
 * Concatenate the transcript text, remembering where each node starts.
 * @param root - transcript content element.
 * @returns the joined text and its chunk table.
 */
function collectRenderedText(root: Element): { text: string; chunks: TextNodeChunk[] } {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (parent === null || parent.closest(SKIP_SELECTOR) !== null) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    }
  })
  const chunks: TextNodeChunk[] = []
  let text = ''
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const value = node.nodeValue ?? ''
    chunks.push({ node, start: text.length, length: value.length })
    text += value
  }
  return { text, chunks }
}

/**
 * Locate a stored quote in the transcript and return its Range.
 * @param root - transcript content element.
 * @param quote - normalized quote text.
 * @returns the matching Range, or null when the text is gone.
 */
export function findQuoteRange(root: Element, quote: string): Range | null {
  const { text, chunks } = collectRenderedText(root)
  const match = matchQuote(text, quote)
  if (match === null) return null
  const startIndex = chunkIndexAt(chunks, match.start)
  const endIndex = chunkIndexAt(chunks, match.end - 1)
  if (startIndex < 0 || endIndex < 0) return null
  const start = chunks[startIndex]
  const end = chunks[endIndex]
  const range = document.createRange()
  try {
    range.setStart(start.node, match.start - start.start)
    range.setEnd(end.node, match.end - end.start)
  } catch {
    return null
  }
  return range
}
