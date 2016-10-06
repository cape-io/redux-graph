import test from 'tape'

import reducer, { createTypeIndex, getPath, validEntity } from '../../src/entity/typeIndexReducer'
import state from '../mock'
const entity = state.graph.entity

test('validEntity', (t) => {
  t.true(validEntity(entity.a))
  t.true(validEntity(entity.a1))
  t.false(validEntity({ type: 'foo' }))
  t.false(validEntity({ id: 'foo' }))
  t.end()
})
test('getPath', (t) => {
  t.deepEqual(getPath(entity.a), [ 'foo', 'a' ])
  t.deepEqual(getPath(entity.a1), [ 'bar', 'a1' ])
  t.end()
})
test('createTypeIndex', (t) => {
  const typeIndex = createTypeIndex(entity)
  t.deepEqual(typeIndex, state.graph.typeIndex)
  t.end()
})
