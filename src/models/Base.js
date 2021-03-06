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

  postProcess(promise, deserializer) {
    return promise.then(response => {
      if (response.ok) {
        switch (response.status) {
          case 201: // Created
            return response.json()
              .then(json => {
                    return Promise.resolve({
                      data: deserializer ? deserializer(json) : this.deserialize(json)
                    })
                  }, err => err instanceof SyntaxError ? Promise.resolve() : Promise.reject())
          case 204: // No-Content
            return Promise.resolve()
          default:
            return response.json().then(json => ({
                  data: deserializer ? deserializer(json) : this.deserialize(json),
                  headers: response.headers
            }))
        }
      } else {
        if ('opaqueredirect' === response.type) {
          location.href = response.url
          return Promise.resolve()
        }
        switch (response.status) {
          case 401:
          case 440:
            require('@/store').default.dispatch('setLoggedIn', false)
            // window.location.href = `/signin?redirect=${encodeURIComponent(window.location.pathname)}`
            return Promise.reject({
              status: response.status
            })
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
