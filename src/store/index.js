import { createStore } from 'vuex'
import loader from './core/_loader'
import auth from './core/_auth'
import eventos from './ticketing/_eventos'
import carrito from './carrito/_carrito'
import adminReportes from './adminTicketing/_reportes'

export default createStore({
  modules: {
    auth,
    loader,
    eventos,
    carrito,
    adminReportes,
  }
})
