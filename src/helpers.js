import reduce from 'lodash/reduce'
import set from 'lodash/set'

import { insertFields, isEntity, isEntityCreated } from './entity/helpers'
import { entityPut, triplePut } from './'
import { tripleValidate } from './triple/helpers'


export function createIfNew(dispatch, entity) {
  if (isEntityCreated(entity)) return entity
  const item = insertFields(entity)
  create(dispatch, item) // eslint-disable-line no-use-before-define
  return item
}

export function createTriple(dispatch, triple) {
  tripleValidate(triple)
  const subject = createIfNew(triple.subject)
  const object = createIfNew(triple.object)
  dispatch(triplePut({ ...triple, subject, object }))
}

export function propHandler(dispatch, subject) {
  return (res, val, predicate) => {
    if (isEntity(val)) {
      createTriple(dispatch, { predicate, subject, object: val })
      return res
    }
    return set(res, predicate, val)
  }
}

export function create(dispatch, entity) {
  const item = reduce(entity, propHandler(dispatch))
  dispatch(entityPut(item))
}
