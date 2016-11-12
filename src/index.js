import { combineReducers } from 'redux'
import entity from './entity/reducer'
import triple from './triple/reducer'
import typeIndex from './entity/typeIndexReducer'

export * from './helpers'
export { entityHasType, insertFields, isEntity, isEntityCreated, nextId } from './entity/helpers'
export * from './triple/helpers'

export {
  del as entityDel,
  DEL as ENTITY_DEL,
  put as entityPut,
  PUT as ENTITY_PUT,
  putAll as entityPutAll,
  PUT_ALL as ENTITY_PUT_ALL,
  update as entityUpdate,
  UPDATE as ENTITY_UPDATE,
} from './entity/actions'

export {
  del as tripleDel,
  DEL as TRIPLE_DEL,
  put as triplePut,
  PUT as TRIPLE_PUT,
  putAll as triplePutAll,
  PUT_ALL as TRIPLE_PUT_ALL,
} from './triple/actions'

export * from './select'
export * from './entity/select'
export * from './triple/select'
export { getIndex, getIndexPath } from './triple/selectNew'

export default combineReducers({
  entity,
  triple,
  typeIndex,
})
