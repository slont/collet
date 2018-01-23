import qs from 'qs'

export default class Base {
  constructor(endpoint) {
    this.endpoint = `${process.env.API_ENDPOINT}${endpoint}`
  }

  find(params = null) {
    return this.postProcess(fetch(`${this.endpoint + (params ? '?' + qs.stringify(params, { indices: false }) : '')}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  findOne(id, params = null) {
    return this.postProcess(fetch(`${this.endpoint}/${id}${(params ? '?' + qs.stringify(params, { indices: false }) : '')}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  create(body) {
    return this.postProcess(fetch(`${this.endpoint}`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      body: JSON.stringify(body)
    }))
  }

  update(id, body) {
    return this.postProcess(fetch(`${this.endpoint}/${id}`, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders(),
      body: JSON.stringify(body)
    }))
  }

  delete(id) {
    return this.postProcess(fetch(`${this.endpoint}/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: Base.getHeaders()
    }))
  }

  postProcess(promise) {
    return promise.then(response => {
      if (response.ok) {
        switch (response.status) {
          case 201: // Created
            return response.json()
              .then(json => Promise.resolve({ data: this.deserialize(json) }),
                    err => err instanceof SyntaxError ? Promise.resolve() : Promise.reject())
          case 204: // No-Content
            return Promise.resolve()
          default:
            return response.json().then(json => ({
                  data: this.deserialize(json),
                  headers: response.headers
            }))
        }
      } else {
        switch (response.status) {
          case 401:
          case 440:
            window.location.href = `/signin?redirect=${encodeURIComponent(window.location.pathname)}`
            break
          default:
            console.log('Network response was not ok.')
            return response.json().then(json => Promise.reject(json))
        }
      }
    }, error => {
      console.log(`There has been a problem with your fetch operation: ${error.message}`)
      return Promise.reject({ success: false })
    })
  }

  static getHeaders() {
    return {
      'X-Requested-With': location.href, // for CSRF Filter,
      'Content-Type': 'application/json',
      'Authorization': localStorage.authToken
    }
  }

  deserialize(json) {
    return json
  }
}
