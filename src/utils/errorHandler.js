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

        // Show error
        if (res.message && res.message !== 'Token has expired') $toast.error(res.message)

        // Show errors
        if (res.errors) {
          Object.values(res.errors).forEach((x) => {
            x.forEach((z) => $toast.error(z))
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
