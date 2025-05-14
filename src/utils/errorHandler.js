export default {
  install: async (app) => {
    const { $toast, $store } = app.config.globalProperties

    const errorHandler = (e) => {
      if (e.name === 'AxiosError') {
        const res = e.response.data

        // Logout if not authorized
        // if ([401, 403].includes(res.code)) {
        //   $store.dispatch('logout')
        // }

        // Logout if expired
        if (res.message && res.message === 'Token has expired') {
          $store.dispatch('logout')
        }

        // Mostrar mensaje en 'data' si existe
        if (res.data) {
          // Si es un string, mostrarlo directo
          if (typeof res.data === 'string') {
            $toast.error(res.data)
          } else if (Array.isArray(res.data)) {
            res.data.forEach((msg) => $toast.error(msg))
          } else if (typeof res.data === 'object') {
            // <-- Agrega este bloque para buscar en res.data.data
            if (res.data.data && typeof res.data.data === 'object') {
              Object.values(res.data.data).flat().forEach((msg) => $toast.error(msg))
            } else {
              Object.values(res.data).forEach((msg) => $toast.error(msg))
            }
          }
        }
        // Mostrar mensaje en 'message' si existe y no es el de token
        else if (res.message && res.message !== 'Token has expired') {
          $toast.error(res.message)
        }

        // Mostrar errores por campo si existen
        if (res.errors) {
          Object.values(res.errors).forEach((x) => {
            if (Array.isArray(x)) x.forEach((z) => $toast.error(z))
            else $toast.error(x)
          })
        }
      } else if (e.name === 'UnauthorizedError') {
        $toast.error(e.message)
      } else {
        $toast.error('Error inesperado, vuelva a intentarlo en unos minutos')
        console.error(e)
      }
    }

    app.config.globalProperties.$errorHandler = errorHandler
    app.config.globalProperties.$store.$errorHandler = errorHandler
  }
}
