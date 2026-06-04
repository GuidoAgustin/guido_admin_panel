<template>
  <Widget class="bg-dark text-white border-secondary">
    <template #title>
      <span class="text-white">Gestión de Usuarios</span>
    </template>

    <div v-if="loadingUsers" class="text-center p-4 text-white">
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
      totalUsers: state => state.eventos.totalUsers,
      // 👇 Traemos las ventas globales que ya tenés en Vuex
      ventas: state => state.ventas?.ventas || [] 
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
        data: this.users.map(user => {
          // 👇 Transformamos el "480264.00" que manda SQL a un número, lo redondeamos y le damos formato AR
          const plataFormateada = Math.round(Number(user.totalSpent || 0)).toLocaleString('es-AR');

          return {
            ...user,
            totalSpent: `$${plataFormateada}`
          };
        })
      };
    }
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
/* ===========================================================
  🎨 EL ANTÍDOTO DEFINITIVO PARA EL FRANKENSTEIN UI 🎨
  (Pega esto en SalesSection, UsersSection y DashboardSection)
===========================================================
*/

/* 1. Oscurecemos el fondo general de la sección para dar contraste (Casi Negro) */
.sales-section, .users-section, .dashboard-section, .reports-section, .events-section {
  background-color: #101214 !important; /* Gris ultra-oscuro */
  min-height: 100vh;
  padding: 1.5rem;
}

/* 2. Forzamos estilo Oscuro Premium al Widget */
:deep(.widget),
:deep(.card),
:deep(.bg-white) {
  background-color: #1c1f23 !important; /* Gris oscuro tarjeta */
  border-color: #343a40 !important;
  color: #f8f9fa !important; /* Texto casi blanco */
}

/* 3. Matamos la barra blanca del header del Widget definitivamente */
:deep(header),
:deep(.widget-header),
:deep(.card-header) {
  background-color: transparent !important;
  color: #f8f9fa !important; /* Título casi blanco */
  border-bottom: 1px solid #343a40 !important;
}

/* 4. LA TABLA: Forzamos textos en BLANCO PURO para contraste total */
:deep(.VueTables),
:deep(table),
:deep(thead th),
:deep(tbody td) {
  color: #ffffff !important; /* Texto blanco puro */
  background-color: transparent !important;
}

/* 5. Headers de la tabla oscuros con texto blanco */
:deep(thead th) {
  background-color: #101214 !important;
  border-bottom: 2px solid #495057 !important;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
}

/* 6. Filas de la tabla con borde sutil */
:deep(tbody td) {
  border-bottom: 1px solid #343a40 !important;
}

/* 7. Oscurecemos el buscador y controles de la tabla */
:deep(.VueTables__search label),
:deep(.VueTables__limit label) {
  color: #ced4da !important; /* Gris claro para etiquetas */
}

:deep(.VueTables__search input),
:deep(.VueTables__limit select),
:deep(.form-control),
:deep(.form-select) {
  background-color: #101214 !important; /* Fondo input casi negro */
  color: #ffffff !important; /* Texto input blanco */
  border-color: #495057 !important;
}

:deep(.VueTables__search input:focus),
:deep(.form-control:focus) {
  border-color: var(--bs-primary) !important;
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25) !important;
}

/* 8. Estilo para el Paginador */
:deep(.pagination .page-link) {
  background-color: #1c1f23 !important;
  border-color: #343a40 !important;
  color: #adb5bd !important;
}
:deep(.pagination .page-item.active .page-link) {
  background-color: var(--bs-primary) !important;
  border-color: var(--bs-primary) !important;
  color: white !important;
}

/* 9. EL CARTEL DE ADVERTENCIA (Lo hacemos minimalista y legible) */
:deep(.alert-warning) {
  background-color: rgba(255, 193, 7, 0.05) !important;
  border: 1px solid #ffc107 !important;
  border-left: 5px solid #ffc107 !important;
  color: #ffc107 !important;
}

/* 10. BOTONES DE ACCIÓN EN TABLA (Les damos peso) */
:deep(.btn-outline-primary),
:deep(.btn-outline-danger) {
  background-color: rgba(255, 255, 255, 0.05); /* Fondo muy sutil */
  font-weight: bold;
}

/* 11. RESCATE DE BOTONES FANTASMAS (Filtros y Acciones) */
:deep(.VueTables .btn),
:deep(.widget .btn),
:deep(.dropdown-toggle),
:deep(td .btn),
:deep(td button),
:deep(.VueTables__filters-row button) {
  color: #ffffff !important;
  background-color: #2b3035 !important; /* Un gris intermedio para que resalte del fondo negro */
  border: 1px solid #495057 !important;
  opacity: 1 !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
}

/* Efecto hover brillante para que el usuario sepa que es clickeable */
:deep(.VueTables .btn:hover),
:deep(.widget .btn:hover),
:deep(.dropdown-toggle:hover),
:deep(td .btn:hover),
:deep(td button:hover) {
  background-color: var(--bs-primary) !important;
  border-color: var(--bs-primary) !important;
  color: #ffffff !important;
}

/* Forzar que los íconos (como los 3 puntitos) adentro de los botones sean blancos */
:deep(td button i),
:deep(td button svg),
:deep(.btn i) {
  color: #ffffff !important;
  fill: #ffffff !important;
}
</style>