import Base from './Base'
import moment from 'moment'

export default class Item extends Base {
  constructor(themeId, itemId) {
    super(`/themes/${themeId}/items/${itemId}/elements`)
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => Object.assign({}, v, {
        createdAt: moment(v.createdAt),
        updatedAt: moment(v.createdAt)
      }))
    } else {
      return Object.assign({}, json, {
        createdAt: moment(json.createdAt),
        updatedAt: moment(json.createdAt)
      })
    }
  }
}
