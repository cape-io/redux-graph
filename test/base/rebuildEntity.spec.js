import test from 'tape'
import { combineReducers, createStore } from 'redux'
import { get } from 'lodash'

import graph, { create, createTriple, isEntity, rebuildEntitySelector } from '../../src'
import { collection, listItem } from '../mock'

test('rebuildEntitySelector()', t => {
  const { dispatch, getState } = createStore(combineReducers({ graph }))
  create(dispatch, collection.creator)
  create(dispatch, collection.mainEntity)
  const item = create(dispatch, collection)
  const state = getState()
  // console.log(state)
  const subj = state.graph.entity[item.id]
  t.deepEqual(item, subj)
  t.ok(isEntity(subj))
  t.notOk(subj.creator, 'creator')
  t.notOk(subj.mainEntity, 'mainEntity')
  create(dispatch, listItem.item)
  const triple = { subject: item, predicate: 'itemListElement', object: listItem }
  const { object } = createTriple(dispatch, triple)
  const state2 = getState()
  const buildEntity = rebuildEntitySelector(() => item.id)
  const entity = buildEntity(state2)
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
