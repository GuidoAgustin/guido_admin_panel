<template>
  <div class="topbar">
    <div class="welcome-message">
      Bienvenid@
      <span v-if="$store.getters.isLoggedIn && $store.getters.user">
        {{ $store.getters.user.first_name }}
      </span>!
    </div>
    <div class="custom-topbar-actions">
      <a class="action-link" v-if="$store.getters.isLoggedIn" @click="goToCart" title="Mis Compras">
        <i class="fa-solid fa-cart-shopping"></i> 
      </a>
      
      <a class="action-link" v-if="$store.getters.isAdmin" @click="goToScanner" title="Escáner de Entradas">
        <i class="fa-solid fa-qrcode"></i>
      </a>

      <a class="action-link" v-if="$store.getters.isAdmin" @click="goToAdminPanel" title="Panel de administración">
        <i class="fa-solid fa-tools"></i>
      </a>
      
      <a class="action-link" @click="handleLogoutOrLogin">
        <i class="fa-solid fa-power-off"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.addEventListener('click', this.closeSidebar)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeSidebar)
  },
  methods: {
    closeSidebar(e) {
      const sb = document.querySelector('.sidebar')
      if (sb && sb.classList.contains('sidebar-open')) {
        if (e.target.closest('.sidebar')) return
        sb.classList.remove('sidebar-open')
      }
    },
    openSidebar() {
      const sb = document.querySelector('.sidebar')
      if (sb)
        sb.classList.add('sidebar-open')
    },
    async handleLogoutOrLogin() {
      if (this.$store.getters.isLoggedIn) {
        await this.$store.dispatch('logout', { redirect: false })
        // El usuario se desloguea y permanece en la página actual
      } else {
        this.$router.push({ name: 'login' })
      }
    },
    goToAdminPanel() {
      this.$router.push({ path: '/adminpanel' })
    },
    
    // 👇 AGREGAMOS EL MÉTODO QUE LLEVA A LA RUTA DEL ESCÁNER 👇
    goToScanner() {
      this.$router.push({ path: '/escaner' })
    },
    
    goToCart() {
      this.$router.push({ path: '/mi-carrito' }) 
    }
  }
}
</script>
<style scoped>
/* ==========================================================
   BLINDAJE DE TOPBAR (Nitidez Cristalina Forzada)
========================================================== */

/* 1. Escudo de la topbar (flexbox centering) */
.topbar {
  justify-content: space-between !important;
  align-items: center !important;
}

/* 2. El contenedor de Matrix */
.custom-topbar-actions {
  display: flex !important;
  align-items: center !important;
  gap: 15px !important; /* Separación perfecta */
  margin: 0 !important;
  padding: 0 10px !important; /* Aire prolijo a los costados */
}

/* 3. Nuestros enlaces blindados nítidos */
.action-link {
  /* Mantenemos el tamaño que definimos antes */
  font-size: 1.15rem !important; 
  color: #343a40 !important; /* Gris oscuro original */
  cursor: pointer !important;
  
  /* Mantenemos una transición suave SOLO PARA EL COLOR */
  transition: color 0.2s ease-in-out !important; 
  
  padding: 0.5rem !important; /* Gordura del area clickeable */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-decoration: none !important;
  background: transparent !important;
  border: none !important;
  width: auto !important;
  opacity: 1 !important; /* Fuerza visibilidad total */
}

/* 4. Efecto HOVER BLINDADO (Solo color, sin agrandar) */
.action-link:hover {
  color: #3b7a57 !important; /* Verde Ticketing */
  
  /* 👇 👇 ELIMINAMOS ESTO PARA QUE NO SE VEA BORROSO 👇 👇 */
  /* transform: scale(1.05) !important; */ 
  
  /* Nos aseguramos que no herede ningún transform raro del admin */
  transform: none !important; 
}

/* Quitamos cualquier borde o outline molesto */
.action-link:focus, .action-link:active {
  outline: none !important;
  box-shadow: none !important;
}

/* ==========================================================
   BLINDAJE ULTRA AGRESIVO PARA NITIDEZ Y GORDURA DEL ICONO
========================================================== */

.action-link i {
  /* Forzamos el grosor exacto de FontAwesome Solid */
  font-weight: 900 !important; 
  
  /* Suavizado de bordes óptimo (Nitidez 4K) */
  -webkit-font-smoothing: antialiased !important; /* Chrome/Edge */
  -moz-osx-font-smoothing: grayscale !important; /* Mac/Safari */
  
  /* Forzamos a que el renderizado priorice calidad y legibilidad */
  text-rendering: geometricPrecision !important; 
  
  /* Blindamos el color y opacity nativo de FA */
  opacity: 1 !important; 
  color: inherit !important; 
  text-shadow: none !important; 
  line-height: 1 !important;
  display: inline-block !important;
}
</style>