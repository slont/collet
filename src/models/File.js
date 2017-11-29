import Base from './Base'

export default class File extends Base {
  constructor() {
    super('/files')
  }

  create(file) {
    const formData = new FormData()
    formData.append('file', file)
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
    const result = Object.assign({}, json)
    return result
  }
}
