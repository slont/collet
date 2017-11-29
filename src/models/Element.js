import Base from './Base'

export default class Item extends Base {
  constructor(themeId, itemId) {
    super(`/themes/${themeId}/items/${itemId}/elements`)
  }

  deserialize(json) {
    const result = Object.assign({}, json)
    return result
  }
}
