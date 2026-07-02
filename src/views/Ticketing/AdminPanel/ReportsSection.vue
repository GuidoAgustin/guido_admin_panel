<template>
  <div class="reports-section">
    <div
      class="section-header d-flex flex-column flex-xl-row justify-content-between align-items-start align-items-xl-center mb-4 gap-3"
    >
      <h2>Reportes y Análisis</h2>

      <div class="reports-controls d-flex flex-column flex-md-row flex-wrap align-items-stretch align-items-md-end gap-2 w-100 justify-content-md-end">
        
        <FormSelect
          v-model="eventoSeleccionado"
          label="Evento"
          :options="listaEventos"
          optionLabel="nombre_evento"
          optionValue="evento_id"
          class="w-100" 
          style="max-width: 300px;"
        />

        <FormDateRange 
          v-model="rangoFechas" 
          label="Período a analizar" 
          class="w-100" 
          style="max-width: 300px;" 
        />

        <FormButton
          theme="primary"
          icon="fa-solid fa-rotate"
          @click="cargarReportes"
          :disabled="cargando"
        >
          {{ cargando ? 'Calculando...' : 'Actualizar' }}
        </FormButton>

        <FormButton
          theme="secondary"
          icon="fa-solid fa-eraser"
          @click="limpiarFiltros"
          :disabled="cargando"
          tooltip="Ver todo el histórico"
        >
          Limpiar
        </FormButton>

        <div class="position-relative" @mouseleave="menuExportarAbierto = false">
          <FormButton 
            theme="success" 
            icon="fa-solid fa-file-export" 
            @click="menuExportarAbierto = !menuExportarAbierto"
            class="w-100"
          >
            Exportar
          </FormButton>

          <div 
            v-if="menuExportarAbierto"
            class="position-absolute pt-2"
            style="top: 100%; right: 0; left: auto; min-width: 240px; z-index: 1050;"
          >
            <div class="bg-dark rounded shadow-lg border border-secondary overflow-hidden">
              <div 
                class="export-item d-flex align-items-center gap-3 px-3 py-3 text-white"
                @click="ejecutarExportacion('pdf')"
              >
                <i class="fa-solid fa-file-pdf text-danger fs-4"></i> 
                <span class="fw-semibold">Descargar PDF</span>
              </div>
              <div class="border-top border-secondary opacity-50"></div>
              <div 
                class="export-item d-flex align-items-center gap-3 px-3 py-3 text-white"
                @click="ejecutarExportacion('csv')"
              >
                <i class="fa-solid fa-file-excel text-success fs-4"></i> 
                <span class="fw-semibold">Descargar Excel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row" :class="{ 'opacity-50': cargando }">
      <div class="col-md-6 mb-4">
        <Widget icon="fa-solid fa-chart-line fa-lg text-success">
          <template #title>Resumen Financiero</template>
          <div class="report-content d-flex flex-column gap-3 mt-3">
            <div class="d-flex justify-content-between border-bottom pb-2">
              <span class="text-muted">Ingresos del período:</span>
              <strong class="text-success fs-5">${{ formatNumber(reports.monthlyRevenue) }}</strong>
            </div>
            <div class="d-flex justify-content-between border-bottom pb-2">
              <span class="text-muted">Promedio por venta:</span>
              <strong class="fs-5">${{ formatNumber(reports.averageSale) }}</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center pb-2">
              <span class="text-muted">Evento que mas recaudo:</span>
              <div class="d-flex align-items-center gap-2">
                <strong class="fs-5 text-end">
                  {{ reports.topEvent }}
                  <span
                    v-if="mostrarPlataMejorEvento && reports.topEvent !== 'Sin datos'"
                    class="text-success fs-6 ms-1"
                  >
                    (${{ Number(reports.topEventRevenue).toLocaleString('es-AR') }})
                  </span>
                </strong>
                <button
                  v-if="reports.topEvent !== 'Sin datos'"
                  class="btn btn-sm btn-link text-muted p-0 ms-1"
                  @click="mostrarPlataMejorEvento = !mostrarPlataMejorEvento"
                  title="Ocultar/Mostrar recaudación"
                  style="text-decoration: none"
                >
                  <i class="fa-solid" :class="mostrarPlataMejorEvento ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>
          </div>
        </Widget>
      </div>

      <div class="col-md-6 mb-4">
        <Widget icon="fa-solid fa-bullseye fa-lg text-primary">
          <template #title>Estadísticas de Eventos</template>
          <div class="report-content d-flex flex-column gap-3 mt-3">
            <div class="d-flex justify-content-between border-bottom pb-2">
              <span class="text-muted">Eventos completados:</span>
              <strong class="fs-5">{{ reports.completedEvents }}</strong>
            </div>
            <div class="d-flex justify-content-between border-bottom pb-2">
              <span class="text-muted">Ocupación promedio:</span>
              <strong class="fs-5">{{ reports.averageOccupancy }}%</strong>
            </div>
            <div class="d-flex justify-content-between pb-2">
              <span class="text-muted">Cancelaciones:</span>
              <strong class="text-danger fs-5">{{ reports.cancellations }}</strong>
            </div>
          </div>
        </Widget>
      </div>
    </div>

    <div class="row mt-2" :class="{ 'opacity-50': cargando }">
      <div class="col-12 " v-if="graficosPorEvento && graficosPorEvento.length > 0">
        <h4 class="text-white border-bottom border-secondary pb-2">Desglose de Inventario por Evento</h4>
      </div>

      <div 
        class="col-md-6 col-lg-4 mb-4" 
        v-for="(grafico, index) in graficosPorEvento" 
        :key="index"
      >
        <Widget icon="fa-solid fa-ticket fa-lg text-info">
          <template #title>{{ grafico.eventoNombre }}</template>
          
          <div class="d-flex justify-content-center align-items-center mt-3" style="height: 200px;">
            <Doughnut 
              v-if="grafico.datosGrafico.datasets[0].data.length > 0"
              :data="grafico.datosGrafico" 
              :options="grafico.opcionesGrafico" 
            />
            <span v-else class="text-muted">Sin movimientos registrados.</span>
          </div>
        </Widget>
      </div>

      <div class="col-12 text-center text-muted mt-4" v-if="!cargando && (!graficosPorEvento || graficosPorEvento.length === 0)">
        <i class="fa-solid fa-chart-pie fa-2x mb-2 opacity-50"></i>
        <p>No hay datos de inventario para el período seleccionado.</p>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import FormDateRange from '@/components/Form/FormDateRange.vue'
import FormButton from '@/components/Form/FormButton.vue'
import Widget from '@/components/Widget.vue'
import FormSelect from '@/components/Form/FormSelect.vue'
import html2pdf from 'html2pdf.js'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: 'ReportsSection',
  components: {
    FormDateRange,
    FormButton,
    Widget,
    FormSelect,
    Doughnut,
  },
  data() {
    return {
      cargando: false,
      rangoFechas: {
        start: null,
        end: null
      },
      eventoSeleccionado: '',
      listaEventos: [],
      mostrarPlataMejorEvento: false,
      menuExportarAbierto: false
    }
  },
  computed: {
    ...mapState({
      reports: (state) => state.adminReportes.reports
    }),
    ...mapGetters(['formatNumber']),

    graficosPorEvento() {
      if (!this.reports.ticketBreakdown || this.reports.ticketBreakdown.length === 0) {
        return []; 
      }

      const eventosAgrupados = {};
      
      this.reports.ticketBreakdown.forEach(ticket => {
        const nombreEvento = ticket.nombre_evento || (this.eventoSeleccionado ? 'Evento Actual' : 'Resumen General');
        if (!eventosAgrupados[nombreEvento]) {
          eventosAgrupados[nombreEvento] = [];
        }
        eventosAgrupados[nombreEvento].push(ticket);
      });

      const arrayGraficos = [];
      
      // Paletas de colores: Vivos para lo vendido, y distintos tonos de gris para lo vacío
      const coloresVendidas = ['#198754', '#0dcaf0', '#ffc107', '#dc3545', '#6f42c1'];
      const coloresSinVender = ['#343a40', '#495057', '#6c757d', '#adb5bd', '#ced4da'];

      for (const [eventoNombre, tickets] of Object.entries(eventosAgrupados)) {
        
        const labels = [];
        const data = [];
        const coloresGrafico = [];

        // Por cada entrada, metemos 2 porciones en la torta (Vendida y Sin Vender)
        tickets.forEach((t, index) => {
          // 1. Lo que ya se vendió (Color vivo)
          labels.push(`Vendidas (${t.name})`);
          data.push(t.sold);
          coloresGrafico.push(coloresVendidas[index % coloresVendidas.length]);

          // 2. Lo que falta vender (Gris apagado)
          labels.push(`Sin vender (${t.name})`);
          data.push(t.remaining);
          coloresGrafico.push(coloresSinVender[index % coloresSinVender.length]);
        });

        arrayGraficos.push({
          eventoNombre: eventoNombre,
          datosGrafico: {
            labels: labels,
            datasets: [{
              backgroundColor: coloresGrafico,
              borderColor: '#212529',
              borderWidth: 2,
              data: data
            }]
          },
          opcionesGrafico: {
            responsive: true,
            maintainAspectRatio: false,
            // Achicamos un poco el agujero del medio para que la torta se vea más "gordita" en menos espacio
            cutout: '60%', 
            layout: {
              padding: 10 // Le da un poco de aire alrededor
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: { 
                  color: '#adb5bd', // Un gris clarito para que no resalte tanto como el título
                  boxWidth: 12,     // 👇 Cuadraditos de color más chicos (antes eran gigantes)
                  padding: 10,      // Espacio entre los elementos de la leyenda
                  font: {
                    size: 11        // 👇 Letra más chica para que entre todo bien
                  }
                }
              }
            }
          }
        });
      }

      return arrayGraficos;
    }
  },
  async mounted() {
    this.setearMesActual()
    await this.cargarListaEventos()
    this.cargarReportes()
  },
  methods: {
    setearMesActual() {
      const hoy = new Date()
      const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

      this.rangoFechas = {
        start: primerDia.toISOString().split('T')[0],
        end: hoy.toISOString().split('T')[0]
      }
    },

    async cargarListaEventos() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}eventos`)
        const data = await response.json()

        const eventosReales = data.data || data.eventos || data

        this.listaEventos = [
          { evento_id: '', nombre_evento: 'Todos los eventos' },
          ...eventosReales
        ]
      } catch (error) {
        console.error('Error cargando la lista de eventos:', error)
      }
    },

    async cargarReportes() {
      this.cargando = true
      try {
        const payload = {
          start: this.rangoFechas.start,
          end: this.rangoFechas.end,
          id_evento: this.eventoSeleccionado
        }

        await this.$store.dispatch('adminReportes/fetchReportesAction', payload)

        if (this.$toast) this.$toast.success('Reportes actualizados')
      } catch (error) {
        console.error('Error al cargar reportes:', error)
        if (this.$toast) this.$toast.error('Error al calcular los reportes')
      } finally {
        this.cargando = false
      }
    },

    limpiarFiltros() {
      this.rangoFechas = {
        start: null,
        end: null
      }
      this.eventoSeleccionado = ''
      if (this.$toast) this.$toast.info('Mostrando el histórico completo...')
      this.cargarReportes()
    },

    async exportarReportePDF() {
      if (this.$toast) this.$toast.info('Preparando el documento PDF...')

      const element = document.querySelector('.reports-section')

      const opt = {
        margin: 10,
        filename: `Reporte_Ticketing_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      }

      try {
        await html2pdf().set(opt).from(element).save()
        if (this.$toast) this.$toast.success('¡PDF descargado con éxito!')
      } catch (error) {
        console.error('Error al generar PDF:', error)
        if (this.$toast) this.$toast.error('Hubo un problema al generar el PDF.')
      }
    },

    exportarReporteCSV() {
      if (this.$toast) this.$toast.info('Generando archivo Excel...')

      const filas = [
        ['Metrica', 'Valor'],
        ['Ingresos del periodo', this.reports.monthlyRevenue],
        ['Promedio por venta', this.reports.averageSale],
        ['Mejor evento', this.reports.topEvent],
        ['Recaudacion mejor evento', this.reports.topEventRevenue],
        ['Eventos completados', this.reports.completedEvents],
        ['Ocupacion promedio (%)', this.reports.averageOccupancy],
        ['Cancelaciones', this.reports.cancellations]
      ]

      const contenidoCSV = filas.map((fila) => fila.join(',')).join('\n')
      const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `Reporte_Ticketing_${new Date().toISOString().split('T')[0]}.csv`
      )
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      if (this.$toast) this.$toast.success('¡Excel descargado con éxito!')
    },

    ejecutarExportacion(tipo) {
      this.menuExportarAbierto = false;
      
      if (tipo === 'pdf') {
        this.exportarReportePDF();
      } else if (tipo === 'csv') {
        this.exportarReporteCSV();
      }
    },
  }
}
</script>

<style scoped>
.export-item {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.export-item:hover {
  background-color: var(--bs-primary);
  padding-left: 1.5rem !important; 
}
</style>