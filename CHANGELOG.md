## [1.3.1]

* Cleanup of `create(dispatch, entity)` that will add add subject first before `createTriple`.
* Added `splitEntity()` that will return `{ subject, triples }`.

## [1.3.0]

* Added `entityHasType(typeId, entity)` curried function to check is valid entity with certain type.
* Improve validation of `isTriple` to check for plain object first.
* Now throwing error if first  arg is not a function on `createIfNew(dispatch, entity)` and `createTriple`.
* `createIfNew` and `create` now return reduced entity where triple object fields are removed.

## [1.2.1]
This is prep for version 2 where each entity will be stored in its own type index.

* `selectTypeIndex(state)` returns object keyed by entity type property.
* `entityTypeSelector(typeId)(state)` selector creator returns selector that will return only entity type specified.

## [1.2.0]
> 2016-08-20

Added several helper functions.

* `create()` will create required triples and objects.
* `createIfNew()` will dispatch new entity if it doesn't have an id field.
* `createTriple()` will dispatch new entities and triples.
* `nextId()` generate a new random key. Probably unique.
* `isEntity()` is the object an entity.
* `isEntityCreated()` does the entity have an id field. Second arg to check dateCreated prop.
* `isTriple()` validate triple object.
* `insertFields()` add fields (id and dateCreate) required for save.

## [1.1.0]
> 2016-07-26

* Allowed using `UPDATE` to create new entity if one is not found.
* Updated packages.

## [1.1.0]
> 2016-06-16

* Added triple action helper `buildTriple()` that is applied to both `put()` and `putAll()` actions.
* Updated packages.

## [1.0.1]
> 2016-04-07

Initial Release
