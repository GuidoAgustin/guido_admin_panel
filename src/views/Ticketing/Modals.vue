<template>
  <div>
    <!-- Modal de compra -->
    <VueModal
      v-if="showBuyModal"
      size="md"
      position="center"
      @close="onClose"
    >
      <template #title>Compra de Entrada</template>

      <template #body>
        <div v-if="loadingTipos" class="text-center">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Cargando tipos de entrada...</p>
        </div>

        <div v-else-if="errorTipos" class="text-danger">
          {{ errorTipos }}
        </div>

        <div v-else>
          <p>
            Estás comprando para el evento:
            <strong>{{ ticketSeleccionado.nombre_evento }}</strong>
          </p>

          <!-- Selector de tipo de entrada -->
          <div class="form-group">
            <label for="tipoSelect">Tipo de entrada</label>
            <select
              id="tipoSelect"
              class="form-control"
              v-model="selectedTipo"
            >
              <option disabled value="">-- Elige un tipo --</option>
              <option
                v-for="tipo in tipos"
                :key="tipo.id_tipo_entrada"
                :value="tipo"
              >
                {{ tipo.nombre_tipo }} -
                ${{ Number(tipo.precio).toFixed(2) }} (
                Disponibles: {{ tipo.cantidad_disponible }} )
              </option>
            </select>
          </div>

          <!-- Selector de cantidad -->
          <div class="form-group" v-if="selectedTipo">
            <label for="cantidadSelect">
              Cantidad (máx {{ selectedTipo.cantidad_disponible }}):
            </label>
            <select
              id="cantidadSelect"
              class="form-control"
              v-model.number="cantidad"
            >
              <option
                v-for="n in selectedTipo.cantidad_disponible"
                :key="n"
                :value="n"
              >
                {{ n }}
              </option>
            </select>
          </div>
        </div>
      </template>

      <template #footer>
        <button class="btn btn-secondary" @click="onClose">
          Cancelar
        </button>
        <button
          class="btn btn-primary"
          :disabled="!selectedTipo || cantidad < 1"
          @click="confirmPurchase"
        >
          Confirmar Compra
        </button>
      </template>
    </VueModal>

    <!-- Modal para pedir registro -->
    <VueModal
      v-if="showRegisterModal"
      size="md"
      position="center"
      @close="closeRegisterModal"
    >
      <template #title>Registro requerido</template>
      <template #body>
        <p>
          Debes estar registrado para comprar una entrada.
          ¿Deseas registrarte?
        </p>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeRegisterModal">
          Cancelar
        </button>
        <button class="btn btn-primary" @click="goToRegister">
          Registrarme
        </button>
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
  emits: ['closeBuyModal', 'closeRegisterModal', 'goToRegister'],
  data() {
    return {
      selectedTipo: '',
      cantidad: 1
    }
  },
  computed: {
    ...mapGetters('eventos', [
      'tipos',
      'loadingTipos',
      'errorTipos'
    ])
  },
  watch: {
    showBuyModal(newVal) {
      if (newVal && this.ticketSeleccionado) {
        this.fetchTipos(this.ticketSeleccionado.evento_id)
        this.selectedTipo = ''
        this.cantidad = 1
      }
    }
  },
  methods: {
    ...mapActions('eventos', ['fetchTipos']),
    onClose() {
      this.$emit('closeBuyModal')
    },
    confirmPurchase() {
      // Aquí podrías despachar la acción de compra, por ejemplo:
      // this.$store.dispatch('ventas/checkout', {
      //   evento_id: this.ticketSeleccionado.evento_id,
      //   tipo_id: this.selectedTipo.id_tipo_entrada,
      //   cantidad: this.cantidad
      // })
      console.log({
        evento_id: this.ticketSeleccionado.evento_id,
        tipo_id: this.selectedTipo.id_tipo_entrada,
        cantidad: this.cantidad
      })
      this.onClose()
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

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
