import test from 'tape'

import { expandIndex, tripleIndexSelector, tripleTypeIndexSelector } from '../../src'
import state from '../mock'

test('expandIndex', t => {
  const index = { a: true, b: true }
  const expanded = expandIndex(index, state.graph.entity)
  t.equal(expanded.a, state.graph.entity.a)
  t.equal(expanded.b, state.graph.entity.b)
  t.end()
})
test('tripleIndexSelector', t => {
  const indexSelector = () => ({ c: true, a1: true })
  const selector = tripleIndexSelector(indexSelector)
  const expanded = selector(state)
  t.equal(expanded.c, state.graph.entity.c)
  t.equal(expanded.a1, state.graph.entity.a1)
  t.end()
})
test('tripleTypeIndexSelector', t => {
  const indexSelector = () => ({ c: true, a1: true })
  const selector = tripleTypeIndexSelector(indexSelector)
  const typeIndex = selector(state)
  t.equal(typeIndex.foo.c, state.graph.entity.c)
  t.equal(typeIndex.bar.a1, state.graph.entity.a1)
  t.end()
})
