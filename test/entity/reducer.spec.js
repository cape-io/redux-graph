import test from 'tape'
import { entityUpdate, entityPut } from '../../src'
import reducer from '../../src/entity/reducer'
import { creator, item } from '../mock'

test('entityPut', t => {
  const state = reducer(undefined, entityPut(creator))
  t.deepEqual(state.user0, creator)
  const state2 = reducer(state, entityPut(item))
  t.deepEqual(state2.user0, creator)
  t.deepEqual(state2.i28, item)
  t.end()
})
test('entityUpdate', t => {
  const entity = { id: 'foo', bar: true }
  const initState = { foo: {} }
  const state = reducer(initState, entityUpdate(entity))
  t.deepEquals(state.foo, entity)
  t.ok(state.foo !== initState.foo)
  const state2 = reducer(state, entityPut(creator))
  t.deepEquals(state2.foo, entity)
  const up1 = { id: creator.id, image: 'http://www.example.com/image.jpg', more: 'fields' }
  const state3 = reducer(state2, entityUpdate(up1))
  t.deepEqual(state3.user0, { ...creator, ...up1 })
  t.end()
})
