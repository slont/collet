import Base from './Base'
import moment from 'moment'

export default class Item extends Base {
  constructor(themeId) {
    super(`/themes/${themeId}/items`)
  }

  deserialize(json) {
    return Object.assign({}, json, {
      createdAt: moment(json.createdAt),
      updatedAt: moment(json.createdAt)
    })
  }
}
