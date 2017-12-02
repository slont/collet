import Base from './Base'
import Item from './Item'
import moment from 'moment'

export default class Theme extends Base {
  constructor() {
    super('/themes')
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => Object.assign({}, v, {
        items: (v.items && new Item().deserialize(v.items)) || [],
        createdAt: moment(v.createdAt),
        updatedAt: moment(v.createdAt)
      }))
    } else {
      return Object.assign({}, json, {
        items: (json.items && new Item().deserialize(json.items)) || [],
        createdAt: moment(json.createdAt),
        updatedAt: moment(json.createdAt)
      })
    }
  }
}
