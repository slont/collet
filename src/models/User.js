import Base from './Base'
import Theme from './Theme'
import Item from './Item'
import qs from 'qs'
import moment from 'moment'

export default class User extends Base {
  constructor() {
    super(`/users`)
  }

  findOneWithReport(id, params = null) {
    return this.postProcess(fetch(`${this.endpoint}/${id}/_report${(params ? '?' + qs.stringify(params, { indices: false }) : '')}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  findThemes(userId, params = null) {
    return this.postProcess(fetch(`${this.endpoint}/${userId}/themes${(params ? '?' + qs.stringify(params, { indices: false }) : '')}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }), new Theme().deserialize)
  }

  findFavoriteThemes(userId, params) {
    return this.postProcess(fetch(`${this.endpoint}/${userId}/themes/_favorite?${qs.stringify(params, { indices: false })}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }), new Theme().deserialize)
  }

  findItems(userId, params = null) {
    return this.postProcess(fetch(`${this.endpoint}/${userId}/items${(params ? '?' + qs.stringify(params, { indices: false }) : '')}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }), new Item().deserialize)
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
      loggedAt: json.loggedAt ? moment(json.loggedAt) : null,
      createdAt: moment(json.createdAt),
      updatedAt: moment(json.updatedAt)
    })
  }
}
