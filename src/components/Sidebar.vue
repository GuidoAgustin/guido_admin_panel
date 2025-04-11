<template>
  <div class="sidebar">
    <div class="brand">
      <img src="/img/logo.svg" class="brand-logo" alt="" />
      <h1>QUARTZ</h1>
    </div>
    <ul class="menu">
      <li v-for="(menu, mi) of menus" :key="mi">
        <template v-if="menu.children && menu.children.length">
          <ul :id="`deep-${menu.title.toLowerCase().replaceAll(' ', '-')}`">
            <li v-for="(submenu, smi) of sortByTitle(menu.children)" :key="smi">
              <router-link
                :class="{
                  disabled: !submenu.to
                }"
                :to="submenu.to || '#'"
              >
                <span class="icon">{{ parseSubmenuIcon(submenu) }}</span>
                {{ submenu.title }}
              </router-link>
            </li>
          </ul>
          <a
            href="/"
            :data-target="`deep-${menu.title.toLowerCase().replaceAll(' ', '-')}`"
            @click.prevent="toggleTarget"
          >
            <i class="icon" :class="menu.icon" />
            {{ menu.title }}
            <i class="fa-solid fa-angle-right arrow" v-if="menu.children && menu.children.length" />
          </a>
        </template>
        <router-link
          v-else
          active-class="active"
          :class="{ disabled: !menu.to }"
          :to="menu.to || '/'"
          @click="closeSubmenus"
        >
          <div class="icon">
            <i :class="menu.icon" />
          </div>
          {{ menu.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import allMenus from '@/router/menus.js'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const { userCan } = store.getters
    const hasFunc = (funcs) => {
      if (!funcs) return true
      return funcs?.some((func) => userCan(func.name, func.mode)) || false
    }

    const menus = computed(() => {
      return allMenus
        .map((x) => ({
          ...x,
          children: (x.children || []).filter((c) => hasFunc(c.functionalities))
        }))
        .filter((x) => x.children?.length || hasFunc(x.functionalities))
    })

    const toggleTarget = (e) => {
      const others = document.querySelectorAll('ul.menu > li > ul')
      const t = document.getElementById(e.target.dataset.target)
      const canOpen = !t.classList.contains('opened')

      others.forEach((x) => {
        x.classList.remove('opened')
      })

      if (canOpen) {
        t.classList.add('opened')
      }
    }
    const closeSubmenus = () => {
      const others = document.querySelectorAll('ul.menu > li > ul')
      others.forEach((x) => {
        x.classList.remove('opened')
      })
    }
    const parseSubmenuIcon = (submenu) => {
      return submenu.title
        .toUpperCase()
        .split(' ')
        .map((x) => x[0])
        .slice(0, 2)
        .join('')
    }

    const sortByTitle = (submenus) => {
      return submenus.sort((a, b) => {
        return a.title > b.title ? 1 : -1
      })
    }

    return { toggleTarget, closeSubmenus, parseSubmenuIcon, sortByTitle, menus }
  }
}
</script>
