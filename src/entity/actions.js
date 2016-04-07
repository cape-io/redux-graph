import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import keyBy from 'lodash/keyBy'

import createAction from '../../createAction'

export const DEL = 'graph/entity/DEL'
export const del = createAction(DEL)

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
