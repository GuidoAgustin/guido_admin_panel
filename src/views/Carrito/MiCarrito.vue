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
            @click="tabActual = 'ticketing'"
          >
            🎟️ Entradas
          </button>
          <button 
            type="button" 
            class="btn px-4 py-2 fw-bold" 
            :class="tabActual === 'ecommerce' ? 'btn-primary' : 'btn-outline-primary'"
            @click="tabActual = 'ecommerce'"
          >
            🛍️ Tienda
          </button>
          <button 
            type="button" 
            class="btn px-4 py-2 fw-bold" 
            :class="tabActual === 'historial' ? 'btn-secondary' : 'btn-outline-secondary'"
            @click="tabActual = 'historial'"
          >
            📜 Historial
          </button>
        </div>
      </div>
      
      <div v-if="tabActual === 'ticketing'" class="animate__animated animate__fadeIn">
        <div class="mb-5">
          <h4 class="text-warning border-bottom pb-2 mb-3"><i class="fa-solid fa-clock-rotate-left me-2"></i> Reservas Pendientes</h4>
          <div v-if="entradasEnCarrito.length === 0" class="text-white small">No tenés entradas pendientes de pago.</div>
          
          <div class="row">
            <div v-for="entrada in entradasEnCarrito" :key="entrada.id" class="col-md-6 mb-3">
              <div class="card shadow-sm border-0 ticket-card pendiente bg-dark text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <h6 class="card-title mb-0 fw-bold">{{ entrada.evento }}</h6>
                    <span class="badge bg-warning text-dark">Pendiente</span>
                  </div>
                  <p class="mb-1 small"><i class="fa-regular fa-calendar me-2"></i>{{ entrada.fecha }}</p>
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <h6 class="mb-0 fw-bold text-success">${{ entrada.total }}</h6>
                    <button @click="iniciarPago(entrada, 'entrada')" class="btn btn-success btn-sm rounded-pill px-3">Pagar <i class="fa-solid fa-arrow-right ms-1"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-5">
          <h4 class="text-success border-bottom pb-2 mb-3"><i class="fa-solid fa-ticket me-2"></i> Mis Próximos Eventos</h4>
          <div v-if="entradasProximas.length === 0" class="text-white small">No tenés eventos próximos.</div>
          
          <div class="row">
            <div v-for="entrada in entradasProximas" :key="entrada.id" class="col-md-6 mb-3">
              <div class="card shadow-sm border-0 ticket-card pagada bg-dark text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <h6 class="card-title mb-0 fw-bold">{{ entrada.evento }}</h6>
                    <span class="badge bg-success">Confirmado</span>
                  </div>
                  <p class="mb-1 small"><i class="fa-regular fa-calendar me-2"></i>{{ entrada.fecha }}</p>
                  <p class="mb-1 small"><i class="fa-solid fa-qrcode me-2"></i>Código: <strong>{{ entrada.codigo }}</strong></p>
                  <div class="text-end mt-2">
                    <button class="btn btn-outline-success btn-sm rounded-pill px-3"><i class="fa-solid fa-eye me-1"></i> Ver Entrada</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tabActual === 'ecommerce'" class="animate__animated animate__fadeIn">
        <div class="mb-5">
          <h4 class="text-warning border-bottom pb-2 mb-3"><i class="fa-solid fa-cart-shopping me-2"></i> Carrito de Compras</h4>
          <div v-if="productosEnCarrito.length === 0" class="text-white small">Tu carrito está vacío.</div>
          
          <div class="row">
            <div v-for="prod in productosEnCarrito" :key="prod.id" class="col-md-6 mb-3">
              <div class="card shadow-sm border-0 product-card pendiente bg-dark text-white">
                <div class="card-body d-flex align-items-center py-2">
                  <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">{{ prod.nombre }}</h6>
                    <span class="small">Cant: {{ prod.cantidad }} | ${{ prod.total }}</span>
                  </div>
                  <div>
                    <button class="btn btn-sm btn-outline-danger me-2"><i class="fa-solid fa-trash"></i></button>
                    <button @click="iniciarPago(prod, 'producto')" class="btn btn-sm btn-success">Pagar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-5">
          <h4 class="text-info border-bottom pb-2 mb-3"><i class="fa-solid fa-truck-fast me-2"></i> Pedidos en Curso</h4>
          <div v-if="productosActivos.length === 0" class="text-white small">No tenés pedidos en curso.</div>
          
          <div class="row">
            <div v-for="pedido in productosActivos" :key="pedido.id" class="col-md-6 mb-3">
              <div class="card shadow-sm border-0 product-card activa bg-dark text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <h6 class="card-title mb-0 fw-bold">Pedido #{{ pedido.id }}</h6>
                    <span class="badge bg-info text-dark">{{ pedido.estado_envio }}</span>
                  </div>
                  <p class="mb-0 small">Fecha de compra: {{ pedido.fecha }}</p>
                  <div class="progress mt-2" style="height: 5px;">
                    <div class="progress-bar bg-info" role="progressbar" style="width: 75%;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tabActual === 'historial'" class="animate__animated animate__fadeIn">
        <div class="row mb-4 align-items-center bg-dark text-white p-3 rounded border border-secondary mx-0">
          <div class="col-md-6">
            <p class="mb-0"><i class="fa-solid fa-filter me-2"></i>Filtrar historial de compras:</p>
          </div>
          <div class="col-md-6 d-flex justify-content-end">
            <select class="form-select w-auto shadow-sm bg-secondary text-white border-0" v-model="filtroAnio">
              <option value="ultimos_6_meses">Últimos 6 meses</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-4">
            <h5 class="text-light border-bottom border-secondary pb-2 mb-3"><i class="fa-solid fa-ticket me-2"></i> Eventos Pasados</h5>
            <div v-if="entradasPasadas.length === 0" class="text-white small">No hay eventos en el historial.</div>
            
            <div v-for="entrada in entradasPasadas" :key="entrada.id" class="card border border-secondary bg-dark text-white ticket-card historial mb-2">
              <div class="card-body py-2">
                <div class="d-flex justify-content-between">
                  <span class="fw-bold">{{ entrada.evento }}</span>
                  <span class="badge bg-secondary">Finalizado</span>
                </div>
                <span class="small text-light">Asististe el {{ entrada.fecha }}</span>
              </div>
            </div>
          </div>

          <div class="col-md-6 mb-4">
            <h5 class="text-light border-bottom border-secondary pb-2 mb-3"><i class="fa-solid fa-box-open me-2"></i> Pedidos Entregados</h5>
            <div v-if="productosPasados.length === 0" class="text-white small">No hay compras en el historial.</div>
            
            <div v-for="pedido in productosPasados" :key="pedido.id" class="card border border-secondary bg-dark text-white product-card historial mb-2">
              <div class="card-body py-2">
                <div class="d-flex justify-content-between">
                  <span class="fw-bold">Pedido #{{ pedido.id }}</span>
                  <span class="badge bg-secondary">Entregado</span>
                </div>
                <span class="small text-light">Entregado el {{ pedido.fecha_entrega }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <button class="btn btn-outline-light rounded-pill px-4">
            Cargar más resultados <i class="fa-solid fa-angle-down ms-1"></i>
          </button>
        </div>
      </div>

    </div> </div>
</template>

<script>
import Topbar from '@/components/Topbar.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'MiCarrito',
  components: { Topbar },
  data() {
    return {
      tabActual: 'ticketing', 
      filtroAnio: 'ultimos_6_meses',
      cargando: false, 

      // Acá SOLO dejamos el historial y los eventos/pedidos ya pagados:
      entradasProximas: [],
      entradasPasadas: [],
      productosActivos: [],
      productosPasados: []
    };
  },
  computed: {
    // Nos traemos las variables pendientes directamente desde el store (_carrito.js)
    ...mapGetters(["entradasEnCarrito", "productosEnCarrito"]),
  },
  mounted() {
    this.cargarPantalla();
  },
  methods: {
    // 1. FUNCIÓN PARA TRAER LOS DATOS REALES DE MYSQL
    async cargarPantalla() {
      this.cargando = true;
      try {
        // En vez de usar Axios acá, le decimos a Vuex que busque TODO
        const misDatos = await this.$store.dispatch('obtenerCarritoPendiente');
        
        // Guardamos localmente el historial que nos devolvió Vuex
        this.entradasProximas = misDatos.entradasProximas || [];
        this.entradasPasadas = misDatos.entradasPasadas || [];
        this.productosActivos = misDatos.productosActivos || [];
        this.productosPasados = misDatos.productosPasados || [];

      } catch (error) {
        console.error("Error al cargar la pantalla:", error);
        // Si no tenés $errorHandler definido, usamos console.error o alert
        if (this.$errorHandler) {
          this.$errorHandler(error);
        } else {
          alert("Error al obtener los datos del carrito.");
        }
      } finally {
        this.cargando = false;
      }
    },

    // 2. FUNCIÓN PARA CONECTAR MERCADO PAGO
    async iniciarPago(item, tipo) {
      this.$store.commit('SHOW_LOADER'); 
      try {
        console.log(`Iniciando pago para ${tipo} con ID:`, item.id);
        
        // Acá llamaremos al backend real de Mercado Pago más adelante
        // const response = await this.$clients.api.post('/mercadopago/crear-preferencia', { item_id: item.id, tipo: tipo });
        // window.location.href = response.data.init_point; 

        // Simulación temporal
        setTimeout(() => {
          this.$store.commit('HIDE_LOADER');
          this.$toast.info("¡Acá te llevaríamos a Mercado Pago!");
        }, 1500);

      } catch (error) {
        this.$store.commit('HIDE_LOADER');
        this.$errorHandler(error);
      }
    }
  }
}
</script>

<style scoped>
/* Agregamos esto para forzar el fondo verde en el contenedor principal */
.ticket-page-container {
  background-color: #1a332a !important; /* Reemplazá por el color exacto que usás en tu app */
  color: #ffffff; /* Asegura que el texto general sea blanco */
  min-height: 100vh; /* Que ocupe toda la pantalla hacia abajo */
}

.pt-5 { padding-top: 4rem !important; }

.animate__fadeIn { animation: fadeIn 0.3s; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.ticket-card, .product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid transparent !important;
}
.ticket-card:hover:not(.historial), .product-card:hover:not(.historial) {
  transform: translateY(-2px);
  box-shadow: 0 .25rem .75rem rgba(0,0,0,.1)!important;
}

.pendiente { border-left-color: #ffc107 !important; }
.pagada { border-left-color: #198754 !important; }
.activa { border-left-color: #0dcaf0 !important; }
.historial { border-left-color: #6c757d !important; }
</style>