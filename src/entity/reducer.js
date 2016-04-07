import immutable from 'seamless-immutable'
import isFunction from 'lodash/isFunction'

import { DEL, PUT, PUT_ALL, UPDATE } from './actions'
import { PUT as TRIPLE_PUT } from '../triple/actions'

function putReducer(state, payload) { return state.set(payload.id, payload) }
function triplePut(state, { object }) {
  const { id } = object
  return state[id] ? state : putReducer(state, object)
}
const reducers = {
  [DEL]: (state, payload) => state.without(payload),
  [PUT]: putReducer,
  [PUT_ALL]: (state, payload) => state.merge(payload),
  [TRIPLE_PUT]: triplePut,
  [UPDATE]: (state, payload) => state.set(payload.id, state[payload.id].merge(payload)),
}

// Updates an entity cache in response to any action with response.entity.
export default function reducer(state = {}, action) {
  if (action.error || !action.type || !isFunction(reducers[action.type])) return state
  return reducers[action.type](state.asMutable ? state : immutable(state), action.payload)
}
