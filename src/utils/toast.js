import Toast from 'vue-toastification'
import { useToast, POSITION } from 'vue-toastification'

import 'vue-toastification/dist/index.css'

export default {
  install: async (app) => {
    const toast = useToast()

    app.use(Toast, {
      position: POSITION.BOTTOM_RIGHT
    })

    app.config.globalProperties.$toast = toast
    app.config.globalProperties.$store.$toast = toast
  }
}
