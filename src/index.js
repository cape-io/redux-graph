import { combineReducers } from 'redux'
import entity from './entity/reducer'
import triple from './triple/reducer'

export { create, createTriple } from './helpers'
export { isEntity } from './entity/helpers'
export { isTriple } from './triple/helpers'

export {
  del as entityDel,
  put as entityPut,
  putAll as entityPutAll,
  update as entityUpdate,
  UPDATE as ENTITY_UPDATE,
} from './entity/actions'

export {
  del as tripleDel,
  put as triplePut,
  putAll as triplePutAll,
} from './triple/actions'

export * from './select'
export * from './entity/select'
export * from './triple/select'

export default combineReducers({
  entity,
  triple,
})
