import { now } from 'lodash'
import { combineReducers, createStore } from 'redux'
import graph, { entityPutAll } from '../src'

export const fido = { id: 'dgo14', type: 'Animal', name: 'fido' }
export const mainEntity = { id: 'pBlf', type: 'DataFeed', dog: fido }
export const agent = { id: 'ag12', type: 'Person', name: 'Silly Sam' }
export const creator = {
  id: 'user0',
  type: 'Person',
  name: 'Anonymous Person or User of the website',
  image: null,
}
export const item = {
  approxWidth: '57"',
  category: 'textile',
  colors: [],
  contents: '100% Solution Dyed Acrylic',
  dateCreated: now(),
  dateModified: now(),
  discontinued: false,
  id: 'i28z',
  labelMessage: '5512',
  lengthUnit: 'Yards',
  name: 'Dhow',
  originCountry: 'Italy',
  patternNumber: '10001',
  price: '$90',
  colorNumber: '28',
  type: 'Item',
  isPattern: false,
}
export const collection = {
  creator, // User that created the thing.
  itemListOrder: 'Ascending',
  mainEntity, // List of what.
  title: 'Favorites',
  type: 'CollectionList',
}
export const listItem = {
  actionStatus: 'created',
  agent,
  item,
  position: 100,
  startTime: '2016-08-30T17:41:43.233Z',
  type: 'ListItem',
}
const reducer = combineReducers({
  graph2: graph,
})
export const listItem2 = {
  ...listItem,
  agent: creator,
}
export const li34 = {
  ...listItem,
  id: 'li34',
}
export function configStore() {
  const store = createStore(reducer)
  store.dispatch(entityPutAll([
    agent, item, creator, listItem, listItem, listItem2, li34, mainEntity, fido,
  ]))
  return store
}
