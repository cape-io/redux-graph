import test from 'tape'

import { entityHasType, isEntity } from '../../src/entity/helpers'

test('isEntity', t => {
  t.false(isEntity(), 'undefined')
  t.false(isEntity({}), 'empty object')
  t.false(isEntity({ id: 'foo' }), 'object with id')
  t.true(isEntity({ type: 'foo' }), 'object with type')
  t.end()
})
test('entityHasType', t => {
  t.false(entityHasType('foo', null), 'null')
  t.false(entityHasType('foo')({}), 'empty obj')
  t.false(entityHasType('foo')({ type: 'bar' }), 'wrong type')
  t.true(entityHasType('foo', { type: 'foo' }), 'object with type')
  t.end()
})
