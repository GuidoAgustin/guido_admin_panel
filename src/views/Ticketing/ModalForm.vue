<template>
  <VueModal v-if="visible" size="md" position="center" @close="close">
    <template #title>{{ modalTitle }}</template>

    <template #body>
      <form @submit.prevent="submit">
        <h5 class="mb-3 text-primary border-bottom pb-2">Datos del Evento</h5>

        <div class="mb-3">
          <FormText 
            v-model="form.nombre_evento" 
            label="Nombre del Evento" 
            placeholder="Ej: Festival de Música" 
            required 
          />
        </div>

        <div class="form-group mb-3">
          <label>Descripción</label>
          <textarea
            v-model="form.descripcion"
            class="form-control"
            rows="2"
            placeholder="Ej: Un evento para los amantes de la música."
            required
          ></textarea>
        </div>


        <div class="form-group mb-3 bg-light p-3 border rounded">
          <label class="font-weight-bold text-success">
            <i class="fas fa-clock mr-1"></i> Programar Apertura de Ventas (Opcional)
          </label>
          <input
            v-model="form.fecha_inicio_venta"
            type="datetime-local"
            class="form-control"
          />
          <small class="form-text text-muted">
            Si el evento nace en estado "Próximamente", pasará solo a "Disponible" en esta fecha exacta.
          </small>
        </div>
        <div class="form-row mb-3">
          <div class="form-group col">
            <label>Fecha y Hora Inicio Evento</label>
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

        <div class="form-row mb-3">
          <div class="col">
            <FormText 
              v-model="form.lugar_nombre" 
              label="Lugar (Nombre)" 
              placeholder="Ej: Parque Central" 
              required 
            />
          </div>
          <div class="col">
            <FormText 
              v-model="form.lugar_direccion" 
              label="Lugar (Dirección)" 
              placeholder="Ej: Avenida Siempre Viva 123" 
              required 
            />
          </div>
        </div>

        <div class="form-row mb-3">
          <div class="col">
            <FormText 
              v-model="form.categoria" 
              label="Categoría" 
              placeholder="Ej: Concierto" 
              required 
            />
          </div>
          <div class="col">
            <FormSelect 
              v-model="form.estado_evento" 
              label="Estado" 
              :options="estadoOptions" 
              required 
            />
          </div>
        </div>

        <div class="form-group mt-3 p-3 border rounded bg-light shadow-sm">
          <FormSwitch 
            v-model="form.vender_durante_evento" 
            label="Permitir venta de entradas con el evento en curso" 
          />
          <small class="form-text text-muted mt-2 d-block">
            <i class="fas fa-fire text-danger mr-1"></i> Si se activa, el público podrá seguir comprando entradas incluso si ya pasó la "Fecha de Inicio", hasta que llegue la <b>Fecha y Hora Fin</b> del evento.
          </small>
        </div>

        <div class="form-group mt-3">
          <label class="font-weight-bold">Imagen del Evento</label>
          <div v-if="isEditing && currentImageUrl" class="mb-3 p-2 border rounded text-center">
            <img
              :src="currentImageUrl"
              alt="Imagen actual"
              style="max-width: 100%; max-height: 180px; border-radius: 8px; object-fit: cover;"
            />
            <small class="d-block mt-2 text-muted">Imagen actual. Selecciona una nueva para reemplazarla.</small>
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


        <h5 class="mt-5 text-primary border-bottom pb-2">Tipos de Entrada</h5>
        <div v-if="loadingTipos" class="text-center my-3">
          <i class="fas fa-spinner fa-spin text-primary"></i> Cargando tipos...
        </div>
        <div v-if="errorTipos" class="alert alert-danger shadow-sm">
          {{ errorTipos }}
        </div>

        <div
          v-for="(tipo, idx) in tipos"
          :key="tipo.id_tipo_entrada || `new-${idx}`"
          class="border rounded p-3 mb-3 bg-light shadow-sm"
        >
          <div class="d-flex justify-content-between align-items-center mb-3">
            <strong class="text-dark">Tipo #{{ idx + 1 }}
              <span v-if="tipo.id_tipo_entrada" class="badge badge-info ml-1">ID: {{ tipo.id_tipo_entrada }}</span>
            </strong>
            <FormButton
              theme="danger"
              small
              @click="handleRemoveTipo(idx)"
              :disabled="loadingTipos"
            >
              <i class="fas fa-trash"></i> Eliminar
            </FormButton>
          </div>

          <div class="mb-3">
            <FormText 
              v-model="tipo.nombre_tipo" 
              label="Nombre Tipo" 
              placeholder="Ej: Vip" 
              required 
            />
          </div>

          <div class="form-row mb-3">
            <div class="col">
              <FormNumber 
                v-model.number="tipo.precio" 
                label="Precio" 
                placeholder="Ej: 15000.00" 
                required 
              />
            </div>
            <div class="col">
              <FormNumber 
                v-model.number="tipo.cantidad_total" 
                label="Cantidad Total" 
                placeholder="Ej: 100" 
                required 
              />
            </div>
          </div>

          <div class="form-group mb-0">
            <label>Descripción Adicional</label>
            <textarea
              v-model="tipo.descripcion_adicional"
              class="form-control"
              rows="2"
              placeholder="Ej: Entrada con comida y bebida"
            ></textarea>
          </div>
        </div>

        <FormButton
          outlined
          theme="primary"
          class="mb-3 w-100 mt-2"
          @click="addTipo"
          :disabled="loadingTipos"
        >
          <i class="fas fa-plus"></i> Agregar Tipo de Entrada
        </FormButton>
      </form>
    </template>

    <template #footer>
      <FormButton theme="secondary" class="mr-2" @click="close">Cancelar</FormButton>
      <FormButton theme="primary" @click="submit" :disabled="loading">
        <i class="fas fa-spinner fa-spin mr-1" v-if="loading"></i>
        {{ submitButtonText }}
      </FormButton>
    </template>
  </VueModal>
</template>

<script>
import VueModal from '@/components/Modal/VueModal.vue';
import FormUploader from '@/components/Form/FormUploader.vue';
// IMPORTAMOS TODOS TUS COMPONENTES HERMOSOS
import FormText from '@/components/Form/FormText.vue';
import FormSelect from '@/components/Form/FormSelect.vue';
import FormNumber from '@/components/Form/FormNumber.vue';
import FormButton from '@/components/Form/FormButton.vue';
import FormSwitch from '@/components/Form/FormSwitch.vue';
import { mapActions, mapGetters } from 'vuex';

const initialEventFormState = () => ({
  nombre_evento: '',
  descripcion: '',
  fecha_hora_inicio: '',
  fecha_hora_fin: '',
  fecha_inicio_venta: '',
  lugar_nombre: '',
  lugar_direccion: '',
  categoria: '',
  estado_evento: 'proximamente',
  vender_durante_evento: false,
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
  // DECLARAMOS LOS COMPONENTES ACÁ
  components: { 
    VueModal, 
    FormUploader, 
    FormText, 
    FormSelect, 
    FormNumber, 
    FormButton, 
    FormSwitch 
  },
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
      initialTiposState: [],
      // OPCIONES PARA TU COMPONENTE FORM SELECT
      estadoOptions: [
        { value: 'proximamente', name: 'Próximamente', label: 'Próximamente', text: 'Próximamente' },
        { value: 'disponible', name: 'Disponible', label: 'Disponible', text: 'Disponible' },
        { value: 'agotado', name: 'Agotado', label: 'Agotado', text: 'Agotado' },
        { value: 'pasado', name: 'Pasado', label: 'Pasado', text: 'Pasado' },
        { value: 'cancelado', name: 'Cancelado', label: 'Cancelado', text: 'Cancelado' }
      ]
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
      if (this.isEditing && this.eventoToEdit) {
        this.form = {
          nombre_evento: this.eventoToEdit.nombre_evento || '',
          descripcion: this.eventoToEdit.descripcion || '',
          fecha_hora_inicio: this.formatDateForInput(this.eventoToEdit.fecha_hora_inicio),
          fecha_hora_fin: this.formatDateForInput(this.eventoToEdit.fecha_hora_fin),
          fecha_inicio_venta: this.formatDateForInput(this.eventoToEdit.fecha_inicio_venta),
          lugar_nombre: this.eventoToEdit.lugar_nombre || '',
          lugar_direccion: this.eventoToEdit.lugar_direccion || '',
          categoria: this.eventoToEdit.categoria || '',
          estado_evento: this.eventoToEdit.estado_evento || 'proximamente',
          vender_durante_evento: this.eventoToEdit.vender_durante_evento === true || this.eventoToEdit.vender_durante_evento === 'true',
          evento_id: this.eventoToEdit.evento_id
        };
        this.currentImageUrl = this.eventoToEdit.imagen_url;
        this.imageFile = null;

        if (this.eventoToEdit.tipos_entrada && this.eventoToEdit.tipos_entrada.length > 0) {
          this.tipos = JSON.parse(
            JSON.stringify(
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
          this.initialTiposState = JSON.parse(JSON.stringify(this.tipos)); 
        } else {
          this.tipos = [initialTicketTypeState()];
          this.initialTiposState = JSON.parse(JSON.stringify(this.tipos));
        }
      } else {
        this.resetFormAndState();
      }
    },

    resetFormAndState() {
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
        return true;
      }
      const tipoInicial = this.initialTiposState.find(
        (t) => t.id_tipo_entrada === tipoActual.id_tipo_entrada
      );
      if (!tipoInicial) {
        return true;
      }

      const changed = (
        tipoActual.nombre_tipo !== tipoInicial.nombre_tipo ||
        parseFloat(tipoActual.precio) !== parseFloat(tipoInicial.precio) ||
        parseInt(tipoActual.cantidad_total, 10) !== parseInt(tipoInicial.cantidad_total, 10) ||
        tipoActual.descripcion_adicional !== tipoInicial.descripcion_adicional
      );
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
          }

          await this.updateEventoAction({
            eventoId: this.form.evento_id,
            eventoData: eventoFormData
          });

          const promisesTipos = this.tipos.map(async (tipo) => {
            const tipoPayload = {
              nombre_tipo: tipo.nombre_tipo,
              precio: tipo.precio,
              cantidad_total: tipo.cantidad_total,
              descripcion_adicional: tipo.descripcion_adicional,
              cantidad_disponible: tipo.cantidad_disponible,
            };

            if (tipo.id_tipo_entrada) {
              const cambioDetectado = this.hasTipoChanged(tipo);
              if (cambioDetectado) {
                return this.updateTipoEntradaAction({
                  id_tipo_entrada: tipo.id_tipo_entrada,
                  ...tipoPayload
                });
              }
            } else {
              return this.createTipo({
                ...tipoPayload,
                id_evento: this.form.evento_id,
              });
            }
            return Promise.resolve();
          });

          await Promise.all(promisesTipos);

          this.$toast.success('Evento y sus tipos de entrada actualizados correctamente!');
          this.$emit('eventSaved');
          this.close();
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || 'Error desconocido al actualizar.';
          this.$toast.error(`Error: ${errMsg}`);
        }
      } else {
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
          const errMsg = err.response?.data?.message || err.message || 'Error desconocido al crear el evento.';
          this.$toast.error(`Error al crear evento: ${errMsg}`);
        }
      }
    }
  }
};
</script>