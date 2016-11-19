import test from 'tape'
import { every, get, isFunction, partial, size } from 'lodash'

import {
  buildRef, buildRefs, fullRefPath, getRef, getKey, getPath, getRefPath, hasPredicate,
  insertFields, nextId, predicateFilter, entityTypeSelector, isEntityCreatedDate,
  pickTypeId, rangePath, REF, REFS, refMatch, requireIdType, setRef, setRangeIncludes, isValidId,
  entityMatch, entityMatches,
} from '../src'

import { agent, configStore, creator, item, mainEntity } from './mock'

const { getState } = configStore()

test('nextId', (t) => {
  t.ok(isValidId(nextId()))
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
  t.deepEqual(getRefPath('creator', creator), [ REFS, 'creator', 'Person_user0' ])
  t.deepEqual(getRefPath('mainEntity'), [ REF, 'mainEntity' ])
  t.end()
})
test('fullRefPath', (t) => {
  const path = fullRefPath(creator, 'art')
  t.deepEqual(path, [ 'Person', 'user0', REF, 'art' ])
  const path2 = fullRefPath(creator, 'art', item)
  t.deepEqual(path2, [ 'Person', 'user0', REFS, 'art', getKey(item) ])
  t.end()
})
test('setRef', (t) => {
  const ent1 = setRef({}, 'creator', creator)
  t.equal(get(ent1, getRefPath('creator').concat('id')), 'user0')
  t.end()
})
test('buildRef', (t) => {
  t.deepEqual(buildRef({}, false, 'isCandy'), { isCandy: false })
  t.deepEqual(buildRef({}, creator, 'creator'),
    { [REF]: { creator: { id: 'user0', type: 'Person' } } }
  )
  t.end()
})
test('getRef', (t) => {
  t.equal(getRef({ [REF]: { creator }, name: 'Emi' }, 'creator'), creator)
  t.equal(getRef({ [REF]: { creator }, name: 'Emi' }, 'friend'), undefined)
  t.end()
})
test('refMatch', (t) => {
  t.true(refMatch({ id: 'any', type: 'thing', name: 'foo' }, { id: 'any', type: 'thing' }))
  t.false(refMatch({ id: 'any', type: 'thing', name: 'foo' }, { id: 'any', type: 'touch' }))
  t.end()
})
test('hasPredicate', (t) => {
  const checker = hasPredicate('creator', creator)
  t.true(checker({ [REF]: { creator }, name: 'Emi' }))
  t.false(checker({ [REF]: { friend: creator }, name: 'Emi' }))
  t.end()
})
test('predicateFilter', (t) => {
  const items = entityTypeSelector('ListItem')(getState())
  const agentItems = predicateFilter('agent', agent, items)
  t.ok(every(agentItems, isEntityCreatedDate))
  t.equal(size(agentItems), 3)
  const withItem = predicateFilter('item', item, items)
  t.ok(every(withItem, isEntityCreatedDate))
  t.equal(size(withItem), 4)
  const creatorItems = predicateFilter('agent', creator, items)
  t.ok(every(creatorItems, isEntityCreatedDate))
  t.equal(size(creatorItems), 1)
  t.end()
})
test('buildRefs', (t) => {
  const entity = { candy: false, creator, item }
  t.deepEqual(buildRefs(entity), {
    candy: false,
    [REF]: {
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
    [REF]: {},
    [REFS]: {},
    dateCreated: entity.dateCreated,
    id: entity.id,
  })
  const ent2 = insertFields(pickTypeId(entity))
  t.deepEqual(ent2, { ...entity, dateCreated: ent2.dateCreated }, 'ent2, entity')
  ent2.creator = creator
  const ent3 = insertFields(ent2)
  t.deepEqual(ent3, {
    ...entity, [REF]: { creator: pickTypeId(creator) }, dateCreated: ent3.dateCreated,
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
test('entityMatch', (t) => {
  t.true(entityMatch(
    { id: 'foo1', type: 'Person', name: 'liz' },
    { id: 'foo1', type: 'Person', name: 'cam' }
  ))
  t.false(entityMatch(
    { id: 'foo1', type: 'person', name: 'liz' },
    { id: 'foo1', type: 'person', name: 'cam' }
  ))
  t.false(entityMatch(
    { id: 'foo2', type: 'Person', name: 'liz' },
    { id: 'foo1', type: 'Person', name: 'liz' }
  ))
  t.false(entityMatch(
    { id: 'foo1', type: 'Person', name: 'liz' },
    { id: 'foo1', type: 'Thing', name: 'cam' }
  ))
  t.end()
})
test('entityMatches', (t) => {
  const ent = { id: 'foo1', type: 'Person', name: 'liz' }
  t.true(entityMatches(ent)({ id: 'foo1', type: 'Person' }))
  const matches = entityMatches(ent)
  t.true(isFunction(matches))
  t.true(matches(ent))
  t.false(matches(null))
  t.false(matches({ id: 'foo2', type: 'Person' }, { id: 'foo2', type: 'Person' }))
  t.end()
})
