import Base from './Base'

export default class Item extends Base {
  constructor(themeId) {
    super(`/themes/${themeId}/items`)
  }

  deserialize(json) {
    const result = Object.assign({}, json)
    return result
  }
}
