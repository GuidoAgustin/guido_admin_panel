<template>
  <VueModal size="md" position="center" @close="close">
    <template #title>
      <span v-if="mode === 'edit'">Editar Usuario</span>
      <span v-else-if="mode === 'delete'" class="text-danger">Eliminar Usuario</span>
    </template>

    <template #body>
      <form v-if="mode === 'edit'" @submit.prevent="confirmAction" class="p-2">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" class="form-control" v-model="localUser.first_name" required>
        </div>
        <div class="form-group">
          <label>Apellido</label>
          <input type="text" class="form-control" v-model="localUser.last_name" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-control" v-model="localUser.email" required>
        </div>
        <div class="form-group">
          <label>Rol</label>
          <input type="text" class="form-control" v-model="localUser.rol" required>
        </div>
        </form>

      <div v-else-if="mode === 'delete'" class="p-3 text-center">
        <i class="fa fa-exclamation-triangle fa-3x text-warning mb-3"></i>
        <p>¿Estás seguro de que deseas eliminar al usuario <b>{{ localUser.first_name }} {{ localUser.last_name }}</b>?</p>
        <p class="text-muted small">Esta acción no se puede deshacer.</p>
      </div>
    </template>

    <template #footer>
      <button class="btn btn-secondary mr-2" @click="close" :disabled="loading">
        Cancelar
      </button>
      
      <button 
        class="btn" 
        :class="mode === 'delete' ? 'btn-danger' : 'btn-primary'"
        @click="confirmAction" 
        :disabled="loading"
      >
        <i class="fa fa-spinner fa-spin" v-if="loading"></i>
        {{ buttonText }}
      </button>
    </template>
  </VueModal>
</template>

<script>
import VueModal from '@/components/Modal/VueModal.vue'
import { mapActions } from 'vuex'   

export default {
  name: 'UserModal',
  components: { VueModal },
  props: {
    user: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'edit',
      validator: val => ['edit', 'delete'].includes(val)
    }
  },
  data() {
    return {
      localUser: {},
      loading: false
    }
  },
  computed: {
    buttonText() {
      if (this.loading) return 'Procesando...';
      return this.mode === 'delete' ? 'Sí, Eliminar' : 'Guardar Cambios';
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(val) {
        if (val) this.localUser = JSON.parse(JSON.stringify(val));
      }
    }
  },
  methods: {
    // Aquí puedes importar tus acciones reales de Vuex
    ...mapActions(['updateUserAction', 'deleteUserAction']),

    close() {
      this.$emit('close');
    },

    async confirmAction() {
  this.loading = true;
  try {
    // 👇 ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ ASÍ
    // Algunos endpoints devuelven 'id' y otros 'user_id', esto cubre ambos.
    const id = this.localUser.user_id || this.localUser.id; 

    console.log("ID a borrar:", id); // <--- Míralo en la consola del navegador (F12)

    if (!id) {
       this.$toast.error("Error: No se encuentra el ID del usuario");
       return;
    }

    if (this.mode === 'edit') {
       // ...
    } else if (this.mode === 'delete') {
       await this.deleteUserAction(id);
       this.$toast.success('Usuario eliminado correctamente');
    }
    
    this.$emit('saved');
    this.close();

      } catch (error) {
        console.error(error);
        const msg = error.response?.data?.message || 'Error al procesar la solicitud';
        this.$toast.error(msg);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>