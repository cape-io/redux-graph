import test from 'tape'
import { isArray, isMatch, isNumber } from 'lodash'
import {
  entityDel, ENTITY_DEL, entityPut, ENTITY_PUT, entityPutAll, ENTITY_PUTALL,
  entityUpdate, ENTITY_UPDATE, pickTypeId, triplePut, TRIPLE_PUT,
} from '../src'
import { agent, creator, item, mainEntity } from './mock'

test('entityDel', (t) => {
  const act = entityDel(creator)
  t.equal(act.type, ENTITY_DEL)
  t.deepEqual(act.payload, pickTypeId(creator))
  t.end()
})
test('entityPut', (t) => {
  const act = entityPut(creator)
  t.equal(act.type, ENTITY_PUT)
  t.ok(isNumber(act.payload.dateCreated))
  t.ok(isMatch(act.payload, creator))
  t.end()
})
test('entityPutAll', (t) => {
  const act = entityPutAll([ agent, creator, item, mainEntity ])
  t.equal(act.type, ENTITY_PUTALL)
  t.ok(isArray(act.payload))
  t.equal(act.payload.length, 4)
  t.ok(isNumber(act.payload[0].dateCreated))
  t.ok(isMatch(act.payload[0], agent))
  t.ok(isNumber(act.payload[1].dateCreated))
  t.ok(isMatch(act.payload[1], creator))
  t.ok(isNumber(act.payload[2].dateCreated))
  t.ok(isMatch(act.payload[2], item))
  t.ok(isNumber(act.payload[3].dateCreated))
  t.ok(isMatch(act.payload[3], mainEntity))
  t.end()
})
test('entityUpdate', (t) => {
  const act = entityUpdate(creator)
  t.equal(act.type, ENTITY_UPDATE)
  t.false(isNumber(act.payload.dateCreated))
  t.ok(isNumber(act.payload.dateModified))
  t.end()
})
test('triplePut', (t) => {
  const act = triplePut({ subject: creator, predicate: 'item', object: item, extra: true })
  t.equal(act.type, TRIPLE_PUT, 'action type')
  t.deepEqual(act.payload, {
    predicate: 'item', subject: pickTypeId(creator), object: pickTypeId(item),
  })
  t.end()
})
