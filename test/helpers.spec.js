import { create, createTriple } from '../src'

const mainEntity = { id: 'pBlf', type: 'DataFeed' }
const creator = {
  id: 'user0',
  type: 'Person',
  name: 'Anonymous Person or User of the website',
}
const title = 'Favorites'
const collection = {
  creator, // User that created the thing.
  itemListOrder: 'Ascending',
  mainEntity, // List of what.
  title,
  type: 'CollectionList',
}
