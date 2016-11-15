import { curry, filter, flow, get, isEmpty, mapValues, merge, nthArg, property } from 'lodash'
// import { condId, overBranch } from 'cape-lodash'
import { createSelector } from 'reselect'
import { select } from 'cape-select'
import { getPath, REF, rmIndexFields } from './helpers'

const fpSelect = curry(select, 2)
export const selectGraph = property('graph')
export const entityTypeSelector = fpSelect(selectGraph)
export const entitySelector = flow(getPath, fpSelect(selectGraph))
export const getEntity = curry((state, entity) => entitySelector(entity)(state))

export const getGraphNode = curry((graph, node) => get(graph, getPath(node)))
export function pickRefNodes(refs, graph) {
  return mapValues(refs, getGraphNode(graph))
}
// Get one level of REF fields.
export const buildFullEntity = curry((node, graph) => {
  if (isEmpty(node[REF])) return rmIndexFields(node)
  return merge({}, rmIndexFields(node), pickRefNodes(node[REF], graph))
})
// (state, entityObj) simpleSelector
export const getFullEntity = createSelector(nthArg(1), selectGraph, buildFullEntity)

export function fullEntitySelector(customEntitySelector) {
  return state => getFullEntity(state, customEntitySelector(state))
}

export function filterEntity(type, predicate) {
  return createSelector(
    entityTypeSelector(type),
    items => filter(items, predicate)
  )
}
