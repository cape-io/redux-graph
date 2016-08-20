import test from 'tape'

import { create, createIfNew, isEntity, isEntityCreated, isTriple } from '../src'

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
test('isEntityCreated', t => {
  t.ok(isEntityCreated(creator), 'created')
  t.false(isEntityCreated({ type: 'Person' }), 'not created')
  t.end()
})
test('createIfNew', t => {
  function dispatchFail() { t.fail('created entity should not dispatch.') }
  const created = { id: 'abc' }
  t.equal(createIfNew(dispatchFail, created), created, 'return if created')
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
