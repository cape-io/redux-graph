import { curry, filter, flow, get, identity, isEmpty, mapValues, nthArg, property } from 'lodash'
import { merge } from 'cape-lodash'
import { createSelector } from 'reselect'
import { select, simpleSelector } from 'cape-select'
import { getPath, REF, REFS, rmRefs } from './helpers'

export const GRAPH_KEY = 'graph2'
const fpSelect = curry(select, 2)
export const selectGraph = property(GRAPH_KEY)
export const entityTypeSelector = fpSelect(selectGraph)
export const entitySelector = flow(getPath, fpSelect(selectGraph))
export const getEntity = curry((state, entity) => entitySelector(entity)(state))

export const getGraphNode = curry((graph, node) => get(graph, getPath(node), node))
export const pickRefNodes = curry((deep, graph, refs) => {
  if (!refs) return {}
  if (deep) return mapValues(refs, flow(getGraphNode(graph), buildFullEntity(deep - 1, graph))) // eslint-disable-line
  return mapValues(refs, getGraphNode(graph))
})
// Get one level of REF fields.
export const buildFullEntity = curry((deep, graph, node) => {
  if (!node || (isEmpty(node[REF]) && isEmpty(node[REFS]))) return rmRefs(node)
  const getPredRefs = predRefs => mapValues(predRefs,
    flow(getGraphNode(graph), deep ? buildFullEntity(deep, graph) : identity)
  )
  return merge(
    rmRefs(node),
    pickRefNodes(deep, graph, node[REF]),
    node[REFS] ? mapValues(node[REFS], getPredRefs) : {}
  )
})
// (state, entityObj) simpleSelector
export const getFullEntity = createSelector(selectGraph, nthArg(1), buildFullEntity(0))
export const getAllChildren = createSelector(selectGraph, nthArg(1), buildFullEntity(7))
export function fullEntitySelector(customEntitySelector) {
  return simpleSelector(nthArg(0), customEntitySelector, getFullEntity)
}
export function allChildrenSelector(customEntitySelector) {
  return simpleSelector(nthArg(0), customEntitySelector, getAllChildren)
}

export function filterEntity(type, predicate) {
  return createSelector(
    entityTypeSelector(type),
    items => filter(items, predicate)
  )
}
