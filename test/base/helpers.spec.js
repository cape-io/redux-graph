import test from 'tape'

import { create, createIfNew, insertFields, isEntity, isEntityCreated, isTriple } from '../../src'

const mainEntity = { id: 'pBlf', type: 'DataFeed' }
const creator = {
  id: 'user0',
  type: 'Person',
  name: 'Anonymous Person or User of the website',
}
const title = 'Favorites'
const collection = {
  creator, // User that created the thing.
  itemListOrder: 'Ascending',
  mainEntity, // List of what.
  title,
  type: 'CollectionList',
}
const expectedActions = [
  {
    type: 'graph/triple/PUT',
    payload: {
      predicate: 'creator',
      subject: { id: '0tl6uma3', type: 'CollectionList' },
      object: { id: 'user0', type: 'Person' },
      id: [ '0tl6uma3', 'creator', 'user0' ] },
  },
  {
    type: 'graph/triple/PUT',
    payload: {
      predicate: 'mainEntity',
      subject: { id: '0tl6uma3', type: 'CollectionList' },
      object: { id: 'pBlf', type: 'DataFeed' },
      id: [ '0tl6uma3', 'mainEntity', 'pBlf' ],
    },
  },
  {
    type: 'graph/entity/PUT',
    payload: {
      itemListOrder: 'Ascending',
      title: 'Favorites',
      type: 'CollectionList',
    },
  },
]
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
test('create()', t => {
  let subject = null
  function dispatch(action) {
    // console.log(action)
    const expAct = expectedActions.shift()
    t.equal(action.type, expAct.type, 'type is the same')
    if (action.type === 'graph/triple/PUT') {
      t.ok(isTriple(action.payload, true), 'is triple')
      if (!subject) {
        subject = action.payload.subject
      }
      else {
        t.deepEqual(action.payload.subject, subject, 'subject match')
      }
    }
    else {
      t.ok(isEntity(action.payload), 'is entity')
      t.equal(action.payload.id, subject.id, 'subject id')
      t.equal(action.payload.type, subject.type, 'subj type')
    }
  }
  create(dispatch, collection)
  t.end()
})
