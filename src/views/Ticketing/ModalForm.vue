// frontend/src/views/Ticketing/ModalForm.vue
<template>
  <VueModal v-if="visible" size="md" position="center" @close="close"> <template #title>{{ modalTitle }}</template>

    <template #body>
      <form @submit.prevent="submit">
        <h5>Datos del Evento</h5>

        <div class="form-group">
          <label>Nombre del Evento</label>
          <input
            v-model="form.nombre_evento"
            type="text"
            class="form-control"
            placeholder="Ej: Festival de Música"
            required
          />
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea
            v-model="form.descripcion"
            class="form-control"
            rows="2"
            placeholder="Ej: Un evento para los amantes de la música."
            required
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group col">
            <label>Fecha y Hora Inicio</label>
            <input
              v-model="form.fecha_hora_inicio"
              type="datetime-local"
              class="form-control"
              required
            />
          </div>
          <div class="form-group col">
            <label>Fecha y Hora Fin</label>
            <input
              v-model="form.fecha_hora_fin"
              type="datetime-local"
              class="form-control"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col">
            <label>Lugar (Nombre)</label>
            <input
              v-model="form.lugar_nombre"
              type="text"
              class="form-control"
              placeholder="Ej: Parque Central"
              required
            />
          </div>
          <div class="form-group col">
            <label>Lugar (Dirección)</label>
            <input
              v-model="form.lugar_direccion"
              type="text"
              class="form-control"
              placeholder="Ej: Avenida Siempre Viva 123"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col">
            <label>Categoría</label>
            <input
              v-model="form.categoria"
              type="text"
              class="form-control"
              placeholder="Ej: Concierto"
              required
            />
          </div>
          <div class="form-group col">
            <label>Estado</label>
            <select v-model="form.estado_evento" class="form-control" required>
              <option value="proximamente">Próximamente</option>
              <option value="disponible">Disponible</option>
              <option value="agotado">Agotado</option>
              <option value="pasado">Pasado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div class="form-group">
            <label>Imagen del Evento</label>
            <div v-if="isEditing && currentImageUrl" class="mb-2">
                <img :src="currentImageUrl" alt="Imagen actual" style="max-width: 200px; max-height: 200px; display: block;">
                <small>Imagen actual. Selecciona una nueva para reemplazarla.</small>
            </div>
            <FormUploader
                v-model="imageFile"
                label="Seleccionar nueva imagen"
                :maxSizeMB="10"
                :imageType="true"
            />
        </div>

        <h5 class="mt-4">Tipos de Entrada</h5>
        <div v-if="loadingTipos" class="text-center my-3">
            <i class="fas fa-spinner fa-spin"></i> Cargando tipos...
        </div>
        <div v-if="errorTipos" class="alert alert-danger">
            {{ errorTipos }}
        </div>

        <div
          v-for="(tipo, idx) in tipos"
          :key="tipo.id_tipo_entrada || `new-${idx}`" class="border rounded p-3 mb-3 bg-light shadow-sm"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <strong>Tipo #{{ idx + 1 }} <span v-if="tipo.id_tipo_entrada" class="badge badge-info ml-1">ID: {{ tipo.id_tipo_entrada }}</span></strong>
            <button
              type="button" class="btn btn-sm btn-danger"
              @click="handleRemoveTipo(idx)"
              :disabled="loadingTipos"
            >
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>

          <div class="form-group">
            <label>Nombre Tipo</label>
            <input
              v-model="tipo.nombre_tipo"
              type="text"
              class="form-control"
              placeholder="Ej: Vip"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label>Precio</label>
              <input
                v-model.number="tipo.precio"
                type="number"
                step="0.01"
                class="form-control"
                placeholder="Ej: 15000.00"
                required
              />
            </div>
            <div class="form-group col">
              <label>Cantidad Total</label>
              <input
                v-model.number="tipo.cantidad_total"
                type="number"
                class="form-control"
                placeholder="Ej: 100"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Descripción Adicional</label>
            <textarea
              v-model="tipo.descripcion_adicional"
              class="form-control"
              rows="2"
              placeholder="Ej: Entrada con comida y bebida"
            ></textarea>
          </div>
        </div>

        <button
          type="button" class="btn btn-outline-primary mb-3"
          @click="addTipo"
          :disabled="loadingTipos"
        >
          <i class="fas fa-plus"></i> Agregar Tipo de Entrada
        </button>
      </form>
    </template>

    <template #footer>
      <button class="btn btn-secondary mr-2" type="button" @click="close">
        Cancelar
      </button>
      <button class="btn btn-primary" type="button" @click="submit" :disabled="loading"> <i class="fas fa-spinner fa-spin" v-if="loading"></i>
        {{ submitButtonText }}
      </button>
    </template>
  </VueModal>
</template>

<script>
import VueModal from '@/components/Modal/VueModal.vue';
import FormUploader from '@/components/Form/FormUploader.vue';
import { mapActions, mapGetters } from 'vuex';

// Estado inicial para el formulario del evento
const initialEventFormState = () => ({
  nombre_evento: '',
  descripcion: '',
  fecha_hora_inicio: '',
  fecha_hora_fin: '',
  lugar_nombre: '',
  lugar_direccion: '',
  categoria: '',
  estado_evento: 'proximamente',
  evento_id: null // Clave para identificar si estamos editando
});

// Estado inicial para un tipo de entrada
const initialTicketTypeState = () => ({
  // id_tipo_entrada: se asignará si es un tipo existente traído del backend
  nombre_tipo: '',
  precio: null,
  cantidad_total: null,
  // cantidad_disponible: el backend la calcula o la recibe (inicialmente = cantidad_total)
  descripcion_adicional: '',
});

export default {
  name: 'ModalFormEvento', // Renombrado para más claridad
  components: { VueModal, FormUploader },
  props: {
    visible: Boolean,
    eventoToEdit: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: initialEventFormState(),
      imageFile: null, // Para la nueva imagen seleccionada
      currentImageUrl: null, // Para mostrar la URL de la imagen existente al editar
      tipos: [initialTicketTypeState()], // Array para los tipos de entrada
    };
  },
  computed: {
    // Mapear getters de Vuex para estados de carga/error
    ...mapGetters(['loading', 'error', 'loadingTipos', 'errorTipos']), // 'tipos' (del store) podría causar conflicto con 'this.tipos' local

    isEditing() {
      // Un evento se está editando si 'eventoToEdit' tiene un ID.
      return !!(this.eventoToEdit && this.eventoToEdit.evento_id);
    },
    modalTitle() {
      return this.isEditing ? 'Editar Evento' : 'Crear Nuevo Evento';
    },
    submitButtonText() {
      return this.isEditing ? 'Guardar Cambios' : 'Crear Evento';
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initializeModalData();
      } else {
        // Cuando el modal se cierra, reseteamos el formulario
        this.resetFormAndState();
      }
    },
    // Observador para `eventoToEdit.tipos_entrada` para actualizar `this.tipos` si cambia
    // Esto es útil si los tipos de entrada se cargan asíncronamente después de que `eventoToEdit` se pasa
    'eventoToEdit.tipos_entrada': {
        handler(newTipos) {
            if (this.isEditing && newTipos) {
                 this.tipos = newTipos.map(t => ({
                    ...initialTicketTypeState(), // Empezar con la estructura base
                    id_tipo_entrada: t.id_tipo_entrada,
                    nombre_tipo: t.nombre_tipo,
                    precio: parseFloat(t.precio),
                    cantidad_total: parseInt(t.cantidad_total, 10),
                    cantidad_disponible: parseInt(t.cantidad_disponible, 10), // Útil para mostrar si se edita
                    descripcion_adicional: t.descripcion_adicional || '',
                }));
                 if (this.tipos.length === 0) {
                    this.tipos = [initialTicketTypeState()];
                }
            }
        },
        deep: true, // Necesario para observar cambios dentro del array
        immediate: false // No ejecutar al inicio, solo cuando 'visible' se active
    }
  },
  methods: {
    ...mapActions([
      'createEvento',
      'createTipo',
      // 'updateEvento', // Lo necesitarás para la lógica de edición completa
      // 'updateTipoEntrada', // Lo necesitarás para la lógica de edición completa
      'deleteTipoEntradaAction', // Acción para borrar tipos de entrada existentes
      'fetchTickets', // Para recargar la lista principal después de guardar/crear
      // 'fetchTipos', // Podría ser necesario si los tipos se gestionan de forma muy independiente
    ]),

    initializeModalData() {
      if (this.isEditing && this.eventoToEdit) {
        // Modo Edición: Popular formulario con datos de eventoToEdit
        this.form = {
          nombre_evento: this.eventoToEdit.nombre_evento || '',
          descripcion: this.eventoToEdit.descripcion || '',
          fecha_hora_inicio: this.formatDateForInput(this.eventoToEdit.fecha_hora_inicio),
          fecha_hora_fin: this.formatDateForInput(this.eventoToEdit.fecha_hora_fin),
          lugar_nombre: this.eventoToEdit.lugar_nombre || '',
          lugar_direccion: this.eventoToEdit.lugar_direccion || '',
          categoria: this.eventoToEdit.categoria || '',
          estado_evento: this.eventoToEdit.estado_evento || 'proximamente',
          evento_id: this.eventoToEdit.evento_id, // Guardar el ID del evento que se edita
        };
        this.currentImageUrl = this.eventoToEdit.imagen_url; // Mostrar imagen actual
        this.imageFile = null; // Resetear selector de nueva imagen

        // Cargar tipos de entrada del evento.
        // `eventoToEdit` ya debería tener una propiedad `tipos_entrada` (array)
        // según tu `eventos.repository.js` que incluye `tipos_entrada`.
        if (this.eventoToEdit.tipos_entrada && this.eventoToEdit.tipos_entrada.length > 0) {
          this.tipos = JSON.parse(JSON.stringify(this.eventoToEdit.tipos_entrada.map(t => ({
            ...initialTicketTypeState(), // Base
            id_tipo_entrada: t.id_tipo_entrada,
            nombre_tipo: t.nombre_tipo,
            precio: parseFloat(t.precio),
            cantidad_total: parseInt(t.cantidad_total, 10),
            cantidad_disponible: parseInt(t.cantidad_disponible, 10), // Importante para referencia
            descripcion_adicional: t.descripcion_adicional || '',
          }))));
        } else {
          this.tipos = [initialTicketTypeState()]; // Si no hay tipos, empezar con uno vacío
        }
      } else {
        // Modo Creación
        this.resetFormAndState();
      }
    },

    resetFormAndState() {
      this.form = initialEventFormState();
      this.imageFile = null;
      this.currentImageUrl = null;
      this.tipos = [initialTicketTypeState()];
      // Podrías resetear errores específicos del store aquí si es necesario
      // this.$store.commit('SET_ERROR_TIPOS', null);
    },

    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      // Formato YYYY-MM-DDTHH:mm
      return (
        date.getFullYear() +
        '-' + ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' + ('0' + date.getDate()).slice(-2) +
        'T' + ('0' + date.getHours()).slice(-2) +
        ':' + ('0' + date.getMinutes()).slice(-2)
      );
    },

    close() {
      this.$emit('update:visible', false);
      // El reseteo del formulario ahora se maneja en el watcher de 'visible'
    },

    addTipo() {
      this.tipos.push(initialTicketTypeState());
    },

    async handleRemoveTipo(index) {
      const tipoToRemove = this.tipos[index];

      if (this.isEditing && tipoToRemove.id_tipo_entrada) {
        // Es un tipo de entrada existente (tiene ID), se debe borrar de la BD
        if (window.confirm(`¿Estás seguro de que quieres borrar el tipo de entrada "${tipoToRemove.nombre_tipo || 'este tipo'}"? Esta acción es permanente y eliminará el tipo de la base de datos.`)) {
          try {
            await this.deleteTipoEntradaAction(tipoToRemove.id_tipo_entrada);
            this.tipos.splice(index, 1); // Eliminar del array local en el frontend
            this.$toast.success('Tipo de entrada borrado exitosamente de la base de datos.');
            // Si después de borrar, el array de tipos queda vacío, añadir uno nuevo para la UI
            if (this.tipos.length === 0) {
              this.addTipo();
            }
          } catch (err) {
            console.error('Error al borrar tipo de entrada (BD):', err);
            this.$toast.error(err.message || 'Error al borrar el tipo de entrada de la base de datos.');
          }
        }
      } else {
        // Es un tipo nuevo (aún no guardado en la BD) o no estamos en modo edición.
        // Solo se elimina del array local del formulario.
        if (this.tipos.length > 1) {
          this.tipos.splice(index, 1);
        } else if (this.tipos.length === 1 && (tipoToRemove.nombre_tipo || tipoToRemove.precio != null || tipoToRemove.cantidad_total != null)) {
            // Si es el único tipo y tiene datos, preguntar antes de limpiar sus campos.
             if (window.confirm('Este es el único tipo de entrada. ¿Deseas limpiar sus campos?')) {
                this.tipos.splice(index, 1, initialTicketTypeState()); // Reemplazar con uno vacío
            }
        } else {
          // Si es el único y está vacío, no hacer nada o mostrar un aviso.
          this.$toast.info('Debe haber al menos un tipo de entrada definido.');
        }
      }
    },

    async submit() {
      // Validaciones básicas (puedes expandirlas)
      if (!this.form.nombre_evento || !this.form.descripcion || !this.form.fecha_hora_inicio || !this.form.lugar_nombre || !this.form.lugar_direccion || !this.form.categoria) {
        this.$toast.error('Por favor, completa todos los campos obligatorios del evento.');
        return;
      }
      for (const tipo of this.tipos) {
        if (!tipo.nombre_tipo || tipo.precio == null || tipo.cantidad_total == null) {
          this.$toast.error('Por favor, completa nombre, precio y cantidad para todos los tipos de entrada.');
          return;
        }
      }


      if (this.isEditing) {
        // LÓGICA PARA ACTUALIZAR EVENTO Y SUS TIPOS (PENDIENTE)
        this.$toast.info('La funcionalidad de ACTUALIZAR evento y sus tipos aún está en desarrollo.');
        console.log('Datos para actualizar:', this.form, this.tipos, this.imageFile);
        // Aquí llamarías a una acción `updateEventoAction(formData)`
        // Y luego, para cada tipo en `this.tipos`:
        // - Si tiene `id_tipo_entrada`, llamar a `updateTipoEntradaAction(tipo)`
        // - Si no tiene `id_tipo_entrada`, llamar a `createTipo({ ...tipo, id_evento: this.form.evento_id })`
        // Después de todas las operaciones:
        // this.$emit('eventSaved'); // Para que Ticketing.vue recargue los datos
        // this.close();
      } else {
        // LÓGICA PARA CREAR EVENTO (EXISTENTE)
        try {
          const formData = new FormData();
          // Añadir campos del evento al FormData
          Object.entries(this.form).forEach(([key, value]) => {
            if (value !== null && value !== undefined && key !== 'evento_id') { // No enviar evento_id en creación
              formData.append(key, value);
            }
          });

          if (this.imageFile) {
            formData.append('imagen', this.imageFile);
          } else if (!this.isEditing && !this.imageFile) {
            // Podrías hacer la imagen opcional o requerirla aquí
            // this.$toast.error('Por favor, selecciona una imagen para el evento.');
            // return;
          }

          const eventoResponse = await this.createEvento(formData); // Acción de Vuex
          
          const eventoCreado = eventoResponse.data?.data || eventoResponse.data || eventoResponse; // Ajustar según la estructura de tu respuesta
          const evento_id = eventoCreado.evento_id;

          if (!evento_id) {
            console.error('Respuesta del backend al crear evento no contiene evento_id:', eventoResponse);
            throw new Error('No se recibió el ID del evento creado. Verifica la respuesta del backend.');
          }

          // Crear tipos de entrada asociados al evento recién creado
          for (const tipo of this.tipos) {
            // Solo procesar si el tipo tiene datos básicos (evita enviar tipos vacíos)
            if (tipo.nombre_tipo && tipo.precio != null && tipo.cantidad_total != null) {
              await this.createTipo({
                ...tipo, // nombre_tipo, precio, cantidad_total, descripcion_adicional
                id_evento: evento_id, // Asociar al evento creado
                // cantidad_disponible: tipo.cantidad_total, // El backend debería manejar esto si no se envía
              });
            }
          }

          this.$toast.success('Evento y tipos de entradas creados correctamente!');
          this.$emit('eventSaved'); // Emitir para que Ticketing.vue recargue la lista de eventos
          this.close();
        } catch (err) {
          console.error('Error en submit (creación) de ModalForm:', err.response || err);
          const errMsg = err.response?.data?.message || err.message || 'Error desconocido al crear el evento.';
          this.$toast.error(`Error al crear evento: ${errMsg}`);
        }
      }
    },
  },
};
</script>