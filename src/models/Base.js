import qs from 'qs'

export default class Base {
  constructor(endpoint) {
    this.endpoint = `${process.env.API_ENDPOINT}${endpoint}`
  }

  find(params = null) {
    return this.postProcess(fetch(`${this.endpoint + (params ? '?' + qs.stringify(params) : '')}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    }))
  }

  findOne(key, params = null) {
    return this.postProcess(fetch(`${this.endpoint}/${key}${(params ? '?' + qs.stringify(params) : '')}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    }))
  }

  create(body) {
    return this.postProcess(fetch(`${this.endpoint}`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-Requested-By': location.href // for CSRF Filter
      },
      body: JSON.stringify(body)
    }))
  }

  update(key, body) {
    return this.postProcess(fetch(`${this.endpoint}/${key}`, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-Requested-By': location.href // for CSRF Filter
      },
      body: JSON.stringify(body)
    }))
  }

  delete(key) {
    return this.postProcess(fetch(`${this.endpoint}/${key}`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-Requested-By': location.href // for CSRF Filter
      }
    }))
  }

  postProcess(promise) {
    return promise.then(response => {
      if (response.ok) {
        switch (response.status) {
          case 201: // Created
            return response.json()
              .then(json => Promise.resolve(this.deserialize(json)),
                    err => err instanceof SyntaxError ? Promise.resolve() : Promise.reject())
          case 204: // No-Content
            return Promise.resolve()
          default:
            return response.json().then(json => Promise.resolve(this.deserialize(json)))
        }
      } else {
        switch (response.status) {
          case 401:
          case 440:
            window.location.href = `/logout?redirect=${encodeURIComponent(window.location.pathname)}`
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

  deserialize(json) {
    return json
  }
}
