import test from 'tape'
import { combineReducers, createStore } from 'redux'
import { forEach, get, size } from 'lodash'

import graph, {
  create, createTriple, entityTypeSelector, isEntity,
  rebuildEntitySelector, rebuildEntitiesSelector,
} from '../../'
import { collection, collection2, listItem } from '../mock'

const { dispatch, getState } = createStore(combineReducers({ graph }))
create(dispatch, collection.creator)
create(dispatch, collection.mainEntity)
const item = create(dispatch, collection)
create(dispatch, collection2)
create(dispatch, listItem.item)
const triple = { subject: item, predicate: 'itemListElement', object: listItem }
const { object } = createTriple(dispatch, triple)
const state = getState()

test('rebuildEntitySelector()', t => {
  // console.log(state)
  const subj = state.graph.entity[item.id]
  t.deepEqual(item, subj)
  t.ok(isEntity(subj))
  t.notOk(subj.creator, 'creator')
  t.notOk(subj.mainEntity, 'mainEntity')
  const buildEntity = rebuildEntitySelector(() => item.id)
  const entity = buildEntity(state)
  // console.log(entity.itemListElement[object.id].item)
  t.ok(isEntity(get(entity, 'creator.user0')), 'creator')
  t.ok(isEntity(get(entity, 'mainEntity.pBlf')), 'mainEntity')
  t.ok(isEntity(get(entity, [ 'itemListElement', object.id ])), 'itemListElement')
  const id = listItem.item.id
  const liItem = get(entity, [ 'itemListElement', object.id, 'item', id ])
  t.ok(isEntity(liItem), 'itemListElement.item')
  t.deepEqual(liItem, listItem.item, 'liItem')
  t.end()
})
test('rebuildEntitiesSelector()', t => {
  const getCollections = rebuildEntitiesSelector(entityTypeSelector('CollectionList'))
  const collections = getCollections(state)
  t.equal(size(collections), 2, 'size')
  forEach(collections, entity => {
    t.ok(isEntity(get(entity, 'creator.user0')), 'creator')
    t.ok(isEntity(get(entity, 'mainEntity.pBlf')), 'mainEntity')
  })
  t.end()
})
