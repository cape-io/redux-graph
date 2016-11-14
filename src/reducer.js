import { ary, get, isEmpty, omit, partialRight, reduce } from 'lodash'
import { createReducer, merge, set, setIn } from 'cape-redux'

import { ENTITY_DEL, ENTITY_PUT, ENTITY_PUTALL, ENTITY_UPDATE } from './actions'
import { getKey, fullRefPath, getPath, setRangeIncludes, REF, pickTypeId } from './helpers'

// Update `rangeIncludes` values on object entity.
export function updateRefObjs(state, item) {
  if (isEmpty(item[REF])) return state
  const key = getKey(item)
  const subj = pickTypeId(item)
  const updateRange = partialRight(setRangeIncludes, subj, key)
  return reduce(item[REF], ary(updateRange, 3), state)
}

// Insert or replace entity.
export function entityPutReducer(state, item) {
  const newState = setIn(getPath(item), state, item)
  return updateRefObjs(newState, item)
}
export function updateSubjRef(state, subj, predicate, obj) {
  return setIn(fullRefPath(subj, predicate, obj), obj)
}
// Update `_refs` values on subject entities.
export function updateRangeSubjs(state, item) {
  if (isEmpty(item.rangeIncludes)) return state
  const obj = pickTypeId(item)
  function updateSubj(prevState, subjs, predicate) {
    return reduce(subjs, (ste, subj) => updateSubjRef(ste, subj, predicate, obj), prevState)
  }
  return reduce(item.rangeIncludes, updateSubj, state)
}
export function entityUpdateReducer(state, payload) {
  const path = getPath(payload)
  const oldItem = get(state, path, { [REF]: {} })
  const item = merge(oldItem, payload, { [REF]: merge(oldItem[REF], payload[REF]) })
  const newState = entityPutReducer(state, item)
  return updateRangeSubjs(newState, item)
}

export const reducers = {
  [ENTITY_PUT]: entityPutReducer,
  [ENTITY_UPDATE]: entityUpdateReducer,
  [ENTITY_DEL]: (state, { type, id }) => set(type, state, omit(state[type], id)),
  [ENTITY_PUTALL]: (state, payload) => state.merge(payload),
}
const reducer = createReducer(reducers)
export default reducer
