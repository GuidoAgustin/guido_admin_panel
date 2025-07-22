<template>
    <div class="users-section">
        <div class="section-header">
            <h2>Gestión de Usuarios</h2>
            <input type="text" v-model="userSearch" placeholder="Buscar usuarios..." class="search-input">
        </div>
        <div class="users-grid">
            <div v-for="user in filteredUsers" :key="user.id" class="user-card">
                <div class="user-avatar-large">{{ user.name.charAt(0) }}</div>
                <div class="user-info">
                    <h3>{{ user.name }}</h3>
                    <p>{{ user.email }}</p>
                    <span class="user-role">{{ user.role }}</span>
                </div>
                <div class="user-stats">
                    <div class="stat">
                        <span class="stat-value">{{ user.ticketsPurchased }}</span>
                        <span class="stat-label">Entradas</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${{ formatNumber(user.totalSpent) }}</span>
                        <span class="stat-label">Gastado</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn-view">Ver</button>
                    <button class="btn-edit">Editar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    name: 'UsersSection',
    data() {
        return {
            userSearch: ''
        }
    },
    computed: {
      ...mapState(['users']),
      ...mapGetters(['formatNumber']),

      filteredUsers() {
          if (!this.userSearch) return this.users;
          return this.users.filter(user =>
              user.name.toLowerCase().includes(this.userSearch.toLowerCase()) ||
              user.email.toLowerCase().includes(this.userSearch.toLowerCase())
          );
      }
    }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_adminPanel.scss';
</style>