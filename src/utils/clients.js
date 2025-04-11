import axios from 'axios'

function parseUrl(url, params) {
  if (!params) {
    return url
  }

  const queryString = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')

  return `${url}?${queryString}`
}

class ApiClient {
  constructor(store, baseURL) {
    this.axios = axios
    this.baseUrl = baseURL
    this.store = store
    this.loadingUrls = {}
    this.loadedUrls = {}
    this.persistTimeout = 1000 * 60 * 10 // 10 minutes in miliseconds
  }

  setUrlLoading(url, params, isLoading = true, persist = false) {
    const parsedUrl = parseUrl(url, params)

    if (isLoading) {
      this.loadingUrls[parsedUrl] = true
    } else if (this.loadingUrls[parsedUrl]) {
      this.loadingUrls[parsedUrl] = undefined

      if (persist) {
        this.loadedUrls[parsedUrl] = Date.now() + this.persistTimeout
      }
    }
  }

  isPersisted(parsedUrl) {
    if (!this.loadedUrls[parsedUrl]) return false

    if (this.loadedUrls[parsedUrl] < Date.now()) {
      this.loadedUrls[parsedUrl] = undefined
      return false
    }

    return true
  }

  // To avoid multiple callings from diferent components at the same time
  // we set the fullUrl path in a hashmap and then we check wether is there or not
  // If persist is true, once its finished, the fullUrl cannot be called again for 10min
  canFetch(url, params, force = false) {
    const parsedUrl = parseUrl(url, params)
    const isLoading = this.loadingUrls[parsedUrl]

    return force || (!this.isPersisted(parsedUrl) && !isLoading)
  }

  async _verifyToken() {
    const token = this.store.getters.token
    const refresh_token = this.store.getters.refresh_token

    if (!token || !refresh_token) return

    const tokenExp = JSON.parse(atob(token.split('.')[1])).exp
    const refreshTokenExp = JSON.parse(atob(refresh_token.split('.')[1])).exp
    const now = Math.floor(Date.now() / 1000)

    // If token is about to expire and refresh token is valid
    // We use 15seconds because JWT is expiring
    // the token 10seconds before real expiration date
    if (tokenExp - now <= 15 && refreshTokenExp > now) {
      const {
        data: { data: newTokens }
      } = await axios.post(`${this.baseUrl}refresh_token`, {
        refresh_token
      })

      this.store.commit('SET_TOKEN', newTokens.token)
      this.store.commit('SET_REFRESH_TOKEN', newTokens.refresh_token)

      return newTokens.token
    }

    return token
  }

  async get(url, data, download = false) {
    this.setUrlLoading(url, data?.params, true, data?.persist)

    const token = await this._verifyToken()

    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}${url}`, {
          params: data?.params,
          headers: {
            ...data?.headers,
            Authorization: `Bearer ${token}`
          },
          responseType: download ? 'blob' : 'json'
        })
        .then((response) => {
          if (download) {
            let filename
            const contentDisposition = response.headers['content-disposition']

            if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
              const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '')
              }
            }

            resolve({ data: response.data, filename })
          } else {
            resolve(response)
          }
        })
        .catch(async (err) => {
          let error = err

          if (download) {
            error = JSON.parse(await err?.response?.data?.text())
          }
          reject(error)
        })
        .finally(() => {
          this.setUrlLoading(url, data?.params, false, data?.persist)
        })
    })
  }

  async post(url, data, opts, download = false) {
    const token = await this._verifyToken()

    return new Promise((resolve, reject) => {
      axios
        .post(`${this.baseUrl}${url}`, data, {
          headers: {
            ...opts?.headers,
            Authorization: `Bearer ${token}`
          },
          responseType: download ? 'blob' : 'json'
        })
        .then((response) => {
          if (download) {
            let filename
            const contentDisposition = response.headers['content-disposition']

            if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
              const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '')
              }
            }

            resolve({ data: response.data, filename })
          } else {
            resolve(response)
          }
        })
        .catch(async (err) => {
          let error = err

          if (download) {
            error = {
              name: 'AxiosError',
              response: {
                data: JSON.parse(await err?.response?.data?.text())
              }
            }
          }
          reject(error)
        })
    })
  }

  async put(url, data, headers = { headers: {} }) {
    const token = await this._verifyToken()

    return new Promise((resolve, reject) => {
      axios
        .put(`${this.baseUrl}${url}`, data, {
          headers: {
            ...headers.headers,
            Authorization: `Bearer ${token}`
          }
        })
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  async delete(url, data) {
    const token = await this._verifyToken()

    return new Promise((resolve, reject) => {
      axios
        .delete(`${this.baseUrl}${url}`, {
          params: data?.params,
          headers: {
            ...data?.headers,
            Authorization: `Bearer ${token}`
          }
        })
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export default {
  install(app) {
    const store = app.config.globalProperties.$store

    app.config.globalProperties.$store.$clients = {
      api: new ApiClient(store, import.meta.env.VITE_BACKEND_URL)
      // To create a new client we use this template
      // app: new ApiClient(store, baseURL)
    }
  }
}
