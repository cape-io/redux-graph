import { createSelector } from 'reselect'

import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'
import mapValues from 'lodash/mapValues'

import { isEntity, isEntityCreated } from '../entity/helpers'
import { buildTypeIndex, entitySelector } from '../entity/select'

export function isTriple(triple, checkCreated = false) {
  const { id, subject, predicate, object } = triple
  if (!isPlainObject(triple)) throw new Error('Triple must be an object.')
  if (!isEntity(subject)) throw new Error('Triple must include subject object.')
  if (!isString(predicate)) throw new Error('Predicate must be a string.')
  if (!isEntity(object)) throw new Error('Triple must include object prop.')
  if (id && (!isArray(id) || id.length !== 3)) {
    throw new Error('Triple id must have a length between three and five.')
  }
  if (checkCreated) {
    if (!isEntityCreated(subject)) throw new Error('Triple subject must have an id already.')
    if (!isEntityCreated(object)) throw new Error('Triple object must have an id already.')
  }
  return true
}
export function expandIndex(items, entity) {
  return mapValues(items, (val, id) => entity[id])
}
export function tripleIndexSelector(indexSelector) {
  return createSelector(indexSelector, entitySelector, expandIndex)
}
export function tripleTypeIndexSelector(indexSelector) {
  return createSelector(tripleIndexSelector(indexSelector), buildTypeIndex)
}
