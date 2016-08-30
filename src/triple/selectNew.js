import curry from 'lodash/curry'
import get from 'lodash/get'
import map from 'lodash/map'
import zipObject from 'lodash/zipObject'

import { tripleSelector } from './select'

export function buildGetSelector(indexId) {
  return state => tripleSelector(state)[indexId]
}
export const indexIds = [ 'spo', 'sop', 'osp', 'ops', 'pos', 'pso' ]
const getFuncs = map(indexIds, buildGetSelector)
export const getIndex = zipObject(indexIds, getFuncs)

export const buildPathSelector = curry(
  (indexId, path, state) => get(getIndex[indexId](state), path)
)
const pathFuncs = map(indexIds, indexId => buildPathSelector(indexId))
export const getIndexPath = zipObject(indexIds, pathFuncs)
