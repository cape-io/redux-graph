import isFunction from 'lodash/isFunction'
import reduce from 'lodash/reduce'
import set from 'lodash/set'

import { insertFields, isEntity, isEntityCreated } from './entity/helpers'
import { entityPut, triplePut } from './'
import { isTriple } from './triple/helpers'

// Dispatch new entity if it doesn't have an id field. Otherwise returns entity.
export function createIfNew(dispatch, entity) {
  if (!isFunction(dispatch)) throw new Error('First createIfNew argument must be dispatch func.')
  if (isEntityCreated(entity)) return entity
  const item = insertFields(entity)
  create(dispatch, item) // eslint-disable-line no-use-before-define
  return item
}

// Dispatch new entities and triples.
export function createTriple(dispatch, triple) {
  if (!isFunction(dispatch)) throw new Error('First createTriple argument must be dispatch func.')
  isTriple(triple)
  const subject = createIfNew(dispatch, triple.subject)
  const object = createIfNew(dispatch, triple.object)
  const tripleWithIds = { ...triple, subject, object }
  dispatch(triplePut(tripleWithIds))
  return tripleWithIds
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

// Create triples and dispatch required actions.
export function create(dispatch, entity) {
  // Create an id for the new entity.
  const subject = entity.id ? entity : insertFields(entity)
  const item = reduce(subject, propHandler(dispatch, subject), {})
  dispatch(entityPut(item))
}
