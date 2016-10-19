import test from 'tape'
import { constant, forEach, isArray, isObject, matches } from 'lodash'

import {
  createEntity, createIfNew, insertFields, isEntity, isEntityCreated, isTriple, key0,
  splitEntity, selectorCreate, val0,
} from '../../src'
import state, { collection, creator, mainEntity } from '../mock'

test('isEntity', t => {
  t.ok(isEntity(mainEntity), 'mainEntity is entity.')
  t.false(isEntity({ id: 'abc' }), 'object with no type is not an entity.')
  t.end()
})
test('isEntityCreated', t => {
  t.false(isEntityCreated(creator, true), 'not created if missing date.')
  t.false(isEntityCreated({ type: 'Person' }), 'not created.')
  t.false(isEntityCreated({ id: 'abc' }), 'missing type not created.')
  t.ok(isEntityCreated(creator), 'entity has props required for creation.')
  t.end()
})
test('insertFields', t => {
  const item1 = insertFields(mainEntity)
  t.ok(isEntityCreated(item1, true), 'has dateCreated field added.')
  t.notEqual(item1, mainEntity, 'new obj created when fields added.')
  t.equal(item1.id, mainEntity.id, 'left id the same.')
  t.equal(item1.type, mainEntity.type, 'type left the same.')
  const now = new Date()
  mainEntity.dateCreated = now
  t.ok(isEntityCreated(mainEntity, true), 'sanity check that our proto is created.')
  t.equal(insertFields(mainEntity), mainEntity, 'insertFields returns orig if created.')
  delete item1.id
  const item2 = insertFields(item1)
  t.ok(isEntityCreated(item2, true), 'created correctly.')
  t.equal(item1.dateCreated, item2.dateCreated, 'dateCreated left the same if included.')
  delete item2.type
  const item3 = insertFields(item2)
  t.equal(item3.type, 'Thing', 'default type is Thing.')
  t.equal(item2.id, item3.id, 'id is left the same.')
  t.ok(isEntityCreated(item3, true), 'created correctly.')
  t.end()
})
test('createIfNew', t => {
  function dispatchFail() { t.fail('created entity should not dispatch.') }
  const created = { id: 'abc', type: 'CreativeWork' }
  t.equal(createIfNew(dispatchFail, created), created, 'return if created.')
  let createdItem = null
  function dispatchOk(action) {
    t.equal(action.type, 'graph/entity/PUT', 'action type')
    t.ok(isEntityCreated(action.payload), 'entity created')
    createdItem = action.payload
  }
  const item = createIfNew(dispatchOk, { type: 'Person' })
  t.deepEqual(item, createdItem, 'item returned')
  t.end()
})
const subject = {
  itemListOrder: 'Ascending',
  title: 'Favorites',
  type: 'CollectionList',
}
const triples = [
  {
    predicate: 'creator',
    subject: { id: '0tl6uma3', type: 'CollectionList' },
    object: { id: 'user0', type: 'Person' },
    id: [ '0tl6uma3', 'creator', 'user0' ],
  },
  {
    predicate: 'mainEntity',
    subject: { id: '0tl6uma3', type: 'CollectionList' },
    object: { id: 'pBlf', type: 'DataFeed' },
    id: [ '0tl6uma3', 'mainEntity', 'pBlf' ],
  },
]
function shouldMatch(t, res, lookFor) {
  forEach(lookFor, (val, key) => t.equal(res[key], val, key))
}
test('splitEntity', t => {
  const split = splitEntity(collection)
  t.ok(isObject(split), 'split is object')
  t.ok(isObject(split.subject), 'subject is object')
  t.ok(isArray(split.triples), 'triples is array')
  shouldMatch(t, split.subject, subject)
  t.equal(split.triples.length, 2, 'triples len 2')
  t.equal(split.triples[0].subject, split.subject)
  t.equal(split.triples[0].predicate, 'creator')
  t.equal(split.triples[0].object, creator)
  t.equal(split.triples[1].subject, split.subject)
  t.equal(split.triples[1].predicate, 'mainEntity')
  t.equal(split.triples[1].object, mainEntity)
  const split2 = splitEntity({})
  t.ok(isObject(split2.subject))
  t.equal(split2.triples.length, 0)
  t.end()
})
const expectedActions = constant([
  {
    type: 'graph/entity/PUT',
    payload: subject,
  },
  {
    type: 'graph/triple/PUT',
    payload: triples[0],
  },
  {
    type: 'graph/triple/PUT',
    payload: triples[1],
  },
])
test('createEntity()', t => {
  t.plan(6)
  const expActs = expectedActions()
  function dispatch(action) {
    const expAct = expActs.shift()
    t.equal(action.type, expAct.type, 'type is the same')
    if (action.type === 'graph/triple/PUT') {
      t.ok(isTriple(action.payload, true), 'is triple')
    }
    else {
      t.ok(isEntity(action.payload), 'is entity')
    }
  }
  createEntity(dispatch, collection)
})
test('selectorCreate', (t) => {
  t.plan(4)
  const car = { type: 'Automobile', name: 'Audi' }
  function dispatch(action) {
    t.equal(action.type, 'graph/entity/PUT', 'type is the same')
    t.ok(matches(car)(action.payload))
    t.ok(action.payload.id)
  }
  function entityBuilder(passedState) {
    t.equal(passedState, state, 'entityBuilder passed state')
    return car
  }
  const getState = constant(state)
  selectorCreate(entityBuilder)(dispatch, getState)
})
test('key0', t => {
  t.equal(key0({ first: 'boo' }), 'first', 'find val of first key')
  t.end()
})
test('val0', t => {
  t.equal(val0({ foo: 'bar' }), 'bar')
  t.end()
})
