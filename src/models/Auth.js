import Base from './Base'
import qs from 'qs'

export default class Auth extends Base {
  constructor() {
    super('')
  }

  findOne(key) {
    return this.postProcess(fetch(`${this.endpoint}/activation/${key}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-Requested-By': location.href // for CSRF Filter
      }
    }))
  }

  signup(body) {
    return this.postProcess(fetch(`${this.endpoint}/signup`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-Requested-By': location.href // for CSRF Filter
      },
      body: JSON.stringify(body)
    }))
  }

  signin(params) {
    return this.postProcess(fetch(`${this.endpoint}/signin?${qs.stringify(params)}`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include'
    }))
  }

  getToken() {
    return localStorage.accessToken
  }

  logout() {
    return this.postProcess(fetch(`${this.endpoint}/signout`, { method: 'GET' }))
  }

  onChange() {}

  deserialize(json) {
    const result = Object.assign({}, json)
    return result
  }
}
