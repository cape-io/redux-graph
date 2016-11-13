import { ary, get, isEmpty, omit, partialRight, reduce } from 'lodash'
import { createReducer, merge, set, setIn } from 'cape-redux'

import { ENTITY_DEL, ENTITY_PUT, ENTITY_PUTALL, ENTITY_UPDATE } from './actions'
import { getKey, getPath, setRangeIncludes, REF, pickTypeId } from './helpers'

// Insert or replace entity.
export function entityPutReducer(state, item) {
  const newState = setIn(getPath(item), state, item)
  if (isEmpty(item[REF])) return newState
  // Update `rangeIncludes` values on object entity.
  const key = getKey(item)
  const subj = pickTypeId(item)
  const updateRange = partialRight(setRangeIncludes, subj, key)
  return reduce(item[REF], ary(updateRange, 3), newState)
}

export function entityUpdateReducer(state, payload) {
  const path = getPath(payload)
  const item = merge(get(state, path), payload)
  const newState = setIn(path, state, item)
  const obj = pickTypeId(item)
  if (isEmpty(item.rangeIncludes)) return newState
  function updateSubj(prevState, subj, predicate) {
    return setIn(getPath(subj).concat(subj.predicate), prevState, obj)
  }
  return reduce(item.rangeIncludes, updateSubj, newState)
}

export const reducers = {
  [ENTITY_PUT]: entityPutReducer,
  [ENTITY_UPDATE]: entityUpdateReducer,
  [ENTITY_DEL]: (state, { type, id }) => set(type, state, omit(state[type], id)),
  [ENTITY_PUTALL]: (state, payload) => state.merge(payload),
}
const reducer = createReducer(reducers)
export default reducer
