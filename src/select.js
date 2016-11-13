import { curry, filter, flow, isPlainObject, mapValues, property } from 'lodash'
import { condId, overBranch } from 'cape-lodash'
import { createSelector } from 'reselect'
import { select } from 'cape-select'
import { getPath } from './helpers'
import { isEntityCreated } from './lang'

const fpSelect = curry(select, 2)
export const selectGraph = property('graph')
export const selectEntity = select(selectGraph, 'entity')
export const entityTypeSelector = fpSelect(selectEntity)
export const entityPath = flow(getPath, property)
export const entitySelector = flow(entityPath, fpSelect(selectGraph))
export const getEntity = curry((state, entity) => entitySelector(entity)(state))

export const getFullEntity = curry((state, entity) => {
  const refBuilder = condId(
    [ isEntityCreated, getEntity(state) ],
    [ isPlainObject, getFullEntity(state) ]
  )
  return mapValues(entity, overBranch(isEntityCreated, refBuilder))
})
export function filterEntity(type, predicate) {
  return createSelector(
    entityTypeSelector(type),
    items => filter(items, predicate)
  )
}
