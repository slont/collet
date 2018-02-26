import Base from './Base'
import moment from 'moment'

export default class User extends Base {
  constructor() {
    super(`/users`)
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
