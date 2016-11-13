import test from 'tape'
import { constant, forEach, get, isArray, isObject, matches } from 'lodash'

import {
  getKey, getRefPath, nextId, pickTypeId, setRef, validId,
} from '../src'

import state, { collection, creator, item, mainEntity } from './mock'

test('nextId', (t) => {
  t.ok(validId(nextId()))
  t.end()
})
test('getKey', (t) => {
  t.equal(getKey(creator), 'Person_user0')
  t.equal(getKey(mainEntity), 'DataFeed_pBlf')
  t.end()
})
test('pickTypeId', (t) => {
  t.deepEqual(pickTypeId(creator), { id: 'user0', type: 'Person' })
  t.deepEqual(pickTypeId(item), { id: 'i28', type: 'Item', dateModified: item.dateModified })
  t.end()
})
test('getRefPath', (t) => {
  t.deepEqual(getRefPath('creator', creator), [ '_refs', 'creator', 'Person_user0' ])
  t.deepEqual(getRefPath('mainEntity', mainEntity), [ '_refs', 'mainEntity', 'DataFeed_pBlf' ])
  t.end()
})
test('setRef', (t) => {
  const ent1 = setRef({}, 'creator', creator)
  t.equal(get(ent1, getRefPath('creator', creator).concat('id')), 'user0')
  t.end()
})
