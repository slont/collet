import Base from './Base'
import Element from './Element'
import moment from 'moment'

export default class Item extends Base {
  constructor(themeId) {
    super(`/themes/${themeId}/items`)
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => Object.assign({}, v, {
        elements: (v.elements && new Element().deserialize(v.elements)) || [],
        createdAt: moment(v.createdAt),
        updatedAt: moment(v.createdAt)
      }))
    } else {
      return Object.assign({}, json, {
        elements: (json.elements && new Element().deserialize(json.elements)) || [],
        createdAt: moment(json.createdAt),
        updatedAt: moment(json.createdAt)
      })
    }
  }
}
