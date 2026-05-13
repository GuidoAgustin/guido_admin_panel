<template>
  <div class="scanner-container bg-dark text-white min-vh-100 d-flex flex-column">
    
    <div class="p-3 bg-black d-flex justify-content-between align-items-center shadow-sm">
      <h4 class="m-0 text-uppercase fw-bold text-info">
        <i class="fa-solid fa-qrcode me-2"></i> Escáner
      </h4>
      <button class="btn btn-outline-light btn-sm" @click="$router.go(-1)">
        <i class="fa-solid fa-arrow-left"></i> Salir
      </button>
    </div>

    <div v-if="!resultadoVisible" class="camera-wrapper flex-grow-1 position-relative d-flex flex-column justify-content-center align-items-center p-3">
      
      <div class="qr-box shadow-lg border border-2 border-info rounded overflow-hidden" style="width: 100%; max-width: 400px; aspect-ratio: 1/1;">
        <qrcode-stream 
          @detect="onDetect" 
          @error="onError"
          :paused="cargando"
        >
          <div v-if="cargando" class="loading-overlay d-flex justify-content-center align-items-center w-100 h-100 bg-dark bg-opacity-75">
            <div class="spinner-border text-info" style="width: 3rem; height: 3rem;" role="status"></div>
          </div>
        </qrcode-stream>
      </div>
      <p class="text-muted mt-3 text-center small">
        Apuntá la cámara al código QR de la entrada.<br>El escaneo es automático.
      </p>

      <div class="manual-input mt-auto w-100" style="max-width: 400px;">
        <hr class="border-secondary mb-3">
        <label class="form-label text-muted small">¿El QR está roto? Ingreso manual:</label>
        <div class="input-group input-group-lg">
          <input 
            v-model="codigoManual" 
            type="text" 
            class="form-control bg-black text-white border-secondary" 
            placeholder="Ej: ENT-12345"
            @keyup.enter="validarManual"
          >
          <button class="btn btn-info fw-bold" @click="validarManual" :disabled="!codigoManual || cargando">
            Validar
          </button>
        </div>
      </div>
    </div>

    <div v-else class="result-screen flex-grow-1 d-flex flex-column justify-content-center align-items-center p-4 text-center" :class="colorFondo">
      
      <i :class="iconoResultado" style="font-size: 6rem; margin-bottom: 20px;"></i>
      <h1 class="fw-bold text-uppercase mb-3">{{ tituloResultado }}</h1>
      <h4 class="mb-4">{{ mensajeResultado }}</h4>
      
      <div v-if="tipoEntrada" class="ticket-type bg-black bg-opacity-25 px-4 py-2 rounded-pill fs-4 fw-bold mb-5 border border-light">
        Tipo: {{ tipoEntrada }}
      </div>

      <button class="btn btn-light btn-lg w-100 fw-bold shadow-lg mt-auto mb-4" style="max-width: 350px; padding: 20px;" @click="reiniciarEscaner">
        ESCANEAR OTRA ENTRADA
      </button>
    </div>

  </div>
</template>

<script>
// Importamos la librería de la cámara
import { QrcodeStream } from 'vue-qrcode-reader'
import axios from 'axios'

export default {
  name: 'ScannerView',
  components: {
    QrcodeStream
  },
  data() {
    return {
      cargando: false,
      codigoManual: '',
      
      // Estados del Semáforo
      resultadoVisible: false,
      estadoValidacion: '', // 'verde', 'rojo', 'negro'
      mensajeResultado: '',
      tipoEntrada: '',
      
      // Manejo de errores de cámara
      errorCamara: ''
    }
  },
  computed: {
    colorFondo() {
      if (this.estadoValidacion === 'verde') return 'bg-success text-white';
      if (this.estadoValidacion === 'rojo') return 'bg-danger text-white';
      return 'bg-dark text-white border border-danger border-5'; // negro/inválido
    },
    iconoResultado() {
      if (this.estadoValidacion === 'verde') return 'fa-solid fa-circle-check';
      if (this.estadoValidacion === 'rojo') return 'fa-solid fa-circle-xmark';
      return 'fa-solid fa-triangle-exclamation text-danger';
    },
    tituloResultado() {
      if (this.estadoValidacion === 'verde') return '¡Adelante!';
      if (this.estadoValidacion === 'rojo') return '¡Detener!';
      return 'Inválido';
    }
  },
  methods: {
    // Cuando la cámara detecta un QR
    async onDetect(detectedCodes) {
      if (this.cargando || this.resultadoVisible) return;
      
      // vue-qrcode-reader v5+ devuelve un array de códigos detectados
      const qrData = detectedCodes[0].rawValue;
      if (qrData) {
        await this.procesarCodigo(qrData);
      }
    },

    // Cuando el usuario tipea a mano y aprieta Validar
    async validarManual() {
      if (!this.codigoManual || this.cargando) return;
      await this.procesarCodigo(this.codigoManual);
    },

    // El cerebro de la conexión
    async procesarCodigo(codigo) {
      this.cargando = true;
      try {
        // Le pegamos al endpoint que armamos en el backend
        const response = await axios.post('http://localhost:3011/admin/escaner/validar', {
          codigo_qr: codigo
        });

        const data = response.data;
        
        // Seteamos el semáforo según lo que dijo el backend
        this.estadoValidacion = data.color; // 'verde', 'rojo' o 'negro'
        this.mensajeResultado = data.mensaje;
        this.tipoEntrada = data.datosEntrada ? data.datosEntrada.tipo : '';
        this.resultadoVisible = true;

        if (this.estadoValidacion === 'verde') {
          if (this.$toast) this.$toast.success('Entrada validada');
        } else {
          // Si hay error, le metemos un sonidito o vibra el celular si lo soporta
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }

      } catch (error) {
        console.error('Error al validar:', error);
        this.estadoValidacion = 'negro';
        this.mensajeResultado = 'Error de conexión con el servidor.';
        this.resultadoVisible = true;
      } finally {
        this.cargando = false;
        this.codigoManual = ''; // Limpiamos el input
      }
    },

    reiniciarEscaner() {
      this.resultadoVisible = false;
      this.estadoValidacion = '';
      this.mensajeResultado = '';
      this.tipoEntrada = '';
    },

    // Manejo de errores de la cámara (sin permisos, sin cámara, etc)
    onError(error) {
      console.error("Error de cámara:", error);
      if (error.name === 'NotAllowedError') {
        this.errorCamara = "ERROR: Tenés que darle permiso a la cámara en el navegador.";
      } else if (error.name === 'NotFoundError') {
        this.errorCamara = "ERROR: No se encontró ninguna cámara en este dispositivo.";
      } else {
        this.errorCamara = "ERROR: No se pudo iniciar la cámara.";
      }
      if (this.$toast) this.$toast.error(this.errorCamara);
    }
  }
}
</script>

<style scoped>
/* Para asegurarnos que la pantalla ocupe el 100% en celulares */
.scanner-container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999; /* Por encima de todo */
  overflow: hidden;
}

.result-screen {
  animation: popIn 0.3s ease-out;
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
</style>