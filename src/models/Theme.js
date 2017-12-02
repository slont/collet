import Base from './Base'
import moment from 'moment'

export default class Theme extends Base {
  constructor() {
    super('/themes')
  }

  deserialize(json) {
    return Object.assign({}, json, {
      createdAt: moment(json.createdAt),
      updatedAt: moment(json.createdAt)
    })
  }
}
