import { createStore } from 'vuex'
import loader from './_loader'
import auth from './_auth'
import eventos from './_eventos'

export default createStore({
  modules: {
    auth,
    loader,
    eventos
  }
})
