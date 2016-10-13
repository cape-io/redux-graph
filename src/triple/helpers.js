import { createSelector } from 'reselect'
import { negate } from 'lodash'
import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'
import mapValues from 'lodash/mapValues'

import { isEntity, isEntityCreated } from '../entity/helpers'
import { buildTypeIndex, entitySelector } from '../entity/select'

const errMsgs = {
  plainObj: 'Triple must be an object.',
  subEnt: 'Triple must include subject object.',
  predicate: 'Predicate must be a string.',
  objEnt: 'Triple must include object prop.',
  id: 'Triple id must have a length between three and five.',
  objId: 'Triple object must have an id already.',
  subId: 'Triple subject must have an id already.',
}

// export const getTripleError = cond([
//   [ flow(negate(isPlainObject)), constant(errMsgs.plainObj) ],
// ])
export function getTripleError(triple, checkCreated = false) {
  const { id, subject, predicate, object } = triple
  if (!isPlainObject(triple)) return errMsgs.plainObj
  if (!isEntity(subject)) return errMsgs.subEnt
  if (!isString(predicate)) return errMsgs.predicate
  if (!isEntity(object)) return errMsgs.objEnt
  if (id && (!isArray(id) || id.length !== 3)) return errMsgs.id
  if (checkCreated) {
    if (!isEntityCreated(subject)) return errMsgs.objId
    if (!isEntityCreated(object)) return errMsgs.subId
  }
  return false
}

export function tripleErr(triple, checkCreated) {
  const errMsg = getTripleError(triple, checkCreated)
  return errMsg && new Error(errMsg)
}
export const isTriple = negate(getTripleError)

export function expandIndex(items, entity) {
  return mapValues(items, (val, id) => entity[id])
}
export function tripleIndexSelector(indexSelector) {
  return createSelector(indexSelector, entitySelector, expandIndex)
}
export function tripleTypeIndexSelector(indexSelector) {
  return createSelector(tripleIndexSelector(indexSelector), buildTypeIndex)
}
