import Base from './Base'
import qs from 'qs'
import moment from 'moment'

export default class User extends Base {
  constructor() {
    super(`/users`)
  }

  findThemes(userId, params = null) {
    return this.postProcess(fetch(`${this.endpoint}/${userId}/themes${(params ? '?' + qs.stringify(params, { indices: false }) : '')}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  findByFavorite(userId, params) {
    return this.postProcess(fetch(`${this.endpoint}/${userId}/themes/_favorite?${qs.stringify(params, { indices: false })}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => User._deserialize(v))
    } else {
      return User._deserialize(json)
    }
  }

  static _deserialize(json) {
    return Object.assign({}, json, {
      createdAt: moment(json.createdAt),
      updatedAt: moment(json.updatedAt)
    })
  }
}
