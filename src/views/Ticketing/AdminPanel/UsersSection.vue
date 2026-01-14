<template>
  <Widget>
    <template #title>Gestión de Usuarios</template>

    <div v-if="loadingUsers" class="text-center p-4">
      <i class="fa fa-spinner fa-spin mr-2"></i> Cargando usuarios...
    </div>

    <div v-if="errorUsers" class="text-center text-danger p-4">
      {{ errorUsers }}
    </div>

    <vue-table
      v-show="!loadingUsers && !errorUsers"
      :values="tableValues"
      :total="totalUsers"
      :per-page="perPage"
      :last-page="tableValues.last_page"
      :api-mode="true"
      :headers="vTable.headers"
      :actions="vTable.actions"
      :options="vTable.options"
      :filters="vTable.filters"
      @changed="getData"
      @onDelete="onDeleteUser"
      @onEdit="onEditUser"
      ref="vtable"
    />

    <UserModal
      v-if="showModal"
      :user="selectedUser"
      :mode="modalMode"
      @close="showModal = false"
      @saved="onUserActionComplete"
    />
  </Widget>
</template>

<script>
import Widget from '@/components/Widget.vue'
import { mapState, mapGetters, mapActions } from 'vuex';
import UserModal from './UserModal.vue'

export default {
  name: 'UsersSection',
  components: {
    Widget,
    UserModal
  },
  data: () => ({
    // Control del Modal
    showModal: false,
    selectedUser: {},
    modalMode: 'edit', // 'edit' o 'delete'

    lastParams: null,
    currentPage: 1,
    perPage: 15,

    vTable: {
      filters: [], // Agregar filtros aquí si es necesario en el futuro
      headers: [
        {
          title: 'first_name',
          mask: 'Nombre',
          sortable: true
        },
        {
          title: 'last_name',
          mask: 'Apellido',
          sortable: true
        },
        {
          title: 'email',
          mask: 'Email',
          sortable: true
        },
        {
          title: 'rol',
          mask: 'Rol',
          sortable: true
        },
        {
          title: 'totalSpent',
          mask: 'Gastado ($)',
          sortable: true
        }
      ],
      actions: [
        {
          title: 'Eliminar Usuario',
          callback: 'onDelete'
        },
        {
          title: 'Editar Usuario',
          callback: 'onEdit'
        }
      ],
      options: {
        perPage: 15,
      }
    }
  }),
  computed: {
    ...mapState({
      users: state => state.eventos.users,
      loadingUsers: state => state.eventos.loadingUsers,
      errorUsers: state => state.eventos.errorUsers,
      totalUsers: state => state.eventos.totalUsers
    }),
    ...mapGetters(['formatNumber']),

    tableValues() {
      const perPage = this.perPage;
      const total = this.totalUsers || 0;
      const lastPage = Math.ceil(total / perPage);

      if (!Array.isArray(this.users)) {
        return {
          total: 0,
          per_page: perPage,
          current_page: this.currentPage,
          last_page: 1,
          from: 0,
          to: 0,
          data: []
        };
      }

      return {
        total,
        per_page: perPage,
        current_page: this.currentPage,
        last_page: lastPage,
        from: (this.currentPage - 1) * perPage + 1,
        to: Math.min(this.currentPage * perPage, total),
        data: this.users.map(user => ({
          ...user,
          totalSpent: `$${this.formatNumber(user.totalSpent || 0)}`
        }))
      }
    }
  },
  created() {
    this.fetchUsers({ page: 1, per_page: this.perPage });
  },
  methods: {
    ...mapActions(['fetchUsers']),

    getData(params) {
      // Prevención de llamadas duplicadas
      const paramsString = JSON.stringify(params);
      if (this.lastParams === paramsString) return;

      this.lastParams = paramsString;
      
      // Actualizamos estado local
      this.currentPage = params.page || 1;
      this.perPage = params.per_page || 15;

      this.fetchUsers(params);
    },

    onEditUser(item) {
      this.selectedUser = item;
      this.modalMode = 'edit';
      this.showModal = true;
    },

    onDeleteUser(item) {
      this.selectedUser = item;
      this.modalMode = 'delete';
      this.showModal = true;
    },
    onUserActionComplete() {
      // Recargamos los datos para ver cambios
      this.fetchUsers({ page: this.currentPage, per_page: this.perPage });
    }
  }
}
</script>

<style scoped>
</style>