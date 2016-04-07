import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import pick from 'lodash/pick'

import createAction from '../../createAction'

export const DEL = 'graph/triple/DEL'
export const del = createAction(DEL)

export const PUT = 'graph/triple/PUT'
// You send it an object with an id, object, subject and predicate properties.
export const put = createAction(PUT, ({ predicate, object, subject, id }) => {
  if (!isString(predicate) || !object.id || !subject.id) {
    throw new Error('Triple must include predicate, object, subject.')
  }
  if (id && (!isArray(id) || id.length !== 3)) {
    throw new Error('Triple id must have a length between three and five.')
  }
  return {
    id: id || [ subject.id, predicate, object.id ],
    object: pick(object, 'id', 'type'),
    predicate,
    subject: pick(subject, 'id', 'type'),
  }
})

export const PUT_ALL = 'graph/triple/PUT_ALL'
export const putAll = createAction(PUT_ALL, values => {
  if (!isArray(values)) {
    throw new Error('Must send putAll an array.')
  }
  return values
})
