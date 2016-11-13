import { isArray, isObject, isString, keyBy, mapValues } from 'lodash'
import { createAction, createGetPayload } from 'cape-redux'
import { insertFields, tripleErr, updateFields } from './helpers'

export const ENTITY_DEL = 'graph/ENTITY_DEL'
export const delPayload = createGetPayload((entityOrId) => {
  if (isString(entityOrId)) return { id: entityOrId }
  return entityOrId
})
export const del = createAction(ENTITY_DEL, delPayload)

export const ENTITY_PUT = 'graph/ENTITY_PUT'
export const put = createAction(ENTITY_PUT, insertFields)

export const TRIPLE_PUT = 'graph/TRIPLE_PUT'
// You send it an object with an id, object, subject and predicate properties.
export const triplePut = createAction(TRIPLE_PUT, tripleErr)

export const PUT_ALL = 'graph/entity/PUT_ALL'
export const putAll = createAction(PUT_ALL, values => {
  if (!isObject(values)) {
    throw new Error('Must send putAll an array or object.')
  }
  const items = isArray(values) ? keyBy(values, 'id') : values
  return mapValues(items, insertFields)
})

export const UPDATE = 'graph/entity/UPDATE'
export const update = createAction(UPDATE, updateFields)
