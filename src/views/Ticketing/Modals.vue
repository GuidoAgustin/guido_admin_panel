<template>
  <div>
    <VueModal
      v-if="showBuyModal"
      size="md"
      position="center"
      @close="onClose"
    >
      <template #title>
        Adquirir Entradas: {{ ticketSeleccionado?.nombre_evento }}
      </template>
      
      <template #body>
        <div v-if="loadingTipos" class="text-center my-4">
          <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
          <p class="mt-2 text-muted">Buscando disponibilidad...</p>
        </div>
        
        <div v-else-if="errorTipos" class="alert alert-danger">
          {{ errorTipos }}
        </div>
        
        <div v-else-if="!tiposPorEvento || tiposPorEvento.length === 0" class="alert alert-info">
          No hay entradas disponibles para este evento en este momento.
        </div>
        
        <div v-else>
          <p class="text-muted mb-4">Selecciona la cantidad de entradas que deseas adquirir:</p>

          <div
            v-for="tipo in tiposPorEvento"
            :key="tipo.id_tipo_entrada"
            class="mb-3 p-3 border rounded shadow-sm bg-light"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div class="flex-grow-1">
                <h5 class="mb-1 text-dark">{{ tipo.nombre_tipo }}</h5>
                <p class="mb-1 fs-5 text-success fw-bold">
                  ${{ formatPrice(tipo.precio) }}
                </p>
                <p class="mb-1 text-muted small">
                  Disponibles: {{ tipo.cantidad_disponible }}
                </p>
              </div>
              
              <div class="d-flex align-items-center bg-white border rounded p-1" style="min-width: 120px">
                <button
                  type="button"
                  class="btn btn-light btn-sm border-0"
                  @click="decrementQuantity(tipo)"
                  :disabled="(selectedQuantities[tipo.id_tipo_entrada] || 0) === 0 || purchaseLoading"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <span class="mx-2 fw-bold" style="min-width: 30px; text-align: center;">
                  {{ selectedQuantities[tipo.id_tipo_entrada] || 0 }}
                </span>
                <button
                  type="button"
                  class="btn btn-light btn-sm border-0"
                  @click="incrementQuantity(tipo)"
                  :disabled="(selectedQuantities[tipo.id_tipo_entrada] || 0) >= tipo.cantidad_disponible || tipo.cantidad_disponible === 0 || purchaseLoading"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
            <div v-if="tipo.descripcion_adicional" class="mt-2 pt-2 border-top text-muted small">
              <i class="fas fa-info-circle me-1"></i> {{ tipo.descripcion_adicional }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
            <h5 class="text-muted mb-0">Total a Pagar</h5>
            <h3 class="text-success fw-bold mb-0">${{ formatPrice(totalPriceFromSelection) }}</h3>
          </div>
        </div>
      </template>

      <template #footer>
        <button class="btn btn-outline-secondary me-auto" @click="onClose" :disabled="purchaseLoading">
          Cancelar
        </button>
        
        <button
          class="btn btn-outline-success me-2"
          :disabled="isSelectionEmptyForModal || purchaseLoading"
          @click="proceedWithAction('carrito')"
        >
          <i class="fas fa-cart-plus me-1"></i> Al Carrito
        </button>
        
        <button
          class="btn btn-primary px-4 fw-bold"
          :disabled="isSelectionEmptyForModal || purchaseLoading"
          @click="proceedWithAction('comprar_ahora')"
        >
          <i class="fas fa-spinner fa-spin me-1" v-if="purchaseLoading"></i>
          <span v-else><i class="fas fa-credit-card me-1"></i> Ir a Pagar</span>
        </button>
      </template>
    </VueModal>

    <VueModal v-if="showRegisterModal" size="md" position="center" @close="closeRegisterModal">
      <template #title>Registro requerido</template>
      <template #body>
        <p>Debes estar logueado para adquirir entradas. ¿Deseas ingresar a tu cuenta?</p>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeRegisterModal">Cancelar</button>
        <button class="btn btn-primary" @click="goToRegister">Ir al Login</button>
      </template>
    </VueModal>
  </div>
</template>

<script>
import VueModal from '@/components/Modal/VueModal.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Modals',
  components: { VueModal },
  props: {
    showBuyModal: Boolean,
    showRegisterModal: Boolean,
    ticketSeleccionado: Object,
  },
  data() {
    return {
      selectedQuantities: {},
      purchaseLoading: false,
    }
  },
  computed: {
    ...mapGetters(['tipos', 'loadingTipos', 'errorTipos']),
    tiposPorEvento() {
      if (!this.ticketSeleccionado) return []
      return this.tipos.filter(t => t.id_evento === this.ticketSeleccionado.evento_id)
    },
    totalPriceFromSelection() {
      let total = 0
      if (this.tiposPorEvento && this.tiposPorEvento.length > 0) {
        this.tiposPorEvento.forEach((tipo) => {
          const cantidad = this.selectedQuantities[tipo.id_tipo_entrada] || 0
          if (cantidad > 0) {
            total += cantidad * parseFloat(tipo.precio)
          }
        })
      }
      return total
    },
    isSelectionEmptyForModal() {
      if (!this.tiposPorEvento || this.tiposPorEvento.length === 0) return true
      return Object.values(this.selectedQuantities).every((qty) => !qty || qty === 0)
    }
  },
  watch: {
    showBuyModal(newVal) {
      if (newVal && this.ticketSeleccionado) {
        this.fetchTipos(this.ticketSeleccionado.evento_id)
        this.selectedQuantities = {}
        this.purchaseLoading = false
      }
    }
  },
  methods: {
    ...mapActions(['fetchTipos', 'iniciarCompraAction', 'pagarOrden']),
    
    formatPrice(price) {
      if (!price) return '0';
      return Math.round(price).toLocaleString('es-AR');
    },

    onClose() {
      this.$emit('closeBuyModal')
    },

    incrementQuantity(tipo) {
      const currentQty = this.selectedQuantities[tipo.id_tipo_entrada] || 0
      if (currentQty < tipo.cantidad_disponible) {
        this.selectedQuantities[tipo.id_tipo_entrada] = currentQty + 1
        this.selectedQuantities = { ...this.selectedQuantities } 
      }
    },

    decrementQuantity(tipo) {
      const currentQty = this.selectedQuantities[tipo.id_tipo_entrada] || 0
      if (currentQty > 0) {
        this.selectedQuantities[tipo.id_tipo_entrada] = currentQty - 1
        if (this.selectedQuantities[tipo.id_tipo_entrada] === 0) {
          delete this.selectedQuantities[tipo.id_tipo_entrada]
        }
        this.selectedQuantities = { ...this.selectedQuantities } 
      }
    },

    // ✨ NUEVA FUNCIÓN: Arma la lista de items leyendo el State directamente
    buildItemsPayload() {
      const items = [];
      this.tiposPorEvento.forEach((tipo) => {
        const cantidad = this.selectedQuantities[tipo.id_tipo_entrada] || 0
        if (cantidad > 0) {
          items.push({
            id_tipo_entrada: tipo.id_tipo_entrada,
            nombre_tipo_original: tipo.nombre_tipo, 
            cantidad: cantidad,
            precio_unitario: parseFloat(tipo.precio)
          });
        }
      });
      return items;
    },

    // ✨ LA FUNCIÓN MAESTRA QUE EJECUTA LA COMPRA O GUARDA EN CARRITO
    async proceedWithAction(accion) {
      const itemsToConfirm = this.buildItemsPayload();

      if (itemsToConfirm.length === 0) return;

      this.purchaseLoading = true;

      // 🛒 ACCIÓN: AL CARRITO LOCAL
      if (accion === 'carrito') {
        try {
          const carritoLocal = JSON.parse(localStorage.getItem('carrito_entradas')) || [];
          const nuevaEntradaLocal = {
            id_local: Date.now(),
            evento_id: this.ticketSeleccionado.evento_id,
            evento: this.ticketSeleccionado.nombre_evento,
            fecha: this.ticketSeleccionado.fecha_hora_inicio,
            items: itemsToConfirm,
            total: this.totalPriceFromSelection
          };
          
          carritoLocal.push(nuevaEntradaLocal);
          localStorage.setItem('carrito_entradas', JSON.stringify(carritoLocal));
          
          if (this.$toast) this.$toast.success('¡Entradas guardadas en tu carrito!');
          this.onClose();
        } catch(e) {
          console.error("Error al guardar en carrito local", e);
        } finally {
          this.purchaseLoading = false;
        }
        return;
      }

      // ⚡ ACCIÓN: PAGAR AHORA
      const payload = {
        items: itemsToConfirm.map((item) => ({
          id_tipo_entrada: item.id_tipo_entrada,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        }))
      }

      try {
        const ordenCreada = await this.iniciarCompraAction(payload)
        if (this.$toast) this.$toast.info('Redirigiendo a Mercado Pago seguro...')
        
        const payloadMP = {
          orden_id: ordenCreada.id_orden,
          titulo_display: this.ticketSeleccionado.nombre_evento
        }
        
        const respuestaMP = await this.pagarOrden(payloadMP)
        
        if (respuestaMP && respuestaMP.sandbox_init_point) {
          window.location.href = respuestaMP.sandbox_init_point
        } else {
          throw new Error("No se obtuvo el link de Mercado Pago")
        }
      } catch (error) {
        if (this.$toast) this.$toast.error(error.message || 'Hubo un problema al procesar tu solicitud.')
      } finally {
        this.purchaseLoading = false;
      }
    },
    
    closeRegisterModal() {
      this.$emit('closeRegisterModal')
    },
    goToRegister() {
      this.$emit('goToRegister')
    }
  }
}
</script>