# Documentación del Componente VueModal

## Descripción

VueModal es un componente de Vue.js que implementa una ventana modal personalizable con efectos de transición. El modal puede posicionarse en diferentes lugares de la pantalla y ajustarse a varios tamaños predefinidos.

## Propiedades

| Propiedad | Tipo   | Valores permitidos                         | Valor por defecto | Descripción                                 |
| --------- | ------ | ------------------------------------------ | ----------------- | ------------------------------------------- |
| size      | String | 'xs', 'sm', 'md', 'lg'                     | 'lg'              | Define el tamaño del modal                  |
| position  | String | 'center', 'left', 'right', 'top', 'bottom' | 'center'          | Define la posición del modal en la pantalla |

## Slots

El componente cuenta con tres slots para personalizar el contenido:

- title: Para el título del modal
- body: Para el contenido principal del modal
- footer: Para el pie del modal (opcional)

## Eventos

- close: Se emite cuando el modal se cierra completamente

## Ejemplo de uso básico

```
<template>
  <VueModal @close="handleClose">
    <!-- Título del modal -->
    <template #title>
      Mi Título
    </template>

    <!-- Contenido del modal -->
    <template #body>
      <p>Este es el contenido de mi modal</p>
    </template>

    <!-- Pie del modal (opcional) -->
    <template #footer>
      <button @click="handleClose">Cerrar</button>
    </template>
  </VueModal>
</template>

<script>
import VueModal from '@/components/Modal/VueModal.vue'

export default {
  components: {
    VueModal
  },
  methods: {
    handleClose() {
      // Manejar el cierre del modal
    }
  }
}
</script>
```

## Ejemplo con diferentes configuraciones

```
<template>
  <VueModal
    size="sm"
    position="right"
    @close="handleClose"
  >
    <template #title>
      Modal Pequeño a la Derecha
    </template>

    <template #body>
      <p>Contenido del modal</p>
    </template>
  </VueModal>
</template>
```

## Características

- Transiciones animadas al abrir y cerrar
- Se cierra automáticamente al presionar la tecla ESC
- Bloquea el scroll del body cuando está abierto
- Ajusta automáticamente el z-index de la barra lateral
- Botón de cierre incluido en la esquina superior derecha
- Footer opcional que solo se muestra si se proporciona contenido

## Notas importantes

1. El componente maneja automáticamente:

- El bloqueo del scroll de la página
- Los eventos de teclado (ESC para cerrar)
- La limpieza de eventos al desmontarse

2. Para implementar el modal, asegúrate de:

- Importar el componente correctamente
- Manejar el evento close para realizar acciones necesarias al cerrar
- Proporcionar al menos el contenido para los slots title y body

3. Los estilos CSS necesarios deben estar definidos en tu aplicación para las clases:

- .vue-modal
- .vue-modal-content
- .modal-header
- .modal-body
- .modal-footer
- Las clases de tamaño (modal-xs, modal-sm, etc.)
- Las clases de posición (position-center, position-left, etc.)

## Recomendaciones de uso

- Utiliza el tamaño apropiado según la cantidad de contenido
- Considera la posición del modal según el contexto de uso
- Implementa una lógica clara para el manejo del cierre del modal
- Asegúrate de proporcionar feedback visual adecuado en las interacciones
