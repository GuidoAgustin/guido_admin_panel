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
      <template #title>Comprar Entradas para: {{ ticketSeleccionado?.nombre_evento }}</template>
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
          <p>Selecciona la cantidad para cada tipo de entrada que desees comprar:</p>

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
      <template #title>Confirmar tu Compra</template>
      <template #body>
        <p>Estás a punto de comprar las siguientes entradas:</p>
        <ul class=" pl-3">
          <li v-for="item in itemsToConfirm" :key="item.id_tipo_entrada">
            <strong>{{ item.cantidad }}x</strong> {{ item.nombre_tipo_original }}
            <em>(${{ Number(item.precio_unitario).toFixed(2) }} c/u)</em>
          </li>
        </ul>
        <hr />
        <h5 class="text-right ">Total Final: ${{ totalConfirmationPrice.toFixed(2) }}</h5>
        <p class="mt-3">¿Deseas proceder con la compra?</p>
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
          Sí, Comprar Ahora
        </button>
      </template>
    </VueModal>

    <VueModal v-if="showRegisterModal" size="md" position="center" @close="closeRegisterModal">
      <template #title>Registro requerido</template>
      <template #body>
        <p>Debes estar registrado para comprar una entrada. ¿Deseas registrarte?</p>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeRegisterModal">Cancelar</button>
        <button class="btn btn-primary" @click="goToRegister">Registrarme</button>
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
    ticketSeleccionado: Object
  },
  data() {
    return {
      selectedQuantities: {},
      purchaseLoading: false,
      showConfirmPurchaseModal: false, // Nuevo estado para el modal de confirmación
      itemsToConfirm: [] // Ítems para mostrar en el modal de confirmación
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
      // Renombrado para claridad, usado en el modal de selección
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
      // Renombrado para claridad
      if (!this.tiposPorEvento || this.tiposPorEvento.length === 0) return true
      return Object.values(this.selectedQuantities).every((qty) => !qty || qty === 0)
    },
    totalConfirmationPrice() {
      // Para el modal de confirmación
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
        this.showConfirmPurchaseModal = false // Asegurarse que el de confirmación esté cerrado
        this.itemsToConfirm = []
      }
    }
  },
  methods: {
    ...mapActions(['fetchTipos', 'iniciarCompraAction']),
    onClose() {
      this.$emit('closeBuyModal')
      this.showConfirmPurchaseModal = false // Asegurar cierre del modal de confirmación también
      this.itemsToConfirm = []
    },
    incrementQuantity(tipo) {
      const currentQty = this.selectedQuantities[tipo.id_tipo_entrada] || 0
      if (currentQty < tipo.cantidad_disponible) {
        this.selectedQuantities[tipo.id_tipo_entrada] = currentQty + 1
        this.selectedQuantities = { ...this.selectedQuantities } // Forzar reactividad
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
        this.selectedQuantities = { ...this.selectedQuantities } // Forzar reactividad
      }
    },
    openConfirmationModal() {
      // Renombrado desde confirmPurchase
      this.itemsToConfirm = [] // Limpiar primero
      if (this.tiposPorEvento && this.tiposPorEvento.length > 0) {
        this.tiposPorEvento.forEach((tipo) => {
          const cantidad = this.selectedQuantities[tipo.id_tipo_entrada] || 0
          if (cantidad > 0) {
            if (cantidad > tipo.cantidad_disponible) {
              if (this.$toast)
                this.$toast.error(
                  `No hay suficientes entradas (${tipo.cantidad_disponible}) disponibles para ${tipo.nombre_tipo}. Has seleccionado ${cantidad}.`
                )
              this.itemsToConfirm = [] // Vaciar si hay error para no mostrar confirmación
              return // Salir del forEach
            }
            this.itemsToConfirm.push({
              id_tipo_entrada: tipo.id_tipo_entrada,
              nombre_tipo_original: tipo.nombre_tipo, // Guardar nombre para mostrar
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
      this.showConfirmPurchaseModal = true // Mostrar el modal de confirmación
    },
    cancelPurchaseConfirmation() {
      this.showConfirmPurchaseModal = false
      this.itemsToConfirm = [] // Limpiar items
    },
    async proceedWithFinalPurchase() {
      if (this.itemsToConfirm.length === 0) {
        // Esto no debería pasar si el botón está deshabilitado, pero por si acaso
        if (this.$toast) this.$toast.error('No hay ítems para confirmar.')
        this.showConfirmPurchaseModal = false
        return
      }

      this.purchaseLoading = true
      // El payload para iniciarCompraAction solo necesita id_tipo_entrada, cantidad, precio_unitario
      const payload = {
        items: this.itemsToConfirm.map((item) => ({
          id_tipo_entrada: item.id_tipo_entrada,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        }))
      }

      try {
        const ordenCreada = await this.iniciarCompraAction(payload)
        if (this.$toast)
          this.$toast.success(
            `¡Proceso de compra iniciado! Orden ID: ${ordenCreada.id_orden}. Estado: ${ordenCreada.estado_pago}`
          )
        this.onClose() // Cierra el modal de compra principal
      } catch (error) {
        if (this.$toast)
          this.$toast.error(error.message || 'Hubo un problema al procesar tu compra.')
      } finally {
        this.purchaseLoading = false
        this.showConfirmPurchaseModal = false // Asegurar que se cierra
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


