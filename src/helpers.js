import { createSelector } from 'reselect'
import forEach from 'lodash/forEach'
import isFunction from 'lodash/isFunction'
import keys from 'lodash/keys'
import mapValues from 'lodash/mapValues'
import reduce from 'lodash/reduce'
import omitBy from 'lodash/omitBy'

import { insertFields, isEntity, isEntityCreated } from './entity/helpers'
import { entityPut, entitySelector, getIndex, isTriple, triplePut } from './'

export function isFunc(arg) {
  if (!isFunction(arg)) throw new Error('First createIfNew argument must be dispatch func.')
}

// Dispatch new entity if it doesn't have an id field. Otherwise returns entity.
export function createIfNew(dispatch, entity) {
  isFunc(dispatch)
  if (isEntityCreated(entity)) return entity
  return create(dispatch, entity) // eslint-disable-line no-use-before-define
}

// Dispatch new entities and triples.
export function createTriple(dispatch, triple) {
  isFunc(dispatch)
  isTriple(triple)
  const subject = createIfNew(dispatch, triple.subject)
  const object = createIfNew(dispatch, triple.object)
  const tripleWithIds = { ...triple, subject, object }
  dispatch(triplePut(tripleWithIds))
  return tripleWithIds
}

export function buildTriples(subject) {
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
  const triples = reduce(entity, buildTriples(subject), [])
  return { subject, triples }
}

// Create triples and dispatch required actions.
export function create(dispatch, entity) {
  isFunc(dispatch)
  const { subject, triples } = splitEntity(entity)
  dispatch(entityPut(subject))
  forEach(triples, triple => createTriple(dispatch, triple))
  return subject
}
export function entityPredicates(entity, spo, id) {
  return mapValues(spo[id], (objectIds) =>
    mapValues(objectIds, (trip, objId) =>
      rebuildEntity(entity, spo, objId) // eslint-disable-line no-use-before-define
    )
  )
}
export function rebuildEntity(entity, spo, id) {
  if (!spo[id]) return entity[id]
  return entity[id].merge(entityPredicates(entity, spo, id))
}
export function rebuildEntitySelector(entityIdSelector) {
  return createSelector(entitySelector, getIndex.spo, entityIdSelector, rebuildEntity)
}
export function rebuildEntities(entity, spo, entities) {
  return mapValues(entities, ({ id }) => rebuildEntity(entity, spo, id))
}
export function rebuildEntitiesSelector(entitiesSelector) {
  return createSelector(entitySelector, getIndex.spo, entitiesSelector, rebuildEntities)
}
export function entityDomains(entity, ops, id) {
  return mapValues(ops[id], predicate =>
    mapValues(predicate, (trip, domainId) =>
      getDomainIncludes(entity, ops, domainId) // eslint-disable-line no-use-before-define
    )
  )
}
export function getDomainIncludes(entity, ops, id) {
  if (!ops[id]) return entity[id]
  return entity[id].set('domainIncludes', entityDomains(entity, ops, id))
}
export function entityDomainIncludes(entityIdSelector) {
  return createSelector(entitySelector, getIndex.ops, entityIdSelector, getDomainIncludes)
}
// Maybe just use _.find instead?
export function key0(obj) { return keys(obj)[0] }
export function val0(obj) { return obj[key0(obj)] }
