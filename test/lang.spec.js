import test from 'tape'

import { entityHasType, isEntity, isEntityCreated, validId, validType } from '../src'
import { agent, creator, item, mainEntity } from './mock'

test('isEntity', t => {
  t.false(isEntity(), 'undefined')
  t.false(isEntity({}), 'empty object')
  t.false(isEntity({ id: 'foo' }), 'object with id')
  t.false(isEntity({ type: 'foo' }), 'object with lowercase type')
  t.true(isEntity({ type: 'Blah' }), 'is entity when first letter capitalized.')
  t.true(isEntity(item), 'item')
  t.true(isEntity(agent), 'agent')
  t.end()
})
test('isEntity', t => {
  t.false(isEntity({ id: 'abc' }), 'object with no type is not an entity.')
  t.end()
})
test('isEntityCreated', t => {
  t.false(isEntityCreated({ type: 'Person' }), 'not created.')
  t.false(isEntityCreated({ id: 'abc' }), 'missing type not created.')
  t.false(isEntityCreated({ id: 'bf', type: 'foo' }), 'object with lowercase type')
  t.false(isEntityCreated({ id: 'bf', type: 'foo' }), 'object with short id')
  t.true(isEntityCreated(mainEntity), 'mainEntity')
  t.true(isEntityCreated(creator), 'entity has props required for creation.')
  t.true(isEntityCreated(item), 'item is created')
  t.end()
})
test('entityHasType', t => {
  t.false(entityHasType('foo', null), 'null')
  t.false(entityHasType('foo')({}), 'empty obj')
  t.false(entityHasType('foo')({ type: 'bar' }), 'wrong type')
  t.false(entityHasType('foo', { type: 'foo' }), 'object with lower type')
  t.true(entityHasType('Foo', { type: 'Foo' }), 'object with type')
  t.end()
})
test('validId', (t) => {
  t.false(validId(''))
  t.false(validId('abc'))
  t.ok(validId(item.id))
  t.end()
})
test('validType', (t) => {
  t.ok(validType('Test'))
  t.false(validType('bosa'))
  t.end()
})
