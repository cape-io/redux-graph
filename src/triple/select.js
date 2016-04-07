import immutable from 'seamless-immutable'
import get from 'lodash/get'
import forEach from 'lodash/forEach'
import map from 'lodash/map'
import { createSelector } from 'reselect'

import { graphSelector } from '../select'
import { entitySelector } from '../entity/select'

// SPO
export const tripleSelector = state => graphSelector(state).triple

export function getSPO(state, tripleId) {
  return immutable(get(state.spo, tripleId, null))
}

// Query the store for all facts with specific subject
export function getSXX(state, tripleId) {
  const pred = state.spo[tripleId]
  if (!pred) return null
  const res = []
  forEach(pred, predicate => {
    forEach(predicate, value => {
      res.push(immutable(value))
    })
  })
  return res
}
export function getSPX(state, path) {
  const objects = get(state.spo, path, null)
  if (!objects) return objects
  return map(objects, triple => immutable(triple))
}
export function getXPO(state, path) {
  const subjects = get(state.pos, path, null)
  if (!subjects) return subjects
  return map(subjects, (nil, id) => getSPO(state, [ id, ...path ]))
}
export function getXPX(state, predicate) {
  const subjects = state.pso[predicate]
  if (!subjects) return null
  const res = []
  forEach(subjects, (objs, subjectId) => {
    forEach(objs, (nil, objId) => {
      res.push(getSPO(state, [ subjectId, predicate, objId ]))
    })
  })
  return res
}
export function getXXO(state, objectId) {
  const predicates = state.ops[objectId]
  if (!predicates) return null
  const res = []
  forEach(predicates, (subjs, predicate) => {
    forEach(subjs, (nil, subjectId) => {
      res.push(getSPO(state, [ subjectId, predicate, objectId ]))
    })
  })
  return res
}
export function mergeObject(triple, entity) {
  if (!entity) {
    return triple
  }
  return triple.set('object', triple.object.merge(entity))
}

export const selectObject = (triple) => triple.id[2]

function getSXXincludeObject(tripleState, entityState, subjectId) {
  const results = getSXX(tripleState, subjectId)
  return map(results, triple =>
    mergeObject(triple, entityState[selectObject(triple)])
  )
}
export function selectSXXincludeObject(activeEntityIdSelector) {
  return createSelector(
    tripleSelector,
    entitySelector,
    activeEntityIdSelector,
    getSXXincludeObject
  )
}
// Default to get object entity.
function getEntity(object = true) {
  const vertex = object ? 'object' : 'subject'
  return (res, entity) => map(res, triple =>
    triple && triple.set(vertex, entity[triple[vertex].id]) || null
  )
}
function getEntities(res, entity) {
  return map(res, triple =>
    triple && triple.merge({ subject: entity[triple.id[0]], object: entity[triple.id[2]] }) || null
  )
}
export function selectSPX(path) {
  return createSelector(
    tripleSelector,
    state => getSPX(state, path)
  )
}
export function selectSPXentity(path) {
  return createSelector(
    selectSPX(path),
    entitySelector,
    getEntity()
  )
}
export function selectXPO(path) {
  return createSelector(
    tripleSelector,
    state => getXPO(state, path)
  )
}
export function selectXPOentity(path) {
  return createSelector(
    selectXPO(path),
    entitySelector,
    getEntity(false)
  )
}
export function selectXPX(predicate) {
  return createSelector(
    tripleSelector,
    state => getXPX(state, predicate)
  )
}
export function selectXPXentity(predicate) {
  return createSelector(
    selectXPX(predicate),
    entitySelector,
    getEntities
  )
}
export function selectXXO(objectId) {
  return createSelector(
    tripleSelector,
    state => getXXO(state, objectId)
  )
}
export function selectXXOentity(objectId) {
  return createSelector(
    selectXXO(objectId),
    entitySelector,
    getEntity(false)
  )
}
