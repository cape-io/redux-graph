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

export default state
