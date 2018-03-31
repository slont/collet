import Base from './Base'
import moment from 'moment'

export default class Element extends Base {
  constructor(themeId, itemId) {
    super(`/themes/${themeId}/items/${itemId}/elements`)
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => Element._deserialize(v))
    } else {
      return Element._deserialize(json)
    }
  }

  static _deserialize(json) {
    return Object.assign({}, json, {
      valueStr: '',
      valueNum: 0,
      valueDbl: 0.0,
      createdAt: moment(json.createdAt),
      updatedAt: moment(json.updatedAt)
    })
  }
}
