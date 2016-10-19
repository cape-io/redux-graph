import { createReducer } from 'cape-redux'

import { DEL, PUT, PUT_ALL, UPDATE } from './actions'
import { PUT as TRIPLE_PUT } from '../triple/actions'

function putReducer(state, payload) {
  if (!payload.id) throw new Error('putReducer requires payload.id')
  return state.set(payload.id, payload)
}
function triplePut(state, { object }) {
  const { id } = object
  return state[id] ? state : putReducer(state, object)
}
function update(state, payload) {
  if (!state[payload.id]) {
    console.error(payload.id, state)
    throw new Error('ID not found in state.')
  }
  return state.set(payload.id, state[payload.id].merge(payload))
}
const reducers = {
  [DEL]: (state, payload) => state.without(payload.id),
  [PUT]: putReducer,
  [PUT_ALL]: (state, payload) => state.merge(payload),
  [TRIPLE_PUT]: triplePut,
  [UPDATE]: update,
}
const reducer = createReducer(reducers, {}, { makeImmutable: true })
export default reducer
