import { isPlainObject, isString, negate, now, reduce, set } from 'lodash'
import { pick } from 'lodash/fp'
import { setIn } from 'cape-redux'
import { isEntityCreated } from './lang'

// Generate a new random key. Probably unique.
export function nextId() {
  return Math.random().toString(36).substr(6)
  .substring(1, 9)
}
export function getKey({ type, id }) {
  return `${type}_${id}`
}
export const pickTypeId = pick([ 'dateModified', 'id', 'type' ])
export function getRefPath(predicate, obj) {
  if (!isString(predicate)) throw new Error('predicate must be a string.')
  return [ '_refs', predicate, getKey(obj) ]
}
export function setRef(subject, predicate, obj) {
  return setIn(getRefPath(predicate, obj), subject, pickTypeId(obj))
}
export function buildRefs(result, val, predicate) {
  if (isEntityCreated(val)) return setRef(result, predicate, val)
  return set(result, predicate, val)
}
// Split out triple refs because the need to be handled in the reducer.
export function clean(entity) {
  return reduce(entity, buildRefs, {})
}

export function requireIdType(props, typeId = null, doPick = true) {
  if (!props.id) throw new Error('Must have id prop.')
  if (!props.type) throw new Error('Must have a type prop.')
  if (typeId && props.type !== typeId) throw new Error('Wrong entity type.')
  return doPick ? pick('id', 'type') : null
}

// Add fields required for save.
export function insertFields(data) {
  requireIdType(data, null, false)
  return {
    type: 'Thing',
    rangeIncludes: {},
    _refs: {},
    ...clean(data),
    dateCreated: data.dateCreated ? data.dateCreated : now(),
    id: data.id ? data.id : nextId(),
  }
}
export function updateFields(data) {
  return {
    ...insertFields(data),
    dateModified: data.dateModified ? data.dateModified : now(),
  }
}
export function uniqEntity(type) { return insertFields({ type }) }
export function getPath(item) {
  requireIdType(item, null, false)
  return [ item.type, item.id ]
}
const errMsgs = {
  plainObj: 'Triple must be an object.',
  subEnt: 'Triple must include subject object.',
  predicate: 'Predicate must be a string.',
  objEnt: 'Triple must include object prop.',
}

export function getTripleError(triple) {
  const { subject, predicate, object } = triple
  if (!isPlainObject(triple)) return errMsgs.plainObj
  if (!isEntityCreated(subject)) return errMsgs.subEnt
  if (!isString(predicate)) return errMsgs.predicate
  if (!isEntityCreated(object)) return errMsgs.objEnt
  return false
}

export function tripleErr(triple, checkCreated) {
  const errMsg = getTripleError(triple, checkCreated)
  return (errMsg && new Error(errMsg)) || triple
}
export const isTriple = negate(getTripleError)

// @TODO Create ref entities before put subject.
