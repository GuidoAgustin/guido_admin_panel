<template>
  <Topbar />
  <div class="ticket-page-container">
    <div class="container pt-5">
      <div class="d-flex align-items-center justify-content-center mb-4 text-white">
        <i class="fa-solid fa-cart-shopping fa-2x me-3 text-primary"></i>
        <h2 class="mb-0">Mi Carrito y Mis Compras</h2>
      </div>
    </div>

    <div class="container pb-5">
      <div class="d-flex justify-content-center mb-5">
        <div class="btn-group shadow-sm" role="group">
          <button
            type="button"
            class="btn px-4 py-2 fw-bold"
            :class="tabActual === 'ticketing' ? 'btn-primary' : 'btn-outline-primary'"
            @click="cambiarTab('ticketing')"
          >
            🎟️ Entradas
          </button>
          <button
            type="button"
            class="btn px-4 py-2 fw-bold"
            :class="tabActual === 'ecommerce' ? 'btn-primary' : 'btn-outline-primary'"
            @click="cambiarTab('ecommerce')"
          >
            🛍️ Tienda
          </button>
          <button
            type="button"
            class="btn px-4 py-2 fw-bold"
            :class="tabActual === 'historial' ? 'btn-secondary' : 'btn-outline-secondary'"
            @click="cambiarTab('historial')"
          >
            📜 Historial
          </button>
        </div>
      </div>

      <div v-if="tabActual === 'ticketing'" class="animate__animated animate__fadeIn">
        
        <div class="mb-5">
          <h4 class="text-warning border-bottom border-secondary pb-2 mb-4">
            <i class="fa-solid fa-cart-shopping me-2"></i> Entradas por Pagar
          </h4>
          
          <div v-if="carritoLocalEntradas.length > 0" class="d-flex align-items-start mb-4 p-3" style="border-left: 4px solid #ffc107; background: transparent;">
            <i class="fa-solid fa-triangle-exclamation fa-2x me-3 text-warning"></i>
            <div>
              <strong class="d-block mb-1 text-warning">¡Importante! El carrito no reserva tu lugar.</strong>
              <small class="text-light opacity-75">El stock solo se asegura al confirmar el pago. Si el evento se agota o cierra ventas, estas entradas se eliminarán automáticamente.</small>
            </div>
          </div>

          <div v-if="carritoLocalEntradas.length === 0" class="text-center py-4 bg-dark rounded border border-secondary shadow-sm">
            <i class="fa-solid fa-cart-arrow-down fa-3x text-muted mb-3"></i>
            <h5 class="text-white">Tu carrito está vacío</h5>
            <p class="text-muted small mb-4">Asegurá tu lugar antes de que se agoten.</p>
            <button class="btn btn-primary rounded-pill px-4 fw-bold" @click="$router.push('/')">
              Explorar Eventos
            </button>
          </div>

          <div class="row" v-else>
            <div
              v-for="entrada in carritoLocalEntradas"
              :key="entrada.id_local"
              class="col-md-6 mb-3"
            >
              <div class="card shadow-sm border-0 ticket-card pendiente bg-dark text-white">
                <div class="card-body p-4">
                  <div class="d-flex justify-content-between mb-2 align-items-start">
                    <h5 class="card-title mb-0 fw-bold text-white">{{ entrada.evento }}</h5>
                    <button
                      class="btn btn-sm border-0 bg-transparent"
                      @click="eliminarDelCarritoLocal(entrada.id_local)"
                      title="Eliminar del carrito"
                      style="margin-top: -5px; margin-right: -5px; color: #ff4d4d;"
                    >
                      <i class="fa-solid fa-trash fa-lg"></i>
                    </button>
                  </div>
                  <p class="mb-1 text-muted small">
                    <i class="fa-regular fa-calendar me-2"></i>{{ formatearFecha(entrada.fecha) }}
                  </p>

                 <div class="mt-3 mb-4">
                    <div v-for="item in entrada.items" :key="item.id_tipo_entrada" class="mb-2" style="font-size: 0.95rem;">
                      <i class="fa-solid fa-ticket text-warning" style="margin-right: 8px;"></i>
                      <strong class="text-white">{{ item.cantidad }}x</strong> 
                      <span class="text-light" style="margin: 0 10px;">{{ item.nombre_tipo_original }}</span>
                      <span class="text-muted">(${{ formatPrice(item.precio_unitario) }} c/u)</span>
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary">
                    <h5 class="mb-0 fw-bold text-white">Total: <span class="text-success">${{ formatPrice(entrada.total) }}</span></h5>
                    <button
                      @click="iniciarPagoDesdeCarritoLocal(entrada)"
                      class="btn btn-success rounded-pill px-4 fw-bold shadow-sm"
                    >
                      Pagar Ahora <i class="fa-solid fa-arrow-right ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-5">
          <h4 class="text-success border-bottom border-secondary pb-2 mb-4">
            <i class="fa-solid fa-ticket me-2"></i> Mis Próximos Eventos
          </h4>
          
          <div v-if="entradasProximas.length === 0" class="text-white small px-2">
            No tenés eventos próximos confirmados.
          </div>

          <div class="row">
            <div
              v-for="entrada in entradasProximas.slice(0, limiteProximas)"
              :key="entrada.id"
              class="col-md-6 mb-3"
            >
              <div class="card shadow-sm border-0 ticket-card pagada bg-dark text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <h5 class="card-title mb-0 fw-bold">{{ entrada.evento }}</h5>
                    <span class="badge bg-success d-flex align-items-center"><i class="fas fa-check-circle me-1"></i> Confirmado</span>
                  </div>
                  <p class="mb-1 text-muted small">
                    <i class="fa-regular fa-calendar me-2"></i>{{ formatearFecha(entrada.fecha) }}
                  </p>
                  
                  <p class="mb-3 text-muted small">
                    <i class="fa-solid fa-hashtag me-2"></i>Ticket ID:
                    <strong class="text-white">{{ shortCode(entrada.codigo) }}</strong>
                  </p>
                  
                  <div class="border-top border-secondary pt-3 mt-3 text-end">
                    <button
                      @click="descargarTicket(entrada.codigo)"
                      class="btn rounded-pill px-4 btn-sm w-100 fw-bold shadow-sm"
                      style="background-color: #2c3e38; color: #e9ecef; border: 1px solid #3d564e;"
                    >
                      <i class="fa-solid fa-file-pdf me-2 text-danger"></i> Descargar PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-3" v-if="entradasProximas.length > limiteProximas">
            <button class="btn btn-outline-success rounded-pill px-4" @click="limiteProximas += 4">
              Ver más eventos <i class="fa-solid fa-angle-down ms-1"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="tabActual === 'ecommerce'" class="animate__animated animate__fadeIn">
        <div class="mb-5">
          <h4 class="text-warning border-bottom border-secondary pb-2 mb-4">
            <i class="fa-solid fa-cart-shopping me-2"></i> Carrito de Compras
          </h4>
          
          <div v-if="productosEnCarrito.length === 0" class="text-center py-4 bg-dark rounded border border-secondary shadow-sm">
            <i class="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
            <h5 class="text-white">No hay productos en tu carrito</h5>
            <button class="btn btn-primary rounded-pill px-4 fw-bold mt-2" @click="$router.push('/tienda')">
              Ir a la Tienda
            </button>
          </div>

          <div class="row">
            <div v-for="prod in productosEnCarrito" :key="prod.id" class="col-md-6 mb-3">
              <div class="card shadow-sm border-0 product-card pendiente bg-dark text-white">
                <div class="card-body d-flex align-items-center py-3">
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold text-warning">{{ prod.nombre }}</h6>
                    <span class="small text-muted">Cant: {{ prod.cantidad }} | <strong class="text-white">${{ formatPrice(prod.total) }}</strong></span>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-danger">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                    <button @click="iniciarPago(prod, 'producto')" class="btn btn-sm btn-success fw-bold">
                      Pagar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-5">
          <h4 class="text-info border-bottom border-secondary pb-2 mb-4">
            <i class="fa-solid fa-truck-fast me-2"></i> Pedidos en Curso
          </h4>
          <div v-if="productosActivos.length === 0" class="text-white small px-2">
            No tenés pedidos en preparación.
          </div>

          <div class="row">
            <div
              v-for="pedido in productosActivos.slice(0, limitePedidos)"
              :key="pedido.id"
              class="col-md-6 mb-3"
            >
              <div class="card shadow-sm border-0 product-card activa bg-dark text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <h6 class="card-title mb-0 fw-bold">Pedido #{{ pedido.id }}</h6>
                    <span class="badge bg-info text-dark">{{ pedido.estado_envio }}</span>
                  </div>
                  <p class="mb-0 small text-muted">Comprado el: {{ formatearFecha(pedido.fecha) }}</p>
                  <div class="progress mt-3" style="height: 6px">
                    <div class="progress-bar bg-info" role="progressbar" style="width: 75%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tabActual === 'historial'" class="animate__animated animate__fadeIn">
        <div class="row mb-4 align-items-center bg-dark text-white p-3 rounded border border-secondary mx-0 shadow-sm">
          <div class="col-md-6">
            <p class="mb-0 fw-bold"><i class="fa-solid fa-filter me-2 text-primary"></i>Filtrar movimientos:</p>
          </div>
          <div class="col-md-6 d-flex justify-content-md-end mt-2 mt-md-0">
            <select class="form-select w-auto shadow-sm bg-secondary text-white border-0" v-model="filtroAnio">
              <option value="ultimos_6_meses">Últimos 6 meses</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        <div v-if="entradasPasadas.length === 0 && productosPasados.length === 0" class="text-center py-5 bg-dark rounded border border-secondary">
          <i class="fa-solid fa-folder-open fa-3x text-muted mb-3"></i>
          <h5 class="text-white">Tu historial está vacío</h5>
          <p class="text-muted small mb-0">Aún no tenés eventos asistidos ni pedidos entregados.</p>
        </div>

        <div class="row" v-else>
          <div v-if="entradasPasadas.length > 0" :class="productosPasados.length === 0 ? 'col-12' : 'col-md-6'" class="mb-4">
            <h5 class="text-light border-bottom border-secondary pb-2 mb-3">
              <i class="fa-solid fa-ticket me-2 text-muted"></i> Eventos Asistidos
            </h5>

            <div
              v-for="entrada in entradasPasadas.slice(0, limiteHistorial)"
              :key="entrada.id"
              class="card border border-secondary bg-dark text-white ticket-card historial mb-2"
            >
              <div class="card-body py-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-bold">{{ entrada.evento }}</span>
                  <span class="badge" :class="entrada.estado === 'cancelada' ? 'bg-danger' : 'bg-secondary'">
                    {{ entrada.estado === 'cancelada' ? 'Cancelada' : 'Utilizada' }}
                  </span>
                </div>
                <span class="small text-muted"><i class="fa-regular fa-calendar me-1"></i> {{ formatearFecha(entrada.fecha) }}</span>
              </div>
            </div>
          </div>

          <div v-if="productosPasados.length > 0" :class="entradasPasadas.length === 0 ? 'col-12' : 'col-md-6'" class="mb-4">
            <h5 class="text-light border-bottom border-secondary pb-2 mb-3">
              <i class="fa-solid fa-box-open me-2 text-muted"></i> Pedidos Entregados
            </h5>

            <div
              v-for="pedido in productosPasados.slice(0, limiteHistorial)"
              :key="pedido.id"
              class="card border border-secondary bg-dark text-white product-card historial mb-2"
            >
              <div class="card-body py-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-bold">Pedido #{{ pedido.id }}</span>
                  <span class="badge bg-secondary"><i class="fas fa-check me-1"></i> Entregado</span>
                </div>
                <span class="small text-muted"><i class="fa-regular fa-calendar-check me-1"></i> {{ formatearFecha(pedido.fecha_entrega || pedido.fecha) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-4" v-if="entradasPasadas.length > limiteHistorial || productosPasados.length > limiteHistorial">
          <button class="btn btn-outline-light rounded-pill px-4" @click="limiteHistorial += 5">
            Cargar más movimientos <i class="fa-solid fa-angle-down ms-1"></i>
          </button>
        </div>
      </div>
    </div>
    <SiteFooter />
  </div>
</template>

<script>
import SiteFooter from '@/components/SiteFooter.vue'
import Topbar from '@/components/Topbar.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'MiCarrito',
  components: { Topbar, SiteFooter },
  data() {
    return {
      tabActual: 'ticketing',
      filtroAnio: 'ultimos_6_meses',
      cargando: false,

      limiteHistorial: 5,
      limiteProximas: 4,
      limitePedidos: 4,

      carritoLocalEntradas: [],
      entradasProximas: [],
      entradasPasadas: [],
      productosActivos: [],
      productosPasados: []
    }
  },
  computed: {
    ...mapGetters(['entradasEnCarrito', 'productosEnCarrito'])
  },
  async mounted() {
    await this.cargarPantalla()

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('pago') === 'exito' && urlParams.get('orden_id')) {
      await this.finalizarProcesoDePago(urlParams.get('orden_id'))
    }
  },
  methods: {
    async finalizarProcesoDePago(orden_id) {
      this.$store.commit('SHOW_LOADER')
      try {
        await this.$clients.api.post('mercadopago/confirmar-pago', { orden_id })
        if (this.$toast) this.$toast.success('¡Pago confirmado!')
        this.$router.replace({ query: {} })
        await this.cargarPantalla()
      } catch (e) {
        if (this.$toast) this.$toast.error('Error al confirmar el pago')
      } finally {
        this.$store.commit('HIDE_LOADER')
      }
    },

    async cargarPantalla() {
      this.cargando = true
      try {
        if (this.tabActual === 'ticketing') {
          const datos = await this.$store.dispatch('obtenerEntradasActivasAction')
          this.entradasProximas = datos.entradasProximas || []
          this.carritoLocalEntradas = JSON.parse(localStorage.getItem('carrito_entradas')) || []
        } else if (this.tabActual === 'ecommerce') {
          const datos = await this.$store.dispatch('obtenerTiendaActivaAction')
          this.productosActivos = datos.productosActivos || []
        } else if (this.tabActual === 'historial') {
          const datos = await this.$store.dispatch('obtenerHistorialAction')
          this.entradasPasadas = datos.entradasPasadas || []
          this.productosPasados = datos.productosPasados || []
        }
      } catch (error) {
        console.error('Error al cargar la pestaña:', error)
        if (this.$toast) this.$toast.error('Error al sincronizar datos.')
      } finally {
        this.cargando = false
      }
    },

    cambiarTab(nuevaTab) {
      this.tabActual = nuevaTab
      this.cargarPantalla()
    },

    eliminarDelCarritoLocal(id_local) {
      let carrito = JSON.parse(localStorage.getItem('carrito_entradas')) || []
      carrito = carrito.filter((item) => item.id_local !== id_local)
      localStorage.setItem('carrito_entradas', JSON.stringify(carrito))
      this.carritoLocalEntradas = carrito 
      if (this.$toast) this.$toast.success('Entradas removidas del carrito')
    },

    async iniciarPagoDesdeCarritoLocal(entrada) {
      this.$store.commit('SHOW_LOADER')
      try {
        const payloadCompra = {
          items: entrada.items.map((item) => ({
            id_tipo_entrada: item.id_tipo_entrada,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario
          }))
        }
        const ordenCreada = await this.$store.dispatch('iniciarCompraAction', payloadCompra)

        const payloadMP = {
          orden_id: ordenCreada.id_orden,
          titulo_display: entrada.evento
        }
        const respuestaMP = await this.$store.dispatch('pagarOrden', payloadMP)

        this.eliminarDelCarritoLocal(entrada.id_local)

        if (respuestaMP && respuestaMP.sandbox_init_point) {
          window.location.href = respuestaMP.sandbox_init_point
        } else {
          throw new Error('No se obtuvo el link de Mercado Pago')
        }
      } catch (error) {
        console.error('Error al procesar compra desde el carrito:', error)
        if (this.$toast) this.$toast.error(error.message || 'Hubo un problema al iniciar el pago.')
      } finally {
        this.$store.commit('HIDE_LOADER')
      }
    },

    async iniciarPago(item, tipo) {
      this.$store.commit('SHOW_LOADER')
      try {
        const payload = {
          orden_id: item.id,
          titulo_display: tipo === 'entrada' ? item.evento : item.nombre
        }
        const respuestaMP = await this.$store.dispatch('pagarOrden', payload)
        window.location.href = respuestaMP.sandbox_init_point
      } catch (error) {
        if (this.$errorHandler) {
          this.$errorHandler(error)
        } else {
          alert('Hubo un problema al iniciar el pago.')
        }
      } finally {
        this.$store.commit('HIDE_LOADER')
      }
    },

    async descargarTicket(codigo_unico) {
      this.$store.commit('SHOW_LOADER')
      try {
        const blob = await this.$store.dispatch('descargarTicketAction', codigo_unico)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Ticket-${this.shortCode(codigo_unico)}.pdf`)

        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)

        if (this.$toast) this.$toast.success('¡Ticket descargado con éxito! 🎟️')
      } catch (error) {
        if (this.$toast) this.$toast.error('Uy, no pudimos descargar el ticket. Intentá de nuevo.')
      } finally {
        this.$store.commit('HIDE_LOADER')
      }
    },

    // ✨ UX: CÓDIGO CORTO
    shortCode(uuid) {
      if(!uuid) return 'N/A';
      return uuid.split('-')[0].toUpperCase();
    },

    // ✨ UX: PRECIOS LIMPIOS
    formatPrice(price) {
      if (!price) return '0';
      return Math.round(price).toLocaleString('es-AR');
    },

    // ✨ UX: FECHAS EN ESPAÑOL
    formatearFecha(fechaString) {
      if (!fechaString) return 'Fecha desconocida'
      const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      return new Date(fechaString).toLocaleDateString('es-AR', opciones)
    }
  }
}
</script>

<style scoped>
.ticket-page-container {
  background-color: #1a332a !important;
  color: #ffffff;
  min-height: 100vh;
}

.pt-5 {
  padding-top: 4rem !important;
}

.animate__fadeIn {
  animation: fadeIn 0.3s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ticket-card,
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none !important; 
  border-left: 4px solid transparent !important;
}
.ticket-card:hover:not(.historial),
.product-card:hover:not(.historial) {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2) !important;
}

.pendiente {
  border-left-color: #ffc107 !important;
}
.pagada {
  border-left-color: #198754 !important;
}
.activa {
  border-left-color: #0dcaf0 !important;
}
.historial {
  border-left-color: #6c757d !important;
}
</style>