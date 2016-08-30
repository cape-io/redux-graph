import immutable from 'seamless-immutable'

import forEach from 'lodash/forEach'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'

import { DEL, PUT, PUT_ALL } from './actions'

const defaultState = immutable({
  spo: {}, sop: {}, osp: {}, ops: {}, pos: {}, pso: {},
})

function del(state, triple) {
  const [ sub, pred, obj ] = triple
  // Check if this is a valid triple.
  const isValid = get(state.spo, [ sub, pred, obj ], false)
  if (isValid) {
    // @TODO Cleanup the tree if it's without a third level.
    return state.without([ 'spo', sub, pred, obj ])
    .without([ 'sop', sub, obj, pred ])
    .without([ 'osp', obj, sub, pred ])
    .without([ 'ops', obj, pred, sub ])
    .without([ 'pos', pred, obj, sub ])
    .without([ 'pso', pred, sub, obj ])
  }
  return state
}

function put(state, triple) {
  const [ sub, pred, obj ] = triple.id
  // Store the full triple obj on the spo.
  return state.setIn([ 'spo', sub, pred, obj ], triple)
  // Everything else is just an index.
  .setIn([ 'sop', sub, obj, pred ], true)
  .setIn([ 'osp', obj, sub, pred ], true)
  .setIn([ 'ops', obj, pred, sub ], true)
  .setIn([ 'pos', pred, obj, sub ], true)
  .setIn([ 'pso', pred, sub, obj ], true)
}

function putAll(state, triples) {
  forEach(triples, triple => put(state, triple))
  return state
}

const reducers = { [DEL]: del, [PUT]: put, [PUT_ALL]: putAll }

export default function reducer(state = defaultState, action) {
  if (action.error || !action.type || !isFunction(reducers[action.type])) return state
  return reducers[action.type](state, action.payload)
}
