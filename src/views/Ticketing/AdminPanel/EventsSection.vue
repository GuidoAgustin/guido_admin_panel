<template>
  <div class="events-section">
    <div class="section-header">
      <h2>Gestión de Eventos</h2>
      <button class="btn-primary" @click="showCreateEventModal = true">+ Crear Evento</button>
    </div>
    <div class="events-grid">
      <div v-for="event in events" :key="event.id" class="event-card">
        <div class="event-image">
          <img :src="event.image" :alt="event.title" />
          <div class="event-status" :class="event.status">{{ event.status }}</div>
        </div>
        <div class="event-content">
          <h3>{{ event.title }}</h3>
          <p class="event-description">{{ event.description }}</p>
          <div class="event-details">
            <span>📅 {{ event.date }}</span>
            <span>📍 {{ event.location }}</span>
            <span>💰 Desde ${{ formatNumber(event.price) }}</span>
          </div>
          <div class="event-stats">
            <span>Vendidas: {{ event.soldTickets }}/{{ event.totalTickets }}</span>
            <div class="progress-bar">
              <div class="progress" :style="{ width: (event.soldTickets / event.totalTickets * 100) + '%' }"></div>
            </div>
          </div>
          <div class="event-actions">
            <button class="btn-edit">Editar</button>
            <button class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'EventsSection',
  data() {
    return {
      showCreateEventModal: false
    }
  },
  computed: {
    ...mapState('adminTicketing', ['events']),
    ...mapGetters('adminTicketing', ['formatNumber'])
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_adminPanel.scss';
</style>