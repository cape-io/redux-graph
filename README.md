# redux-graph

Really basic graph database with entity and triple storage with some helper functions to join it all together. The module loosely follows the Hexastore approach. Six indices are created for every triple, in order to access them as fast as it is possible.

Each entity must have a unique `id` field and a `type` field.
The triple `id` is in the format of `[ subjectId, predicate, objectId ]`.

## Reducer

The reducer is default export.

```javascript
import graph from 'redux-graph'
const reducerIndex = {
  graph,
}
const reducer = combineReducers(reducerIndex)
const store = createStore(reducer)
```

## Entity Actions

* entityDel
* entityPut
* entityPutAll
* entityUpdate

## Triple Actions

* tripleDel
* triplePut
* triplePutAll

## Helper functions.

* `create(dispatch, item)` will create required triples and objects.
* `createIfNew()` will dispatch new entity if it doesn't have an id field.
* `createTriple()` will dispatch new entities and triples.
* `nextId()` generate a new random key. Probably unique.
* `isEntity()` is the object an entity.
* `isEntityCreated()` does the entity have an id field. Second arg to check dateCreated prop.
* `isTriple()` validate triple object.
* `insertFields()` add fields (id and dateCreate) required for save.
* `rebuildEntity()` adds predicate fields and entity references back into a single object.
* `entityDomainIncludes()` adds `domainIncludes` property to entity that includes entities that reference it.
