import identity from 'lodash/identity'
import isError from 'lodash/isError'
import isFunction from 'lodash/isFunction'
import isUndefined from 'lodash/isUndefined'

export default function createAction(type, payloadCreator, metaCreator) {
  const getPayload = isFunction(payloadCreator) ? payloadCreator : identity
  const getMeta = isFunction(metaCreator) ? metaCreator : (arg1, arg2) => arg2
  return (...args) => {
    const action = { type }
    const payload = getPayload(...args)
    if (!isUndefined(payload)) action.payload = payload
    // Handle FSA errors where the payload is an Error object or has error prop. Set error.
    if (args.length && (isError(args[0]) || args[0].error)) {
      action.error = true
    }
    const meta = getMeta(...args)
    if (meta) {
      action.meta = meta
    }
    return action
  }
}
