import Base from './Base'
import Element from './Element'
import moment from 'moment'

export default class Item extends Base {
  constructor(themeId) {
    super(`/themes/${themeId}/items`)
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => Item._deserialize(v))
    } else {
      return Item._deserialize(json)
    }
  }

  static _deserialize(json) {
    return Object.assign({}, json, {
      elements: (json.elements && new Element().deserialize(json.elements)) || [],
      createdAt: moment(json.createdAt),
      updatedAt: moment(json.updatedAt)
    })
  }
}
