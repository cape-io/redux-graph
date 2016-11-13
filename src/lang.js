import {
  conforms, curry, isNumber, isPlainObject, isString, overEvery,
} from 'lodash'

function entityChecker(source) {
  return overEvery(isPlainObject, conforms(source))
}
function validType(type) {
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
