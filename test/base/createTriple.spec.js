import test from 'tape'

import { createTriple } from '../../src'
import { trouble } from '../mock'

test('createTriple()', t => {
  function dispatch(action) {
    // console.log(action)
  }
  createTriple(dispatch, trouble)
  t.end()
})
