import Base from './Base'
import User from './User'
import qs from 'qs'

export default class Auth extends Base {
  constructor() {
    super('')
  }

  confirmEmail(body) {
    return this.postProcess(fetch(`${this.endpoint}/confirmEmail`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      body: JSON.stringify(body)
    }))
  }

  confirmCode(body) {
    return this.postProcess(fetch(`${this.endpoint}/confirmCode`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      body: JSON.stringify(body)
    }))
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

  signinTwitter(body) {
    return this.postProcess(fetch(`${this.endpoint}/signin/twitter`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      body: JSON.stringify(body),
      redirect: 'manual'
    }))
  }

  callback(body) {
    return this.postProcess(fetch(`${this.endpoint}/callback?${qs.stringify(body)}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  logout() {
    return this.postProcess(fetch(`${this.endpoint}/logout`, {
      method: 'GET',
      headers: Base.getHeaders()
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
    if (json instanceof Array) {
      return json.map(v => Auth._deserialize(v))
    } else {
      return Auth._deserialize(json)
    }
  }

  static _deserialize(json) {
    return Object.assign({}, json, {
      user: (json.user && new User().deserialize(json.user)) || {}
    })
  }
}
