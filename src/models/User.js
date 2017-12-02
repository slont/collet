import Base from './Base'
import moment from 'moment'

export default class User extends Base {
  constructor() {
    super(`/users`)
  }

  deserialize(json) {
    return Object.assign({}, json, {
      image: json.image || '',
      createdAt: moment(json.createdAt),
      updatedAt: moment(json.createdAt)
    })
  }
}
