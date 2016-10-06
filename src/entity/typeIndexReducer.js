import { get, over, overEvery, property, set } from 'lodash'
import { reduce } from 'lodash/fp'
import { createReducer } from 'cape-redux'

import { DEL, PUT, PUT_ALL } from './actions'
import { PUT as TRIPLE_PUT } from '../triple/actions'

export const getPath = over(property('type'), property('id'))
export const validEntity = overEvery(property('type'), property('id'))

function putReducer(state, entity) {
  if (validEntity(entity)) return state.setIn(getPath(entity), true)
  return state
}
function triplePut(state, { object }) {
  const path = getPath(object)
  if (validEntity(object) && !get(state, path)) return state.setIn(path, true)
  return state
}
export function setIndex(res, value) {
  if (validEntity(value)) return set(res, getPath(value), true)
  return res
}
export const createTypeIndex = reduce(setIndex, {})

export function putAllReducer(state, payload) {
  return state.merge(createTypeIndex(payload), { deep: true })
}

const reducers = {
  [DEL]: (state, payload) => state.without(payload),
  [PUT]: putReducer,
  [PUT_ALL]: putAllReducer,
  [TRIPLE_PUT]: triplePut,
}

// Updates an entity cache in response to any action with response.entity.
const reducer = createReducer(reducers, {}, { makeImmutable: true })
export default reducer
