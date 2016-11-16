import { curry, filter, flow, get, isEmpty, mapValues, merge, nthArg, property } from 'lodash'
// import { condId, overBranch } from 'cape-lodash'
import { createSelector } from 'reselect'
import { select } from 'cape-select'
import { getPath, REF, REFS, rmRefs } from './helpers'

const fpSelect = curry(select, 2)
export const selectGraph = property('graph')
export const entityTypeSelector = fpSelect(selectGraph)
export const entitySelector = flow(getPath, fpSelect(selectGraph))
export const getEntity = curry((state, entity) => entitySelector(entity)(state))

export const getGraphNode = curry((graph, node) => get(graph, getPath(node), node))
export const pickRefNodes = curry((deep, graph, refs) => {
  if (deep) return mapValues(refs, buildFullEntity(deep, graph)) // eslint-disable-line
  return mapValues(refs, getGraphNode(graph))
})
// Get one level of REF fields.
export const buildFullEntity = curry((deep, graph, node) => {
  if (isEmpty(node[REF]) && isEmpty(node[REFS])) return rmRefs(node)
  return merge({},
    rmRefs(node),
    pickRefNodes(deep, graph, node[REF]),
    mapValues(node[REFS], pickRefNodes(deep, graph))
  )
})
// (state, entityObj) simpleSelector
export const getFullEntity = createSelector(selectGraph, nthArg(1), buildFullEntity(false))
export const getAllChildren = createSelector(selectGraph, nthArg(1), buildFullEntity(true))
export function fullEntitySelector(customEntitySelector) {
  return state => getFullEntity(state, customEntitySelector(state))
}
export function allChildrenSelector(customEntitySelector) {
  return state => getFullEntity(state, customEntitySelector(state))
}
export function filterEntity(type, predicate) {
  return createSelector(
    entityTypeSelector(type),
    items => filter(items, predicate)
  )
}
