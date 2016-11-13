import test from 'tape'
import { get, partial } from 'lodash'

import {
  buildRef, buildRefs, getKey, getPath, getRefPath, insertFields, nextId,
  pickTypeId, rangePath, requireIdType, setRef, setRangeIncludes, validId,
} from '../src'

import { agent, creator, item, mainEntity } from './mock'

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
  t.deepEqual(ent2, { ...entity, dateCreated: ent2.dateCreated }, 'ent2, entity')
  ent2.creator = creator
  const ent3 = insertFields(ent2)
  t.deepEqual(ent3, {
    ...entity, _refs: { creator: pickTypeId(creator) }, dateCreated: ent3.dateCreated,
  })
  t.end()
})
test('rangePath', (t) => {
  const path = rangePath(creator, 'friend', agent)
  t.deepEqual(path, [ 'Person', 'user0', 'rangeIncludes', 'friend', 'Person_ag12' ])
  const path2 = rangePath(creator, 'friend', agent, 'Key_obj')
  t.deepEqual(path2, [ 'Person', 'user0', 'rangeIncludes', 'friend', 'Key_obj' ])
  t.end()
})
test('setRangeIncludes', (t) => {
  const obj = pickTypeId(creator)
  const state = setRangeIncludes({}, obj, 'friend', agent)
  t.equal(state.Person.user0.rangeIncludes.friend.Person_ag12.id, agent.id)
  const expect = {
    Person: {
      user0: { rangeIncludes: { friend: { Person_ag12: agent } } },
    },
  }
  t.deepEqual(state, expect)
  t.end()
})
