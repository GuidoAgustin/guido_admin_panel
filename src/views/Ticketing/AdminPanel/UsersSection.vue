<template>
  <div class="users-section">
    <div class="section-header">
      <h2>Gestión de Usuarios</h2>
      <input type="text" v-model="userSearch" placeholder="Buscar por nombre o email..." class="search-input">
    </div>

    <div v-if="loadingUsers" class="loading-state">Cargando usuarios...</div>
    <div v-else-if="errorUsers" class="error-state">{{ errorUsers }}</div>

    <div v-else-if="filteredUsers.length > 0" class="users-grid">
      <div v-for="user in filteredUsers" :key="user.user_id" class="user-card">
        <div class="user-avatar-large">{{ user.first_name.charAt(0).toUpperCase() }}</div>
        <div class="user-info">
          <h3>{{ user.first_name }} {{ user.last_name }}</h3>
          <p>{{ user.email }}</p>
          <span class="user-role">{{ user.rol }}</span>
        </div>
        <div class="user-stats">
          <div class="stat">
            <!-- Estas propiedades son de ejemplo, deberás añadirlas a tu modelo de usuario si las necesitas -->
            <span class="stat-value">{{ user.ticketsPurchased || 0 }}</span>
            <span class="stat-label">Entradas</span>
          </div>
          <div class="stat">
            <span class="stat-value">${{ formatNumber(user.totalSpent || 0) }}</span>
            <span class="stat-label">Gastado</span>
          </div>
        </div>
        <div class="user-actions">
          <button class="btn-view">Ver</button>
          <button class="btn-edit">Editar</button>
        </div>
      </div>
    </div>

    <div v-else class="no-results-state">No se encontraron usuarios.</div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'UsersSection',
  data() {
    return {
      userSearch: ''
    }
  },
  computed: {
    // Corregimos la ruta del mapState
    ...mapState({
      users: state => state.eventos.users,
      loadingUsers: state => state.eventos.loadingUsers,
      errorUsers: state => state.eventos.errorUsers
    }),
    // Los getters globales funcionan bien
    ...mapGetters(['formatNumber']),

    filteredUsers() {
      if (!this.userSearch) {
        return this.users;
      }
      const searchTerm = this.userSearch.toLowerCase();
      // Ajustamos a los nombres de campo reales (first_name, last_name)
      return this.users.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    ...mapActions(['fetchUsers'])
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_adminPanel.scss';

/* Estilos adicionales para estados de carga/error */
.loading-state, .error-state, .no-results-state {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #a0a0a0;
}
.error-state {
  color: #f44336;
}
</style>