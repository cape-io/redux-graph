const state = { graph: { entity: {} } }
function addEntity(id, type = 'foo') {
  state.graph.entity[id] = { id, type }
}
addEntity('a')
addEntity('b')
addEntity('c')
addEntity('d')
addEntity('a1', 'bar')
addEntity('b1', 'bar')
addEntity('c1', 'bar')
addEntity('d1', 'bar')

export const agent = {
  id: "user0",
  type: "Person",
  "name":"Anonymous",
  "dateCreated":"2016-08-30T17:25:25.915Z",
}
export const item = {
  approxWidth: '57"',
  category: 'textile',
  colors: [],
  contents: '100% Solution Dyed Acrylic',
  discontinued: false,
  id: '28',
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
export const trouble = {
  subject: {
    "additionalType":"Project","itemListOrder":"Ascending","title":"Favorites","type":"CollectionList","dateCreated":"2016-08-30T17:41:43.224Z","id":"i5dtxvjo"},
  predicate: "itemListElement",
  "object": {
    actionStatus:"created",
    agent,
    item,
    "position":100,
    "startTime":"2016-08-30T17:41:43.233Z",
    "type":"ListItem",
  }
}
export const mainEntity = { id: 'pBlf', type: 'DataFeed' }
export const creator = {
  id: 'user0',
  type: 'Person',
  name: 'Anonymous Person or User of the website',
}
export const title = 'Favorites'
export const collection = {
  creator, // User that created the thing.
  itemListOrder: 'Ascending',
  mainEntity, // List of what.
  title,
  type: 'CollectionList',
}

export default state
