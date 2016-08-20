import isArray from 'lodash/isArray'
import isString from 'lodash/isString'

import { isEntity, isEntityCreated } from '../entity/helpers'

export function isTriple({ id, subject, predicate, object }, checkCreated = false) {
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
