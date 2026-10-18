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
export {
  MAX_QUOTE,
  chunkIndexAt,
  escapeRegExp,
  matchQuote,
  normalizeQuote
};
