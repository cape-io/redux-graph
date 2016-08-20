import isDate from 'lodash/isDate'
import isEmpty from 'lodash/isEmpty'
import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'

// Generate a new random key. Probably unique.
export function nextId() {
  return Math.random().toString(36).substr(6)
  .substring(1, 9)
}
// Check to see if object has required fields.
export function isEntity(value) {
  return isPlainObject(value) && isString(value.type)
}

// Check to see if the entity has been populated with fields required for save.
export function isEntityCreated(entity, checkDate = false) {
  if (!isEntity(entity) || isEmpty(entity.id)) return false
  if (checkDate && !isDate(entity.dateCreated)) return false
  return true
}
// Add fields required for save.
export function insertFields(data) {
  if (isEntityCreated(data, true)) return data
  return {
    ...data,
    dateCreated: data.dateCreated || new Date(),
    id: data.id || nextId(),
    type: data.type || 'Thing',
  }
}
