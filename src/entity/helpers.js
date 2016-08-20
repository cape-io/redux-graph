// import isDate from 'lodash/isDate'
import isEmpty from 'lodash/isEmpty'
import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'

// Generate a new random key. Probably unique.
export function nextId() {
  return Math.random().toString(36).substr(6)
  .substring(1, 9)
}
// Add fields required for save.
export function insertFields(data) {
  return {
    ...data,
    dateCreated: new Date(),
    id: nextId(),
  }
}
// Check to see if object has required fields.
export function isEntity(value) {
  return isPlainObject(value) && value.type && isString(value.type)
}
// Check to see if the entity has been populated with fields required for save.
export function isEntityCreated(entity) {
  return !isEmpty(entity.id)
  // && isDate(entity.dateCreated)
}
