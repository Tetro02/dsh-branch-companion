import assert from 'node:assert/strict'
import test from 'node:test'

import {
  depthOf,
  parentOf,
  parseNodes,
  removeSubtree,
  serializeNodes,
  sortByCreated
} from '../lib/internal/tree.js'

/** Two levels of branches rooted in session A. */
const nodes = [
  { id: 'n1', sourceSessionId: 'A', targetSessionId: 'B', quote: '一', createdAt: 30 },
  { id: 'n2', parentId: 'n1', sourceSessionId: 'B', targetSessionId: 'C', quote: '二', createdAt: 20 },
  { id: 'n3', parentId: 'n2', sourceSessionId: 'C', targetSessionId: 'D', quote: '三', createdAt: 10 },
  { id: 'n4', sourceSessionId: 'A', targetSessionId: 'E', quote: '四', createdAt: 40 }
]

test('parseNodes keeps valid entries and drops malformed ones', () => {
  const raw = JSON.stringify([nodes[0], { id: 'bad' }, null, 'x'])
  assert.deepEqual(parseNodes(raw).map((node) => node.id), ['n1'])
  assert.deepEqual(parseNodes(null), [])
  assert.deepEqual(parseNodes('{not json'), [])
  assert.deepEqual(parseNodes('{"nodes":[]}'), [])
})

test('serializeNodes round-trips through parseNodes', () => {
  assert.deepEqual(parseNodes(serializeNodes(nodes)), nodes)
})

test('parentOf reports the earliest node that opened a session', () => {
  const duplicates = [
    { id: 'late', sourceSessionId: 'X', targetSessionId: 'B', quote: 'a', createdAt: 5 },
    { id: 'early', sourceSessionId: 'X', targetSessionId: 'B', quote: 'b', createdAt: 1 }
  ]
  assert.equal(parentOf(duplicates, 'B'), 'early')
  assert.equal(parentOf(nodes, 'A'), undefined)
})

test('removeSubtree removes the node and every descendant', () => {
  assert.deepEqual(removeSubtree(nodes, 'n2').map((node) => node.id), ['n1', 'n4'])
  assert.deepEqual(removeSubtree(nodes, 'n4').map((node) => node.id), ['n1', 'n2', 'n3'])
})

test('depthOf walks parents and survives a cycle', () => {
  assert.equal(depthOf(nodes, nodes[0]), 0)
  assert.equal(depthOf(nodes, nodes[1]), 1)
  assert.equal(depthOf(nodes, nodes[2]), 2)
  const cyclic = [
    { id: 'a', parentId: 'b', sourceSessionId: 'S', targetSessionId: 'T', quote: '', createdAt: 1 },
    { id: 'b', parentId: 'a', sourceSessionId: 'S', targetSessionId: 'T', quote: '', createdAt: 2 }
  ]
  assert.ok(depthOf(cyclic, cyclic[0]) <= 32)
})

test('sortByCreated does not mutate its input', () => {
  const copy = [...nodes]
  assert.deepEqual(sortByCreated(nodes).map((node) => node.id), ['n3', 'n2', 'n1', 'n4'])
  assert.deepEqual(nodes, copy)
})
