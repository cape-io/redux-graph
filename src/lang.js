import {
  conforms, curry, isNumber, isPlainObject, isString, negate, overEvery,
} from 'lodash'

function entityChecker(source) {
  return overEvery(isPlainObject, conforms(source))
}
export function validType(type) {
  return isString(type) && type[0] === type[0].toUpperCase()
}
export function validId(id) {
  return isString(id) && id.length > 3
}
// Check to see if object has required fields to be an entity.
const entity = { type: validType }
export const isEntity = entityChecker(entity)
const entityCreated = { ...entity, id: validId }
export const isEntityCreated = entityChecker(entityCreated)
const entityCreatedDate = { ...entityCreated, dateCreated: isNumber }
export const isEntityCreatedDate = entityChecker(entityCreatedDate)

export const entityHasType = curry((typeId, item) =>
  isEntity(item) && typeId === item.type
)
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
