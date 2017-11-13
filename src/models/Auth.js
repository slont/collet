import Base from './Base'

export default class Auth extends Base {
  constructor() {
    super('')
  }

  signup(body) {
    return this.postProcess(fetch(`${this.endpoint}/signup`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      body: JSON.stringify(body)
    }))
  }

  signin(body) {
    return this.postProcess(fetch(`${this.endpoint}/signin`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      body: JSON.stringify(body)
    }))
  }

  signout() {
    return this.postProcess(fetch(`${this.endpoint}/signout`, {
      method: 'GET',
      headers: Base.getHeaders()
    }))
  }

  confirm(body) {
    return this.postProcess(fetch(`${this.endpoint}/confirm`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      body: JSON.stringify(body)
    }))
  }

  getToken() {
    return localStorage.authToken
  }

  onChange() {}

  deserialize(json) {
    const result = Object.assign({}, json)
    return result
  }
}