## [1.2.0]
> 2016-08-20

* `create()` will create required triples and objects.
* `createIfNew()` will dispatch new entity if it doesn't have an id field.
* `createTriple()` will dispatch new entities and triples.
* `nextId()` generate a new random key. Probably unique.
* `isEntity()` is the object an entity.
* `isEntityCreated()` does the entity have an id field. Might include check for dateCreated.
* `isTriple()` validate triple object.

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
