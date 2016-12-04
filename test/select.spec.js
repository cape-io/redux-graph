import test from 'tape'
import { isFunction, property, size } from 'lodash'

import {
  buildFullEntity, getFullEntity, fullEntitySelector,
  entitySelector, entityTypeSelector, getGraphNode, pickRefNodes, requireIdType, selectGraph,
  triplePut, GRAPH_KEY, getAllChildren, allChildrenSelector, REFS,
} from '../src'
import { agent, creator, configStore, fido, li34, mainEntity } from './mock'

const { dispatch, getState } = configStore()

const state = getState()
test('selectGraph', (t) => {
  t.equal(selectGraph(state), state[GRAPH_KEY])
  t.end()
})
test('entityTypeSelector', (t) => {
  t.ok(isFunction(entityTypeSelector), 'entityTypeSelector is func')
  const selector = entityTypeSelector('Person')
  t.ok(isFunction(selector), 'created selector is func')
  t.equal(selector(state), state[GRAPH_KEY].Person, 'selector finds correct node')
  t.end()
})
test('entitySelector', t => {
  t.ok(isFunction(entitySelector), 'entitySelector is func')
  const selector = entitySelector(requireIdType(agent))
  t.ok(isFunction(selector), 'created selector is func')
  const found = selector(state)
  t.equal(found, state[GRAPH_KEY].Person.ag12, 'selector finds correct node')
  t.end()
})
test('getGraphNode', (t) => {
  t.equal(getGraphNode(state[GRAPH_KEY], { id: 'i28z', type: 'Item' }), state[GRAPH_KEY].Item.i28z)
  t.end()
})
test('pickRefNodes', (t) => {
  const refs = { item: { id: 'i28z', type: 'Item' }, friend: { id: 'ag12', type: 'Person' } }
  const res = pickRefNodes(false, state[GRAPH_KEY], refs)
  t.equal(size(res), 2, 'size')
  t.equal(res.item, state[GRAPH_KEY].Item.i28z, 'item')
  t.equal(res.friend, state[GRAPH_KEY].Person.ag12, 'friend')
  t.end()
})
test('buildFullEntity', (t) => {
  dispatch(triplePut({ subject: li34, predicate: 'likes', object: mainEntity }))
  const ste = getState()
  const node = ste[GRAPH_KEY].ListItem.li34
  t.deepEqual(node[REFS], { likes: { DataFeed_pBlf: { id: 'pBlf', type: 'DataFeed' } } })
  const res = buildFullEntity(0, ste[GRAPH_KEY], node)
  t.deepEqual(res.agent, ste[GRAPH_KEY].Person.ag12, 'agent')
  t.deepEqual(res.item, ste[GRAPH_KEY].Item.i28z, 'item')
  t.equal(res.likes.DataFeed_pBlf.name, 'Christ')
  dispatch(triplePut({ subject: mainEntity, predicate: 'likedBy', object: li34 }))
  const ste2 = getState()
  const node2 = ste2[GRAPH_KEY].ListItem.li34
  const res2 = buildFullEntity(0, ste2[GRAPH_KEY], node2)
  t.deepEqual(res2.agent, ste[GRAPH_KEY].Person.ag12, 'agent')
  t.deepEqual(res2.item, ste[GRAPH_KEY].Item.i28z, 'item')
  t.equal(res2.likes.DataFeed_pBlf.name, 'Christ')
  // console.log(res.likes.DataFeed_pBlf)
  t.end()
})
test('getFullEntity', (t) => {
  const ste = getState()
  const res = getFullEntity(ste, ste[GRAPH_KEY].ListItem.li34)
  // console.log(ste[GRAPH_KEY].ListItem.li34)
  // console.log(res)
  t.deepEqual(res.agent, ste[GRAPH_KEY].Person.ag12, 'agent')
  t.deepEqual(res.item, ste[GRAPH_KEY].Item.i28z, 'item')
  t.equal(res.likes.DataFeed_pBlf.name, 'Christ')
  const res2 = getFullEntity(ste, ste[GRAPH_KEY].ListItem.li34)
  t.equal(res, res2)
  t.end()
})
test('getAllChildren', (t) => {
  dispatch(triplePut({ subject: fido, predicate: 'friend', object: creator }))
  const ste = getState()
  const node = ste[GRAPH_KEY].DataFeed.pBlf
  delete node[REFS]
  const res = getAllChildren(ste, ste[GRAPH_KEY].DataFeed.pBlf)
  t.equal(res.dog.friend.Person_user0.image, null)
  // console.log(JSON.stringify(res, null, 2))
  t.end()
})
test('allChildrenSelector', (t) => {
  const customEntitySelector = property([ GRAPH_KEY, 'ListItem', 'li34' ])
  const selector = allChildrenSelector(customEntitySelector)
  const res = selector(getState())
  // console.log(JSON.stringify(res, null, 2))
  t.equal(res.likes.DataFeed_pBlf.dog.friend.Person_user0.id, 'user0')
  t.end()
})
test('fullEntitySelector', (t) => {
  const customEntitySelector = entitySelector({ id: 'li34', type: 'ListItem' })
  const res = fullEntitySelector(customEntitySelector)(state)
  t.deepEqual(res.agent, state[GRAPH_KEY].Person.ag12, 'agent')
  t.deepEqual(res.item, state[GRAPH_KEY].Item.i28z, 'item')
  const res2 = fullEntitySelector(customEntitySelector)(state)
  t.equal(res, res2)
  t.end()
})
