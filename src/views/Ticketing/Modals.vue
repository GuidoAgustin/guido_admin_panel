<template>
  <div>
    <VueModal
      v-if="showBuyModal"
      size="md"
      position="center"
      @close="onClose"
      :prevent-close-on-esc="showConfirmPurchaseModal"
      :prevent-close-on-overlay-click="showConfirmPurchaseModal"
    >
      <template #title>
        {{ tipoAccion === 'carrito' ? 'Agregar al Carrito:' : 'Comprar Entradas para:' }} {{ ticketSeleccionado?.nombre_evento }}
      </template>
      <template #body>
        <div v-if="loadingTipos" class="text-center my-3">
          <i class="fas fa-spinner fa-spin fa-2x"></i>
          <p class="mt-2">Cargando tipos de entrada...</p>
        </div>
        <div v-else-if="errorTipos" class="alert alert-danger">
          {{ errorTipos }}
        </div>
        <div v-else-if="!tiposPorEvento || tiposPorEvento.length === 0" class="alert alert-info">
          No hay tipos de entrada disponibles para este evento en este momento.
        </div>
        <div v-else>
          <p>Selecciona la cantidad para cada tipo de entrada que desees adquirir:</p>

          <div
            v-for="tipo in tiposPorEvento"
            :key="tipo.id_tipo_entrada"
            class="mb-3 p-3 border rounded shadow-sm"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div class="flex-grow-1">
                <h5>{{ tipo.nombre_tipo }}</h5>
                <p class="mb-1">
                  Precio: <strong>${{ Number(tipo.precio).toFixed(2) }}</strong>
                </p>
                <p class="mb-1 text-muted">
                  <small>Disponibles: {{ tipo.cantidad_disponible }}</small>
                </p>
              </div>
              <div class="d-flex align-items-center" style="min-width: 120px">
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click="decrementQuantity(tipo)"
                  :disabled="
                    (selectedQuantities[tipo.id_tipo_entrada] || 0) === 0 || purchaseLoading
                  "
                  aria-label="Disminuir cantidad"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <span
                  class="mx-2 px-2 border rounded"
                  style="
                    min-width: 40px;
                    text-align: center;
                    display: inline-block;
                    padding-top: 0.25rem;
                    padding-bottom: 0.25rem;
                  "
                >
                  {{ selectedQuantities[tipo.id_tipo_entrada] || 0 }}
                </span>
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click="incrementQuantity(tipo)"
                  :disabled="
                    (selectedQuantities[tipo.id_tipo_entrada] || 0) >= tipo.cantidad_disponible ||
                    tipo.cantidad_disponible === 0 ||
                    purchaseLoading
                  "
                  aria-label="Aumentar cantidad"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
            <div v-if="tipo.descripcion_adicional" class="mt-2 pt-2 border-top">
              <small><strong>Info adicional:</strong> {{ tipo.descripcion_adicional }}</small>
            </div>
          </div>

          <div v-if="totalPriceFromSelection > 0" class="mt-4 pt-3 border-top text-right">
            <h4>Total a Pagar: ${{ totalPriceFromSelection.toFixed(2) }}</h4>
          </div>
          <div
            v-if="isSelectionEmptyForModal && !purchaseLoading && tiposPorEvento.length > 0"
            class="mt-3 alert alert-warning text-center"
          >
            Por favor, selecciona la cantidad de al menos un tipo de entrada.
          </div>
        </div>
      </template>

      <template #footer>
        <button class="btn btn-secondary" @click="onClose">Cancelar</button>
        <button
          class="btn btn-primary"
          :disabled="isSelectionEmptyForModal || purchaseLoading"
          @click="openConfirmationModal"
        >
          <i class="fas fa-spinner fa-spin" v-if="purchaseLoading"></i>
          {{ purchaseLoading ? 'Procesando...' : 'Confirmar' }}
        </button>
      </template>
    </VueModal>

    <VueModal
      v-if="showConfirmPurchaseModal"
      size="md"
      position="center"
      @close="cancelPurchaseConfirmation"
    >
      <template #title>Confirmar tu Elección</template>
      <template #body>
        <p>Estás a punto de procesar las siguientes entradas:</p>
        <ul class=" pl-3">
          <li v-for="item in itemsToConfirm" :key="item.id_tipo_entrada">
            <strong>{{ item.cantidad }}x</strong> {{ item.nombre_tipo_original }}
            <em>(${{ Number(item.precio_unitario).toFixed(2) }} c/u)</em>
          </li>
        </ul>
        <hr />
        <h5 class="text-right ">Total Final: ${{ totalConfirmationPrice.toFixed(2) }}</h5>
      </template>
      <template #footer>
        <button
          class="btn btn-secondary"
          @click="cancelPurchaseConfirmation"
          :disabled="purchaseLoading"
        >
         Modificar
        </button>
        <button
          class="btn btn-success"
          @click="proceedWithFinalPurchase"
          :disabled="purchaseLoading"
        >
          <i class="fas fa-spinner fa-spin" v-if="purchaseLoading"></i>
          <span v-else-if="tipoAccion === 'carrito'">Sí, Agregar al Carrito</span>
          <span v-else>Sí, Pagar en Mercado Pago</span>
        </button>
      </template>
    </VueModal>

    <VueModal v-if="showRegisterModal" size="md" position="center" @close="closeRegisterModal">
      <template #title>Registro requerido</template>
      <template #body>
        <p>Debes estar logueado para adquirir entradas. ¿Deseas ingresar?</p>
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
    tipoAccion: String // RECIBIMOS LA NUEVA PROP DESDE TICKETING.VUE
  },
  data() {
    return {
      selectedQuantities: {},
      purchaseLoading: false,
      showConfirmPurchaseModal: false, 
      itemsToConfirm: [] 
    }
  },
  computed: {
    ...mapGetters(['tipos', 'loadingTipos', 'errorTipos']),
    tiposPorEvento() {
      if (!this.ticketSeleccionado) return []
      return this.tipos.filter(
        t => t.id_evento === this.ticketSeleccionado.evento_id
      )
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
    },
    totalConfirmationPrice() {
      return this.itemsToConfirm.reduce(
        (acc, item) => acc + item.cantidad * item.precio_unitario,
        0
      )
    }
  },
  watch: {
    showBuyModal(newVal) {
      if (newVal && this.ticketSeleccionado) {
        this.fetchTipos(this.ticketSeleccionado.evento_id)
        this.selectedQuantities = {}
        this.purchaseLoading = false
        this.showConfirmPurchaseModal = false 
        this.itemsToConfirm = []
      }
    }
  },
  methods: {
    // AGREGAMOS pagarOrden A LAS ACCIONES IMPORTADAS
    ...mapActions(['fetchTipos', 'iniciarCompraAction', 'pagarOrden']),
    
    onClose() {
      this.$emit('closeBuyModal')
      this.showConfirmPurchaseModal = false 
      this.itemsToConfirm = []
    },
    incrementQuantity(tipo) {
      const currentQty = this.selectedQuantities[tipo.id_tipo_entrada] || 0
      if (currentQty < tipo.cantidad_disponible) {
        this.selectedQuantities[tipo.id_tipo_entrada] = currentQty + 1
        this.selectedQuantities = { ...this.selectedQuantities } 
      } else {
        if (this.$toast)
          this.$toast.info(
            `Máximo ${tipo.cantidad_disponible} entradas disponibles para ${tipo.nombre_tipo}.`
          )
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
    openConfirmationModal() {
      this.itemsToConfirm = [] 
      if (this.tiposPorEvento && this.tiposPorEvento.length > 0) {
        this.tiposPorEvento.forEach((tipo) => {
          const cantidad = this.selectedQuantities[tipo.id_tipo_entrada] || 0
          if (cantidad > 0) {
            if (cantidad > tipo.cantidad_disponible) {
              if (this.$toast)
                this.$toast.error(
                  `No hay suficientes entradas (${tipo.cantidad_disponible}) disponibles para ${tipo.nombre_tipo}. Has seleccionado ${cantidad}.`
                )
              this.itemsToConfirm = [] 
              return 
            }
            this.itemsToConfirm.push({
              id_tipo_entrada: tipo.id_tipo_entrada,
              nombre_tipo_original: tipo.nombre_tipo, 
              cantidad: cantidad,
              precio_unitario: parseFloat(tipo.precio)
            })
          }
        })
      }

      if (this.itemsToConfirm.length === 0) {
        if (this.$toast)
          this.$toast.info('Por favor, selecciona la cantidad de al menos un tipo de entrada.')
        return
      }
      this.showConfirmPurchaseModal = true 
    },
    cancelPurchaseConfirmation() {
      this.showConfirmPurchaseModal = false
      this.itemsToConfirm = [] 
    },

    // LA FUNCIÓN ESTRELLA QUE DECIDE A DÓNDE VAMOS
    async proceedWithFinalPurchase() {
      if (this.itemsToConfirm.length === 0) {
        if (this.$toast) this.$toast.error('No hay ítems para confirmar.')
        this.showConfirmPurchaseModal = false
        return
      }

      this.purchaseLoading = true

      // 🛒 CASO 1: ELIGIÓ "AL CARRITO" (SOLO VISUAL, NO TOCA STOCK)
      if (this.tipoAccion === 'carrito') {
        try {
          const carritoLocal = JSON.parse(localStorage.getItem('carrito_entradas')) || [];
          
          // Armamos un paquete visual para guardar en su navegador
          const nuevaEntradaLocal = {
            id_local: Date.now(), // Un ID temporal
            evento_id: this.ticketSeleccionado.evento_id,
            evento: this.ticketSeleccionado.nombre_evento,
            fecha: this.ticketSeleccionado.fecha_hora_inicio,
            items: this.itemsToConfirm,
            total: this.totalConfirmationPrice
          };
          
          carritoLocal.push(nuevaEntradaLocal);
          localStorage.setItem('carrito_entradas', JSON.stringify(carritoLocal));
          
          if (this.$toast) this.$toast.success('¡Entradas guardadas en tu carrito para más tarde!');
          this.onClose(); // Cerramos el modal
        } catch(e) {
          console.error("Error al guardar en carrito local", e);
        } finally {
          this.purchaseLoading = false;
        }
        return; // ¡CORTAMOS ACÁ! No llama a iniciarCompraAction ni descuenta stock de tu DB
      }

      // ⚡ CASO 2: ELIGIÓ "COMPRAR AHORA" (CREA LA ORDEN, DESCUENTA STOCK Y VA A MP)
      const payload = {
        items: this.itemsToConfirm.map((item) => ({
          id_tipo_entrada: item.id_tipo_entrada,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        }))
      }

      try {
        const ordenCreada = await this.iniciarCompraAction(payload) // <-- Acá SÍ descuenta stock

        if (this.$toast) this.$toast.info('Redirigiendo a Mercado Pago...')
        
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
        this.purchaseLoading = false
        this.showConfirmPurchaseModal = false 
        this.itemsToConfirm = []
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