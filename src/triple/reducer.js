import forEach from 'lodash/forEach'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
import set from 'lodash/set'

import { DEL, PUT, PUT_ALL } from './actions'

const defaultState = { spo: {}, sop: {}, osp: {}, ops: {}, pos: {}, pso: {} }

function del(state, triple) {
  const [ sub, pred, obj ] = triple
  // Check if this is a valid triple.
  const isValid = get(state.spo, [ sub, pred, obj ], false)
  if (isValid) {
    // @TODO Cleanup the tree if it's without a third level.
    delete this.spo[sub][pred][obj]
    delete this.sop[sub][obj][pred]
    delete this.pso[pred][sub][obj]
    delete this.pos[pred][obj][sub]
    delete this.osp[obj][sub][pred]
    delete this.ops[obj][pred][sub]
  }
  return { ...state }
}

function put(state, triple) {
  const [ sub, pred, obj ] = triple.id
  // Store the full triple obj on the spo.
  set(state.spo, [ sub, pred, obj ], triple)
  // Everything else is just an index.
  set(state.sop, [ sub, obj, pred ], true)
  set(state.osp, [ obj, sub, pred ], true)
  set(state.ops, [ obj, pred, sub ], true)
  set(state.pos, [ pred, obj, sub ], true)
  set(state.pso, [ pred, sub, obj ], true)
  return { ...state }
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
