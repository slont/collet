import Base from './Base'
import Element from './Element'
import qs from 'qs'

export default class Item extends Base {
  constructor(themeId) {
    super(`/themes/${themeId}/items`)
  }

  findByNew(params) {
    return this.postProcess(fetch(`${process.env.API_ENDPOINT}/items/_new?${qs.stringify(params, { indices: false })}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  findByQuery(params) {
    return this.postProcess(fetch(`${process.env.API_ENDPOINT}/items/_search?${qs.stringify(params, { indices: false })}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
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
      elements: (json.elements || []).map(element => Element._deserialize(element)),
      prev: json.prev ? Item._deserialize(json.prev) : {},
      next: json.next ? Item._deserialize(json.next) : {}
    })
  }
}
