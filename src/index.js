import { combineReducers } from 'redux'

export { create, createTriple } from './helpers'

import entity from './entity/reducer'
export {
  del as entityDel,
  put as entityPut,
  putAll as entityPutAll,
  update as entityUpdate,
  UPDATE as ENTITY_UPDATE,
} from './entity/actions'

import triple from './triple/reducer'
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
