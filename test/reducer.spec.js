import test from 'tape'
import { isNumber, isMatch } from 'lodash'
import { getKey, insertFields, updateFields, REF, REFS } from '../src'
import {
  delRefs, entityUpdateReducer, entityPutReducer, entityPutAllReducer, putRefs, updateSubjRef,
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
  const state = { Person: { [agent.id]: { [REF]: { friend: {} } } } }
  const predicate = 'friend'
  const subj = agent
  const obj = creator
  const res = updateSubjRef(state, subj, predicate, obj)
  t.equal(res.Person[agent.id][REF].friend, obj)
  const res2 = updateSubjRef({}, subj, predicate, obj)
  t.equal(res2.Person[agent.id][REFS].friend[getKey(obj)], obj)
  t.end()
})
const payload = [
  insertFields({ ...creator, friend: agent, art: item }),
  insertFields(collection),
]
const state = entityPutAllReducer({}, payload)
test('entityUpdateReducer', (t) => {
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
test('putRefs', (t) => {
  const person = state.Person[creator.id]
  const st1 = putRefs(state, { subject: creator, predicate: 'friends', object: agent })
  t.ok(isMatch(agent, st1.Person[creator.id][REFS].friends[getKey(agent)]))
  t.equal(st1.Person[creator.id].name, creator.name)
  t.equal(person[REF], st1.Person[creator.id][REF])
  t.equal(st1.Person[agent.id].rangeIncludes.friends[getKey(creator)].id, creator.id)
  const pay2 = updateFields({ id: creator.id, type: creator.type, foo: 'bar21' })
  const st2 = entityUpdateReducer(st1, pay2)
  t.equal(st2.Person[creator.id].foo, 'bar21')
  t.deepEqual(st2.Person[creator.id][REF], st1.Person[creator.id][REF])
  t.deepEqual(st2.Person[creator.id][REFS], st1.Person[creator.id][REFS])
  t.end()
})
test('delRefs', (t) => {
  const st1 = putRefs(state, { subject: creator, predicate: 'friend', object: agent, single: 1 })
  t.equal(st1.Person[creator.id][REF].friend.id, agent.id)
  const st2 = delRefs(st1, { subject: creator, predicate: 'friend', single: 1 })
  t.equal(st2.Person[creator.id][REF].friend, null, 'deleted')
  t.end()
})
