import isEmpty from 'lodash/isEmpty'
import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'

export function nextId() {
  return Math.random().toString(36).substr(6)
  .substring(1, 9)
}
export function insertFields(data) {
  return {
    ...data,
    dateCreated: new Date(),
    id: nextId(),
  }
}
export function isEntity(value) {
  return isPlainObject(value) && value.type && isString(value.type)
}

export function isEntityCreated(entity) {
  return !isEmpty(entity.id)
}
