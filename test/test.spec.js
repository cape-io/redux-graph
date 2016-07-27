// import util from 'util'
import test from 'tape'
import { getSXX } from '../src/triple/select'
import reducer, { triplePut, entityUpdate } from '../src/index'

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
test('reducer and put action', assert => {
  const timEmailArray = [ 'tim', 'email', 'lk4' ]
  const timEmailObject = { id: timEmailArray }
  const expected = {
    spo: { tim: { email: { lk4: { id: [ 'tim', 'email', 'lk4' ] } } } },
    sop: { tim: { lk4: { email: true } } },
    osp: { lk4: { tim: { email: true } } },
    ops: { lk4: { email: { tim: true } } },
    pos: { email: { lk4: { tim: true } } },
    pso: { email: { tim: { lk4: true } } },
  }
  const result = reducer(undefined, triplePut(timEmailObject))
  assert.deepEquals(result.triple, expected, 'result matches expected')
  const result2 = reducer(undefined, triplePut(timEmailObject))
  assert.deepEquals(result2.triple, expected, 'result2 matches expected')
  assert.end()
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

test('entityUpdate', t => {
  const entity = { id: 'foo', bar: true }
  const result = reducer({}, entityUpdate(entity))
  t.deepEquals(result.entity.foo, entity)
  t.end()
})
