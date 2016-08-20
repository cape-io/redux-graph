import test from 'tape'

import { create, isEntity, isTriple } from '../src'

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
