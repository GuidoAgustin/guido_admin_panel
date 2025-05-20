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
    const token = this.store.getters.token;
    const refreshToken = this.store.getters.refresh_token; // Cambiado a refreshToken para claridad
  
    if (!token || !refreshToken) {
      return token; // O podrías lanzar un error o forzar logout si es crítico
    }
  
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const refreshTokenData = JSON.parse(atob(refreshToken.split('.')[1]));
      const tokenExp = tokenData.exp;
      const refreshTokenExp = refreshTokenData.exp;
      const now = Math.floor(Date.now() / 1000);
  
      const shouldRefreshToken = tokenExp - now <= 15; // Ajusta este umbral si es necesario
  
      if (shouldRefreshToken && refreshTokenExp > now) {
        try {
          const response = await axios.post(`${this.baseUrl}refresh_token`, {
            refresh_token: refreshToken // Nombre de propiedad según espere tu backend
          });
          const newTokens = response.data.data; // Asegúrate que esta es la estructura de tu respuesta de refresh
  
          if (!newTokens || !newTokens.token) {
              console.error('[AUTH] _verifyToken: Respuesta de refresh_token no contiene nuevos tokens válidos.', response.data);
              throw new Error('Respuesta de refresh_token inválida');
          }
  
          this.store.commit('SET_TOKEN', newTokens.token);
          if (newTokens.refresh_token) { // Si el backend devuelve un nuevo refresh token
            this.store.commit('SET_REFRESH_TOKEN', newTokens.refresh_token);
          }
          return newTokens.token; // Retorna el NUEVO token de acceso
        } catch (refreshError) {
          console.error('[AUTH] _verifyToken: ¡FALLÓ EL INTENTO DE REFRESCAR EL TOKEN!');
          if (refreshError.response) {
            console.error(`[AUTH] Status: ${refreshError.response.status}, Data:`, refreshError.response.data);
          } else {
            console.error('[AUTH] Error:', refreshError.message);
          }
          // Importante: decide qué hacer. Re-lanzar es una opción para que la llamada original falle claramente.
          // O podrías forzar un logout aquí: this.store.dispatch('logout');
          throw refreshError;
        }
      }
      return token; // Retorna el token original (o el que ya estaba en store)
    } catch (e) {
      console.error('[AUTH] _verifyToken: Error decodificando tokens o error inesperado:', e);
      // Podrías estar intentando decodificar un token inválido o nulo.
      // Si los tokens son inválidos, quizás deberías limpiar el estado y forzar logout.
      // this.store.dispatch('logout');
      throw e; // Relanza para que la petición original falle.
    }
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
