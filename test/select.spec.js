import test from 'tape'
import { keys } from 'lodash'

import { entityTypeSelector, selectTypeIndex } from '../src'
import state from './mock'

test('selectTypeIndex', t => {
  const typeIndex = selectTypeIndex(state)
  t.deepEqual(keys(typeIndex), [ 'foo', 'bar' ], 'keys match')
  t.equal(typeIndex.foo.a, state.graph.entity.a, 'entity object is exactly equal')
  t.end()
})
test('entityTypeSelector', t => {
  const typeIndex = selectTypeIndex(state)
  const fooTypes = entityTypeSelector('foo')(state)
  t.equal(fooTypes, typeIndex.foo, 'foo is selected.')
  t.end()
})
