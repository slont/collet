import Base from './Base'

export default class File extends Base {
  constructor() {
    super('/files')
  }

  create(file, fileName, themeId) {
    const formData = new FormData()
    formData.append('file', file, fileName)
    if (themeId) {
      formData.append('themeId', themeId)
    }
    return this.postProcess(fetch(`${this.endpoint}`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-Requested-With': location.href, // for CSRF Filter,
        'Authorization': localStorage.authToken
      },
      body: formData
    }))
  }

  deserialize(json) {
    return Object.assign({}, json)
  }
}
