# redux-graph

Really basic graph database with entity and triple storage with some helper functions to join it all together. The module loosely follows the Hexastore approach. Six indices are created for every triple, in order to access them as fast as it is possible.

Each entity must have a unique `id` field.
The triple `id` is in the format of `[ subjectId, predicate, objectId ]`.
