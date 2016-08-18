import isArray from 'lodash/isArray'
import map from 'lodash/map'
import pick from 'lodash/pick'

import createAction from '../createAction'
import { tripleValidate } from './helpers'

export const DEL = 'graph/triple/DEL'
export const del = createAction(DEL)

export function getId({ id, predicate, object, subject }) {
  return id || [ subject.id, predicate, object.id ]
}
export function pickFields(item) {
  return pick(item, 'id', 'type')
}
// triple object, subject must have id fields.
export function buildTriple(triple) {
  tripleValidate(triple, true)
  return {
    ...triple,
    id: getId(triple),
    object: pickFields(triple.object),
    subject: pickFields(triple.subject),
  }
}

export const PUT = 'graph/triple/PUT'
// You send it an object with an id, object, subject and predicate properties.
export const put = createAction(PUT, buildTriple)

export const PUT_ALL = 'graph/triple/PUT_ALL'
export const putAll = createAction(PUT_ALL, values => {
  if (!isArray(values)) {
    throw new Error('Must send putAll an array.')
  }
  return map(values, buildTriple)
})
