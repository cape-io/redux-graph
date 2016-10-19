import test from 'tape'
import { keys } from 'lodash'

import { getSXX } from '../../src/triple/select'
import reducer, { triplePut } from '../../src/index'

const tripleState = {
  spo: {
    kai: {
      email: {
        s3b: { id: [ 'kai', 'email', 's3b' ], object: { type: 'email' } },
      },
      name: {
        z3x: { id: [ 'kai', 'name', '3zx' ] },
      },
    },
  },
}

// console.log(util.inspect(res, false, null))
test('reducer and put action', t => {
  const subject = { id: 'tim', type: 'Person' }
  const predicate = 'email'
  const object = { id: 'lk4', type: 'email', value: 'tim@example.com' }
  const triple = { subject, predicate, object }
  const savedTriple = {
    id: [ 'tim', 'email', 'lk4' ],
    subject,
    predicate,
    object: { id: 'lk4', type: 'email' },
  }
  const expected = {
    spo: { tim: { email: { lk4: savedTriple } } },
    sop: { tim: { lk4: { email: true } } },
    osp: { lk4: { tim: { email: true } } },
    ops: { lk4: { email: { tim: true } } },
    pos: { email: { lk4: { tim: true } } },
    pso: { email: { tim: { lk4: true } } },
  }
  const result = reducer(undefined, triplePut(triple))
  t.deepEquals(keys(result), [ 'entity', 'triple', 'typeIndex' ], 'state has entity and triple')
  t.deepEquals(keys(result.triple), keys(expected), 'keys match')
  t.deepEquals(result.triple.spo, expected.spo, 'spo matches')
  t.deepEquals(result.triple.sop, expected.sop, 'sop matches')
  t.deepEquals(result.triple.osp, expected.osp, 'osp matches')
  t.deepEquals(result.triple.ops, expected.ops, 'ops matches')
  t.deepEquals(result.triple.pos, expected.pos, 'pos matches')
  t.deepEquals(result.triple.pso, expected.pso, 'pso matches')
  t.end()
})

test('getSXX selector', assert => {
  const result = getSXX(tripleState, 'kai')
  const expected = [
    tripleState.spo.kai.email.s3b,
    tripleState.spo.kai.name.z3x,
  ]
  assert.deepEquals(result, expected, 'result returns both triples.')
  assert.end()
})
