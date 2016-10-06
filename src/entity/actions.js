import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import keyBy from 'lodash/keyBy'
import { createAction, createGetPayload } from 'cape-redux'

export const DEL = 'graph/entity/DEL'
export const delPayload = createGetPayload((entityOrId) => {
  if (isString(entityOrId)) return { id: entityOrId }
  return entityOrId
})
export const del = createAction(DEL, delPayload)

export const PUT = 'graph/entity/PUT'
export const put = createAction(PUT)

export const PUT_ALL = 'graph/entity/PUT_ALL'
export const putAll = createAction(PUT_ALL, values => {
  if (!isObject(values)) {
    throw new Error('Must send putAll an array or object.')
  }
  return isArray(values) ? keyBy(values, 'id') : values
})

export const UPDATE = 'graph/entity/UPDATE'
export const update = createAction(UPDATE)
