<template>
  <div class="ecommerce-products-container distinct-style">
    <Topbar />
    <header class="page-hero">
      <div class="hero-content">
        <h1 class="main-title"><span>Nuestra</span> Selección</h1>
        <p class="subtitle">Calidad y diseño que inspiran tu día a día.</p>
      </div>
    </header>

    <div class="products-grid-wrapper">
      <div class="products-grid">
        <div class="product-card" v-for="product in products" :key="product.id"
          @mousemove="handleMouseMove($event, product.id)" @mouseleave="handleMouseLeave($event, product.id)">
          <div class="product-card-border-glow"></div>
          <div class="product-image-showcase">
            <img :src="product.image" :alt="product.name" class="product-image" />
            <span class="product-badge" v-if="product.badge" :class="getBadgeClass(product.badge)">{{ product.badge
              }}</span>
          </div>
          <div class="product-info">
            <p class="product-category">{{ product.category || 'Moda y Accesorios' }}</p>
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-pricing">
              <p class="price-item total">
                <span>{{ formatCurrency(product.price + (product.shippingCost || 0)) }}</span>
              </p>
              <p class="price-item subtotal" v-if="product.shippingCost !== undefined && product.shippingCost > 0">
                Subtotal: {{ formatCurrency(product.price) }} + Envío
              </p>
              <p class="price-item subtotal" v-else>
                Subtotal: {{ formatCurrency(product.price) }} (Envío Gratis)
              </p>
            </div>
            <button class="btn btn-buy-now" @click="addToCart(product)">
              <i class="fas fa-shopping-cart"></i> Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para compra exitosa -->
    <VueModal v-if="showBuyModal" size="sm" position="center" @close="showBuyModal = false">
      <template #title>
        Producto añadido
      </template>
      <template #body>
        <p><b>{{ productoSeleccionado?.name }}</b> ha sido añadido al carrito.</p>
      </template>
      <template #footer>
        <button class="btn btn-primary" @click="showBuyModal = false">Cerrar</button>
      </template>
    </VueModal>

<!-- Modal para pedir registro -->
<VueModal v-if="showRegisterModal" size="md" position="center" @close="showRegisterModal = false">
  <template #title>
    Registro requerido
  </template>
  <template #body>
    <p>Debes estar registrado para comprar productos.
      ¿Deseas registrarte?
    </p>
  </template>
  <template #footer>
    <button class="btn btn-secondary" @click="showRegisterModal = false">Cancelar</button>
    <button class="btn btn-primary" @click="goToRegister">Registrarme</button>
  </template>
</VueModal>
    
    <footer class="site-footer-ecommerce">
      <button class="btn btn-back" @click="$router.back()" style="margin: 16px 0 10px 16px;">
        <i class="fas fa-arrow-left"></i> Ir para atrás
      </button>
      <div class="container">
        <h4>Síguenos en Redes</h4>
        <div class="social-icons">
          <a href="#" target="_blank" aria-label="Facebook" title="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" target="_blank" aria-label="Instagram" title="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" target="_blank" aria-label="Twitter" title="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" target="_blank" aria-label="Pinterest" title="Pinterest"><i class="fab fa-pinterest-p"></i></a>
        </div>
        <p class="copyright">
          &copy; {{ new Date().getFullYear() }} TuTienda Favorita. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import Topbar from '@/components/Topbar.vue'
import VueModal from '@/components/Modal/VueModal.vue'

export default {
  name: 'EcommerceProductsPageFinalTheme',
  components: {
    Topbar,
    VueModal
  },
  data() {
    return {
      products: [
        {
          id: 1,
          name: 'Cartera "Esencia"',
          price: 140.0,
          shippingCost: 18.0,
          image: '/img/logo.svg',
          category: 'Bolsos de Diseño',
          badge: 'Tendencia'
        },
        {
          id: 2,
          name: 'Vestido "Aura"',
          price: 89.99,
          shippingCost: 0.0,
          image: '/img/logo.svg',
          category: 'Prendas Únicas',
          badge: 'Popular'
        },
        {
          id: 3,
          name: 'Pantalón "Confort"',
          price: 59.99,
          shippingCost: 10.0,
          image: '/img/logo.svg',
          category: 'Básicos Renovados',
          badge: 'Oferta'
        },
        {
          id: 4,
          name: 'Chaqueta "Estilo"',
          price: 129.99,
          shippingCost: 15.0,
          image: '/img/logo.svg',
          category: 'Abrigos Modernos',
          badge: 'Nuevo'
        }
      ],
      showBuyModal: false,
      showRegisterModal: false,
      productoSeleccionado: null
    }
  },
  methods: {
    addToCart(product) {
      const isLoggedIn = !!localStorage.getItem('token') || !!localStorage.getItem('user');
      if (!isLoggedIn) {
        this.showRegisterModal = true;
        return;
      }
      this.productoSeleccionado = product;
      this.showBuyModal = true;
    },
    goToRegister() {
      this.showRegisterModal = false;
      this.$router.push({ name: 'login' });
    },
    formatCurrency(value) {
      if (typeof value !== 'number') {
        return '$0.00'
      }
      return `$${value.toFixed(2)}`
    },
    getBadgeClass(badgeText) {
      if (!badgeText) return ''
      const text = badgeText.toLowerCase()
      if (text.includes('oferta')) return 'badge-offer'
      if (text.includes('nuevo')) return 'badge-new'
      if (text.includes('popular') || text.includes('tendencia')) return 'badge-popular'
      return ''
    },
    handleMouseMove(event) {
      const card = event.currentTarget
      const glow = card.querySelector('.product-card-border-glow')
      if (!glow) return // Safety check
      const rect = card.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      glow.style.setProperty('--mouse-x', `${x}px`)
      glow.style.setProperty('--mouse-y', `${y}px`)
      glow.style.opacity = '1'
    },
    handleMouseLeave(event) {
      const card = event.currentTarget
      const glow = card.querySelector('.product-card-border-glow')
      if (!glow) return // Safety check
      glow.style.opacity = '0'
    }
  }
}
</script>

<style>
@import '@/assets/scss/_e-commerce.scss';
</style>