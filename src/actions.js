import { isArray, map } from 'lodash'
import { createAction } from 'cape-redux'
import { insertFields, updateFields, requireIdType, buildTriple, buildTripleDel } from './helpers'

export const ENTITY_DEL = 'graph/ENTITY_DEL'
export const entityDel = createAction(ENTITY_DEL, requireIdType)

export const ENTITY_PUT = 'graph/ENTITY_PUT'
export const entityPut = createAction(ENTITY_PUT, insertFields)
export const entityPutRaw = createAction(ENTITY_PUT)

export const ENTITY_PUTALL = 'graph/ENTITY_PUTALL'
export const entityPutAll = createAction(ENTITY_PUTALL, values => {
  if (!isArray(values)) throw new Error('Must send putAll an array.')
  return map(values, insertFields)
})

export const ENTITY_UPDATE = 'graph/ENTITY_UPDATE'
export const entityUpdate = createAction(ENTITY_UPDATE, updateFields)

export const TRIPLE_DEL = 'graph/TRIPLE_DEL'
export const tripleDel = createAction(TRIPLE_DEL, buildTripleDel)

export const TRIPLE_PUT = 'graph/TRIPLE_PUT'
// You send it an object with an id, object, subject and predicate properties.
// This is only used when there a multiple predicate refs.
export const triplePut = createAction(TRIPLE_PUT, buildTriple)
