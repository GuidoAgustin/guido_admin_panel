<template>
    <VueModal v-if="visible" size="md" position="center" @close="close">
        <template #title>Crear Nuevo Evento</template>

        <template #body>
            <form @submit.prevent="submit">
                <!-- —— DATOS DEL EVENTO —— -->
                <h5>Datos del Evento</h5>

                <!-- Nombre -->
                <div class="form-group">
                    <label>Nombre del Evento</label>
                    <input v-model="form.nombre_evento" type="text" class="form-control"
                        placeholder="Ej: Festival de Música" required />
                </div>

                <!-- Descripción -->
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea v-model="form.descripcion" class="form-control" rows="2"
                        placeholder="Ej: Un evento para los amantes de la música." required></textarea>
                </div>

                <!-- Fechas -->
                <div class="form-row">
                    <div class="form-group col">
                        <label>Fecha y Hora Inicio</label>
                        <input v-model="form.fecha_hora_inicio" type="datetime-local" class="form-control" required />
                    </div>
                    <div class="form-group col">
                        <label>Fecha y Hora Fin</label>
                        <input v-model="form.fecha_hora_fin" type="datetime-local" class="form-control" />
                    </div>
                </div>

                <!-- Lugar -->
                <div class="form-row">
                    <div class="form-group col">
                        <label>Lugar (Nombre)</label>
                        <input v-model="form.lugar_nombre" type="text" class="form-control"
                            placeholder="Ej: Parque Central" required />
                    </div>
                    <div class="form-group col">
                        <label>Lugar (Dirección)</label>
                        <input v-model="form.lugar_direccion" type="text" class="form-control"
                            placeholder="Ej: Avenida Siempre Viva 123" required />
                    </div>
                </div>

                <!-- Categoría / Estado -->
                <div class="form-row">
                    <div class="form-group col">
                        <label>Categoría</label>
                        <input v-model="form.categoria" type="text" class="form-control" placeholder="Ej: Concierto"
                            required />
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

                <!-- Uploader de imagen -->
                <div class="form-group">
                    <label>Imagen del Evento</label>
                    <FormUploader v-model="imageFile" label="Seleccionar imagen" :maxSizeMB="10" :imageType="true" />
                </div>

                <!-- —— TIPOS DE ENTRADA —— -->
                <h5 class="mt-4">Tipos de Entrada</h5>
                <div v-for="(tipo, idx) in tipos" :key="idx" class="border rounded p-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong>Tipo #{{ idx + 1 }}</strong>
                        <button class="btn btn-sm btn-danger" @click.prevent="removeTipo(idx)" v-if="tipos.length > 1">
                            Eliminar
                        </button>
                    </div>

                    <div class="form-group">
                        <label>Nombre Tipo</label>
                        <input v-model="tipo.nombre_tipo" type="text" class="form-control" placeholder="Ej: Vip"
                            required />
                    </div>

                    <div class="form-row">
                        <div class="form-group col">
                            <label>Precio</label>
                            <input v-model.number="tipo.precio" type="number" step="0.01" class="form-control"
                                placeholder="Ej: 15000.00" required />
                        </div>
                        <div class="form-group col">
                            <label>Cantidad Total</label>
                            <input v-model.number="tipo.cantidad_total" type="number" class="form-control"
                                placeholder="Ej: 100" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Descripción Adicional</label>
                        <textarea v-model="tipo.descripcion_adicional" class="form-control" rows="2"
                            placeholder="Ej: Entrada con comida y bebida"></textarea>
                    </div>
                </div>

                <button class="btn btn-outline-primary mb-3" @click.prevent="addTipo">
                    + Agregar Tipo de Entrada
                </button>
            </form>
        </template>

        <template #footer>
            <button class="btn btn-secondary mr-2" @click="close">Cancelar</button>
            <button class="btn btn-primary" @click="submit">Crear Evento</button>
        </template>
    </VueModal>
</template>

<script>
import VueModal from '@/components/Modal/VueModal.vue'
import FormUploader from '@/components/Form/FormUploader.vue'
import { mapActions } from 'vuex'

export default {
    name: 'ModalForm',
    components: { VueModal, FormUploader },
    props: { visible: Boolean },
    data() {
        return {
            form: {
                nombre_evento: '',
                descripcion: '',
                fecha_hora_inicio: '',
                fecha_hora_fin: '',
                lugar_nombre: '',
                lugar_direccion: '',
                categoria: '',
                estado_evento: 'proximamente'
            },
            imageFile: null,
            tipos: [
                {
                    nombre_tipo: '',
                    precio: null,
                    cantidad_total: null,
                    cantidad_disponible: null,
                    descripcion_adicional: ''
                }
            ]
        }
    },
    methods: {
        ...mapActions('eventos', ['createEvento', 'createTipo', 'fetchTickets']),

        close() {
            this.$emit('update:visible', false)
            // reset
            Object.keys(this.form).forEach(
                k => (this.form[k] = k === 'estado_evento' ? 'proximamente' : '')
            )
            this.imageFile = null
            this.tipos = [
                {
                    nombre_tipo: '',
                    precio: null,
                    cantidad_total: null,
                    cantidad_disponible: null,
                    descripcion_adicional: ''
                }
            ]
        },

        addTipo() {
            this.tipos.push({
                nombre_tipo: '',
                precio: null,
                cantidad_total: null,
                cantidad_disponible: null,
                descripcion_adicional: ''
            })
        },

        removeTipo(i) {
            this.tipos.splice(i, 1)
        },

        async submit() {
            try {
                const payload = new FormData()
                Object.entries(this.form).forEach(([k, v]) => {
                    payload.append(k, v)
                })
                if (this.imageFile) payload.append('imagen', this.imageFile)

                const { data } = await this.createEvento(payload)
                const evento_id = data.data.evento_id

                for (const tipo of this.tipos) {
                    await this.createTipo({ ...tipo, id_evento: evento_id })
                }

                await this.fetchTickets()
                this.$toast.success('Evento y tipos creados correctamente')
                this.close()
            } catch (err) {
                console.error(err)
                this.$toast.error('Error al crear evento o tipos')
            }
        }
    }
}
</script>

<style scoped>
.form-row {
    display: flex;
    gap: 1rem;
}

.form-group {
    margin-bottom: 1rem;
    flex: 1;
}

.border {
    border: 1px solid #ddd;
}

.p-3 {
    padding: 1rem;
}

.mb-3 {
    margin-bottom: 1rem;
}
</style>
  
