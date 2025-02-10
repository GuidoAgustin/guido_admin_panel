<template>
  <div class="he-sidemenu he-tools-menu" :class="{ open }">
    <div class="he-close" @click="toggle">
      <span class="material-symbols-outlined">double_arrow</span>
    </div>

    <div class="he-title">
      <h6>Toolbar</h6>
    </div>

    <div class="he-wrapper">
      <div class="he-tools mb-1">
        <div
          class="he-tool responsive"
          :class="{ active: isMobile }"
          @click="$emit('onChangePreviewSize', 'mobile')"
        >
          <div class="icon">
            <i class="material-symbols-outlined"> phone_iphone </i>
          </div>
          <span>Mobile view</span>
        </div>
        <div
          class="he-tool responsive"
          :class="{ active: !isMobile }"
          @click="$emit('onChangePreviewSize', 'desktop')"
        >
          <div class="icon">
            <i class="material-symbols-outlined"> computer </i>
          </div>
          <span>Desktop view</span>
        </div>
      </div>

      <draggable
        v-model="tools"
        :group="{ name: 'he-col-content', pull: 'clone', put: false }"
        :sort="false"
        itemKey="id"
        class="he-tools"
        :clone="cloneFn"
      >
        <template #item="{ element: tool }">
          <div class="he-tool">
            <div class="icon">
              <i class="material-symbols-outlined">{{ tool.icon }}</i>
            </div>
            <span>{{ tool.title }}</span>
          </div>
        </template>
      </draggable>

      <template v-if="templates?.length">
        <h6 class="mt-3">Sections</h6>
        <draggable
          v-model="templatesArray"
          :group="{ name: 'he-rows', pull: 'clone', put: false }"
          :sort="false"
          itemKey="key"
          class="he-tools"
          :clone="cloneTemplateFn"
        >
          <template #item="{ element: tool, index }">
            <div class="he-tool">
              <div class="icon">
                <i class="material-symbols-outlined">view_cozy</i>
              </div>
              <span>{{ tool.name }}</span>

              <button @click="$emit('deleteTemplate', index)">
                <div class="fa fa-close"></div>
              </button>
            </div>
          </template>
        </draggable>
      </template>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { deepCopy, keyGen } from '../composables'

export default {
  components: {
    Draggable
  },
  props: {
    templates: Array,
    isMobile: Boolean
  },
  emits: ['deleteTemplate', 'onChangePreviewSize'],
  data: () => ({
    open: false,
    tools: [
      {
        id: 'heading',
        title: 'Heading',
        icon: 'title',
        el: {
          tag: 'div',
          class: 'he-text',
          style: {},
          children: [
            {
              tag: 'p',
              innerHtml: "<span class='text-huge'>Heading</span>"
            }
          ]
        }
      },
      {
        id: 'text',
        title: 'Text',
        icon: 'text_fields_alt',
        el: {
          tag: 'div',
          class: 'he-text',
          style: {},
          children: [
            {
              tag: 'p',
              innerHtml: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.'
            },
            {
              tag: 'p',
              innerHtml:
                'Debitis totam numquam quos accusantium nisi, deserunt odit unde! Praesentium facere, totam, provident nihil labore, numquam error dolor ullam molestias sit esse?'
            }
          ]
        }
      },
      {
        id: 'divider',
        title: 'Divider',
        icon: 'horizontal_rule',
        el: {
          tag: 'div',
          class: 'he-divider',
          style: {
            paddingTop: '8px',
            paddingBottom: '8px'
          },
          child: {
            tag: 'div',
            style: {
              borderTop: '1px solid rgba(0, 0, 0, .1)',
              display: 'block',
              width: '100%'
            }
          }
        }
      },
      {
        id: 'image',
        title: 'Image',
        icon: 'image',
        el: {
          tag: 'div',
          class: 'he-img',
          style: {
            textAlign: 'left'
          },
          child: {
            tag: 'img',
            src: 'https://placehold.co/150',
            style: {
              width: '100%'
            }
          }
        }
      },
      {
        id: 'button',
        title: 'Button',
        icon: 'buttons_alt',
        el: {
          class: 'he-button',
          tag: 'div',
          style: {},
          child: {
            tag: 'a',
            href: '#',
            innerText: 'Button',
            style: {
              backgroundColor: '#34bec2',
              color: '#ffffff',
              paddingTop: '8px',
              paddingBottom: '8px',
              paddingLeft: '16px',
              paddingRight: '16px',
              borderRadius: '8px',
              width: '100%',
              textAlign: 'center',
              fontWeight: 600
            }
          }
        }
      },
      {
        id: 'html',
        title: 'Html',
        icon: 'integration_instructions',
        el: {
          tag: 'div',
          class: 'he-html',
          innerHtml: '<div class="empty">Empty HTML. Click to modify</div>'
        }
      }
    ]
  }),
  computed: {
    templatesArray() {
      return this.templates
    }
  },
  mounted() {
    setTimeout(() => {
      this.open = true
    }, 10)
  },
  methods: {
    close() {
      this.open = false
    },
    toggle() {
      this.open = !this.open
    },
    cloneFn(tool) {
      return {
        key: keyGen(),
        ...deepCopy(tool.el)
      }
    },
    cloneTemplateFn(template) {
      return {
        ...deepCopy(template.html),
        key: keyGen()
      }
    }
  }
}
</script>

<style></style>
