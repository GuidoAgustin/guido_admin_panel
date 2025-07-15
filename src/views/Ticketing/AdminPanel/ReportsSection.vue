<template>
    <div class="reports-section">
        <div class="section-header">
            <h2>Reportes y Análisis</h2>
        </div>
        <div class="reports-grid">
            <div class="report-card">
                <h3>📈 Resumen Financiero</h3>
                <div class="report-content">
                    <div class="report-item">
                        <span>Ingresos este mes:</span>
                        <strong>${{ formatNumber(reports.monthlyRevenue) }}</strong>
                    </div>
                    <div class="report-item">
                        <span>Promedio por venta:</span>
                        <strong>${{ formatNumber(reports.averageSale) }}</strong>
                    </div>
                    <div class="report-item">
                        <span>Mejor evento:</span>
                        <strong>{{ reports.topEvent }}</strong>
                    </div>
                </div>
            </div>
            <div class="report-card">
                <h3>🎯 Estadísticas de Eventos</h3>
                <div class="report-content">
                    <div class="report-item">
                        <span>Eventos completados:</span>
                        <strong>{{ reports.completedEvents }}</strong>
                    </div>
                    <div class="report-item">
                        <span>Ocupación promedio:</span>
                        <strong>{{ reports.averageOccupancy }}%</strong>
                    </div>
                    <div class="report-item">
                        <span>Cancelaciones:</span>
                        <strong>{{ reports.cancellations }}</strong>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    name: 'ReportsSection',
    computed: {
      ...mapState('adminTicketing', ['reports']),
      ...mapGetters('adminTicketing', ['formatNumber'])
    }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_adminPanel.scss';
</style>