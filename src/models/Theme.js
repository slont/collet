import Base from './Base'
import Item from './Item'
import moment from 'moment'

export default class Theme extends Base {
  constructor() {
    super('/themes')
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => Theme._deserialize(v))
    } else {
      return Theme._deserialize(json)
    }
  }

  static _deserialize(json) {
    return Object.assign({}, json, {
      items: (json.items && new Item().deserialize(json.items)) || [],
      createdAt: moment(json.createdAt),
      updatedAt: moment(json.createdAt)
    })
  }
}
