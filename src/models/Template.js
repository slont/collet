import Base from './Base'
import moment from 'moment'

export default class Template extends Base {
  constructor(themeId) {
    super(`/themes/${themeId}/templates`)
  }

  deserialize(json) {
    if (json instanceof Array) {
      return json.map(v => Template._deserialize(v))
    } else {
      return Template._deserialize(json)
    }
  }

  static _deserialize(json) {
    return Object.assign({}, json, {
      createdAt: moment(json.createdAt),
      updatedAt: moment(json.createdAt)
    })
  }
}
