import test from 'tape'
import { isFunction, size } from 'lodash'

import {
  buildFullEntity, getFullEntity, fullEntitySelector,
  entitySelector, entityTypeSelector, getGraphNode, pickRefNodes, requireIdType, selectGraph,
  triplePut, GRAPH_KEY,
} from '../src'
import { agent, configStore, li34, mainEntity } from './mock'

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
  const res = buildFullEntity(false, ste[GRAPH_KEY], ste[GRAPH_KEY].ListItem.li34)
  t.deepEqual(res.agent, ste[GRAPH_KEY].Person.ag12, 'agent')
  t.deepEqual(res.item, ste[GRAPH_KEY].Item.i28z, 'item')
  t.equal(res.likes.DataFeed_pBlf.dog.id, 'dgo14')
  // console.log(res.likes.DataFeed_pBlf)
  t.end()
})
test('getFullEntity', (t) => {
  const res = getFullEntity(state, state[GRAPH_KEY].ListItem.li34)
  t.deepEqual(res.agent, state[GRAPH_KEY].Person.ag12, 'agent')
  t.deepEqual(res.item, state[GRAPH_KEY].Item.i28z, 'item')
  const res2 = getFullEntity(state, state[GRAPH_KEY].ListItem.li34)
  t.equal(res, res2)
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
