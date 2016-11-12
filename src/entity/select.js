import { filter, isFunction, reduce, set } from 'lodash'
import { createSelector } from 'reselect'
import { select } from 'cape-select'
import { graphSelector } from '../select'

export const entitySelector = select(graphSelector, 'entity')

export function selectEntityById(state, id) {
  return entitySelector(state)[id]
}

export function selectEntity(entityIdSelect) {
  return state => {
    const entityId = isFunction(entityIdSelect) ? entityIdSelect(state) : entityIdSelect
    return entitySelector(state)[entityId]
  }
}

export function filterEntity(predicate) {
  return createSelector(
    entitySelector,
    items => filter(items, predicate)
  )
}
export function filterEntityFirst(predicate) {
  return createSelector(filterEntity(predicate), res => res[0])
}
export function groupByType(result, entity, key) {
  return set(result, [ entity.type, key ], entity)
}
export function buildTypeIndex(entities) {
  return reduce(entities, groupByType, {})
}
// Entity keyed by type.
export const selectTypeIndex = createSelector(
  entitySelector,
  buildTypeIndex
)
export const selectEntityType = createSelector(
  selectTypeIndex,
  (state, props) => props.entityType,
  (entity, typeId) => entity[typeId]
)
export function entityTypeSelector(typeId) {
  return state => selectTypeIndex(state)[typeId]
}
