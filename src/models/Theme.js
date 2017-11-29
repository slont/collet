import Base from './Base'

export default class Theme extends Base {
  constructor() {
    super('/themes')
  }

  deserialize(json) {
    const result = Object.assign({}, json)
    return result
  }
}
