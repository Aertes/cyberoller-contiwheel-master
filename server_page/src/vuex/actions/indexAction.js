import * as app from './appAction'
import * as menu from './common/menuAction'
import * as nav from './common/navAction'

export default {
  ...app,
  ...menu,
  ...nav
}
