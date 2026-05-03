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
          <h4 class="text-warning border-bottom pb-2 mb-3"><i class="fa-solid fa-cart-shopping me-2"></i> Mi Carrito de Entradas</h4>
          <div v-if="carritoLocalEntradas.length === 0" class="text-white small">Tu carrito está vacío.</div>
          
          <div class="row">
            <div v-for="entrada in carritoLocalEntradas" :key="entrada.id_local" class="col-md-6 mb-3">
              <div class="card shadow-sm border-0 ticket-card pendiente bg-dark text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <h6 class="card-title mb-0 fw-bold">{{ entrada.evento }}</h6>
                    <button class="btn btn-sm text-danger border-0 bg-transparent" @click="eliminarDelCarritoLocal(entrada.id_local)">
                      <i class="fa-solid fa-trash fa-lg"></i>
                    </button>
                  </div>
                  <p class="mb-1 small"><i class="fa-regular fa-calendar me-2"></i>{{ entrada.fecha }}</p>
                  
                  <div class="small text-light mb-2 mt-3">
                    <div v-for="item in entrada.items" :key="item.id_tipo_entrada" class="mb-1">
                      <i class="fa-solid fa-ticket fa-xs me-1 text-warning"></i> 
                      <strong>{{ item.cantidad }}x</strong> {{ item.nombre_tipo_original }} 
                      <span class="text-muted ms-1">(${{ item.precio_unitario }} c/u)</span>
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mt-3 border-top pt-3 border-secondary">
                    <h6 class="mb-0 fw-bold text-success">Total: ${{ entrada.total }}</h6>
                    <button @click="iniciarPagoDesdeCarritoLocal(entrada)" class="btn btn-success btn-sm rounded-pill px-4 fw-bold">
                      Comprar <i class="fa-solid fa-arrow-right ms-1"></i>
                    </button>
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
                    <!-- Le agregamos el @click y le cambiamos el ícono/texto para que quede más pro -->
<button @click="descargarTicket(entrada.codigo)" class="btn btn-success btn-sm rounded-pill px-3 shadow-sm">
  <i class="fa-solid fa-file-pdf me-2"></i> Descargar Ticket
</button>
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
    </div> 
    <SiteFooter />
  </div>
</template>

<script>
import SiteFooter from '@/components/SiteFooter.vue';
import Topbar from '@/components/Topbar.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'MiCarrito',
  components: { Topbar, SiteFooter },
  data() {
    return {
      tabActual: 'ticketing', 
      filtroAnio: 'ultimos_6_meses',
      cargando: false, 

      // VARIABLE NUEVA PARA EL CARRITO FALSO
      carritoLocalEntradas: [],

      entradasProximas: [],
      entradasPasadas: [],
      productosActivos: [],
      productosPasados: []
    };
  },
  computed: {
    ...mapGetters(["entradasEnCarrito", "productosEnCarrito"]),
  },
  async mounted() {
    await this.cargarPantalla();
  
    // Detectar si venimos de un pago exitoso
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('pago') === 'exito' && urlParams.get('orden_id')) {
      await this.finalizarProcesoDePago(urlParams.get('orden_id'));
    }
  },
  methods: {

    async finalizarProcesoDePago(orden_id) {
      this.$store.commit('SHOW_LOADER');
      try {
        await this.$clients.api.post('mercadopago/confirmar-pago', { orden_id });
        if(this.$toast) this.$toast.success("¡Pago confirmado!");
        this.$router.replace({ query: {} });
        await this.cargarPantalla();
      } catch (e) {
        if(this.$toast) this.$toast.error("Error al confirmar el pago");
      } finally {
        this.$store.commit('HIDE_LOADER');
      }
    },

    // 1. CARGAMOS LA PANTALLA Y LA MEMORIA LOCAL
    async cargarPantalla() {
      this.cargando = true;
      try {
        const misDatos = await this.$store.dispatch('obtenerCarritoPendiente');
        
        this.entradasProximas = misDatos.entradasProximas || [];
        this.entradasPasadas = misDatos.entradasPasadas || [];
        this.productosActivos = misDatos.productosActivos || [];
        this.productosPasados = misDatos.productosPasados || [];

        // Cargamos el carrito visual desde localStorage
        this.carritoLocalEntradas = JSON.parse(localStorage.getItem('carrito_entradas')) || [];

      } catch (error) {
        console.error("Error al cargar la pantalla:", error);
        if (this.$errorHandler) {
          this.$errorHandler(error);
        } else {
          alert("Error al obtener los datos del carrito.");
        }
      } finally {
        this.cargando = false;
      }
    },

    // 2. FUNCIÓN PARA BORRAR DEL CARRITO SIN COMPRAR
    eliminarDelCarritoLocal(id_local) {
      let carrito = JSON.parse(localStorage.getItem('carrito_entradas')) || [];
      carrito = carrito.filter(item => item.id_local !== id_local);
      localStorage.setItem('carrito_entradas', JSON.stringify(carrito));
      this.carritoLocalEntradas = carrito; // Actualizamos la vista
      if(this.$toast) this.$toast.success("Entrada eliminada del carrito");
    },

    // 3. LA MAGIA: CONVIERTE EL CARRITO VISUAL EN UNA COMPRA REAL
    async iniciarPagoDesdeCarritoLocal(entrada) {
      this.$store.commit('SHOW_LOADER'); 
      try {
        // A) Disparamos la acción de Vuex para crear la orden (acá sí se descuenta el stock)
        const payloadCompra = {
          items: entrada.items.map(item => ({
            id_tipo_entrada: item.id_tipo_entrada,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario
          }))
        };
        const ordenCreada = await this.$store.dispatch('iniciarCompraAction', payloadCompra);

        // B) Pedimos el link seguro a Mercado Pago
        const payloadMP = { 
          orden_id: ordenCreada.id_orden, 
          titulo_display: entrada.evento 
        };
        const respuestaMP = await this.$store.dispatch('pagarOrden', payloadMP);
        
        // C) Borramos la entrada del carrito local porque ya es una orden real
        this.eliminarDelCarritoLocal(entrada.id_local);

        // D) ¡Viajamos a la pasarela de pago!
        if (respuestaMP && respuestaMP.sandbox_init_point) {
          window.location.href = respuestaMP.sandbox_init_point;
        } else {
          throw new Error("No se obtuvo el link de Mercado Pago");
        }

      } catch (error) {
        console.error("Error al procesar compra desde el carrito:", error);
        if (this.$toast) this.$toast.error(error.message || "Hubo un problema al iniciar el pago.");
      } finally {
        this.$store.commit('HIDE_LOADER');
      }
    },

    // Función vieja para los productos (ecommerce) que dejaste igual
    async iniciarPago(item, tipo) {
      this.$store.commit('SHOW_LOADER'); 
      try {
        const payload = { 
          orden_id: item.id, 
          titulo_display: tipo === 'entrada' ? item.evento : item.nombre 
        };
        const respuestaMP = await this.$store.dispatch('pagarOrden', payload);
        window.location.href = respuestaMP.sandbox_init_point;
      } catch (error) {
        if (this.$errorHandler) {
          this.$errorHandler(error);
        } else {
          alert("Hubo un problema al iniciar el pago.");
        }
      } finally {
        this.$store.commit('HIDE_LOADER');
      }
    },

   // 4. NUEVO: DESCARGAR EL PDF (Arquitectura Limpia 🧼✨)
    async descargarTicket(codigo_unico) {
      this.$store.commit('SHOW_LOADER'); 
      try {
        // A. Le pedimos a Vuex que haga el trabajo sucio y nos traiga el archivo
        const blob = await this.$store.dispatch('descargarTicketAction', codigo_unico);
        
        // B. Lógica exclusiva de la vista (El truco del navegador)
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Ticket-${codigo_unico}.pdf`); 
        
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        if(this.$toast) this.$toast.success("¡Ticket descargado con éxito! 🎟️");
      } catch (error) {
        // El error ya viene atajado desde el Store
        if(this.$toast) this.$toast.error("Uy, no pudimos descargar el ticket. Intentá de nuevo.");
      } finally {
        this.$store.commit('HIDE_LOADER'); 
      }
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