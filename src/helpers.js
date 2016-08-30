import forEach from 'lodash/forEach'
import isFunction from 'lodash/isFunction'
import reduce from 'lodash/reduce'
import omitBy from 'lodash/omitBy'

import { insertFields, isEntity, isEntityCreated } from './entity/helpers'
import { entityPut, triplePut } from './'
import { isTriple } from './triple/helpers'

// Dispatch new entity if it doesn't have an id field. Otherwise returns entity.
export function createIfNew(dispatch, entity) {
  if (!isFunction(dispatch)) throw new Error('First createIfNew argument must be dispatch func.')
  if (isEntityCreated(entity)) return entity
  return create(dispatch, entity) // eslint-disable-line no-use-before-define
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

export function getTriples(subject) {
  return (res, val, predicate) => {
    if (isEntity(val)) {
      const triple = { predicate, subject, object: val }
      return res.concat(triple)
    }
    // @TODO Handle array values.
    return res
  }
}
export function getFields(entity) {
  return omitBy(entity, isEntity)
}
// Split an entity into its database parts. Subject and its triples.
export function splitEntity(item) {
  // Create an id for the new entity.
  const entity = insertFields(item)
  // Clear out any entity ref fields.
  const subject = getFields(entity)
  // Build out triples.
  const triples = reduce(entity, getTriples(subject), [])
  return { subject, triples }
}

// Create triples and dispatch required actions.
export function create(dispatch, entity) {
  const { subject, triples } = splitEntity(entity)
  dispatch(entityPut(subject))
  forEach(triples, triple => createTriple(dispatch, triple))
  return subject
}
