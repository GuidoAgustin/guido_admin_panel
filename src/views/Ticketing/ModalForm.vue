// frontend/src/views/Ticketing/ModalForm.vue
<template>
  <VueModal v-if="visible" size="md" position="center" @close="close">
    <template #title>{{ modalTitle }}</template>

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
            <input v-model="form.fecha_hora_fin" type="datetime-local" class="form-control" />
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
          <img
            :src="currentImageUrl"
            alt="Imagen actual"
            style="max-width: 200px; max-height: 200px; display: block"
          />
          <small>Imagen actual. Selecciona una nueva para reemplazarla.</small>
        </div>
        <div @click.stop> 
          <FormUploader
            v-model="imageFile"
            label="Seleccionar nueva imagen"
            :maxSizeMB="10"
            :imageType="true"
          />
        </div>
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
          :key="tipo.id_tipo_entrada || `new-${idx}`"
          class="border rounded p-3 mb-3 bg-light shadow-sm"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <strong
              >Tipo #{{ idx + 1 }}
              <span v-if="tipo.id_tipo_entrada" class="badge badge-info ml-1"
                >ID: {{ tipo.id_tipo_entrada }}</span
              ></strong
            >
            <button
              type="button"
              class="btn btn-sm btn-danger"
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
          type="button"
          class="btn btn-outline-primary mb-3"
          @click="addTipo"
          :disabled="loadingTipos"
        >
          <i class="fas fa-plus"></i> Agregar Tipo de Entrada
        </button>
      </form>
    </template>

    <template #footer>
      <button class="btn btn-secondary mr-2" type="button" @click="close">Cancelar</button>
      <button class="btn btn-primary" type="button" @click="submit" :disabled="loading">
        <i class="fas fa-spinner fa-spin" v-if="loading"></i>
        {{ submitButtonText }}
      </button>
    </template>
  </VueModal>
</template>

<script>

import VueModal from '@/components/Modal/VueModal.vue';
import FormUploader from '@/components/Form/FormUploader.vue';
import { mapActions, mapGetters } from 'vuex';

const initialEventFormState = () => ({
  nombre_evento: '',
  descripcion: '',
  fecha_hora_inicio: '',
  fecha_hora_fin: '',
  lugar_nombre: '',
  lugar_direccion: '',
  categoria: '',
  estado_evento: 'proximamente',
  evento_id: null
});

const initialTicketTypeState = () => ({
  id_tipo_entrada: null,
  nombre_tipo: '',
  precio: null,
  cantidad_total: null,
  cantidad_disponible: null,
  descripcion_adicional: ''
});

export default {
  name: 'ModalFormEvento',
  components: { VueModal, FormUploader },
  props: {
    visible: Boolean,
    eventoToEdit: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: initialEventFormState(),
      imageFile: null,
      currentImageUrl: null,
      tipos: [initialTicketTypeState()],
      initialTiposState: []
    };
  },
  computed: {
    ...mapGetters(['loading', 'error', 'loadingTipos', 'errorTipos']),
    isEditing() {
      return !!(this.eventoToEdit && this.eventoToEdit.evento_id);
    },
    modalTitle() {
      return this.isEditing ? 'Editar Evento' : 'Crear Nuevo Evento';
    },
    submitButtonText() {
      return this.isEditing ? 'Guardar Cambios' : 'Crear Evento';
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initializeModalData();
      } else {
        this.resetFormAndState();
      }
    }
  },
  methods: {
    ...mapActions([
      'createEvento',
      'createTipo',
      'updateEventoAction',
      'updateTipoEntradaAction',
      'deleteTipoEntradaAction',
      'fetchTickets'
    ]),

    initializeModalData() {
      // console.log('[ModalForm] InitializeModalData. Editing?', this.isEditing, 'EventoToEdit:', JSON.parse(JSON.stringify(this.eventoToEdit)));
      if (this.isEditing && this.eventoToEdit) {
        this.form = {
          nombre_evento: this.eventoToEdit.nombre_evento || '',
          descripcion: this.eventoToEdit.descripcion || '',
          fecha_hora_inicio: this.formatDateForInput(this.eventoToEdit.fecha_hora_inicio),
          fecha_hora_fin: this.formatDateForInput(this.eventoToEdit.fecha_hora_fin),
          lugar_nombre: this.eventoToEdit.lugar_nombre || '',
          lugar_direccion: this.eventoToEdit.lugar_direccion || '',
          categoria: this.eventoToEdit.categoria || '',
          estado_evento: this.eventoToEdit.estado_evento || 'proximamente',
          evento_id: this.eventoToEdit.evento_id
        };
        this.currentImageUrl = this.eventoToEdit.imagen_url;
        this.imageFile = null;

        if (this.eventoToEdit.tipos_entrada && this.eventoToEdit.tipos_entrada.length > 0) {
          this.tipos = JSON.parse(
            JSON.stringify( // Asegurar copia profunda
              this.eventoToEdit.tipos_entrada.map((t) => ({
                id_tipo_entrada: t.id_tipo_entrada,
                nombre_tipo: t.nombre_tipo,
                precio: parseFloat(t.precio),
                cantidad_total: parseInt(t.cantidad_total, 10),
                cantidad_disponible: parseInt(t.cantidad_disponible, 10),
                descripcion_adicional: t.descripcion_adicional || ''
              }))
            )
          );
          this.initialTiposState = JSON.parse(JSON.stringify(this.tipos)); // Copia profunda para comparación
          // console.log('[ModalForm] Tipos inicializados desde eventoToEdit:', this.tipos, this.initialTiposState);
        } else {
          this.tipos = [initialTicketTypeState()];
          this.initialTiposState = JSON.parse(JSON.stringify(this.tipos));
          // console.log('[ModalForm] No hay tipos en eventoToEdit, inicializando con uno vacío:', this.tipos);
        }
      } else {
        this.resetFormAndState();
      }
    },

    resetFormAndState() {
      // console.log('[ModalForm] ResetFormAndState');
      this.form = initialEventFormState();
      this.imageFile = null;
      this.currentImageUrl = null;
      this.tipos = [initialTicketTypeState()];
      this.initialTiposState = JSON.parse(JSON.stringify(this.tipos));
    },

    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return (
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2) +
        'T' +
        ('0' + date.getHours()).slice(-2) +
        ':' +
        ('0' + date.getMinutes()).slice(-2)
      );
    },

    close() {
      this.$emit('update:visible', false);
    },

    addTipo() {
      this.tipos.push(initialTicketTypeState());
    },

    async handleRemoveTipo(index) {
      const tipoToRemove = this.tipos[index];
      if (this.isEditing && tipoToRemove.id_tipo_entrada) {
        if (
          window.confirm(
            `¿Estás seguro de que quieres borrar el tipo de entrada "${
              tipoToRemove.nombre_tipo || 'este tipo'
            }"? Esta acción es permanente y eliminará el tipo de la base de datos.`
          )
        ) {
          try {
            await this.deleteTipoEntradaAction(tipoToRemove.id_tipo_entrada);
            this.tipos.splice(index, 1);
            const initialIdx = this.initialTiposState.findIndex(
              (t) => t.id_tipo_entrada === tipoToRemove.id_tipo_entrada
            );
            if (initialIdx !== -1) this.initialTiposState.splice(initialIdx, 1);

            this.$toast.success('Tipo de entrada borrado exitosamente de la base de datos.');
            if (this.tipos.length === 0) {
              this.addTipo();
            }
          } catch (err) {
            this.$toast.error(err.message || 'Error al borrar el tipo de entrada.');
          }
        }
      } else {
        // Lógica para remover localmente (sin cambios)
        if (this.tipos.length > 1) {
          this.tipos.splice(index, 1);
        } else if (
          this.tipos.length === 1 &&
          (tipoToRemove.nombre_tipo ||
            tipoToRemove.precio != null ||
            tipoToRemove.cantidad_total != null)
        ) {
          if (window.confirm('Este es el único tipo de entrada. ¿Deseas limpiar sus campos?')) {
            this.tipos.splice(index, 1, initialTicketTypeState());
          }
        } else {
          this.$toast.info('Debe haber al menos un tipo de entrada definido.');
        }
      }
    },

    hasTipoChanged(tipoActual) {
      if (!tipoActual.id_tipo_entrada) {
        // console.log(`[hasTipoChanged] Tipo ID ${tipoActual.id_tipo_entrada || 'Nuevo'} es nuevo, SÍ cambió.`);
        return true;
      }
      const tipoInicial = this.initialTiposState.find(
        (t) => t.id_tipo_entrada === tipoActual.id_tipo_entrada
      );
      if (!tipoInicial) {
        // console.warn(`[hasTipoChanged] No se encontró estado inicial para tipo ID ${tipoActual.id_tipo_entrada}, se asume que SÍ cambió.`);
        return true;
      }

      const changed = (
        tipoActual.nombre_tipo !== tipoInicial.nombre_tipo ||
        parseFloat(tipoActual.precio) !== parseFloat(tipoInicial.precio) ||
        parseInt(tipoActual.cantidad_total, 10) !== parseInt(tipoInicial.cantidad_total, 10) ||
        tipoActual.descripcion_adicional !== tipoInicial.descripcion_adicional
      );
      // console.log(`[hasTipoChanged] Tipo ID ${tipoActual.id_tipo_entrada}: ¿Cambió?: ${changed}`, { actual: JSON.parse(JSON.stringify(tipoActual)), inicial: JSON.parse(JSON.stringify(tipoInicial)) });
      return changed;
    },

    async submit() {
      if (
        !this.form.nombre_evento || !this.form.descripcion || !this.form.fecha_hora_inicio ||
        !this.form.lugar_nombre || !this.form.lugar_direccion || !this.form.categoria
      ) {
        this.$toast.error('Por favor, completa todos los campos obligatorios del evento.');
        return;
      }
      for (const [idx, tipo] of this.tipos.entries()) {
        if (!tipo.nombre_tipo || tipo.precio == null || tipo.cantidad_total == null) {
          this.$toast.error(`Por favor, completa nombre, precio y cantidad para el Tipo de Entrada #${idx + 1}.`);
          return;
        }
        if (parseFloat(tipo.precio) < 0 || parseInt(tipo.cantidad_total, 10) < 0) {
          this.$toast.error(`Precio y cantidad total para el Tipo #${idx + 1} no pueden ser negativos.`);
          return;
        }
      }

      // console.log('[ModalForm] Submit. Editing?', this.isEditing);

      if (this.isEditing) {
        try {
          const eventoFormData = new FormData();
          for (const key in this.form) {
            if (key !== 'evento_id' && this.form[key] !== null && this.form[key] !== undefined) {
              eventoFormData.append(key, this.form[key]);
            }
          }
          if (this.imageFile) {
            eventoFormData.append('imagen', this.imageFile);
            // console.log('[ModalForm] Nueva imagen añadida al FormData para actualizar.');
          } else {
            // console.log('[ModalForm] No se seleccionó nueva imagen para actualizar.');
          }

          // console.log('[ModalForm] Llamando a updateEventoAction con ID:', this.form.evento_id);
          await this.updateEventoAction({
            eventoId: this.form.evento_id,
            eventoData: eventoFormData
          });
          // console.log('[ModalForm] updateEventoAction completado.');

          const promisesTipos = this.tipos.map(async (tipo) => { // Quitado 'index' si no se usa dentro del map
            const tipoPayload = {
              nombre_tipo: tipo.nombre_tipo,
              precio: tipo.precio,
              cantidad_total: tipo.cantidad_total,
              descripcion_adicional: tipo.descripcion_adicional,
              cantidad_disponible: tipo.cantidad_disponible, // TEMPORALMENTE ENVIANDO ESTO
            };

            if (tipo.id_tipo_entrada) {
              const cambioDetectado = this.hasTipoChanged(tipo);
              // console.log(`[ModalForm] Procesando tipo existente (ID: ${tipo.id_tipo_entrada}): ¿Cambió? ${cambioDetectado}`);
              if (cambioDetectado) {
                // console.log('[ModalForm] Actualizando tipo existente ID:', tipo.id_tipo_entrada, 'con payload:', JSON.parse(JSON.stringify(tipoPayload)));
                return this.updateTipoEntradaAction({
                  id_tipo_entrada: tipo.id_tipo_entrada,
                  ...tipoPayload
                });
              }
            } else {
              // console.log('[ModalForm] Creando nuevo tipo con payload:', JSON.parse(JSON.stringify(tipoPayload)));
              return this.createTipo({
                ...tipoPayload,
                id_evento: this.form.evento_id,
              });
            }
            return Promise.resolve();
          });

          // console.log('[ModalForm] Esperando promesas de tipos...');
          await Promise.all(promisesTipos);
          // console.log('[ModalForm] Promesas de tipos completadas.');

          this.$toast.success('Evento y sus tipos de entrada actualizados correctamente!');
          this.$emit('eventSaved');
          this.close();
        } catch (err) {
          // console.error('[ModalForm] Error al actualizar evento o tipos:', err.response || err);
          const errMsg = err.response?.data?.message || err.message || 'Error desconocido al actualizar.';
          this.$toast.error(`Error: ${errMsg}`);
        }
      } else {
        // Lógica de Creación
        try {
          const formData = new FormData();
          Object.entries(this.form).forEach(([key, value]) => {
            if (value !== null && value !== undefined && key !== 'evento_id') {
              formData.append(key, value);
            }
          });
          if (this.imageFile) {
            formData.append('imagen', this.imageFile);
          }

          const eventoResponse = await this.createEvento(formData);
          const eventoCreado = eventoResponse.data?.data || eventoResponse.data || eventoResponse;
          const evento_id = eventoCreado.evento_id;
          if (!evento_id) {
            throw new Error('No se recibió el ID del evento creado.');
          }

          for (const tipo of this.tipos) {
            if (tipo.nombre_tipo && tipo.precio != null && tipo.cantidad_total != null) {
              await this.createTipo({
                nombre_tipo: tipo.nombre_tipo,
                precio: tipo.precio,
                cantidad_total: tipo.cantidad_total,
                descripcion_adicional: tipo.descripcion_adicional,
                id_evento: evento_id,
              });
            }
          }
          this.$toast.success('Evento y tipos de entradas creados correctamente!');
          this.$emit('eventSaved');
          this.close();
        } catch (err) {
          // console.error('[ModalForm] Error en submit (creación):', err.response || err);
          const errMsg = err.response?.data?.message || err.message || 'Error desconocido al crear el evento.';
          this.$toast.error(`Error al crear evento: ${errMsg}`);
        }
      }
    }
  }
};
</script>