import test from 'tape'
import { matches } from 'lodash'
import { createTriple } from '../../src'
// import { trouble } from '../mock'

test('createTriple()', (t) => {
  t.plan(7)
  const triple = {
    subject: { id: 'foo', type: 'Thing' },
    predicate: 'likes',
    object: { id: 'bar', type: 'Food' },
  }
  function dispatch(action) {
    t.equal(action.type, 'graph/triple/PUT', 'type is the same')
    t.deepEqual(action.payload.id, [ 'foo', 'likes', 'bar' ])
    t.deepEqual(action.payload.subject, triple.subject)
    t.equal(action.payload.predicate, triple.predicate)
    t.deepEqual(action.payload.object, triple.object)
    t.ok(matches(triple)(action.payload))
    t.deepEqual(action.payload.id, [ 'foo', 'likes', 'bar' ])
  }
  // trouble
  createTriple(dispatch, triple)
})
