import test from 'tape'
import { isFunction, size } from 'lodash'

import {
  buildFullEntity, getFullEntity, fullEntitySelector,
  entitySelector, entityTypeSelector, getGraphNode, pickRefNodes, requireIdType, selectGraph,
} from '../src'
import { agent, configStore } from './mock'

const { getState } = configStore()

const state = getState()
test('selectGraph', (t) => {
  t.equal(selectGraph(state), state.graph)
  t.end()
})
test('entityTypeSelector', (t) => {
  t.ok(isFunction(entityTypeSelector), 'entityTypeSelector is func')
  const selector = entityTypeSelector('Person')
  t.ok(isFunction(selector), 'created selector is func')
  t.equal(selector(state), state.graph.Person, 'selector finds correct node')
  t.end()
})
test('entitySelector', t => {
  t.ok(isFunction(entitySelector), 'entitySelector is func')
  const selector = entitySelector(requireIdType(agent))
  t.ok(isFunction(selector), 'created selector is func')
  const found = selector(state)
  t.equal(found, state.graph.Person.ag12, 'selector finds correct node')
  t.end()
})
test('getGraphNode', (t) => {
  t.equal(getGraphNode(state.graph, { id: 'i28z', type: 'Item' }), state.graph.Item.i28z)
  t.end()
})
test('pickRefNodes', (t) => {
  const refs = { item: { id: 'i28z', type: 'Item' }, friend: { id: 'ag12', type: 'Person' } }
  const res = pickRefNodes(refs, state.graph)
  t.equal(size(res), 2, 'size')
  t.equal(res.item, state.graph.Item.i28z, 'item')
  t.equal(res.friend, state.graph.Person.ag12, 'friend')
  t.end()
})
test('buildFullEntity', (t) => {
  const res = buildFullEntity(state.graph.ListItem.li34, state.graph)
  t.deepEqual(res.agent, state.graph.Person.ag12, 'agent')
  t.deepEqual(res.item, state.graph.Item.i28z, 'item')
  t.end()
})
test('getFullEntity', (t) => {
  const res = getFullEntity(state, state.graph.ListItem.li34)
  t.deepEqual(res.agent, state.graph.Person.ag12, 'agent')
  t.deepEqual(res.item, state.graph.Item.i28z, 'item')
  const res2 = getFullEntity(state, state.graph.ListItem.li34)
  t.equal(res, res2)
  t.end()
})
test('fullEntitySelector', (t) => {
  const customEntitySelector = entitySelector({ id: 'li34', type: 'ListItem' })
  const res = fullEntitySelector(customEntitySelector)(state)
  t.deepEqual(res.agent, state.graph.Person.ag12, 'agent')
  t.deepEqual(res.item, state.graph.Item.i28z, 'item')
  const res2 = fullEntitySelector(customEntitySelector)(state)
  t.equal(res, res2)
  t.end()
})
