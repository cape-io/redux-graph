import test from 'tape'
import { forEach, get, isArray, isMatch, isNumber, omit } from 'lodash'
import {
  entityDel, ENTITY_DEL, entityPut, ENTITY_PUT, entityPutAll, ENTITY_PUTALL,
  entityUpdate, ENTITY_UPDATE, pickTypeId, tripleDel, TRIPLE_DEL, triplePut, TRIPLE_PUT,
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
function testIsMatch(t, object, prototype, str) {
  forEach(prototype, (val, key) => {
    t.equal(get(object, key), val, str + key)
  })
}
test('entityPutAll', (t) => {
  const act = entityPutAll([ agent, creator, item, mainEntity ])
  t.equal(act.type, ENTITY_PUTALL)
  t.ok(isArray(act.payload))
  t.equal(act.payload.length, 4)
  t.ok(isNumber(act.payload[0].dateCreated), '0 dateCreated number')
  t.ok(isMatch(act.payload[0], agent))
  t.ok(isNumber(act.payload[1].dateCreated), '1 dateCreated number')
  t.ok(isMatch(act.payload[1], creator))
  t.ok(isNumber(act.payload[2].dateCreated), '2 dateCreated number')
  testIsMatch(t, act.payload[2], item, 'payload 3: ')
  t.ok(isNumber(act.payload[3].dateCreated), '3 dateCreated number')
  t.ok(isMatch(act.payload[3], omit(mainEntity, 'dog')))
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
test('tripleDel', (t) => {
  const act = tripleDel({ subject: creator, predicate: 'item', object: item, single: true })
  t.equal(act.type, TRIPLE_DEL, 'action type')
  t.deepEqual(act.payload, {
    predicate: 'item', subject: pickTypeId(creator), object: null, single: true,
  })
  const act2 = tripleDel({ subject: creator, predicate: 'item', object: item })
  t.deepEqual(act2.payload, {
    predicate: 'item', subject: pickTypeId(creator), object: pickTypeId(item),
  })
  t.end()
})
