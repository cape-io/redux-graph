import test from 'tape'
import { combineReducers, createStore } from 'redux'
import { isObject } from 'lodash'

import graph, { create, createTriple, entityDomainIncludes } from '../../src'
import { collection, listItem } from '../mock'

test('entityDomainIncludes()', t => {
  const { dispatch, getState } = createStore(combineReducers({ graph }))
  create(dispatch, collection.creator)
  create(dispatch, collection.mainEntity)
  const collectionEnt = create(dispatch, collection)
  const triple = { subject: collectionEnt, predicate: 'itemListElement', object: listItem }
  const { object } = createTriple(dispatch, triple)
  const state2 = getState()
  const buildEntity = entityDomainIncludes(() => listItem.item.id)
  const entity = buildEntity(state2)
  t.equal(entity.id, listItem.item.id, 'list item id')
  t.ok(isObject(entity.domainIncludes), 'has domainIncludes')
  t.ok(isObject(entity.domainIncludes.item), 'has domInc.item')
  const foundListItem = entity.domainIncludes.item[object.id]
  t.ok(isObject(foundListItem), 'foundListItem obj')
  t.equal(foundListItem.id, object.id, 'listItem id')
  t.ok(isObject(foundListItem.domainIncludes.itemListElement), 'itemListElement')
  const foundCollection = foundListItem.domainIncludes.itemListElement[collectionEnt.id]
  t.ok(isObject(foundCollection), 'foundCollection')
  t.end()
})
