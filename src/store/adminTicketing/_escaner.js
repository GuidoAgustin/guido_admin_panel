// Ruta: src/store/adminTicketing/_escaner.js

export default {
  namespaced: true, // 👈 Aislado del resto, como a vos te gusta

  actions: {
    // Ya no usamos el SHOW_LOADER de Vuex acá porque tu ScannerView 
    // ya maneja su propio loader con la variable "this.cargando"
    async validarTicketAction({ rootGetters }, codigoQr) {
      try {
        const { data } = await this.$clients.api.post(
          'admin/escaner/validar',
          { codigo_qr: codigoQr },
          {
            // Usamos rootGetters.token porque este módulo está aislado (namespaced)
            headers: { Authorization: `Bearer ${rootGetters.token}` }
          }
        );
        
        return data; // Le devolvemos el semáforo al componente
      } catch (error) {
        console.error("Error al validar el ticket desde Vuex:", error);
        throw error;
      }
    }
  }
}