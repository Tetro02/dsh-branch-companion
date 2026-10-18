import assert from 'node:assert/strict'
import test from 'node:test'

import { MAX_QUOTE, chunkIndexAt, matchQuote, normalizeQuote } from '../lib/internal/quote.js'

test('normalizeQuote collapses layout whitespace and caps the length', () => {
  assert.equal(normalizeQuote('  光路\n被  遮挡\t'), '光路 被 遮挡')
  assert.equal(normalizeQuote('x'.repeat(MAX_QUOTE + 50)).length, MAX_QUOTE)
  assert.equal(normalizeQuote(''), '')
})

test('matchQuote finds a quote whose rendered whitespace changed', () => {
  const text = '当循环前缀\n短于信道的最大多径时延，会发生什么'
  const match = matchQuote(text, '当循环前缀 短于信道的最大多径时延')
  assert.ok(match)
  assert.equal(text.slice(match.start, match.end), '当循环前缀\n短于信道的最大多径时延')
})

test('matchQuote falls back to the leading characters of a long quote', () => {
  const head = 'OFDM 把频率选择性信道转化为多个近似平坦的子信道'
  const text = `前言 ${head}，后半段已经改写`
  const quote = `${head}，但后半句在会话里被改掉了`
  const match = matchQuote(text, quote)
  assert.ok(match)
  assert.equal(text.slice(match.start, match.end).startsWith('OFDM'), true)
})

test('matchQuote reports no match for text that is gone', () => {
  assert.equal(matchQuote('无关内容', '被删除的段落'), null)
  assert.equal(matchQuote('任意内容', '   '), null)
})

test('chunkIndexAt maps offsets to the owning chunk', () => {
  const chunks = [
    { start: 0, length: 5 },
    { start: 5, length: 3 },
    { start: 8, length: 4 }
  ]
  assert.equal(chunkIndexAt(chunks, 0), 0)
  assert.equal(chunkIndexAt(chunks, 4), 0)
  assert.equal(chunkIndexAt(chunks, 5), 1)
  assert.equal(chunkIndexAt(chunks, 11), 2)
  assert.equal(chunkIndexAt(chunks, 12), -1)
  assert.equal(chunkIndexAt(chunks, -1), -1)
})
