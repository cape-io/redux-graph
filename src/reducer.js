import { filter, get, isEmpty, omit, reduce } from 'lodash'
import { createReducer, merge, set, setIn } from 'cape-redux'

import { ENTITY_DEL, ENTITY_PUT, PUT_ALL, UPDATE } from './actions'
import { getKey, getPath, pickTypeId } from './helpers'
import { isEntityCreated } from './lang'

function update(state, payload) {
  const path = getPath(payload)
  const item = merge(get(state, path), payload)
  const newState = setIn(path, state, item)
  const obj = pickTypeId(item)
  if (isEmpty(item.rangeIncludes)) return newState
  function updateSubj(prevState, subj) {
    return setIn(getPath(subj).concat(subj.predicate), prevState, obj)
  }
  return reduce(item.rangeIncludes, updateSubj, newState)
}

function put(state, item) {
  const newState = setIn(getPath(item), state, item)
  // rangeIncludes
  const triples = filter(item, isEntityCreated)
  if (isEmpty(triples)) return newState
  const key = getKey(item)
  const subj = pickTypeId(item)
  function updateRange(prevState, obj, predicate) {
    return setIn(getPath(obj).concat([ 'rangeIncludes', key ]), prevState, { ...subj, predicate })
  }
  return reduce(triples, updateRange, newState)
}

export const reducers = {
  [ENTITY_DEL]: (state, { type, id }) => set(type, state, omit(state[type], id)),
  [ENTITY_PUT]: put,
  [PUT_ALL]: (state, payload) => state.merge(payload),
  [UPDATE]: update,
}
const reducer = createReducer(reducers, {})
export default reducer
