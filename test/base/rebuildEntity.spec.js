import test from 'tape'
import { combineReducers, createStore } from 'redux'
import { get } from 'lodash'

import graph, { create, isEntity, rebuildEntitySelector } from '../../src'
import { collection } from '../mock'


test('rebuildEntity()', t => {
  const { dispatch, getState } = createStore(combineReducers({ graph }))
  create(dispatch, collection.creator)
  create(dispatch, collection.mainEntity)
  const item = create(dispatch, collection)
  const state = getState()
  // console.log(state)
  const subj = state.graph.entity[item.id]
  t.ok(isEntity(subj))
  t.notOk(subj.creator, 'creator')
  t.notOk(subj.mainEntity, 'mainEntity')
  const buildEntity = rebuildEntitySelector(() => item.id)
  const entity = buildEntity(state)
  // console.log(entity)
  t.ok(isEntity(get(entity, 'creator.user0')), 'creator')
  t.ok(isEntity(get(entity, 'mainEntity.pBlf')), 'mainEntity')
  t.end()
})
