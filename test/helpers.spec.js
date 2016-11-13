import test from 'tape'
import { get, partial } from 'lodash'

import {
  buildRef, buildRefs, getKey, getPath, getRefPath, insertFields, nextId,
  pickTypeId, requireIdType, setRef, validId,
} from '../src'

import { creator, item, mainEntity } from './mock'

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
  t.deepEqual(pickTypeId(item), { id: 'i28z', type: 'Item', dateModified: item.dateModified })
  t.end()
})
test('getRefPath', (t) => {
  t.deepEqual(getRefPath('creator', creator, false), [ '_refs', 'creator', 'Person_user0' ])
  t.deepEqual(getRefPath('mainEntity', mainEntity), [ '_refs', 'mainEntity' ])
  t.end()
})
test('setRef', (t) => {
  const ent1 = setRef({}, 'creator', creator)
  t.equal(get(ent1, getRefPath('creator', creator).concat('id')), 'user0')
  t.end()
})
test('buildRef', (t) => {
  t.deepEqual(buildRef({}, false, 'isCandy'), { isCandy: false })
  t.deepEqual(buildRef({}, creator, 'creator'),
    { _refs: { creator: { id: 'user0', type: 'Person' } } }
  )
  t.end()
})
test('buildRefs', (t) => {
  const entity = { candy: false, creator, item }
  t.deepEqual(buildRefs(entity), {
    candy: false,
    _refs: {
      creator: { id: 'user0', type: 'Person' },
      item: { id: 'i28z', type: 'Item', dateModified: item.dateModified },
    },
  })
  t.end()
})
test('requireIdType', (t) => {
  const func = partial(partial, requireIdType)
  t.throws(func({}))
  t.throws(func({ type: 'foo', id: 'bar' }))
  t.throws(func({ type: 'Foo', id: 'ba' }))
  t.equal(requireIdType(creator, null, false), null)
  t.deepEqual(requireIdType(item), { id: 'i28z', type: 'Item', dateModified: item.dateModified })
  t.equal(requireIdType(mainEntity, null, null), null)
  t.end()
})
test('getPath', (t) => {
  t.deepEqual(getPath(creator), [ 'Person', 'user0' ])
  t.end()
})
test('insertFields', (t) => {
  const entity = insertFields()
  t.deepEqual(entity, {
    type: 'Thing',
    rangeIncludes: {},
    _refs: {},
    dateCreated: entity.dateCreated,
    id: entity.id,
  })
  const ent2 = insertFields(pickTypeId(entity))
  t.deepEqual(ent2, entity)
  ent2.creator = creator
  const ent3 = insertFields(ent2)
  t.deepEqual(ent3, { ...entity, _refs: { creator: pickTypeId(creator) } })
  t.end()
})
