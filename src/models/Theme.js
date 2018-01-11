import Base from './Base'
import Item from './Item'
import moment from 'moment'

export default class Theme extends Base {
  constructor() {
    super('/themes')
  }

  updateFavorite(themeId, userId) {
    return this.postProcess(fetch(`${this.endpoint}/${themeId}/favorites/${userId}`, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  deleteFavorite(themeId, userId) {
    return this.postProcess(fetch(`${this.endpoint}/${themeId}/favorites/${userId}`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
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
