import test from 'tape'

import reducer, { createTypeIndex, getPath, validEntity } from '../../src/entity/typeIndexReducer'
import { entityPut } from '../../src/'
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
test('reducer', (t) => {
  const st1 = reducer(undefined, entityPut(entity.a))
  t.deepEqual(st1, { foo: { a: true } })
  const st2 = reducer(st1, entityPut(entity.b))
  t.deepEqual(st2, { foo: { a: true, b: true } })

  t.end()
})
