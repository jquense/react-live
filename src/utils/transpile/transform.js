import { transform as _transform } from 'buble'
import assign from 'core-js/fn/object/assign'

export const _poly = { assign }

const defaults = {
  objectAssign: '_poly.assign',
  transforms: {
    dangerousForOf: true,
    dangerousTaggedTemplateString: true,
  },
}

export default (code, opts = defaults) => _transform(code, opts).code
