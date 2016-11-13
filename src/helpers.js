import { isString, now, reduce, set } from 'lodash'
import { pick } from 'lodash/fp'
import { setIn } from 'cape-redux'
import { isEntityCreated, getTripleError } from './lang'

export const REF = '_refs'

// Generate a new random key. Probably unique.
export function nextId() {
  return Math.random().toString(36).substr(6)
  .substring(1, 9)
}
export function getKey({ type, id }) {
  return `${type}_${id}`
}

export const pickTypeId = pick([ 'dateModified', 'id', 'type' ])
export function getRefPath(predicate, obj, single = true) {
  if (!isString(predicate)) throw new Error('predicate must be a string.')
  return single ? [ REF, predicate ] : [ REF, predicate, getKey(obj) ]
}
export function setRef(subject, predicate, obj) {
  return setIn(getRefPath(predicate, obj), subject, pickTypeId(obj))
}
export function buildRef(result, val, predicate) {
  // Does not support merging of previously set REF field.
  if (isEntityCreated(val)) return setRef(result, predicate, val)
  return set(result, predicate, val)
}
// Split out triple refs because the need to be handled in the reducer.
export function buildRefs(entity) {
  return reduce(entity, buildRef, {})
}

export function requireIdType(props, typeId = null, doPick = true) {
  if (!isEntityCreated(props)) throw new Error('Must have a type and id prop.')
  if (typeId && props.type !== typeId) throw new Error('Wrong entity type.')
  return doPick ? pickTypeId(props) : null
}
export function getPath(item) {
  requireIdType(item, null, false)
  return [ item.type, item.id ]
}
// Add fields required for save.
export function insertFields(data = {}) {
  return {
    type: 'Thing',
    rangeIncludes: {},
    _refs: {},
    ...buildRefs(data),
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

export function tripleErr(triple) {
  const errMsg = getTripleError(triple)
  if (errMsg) throw new Error(errMsg)
}
export function buildTriple(triple) {
  tripleErr(triple)
  return {
    subject: pickTypeId(triple.subject),
    predicate: triple.predicate,
    object: pickTypeId(triple.object),
  }
}

// @TODO Create ref entities before put subject.
