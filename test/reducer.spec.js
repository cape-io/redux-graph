import test from 'tape'
import { isNumber } from 'lodash'
import { insertFields, updateFields, REF } from '../src'
import {
  entityUpdateReducer, entityPutReducer, entityPutAllReducer, updateSubjRef,
} from '../src/reducer'
import { agent, collection, creator, item } from './mock'

test('entityPutReducer', (t) => {
  const payload = insertFields(creator)
  const state = entityPutReducer({}, payload)
  t.equal(state.Person.user0, payload)
  const pay2 = insertFields({ ...agent, friend: creator, art: item })
  const st2 = entityPutReducer(state, pay2)
  t.equal(st2.Person.ag12, pay2, 'pay2')
  t.ok(isNumber(st2.Person.ag12.dateCreated))
  t.equal(st2.Person.user0.rangeIncludes.friend.Person_ag12.id, 'ag12')
  t.equal(st2.Item.i28z.rangeIncludes.art.Person_ag12.id, 'ag12')
  t.equal(st2.Person.user0.name, creator.name)
  // console.log(JSON.stringify(st2, true, 2))
  t.end()
})
test('updateSubjRef', (t) => {
  const state = {}
  const predicate = 'friend'
  const subj = agent
  const obj = creator
  const res = updateSubjRef(state, subj, predicate, obj)
  t.equal(res.Person[agent.id][REF].friend, obj)
  t.end()
})
test('entityUpdate', (t) => {
  const payload = [
    insertFields({ ...creator, friend: agent, art: item }),
    insertFields(collection),
  ]
  const state = entityPutAllReducer({}, payload)
  t.false(state.Item.i28z.rangeIncludes.art.Person_user0.dateModified)
  t.false(state.Person.ag12.rangeIncludes.friend.Person_user0.dateModified)
  // console.log(JSON.stringify(state, true, 2))
  const pay2 = updateFields({ id: creator.id, type: creator.type, foo: 'bar' })
  const st2 = entityUpdateReducer(state, pay2)
  // console.log(JSON.stringify(st2, null, 2))
  t.equal(st2.Person.user0.foo, 'bar', 'user0 foo field was set correctly.')
  t.ok(state.Person.user0 !== st2.Person.user0, 'new user0 obj')
  t.ok(state.Person.ag12 !== st2.Person.ag12, 'new ag12 obj')
  t.ok(state.Person.user0.name === st2.Person.user0.name, 'name same')
  t.ok(isNumber(st2.Person.user0.dateCreated), 'user0 dateCreated')
  t.ok(isNumber(st2.Person.user0.dateModified), 'user0 dateModified')
  t.ok(isNumber(st2.Item.i28z.rangeIncludes.art.Person_user0.dateModified), 'art.Person_user0 dM')
  t.ok(isNumber(st2.Person.ag12.rangeIncludes.friend.Person_user0.dateModified), 'friend dM')
  t.ok(isNumber(st2.CollectionList[payload[1].id][REF].creator.dateModified), 'collection creator')
  t.end()
})
