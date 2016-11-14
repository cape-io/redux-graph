import { ary, get, isEmpty, omit, partialRight, reduce } from 'lodash'
import { createReducer, merge, set, setIn } from 'cape-redux'

import { ENTITY_DEL, ENTITY_PUT, ENTITY_PUTALL, ENTITY_UPDATE } from './actions'
import { getKey, fullRefPath, getPath, setRangeIncludes, REF, REFS, pickTypeId } from './helpers'

// Update `rangeIncludes` values on object entity.
export function updateRefObjs(state, item) {
  if (isEmpty(item[REF])) return state
  const key = getKey(item)
  const subj = pickTypeId(item)
  const updateRange = partialRight(setRangeIncludes, subj, key)
  return reduce(item[REF], ary(updateRange, 3), state)
}
export function mergeIndexes(oldItem, item) {
  if (!oldItem) return item
  return {
    ...item,
    [REF]: merge(oldItem[REF], item[REF]),
    [REFS]: merge(oldItem[REFS], item[REFS]),
    rangeIncludes: merge(oldItem.rangeIncludes, item.rangeIncludes),
  }
}
// Insert or replace entity.
export function entityPutReducer(state, item) {
  const path = getPath(item)
  const node = mergeIndexes(get(state, path), item)
  const newState = setIn(path, state, node)
  return updateRefObjs(newState, node)
}
export function entityPutAllReducer(state, payload) {
  return reduce(payload, entityPutReducer, state)
}
// An object node was updated. Update predicate values on subject.
export function updateSubjRef(state, subj, predicate, obj) {
  return setIn(fullRefPath(subj, predicate), state, obj)
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
export function entityUpdateReducer(state, item) {
  const path = getPath(item)
  const oldItem = get(state, path)
  const newItem = mergeIndexes(oldItem, item)
  const node = merge(oldItem, newItem)
  const newState = setIn(path, state, node)
  return updateRangeSubjs(updateRefObjs(newState, node), node)
}
export const reducers = {
  [ENTITY_PUT]: entityPutReducer,
  [ENTITY_UPDATE]: entityUpdateReducer,
  [ENTITY_DEL]: (state, { type, id }) => set(type, state, omit(state[type], id)),
  [ENTITY_PUTALL]: entityPutAllReducer,
}
const reducer = createReducer(reducers)
export default reducer
