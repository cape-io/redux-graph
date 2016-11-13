import test from 'tape'
import { insertFields } from '../src'
import { entityPutReducer } from '../src/reducer'
import { agent, creator, item } from './mock'

test('entityPutReducer', (t) => {
  const payload = insertFields(creator)
  const state = entityPutReducer({}, payload)
  t.equal(state.Person.user0, payload)
  const pay2 = insertFields({ ...agent, friend: creator, art: item })
  const st2 = entityPutReducer(state, pay2)
  t.equal(st2.Person.ag12, pay2, 'pay2')
  t.equal(st2.Person.user0.rangeIncludes.friend.Person_ag12.id, 'ag12')
  t.equal(st2.Item.i28z.rangeIncludes.art.Person_ag12.id, 'ag12')
  t.equal(st2.Person.user0.name, creator.name)
  // console.log(JSON.stringify(st2, true, 2))
  t.end()
})
test('entityUpdate', (t) => {
  // const entity = { id: 'foo', bar: true }
  // const initState = { foo: {} }
  // const state = reducer(initState, entityUpdate(entity))
  // t.deepEquals(state.foo, entity)
  // t.ok(state.foo !== initState.foo)
  // const state2 = reducer(state, entityPut(creator))
  // t.deepEquals(state2.foo, entity)
  // const up1 = { id: creator.id, image: 'http://www.example.com/image.jpg', more: 'fields' }
  // const state3 = reducer(state2, entityUpdate(up1))
  // t.deepEqual(state3.user0, { ...creator, ...up1 })
  t.end()
})
