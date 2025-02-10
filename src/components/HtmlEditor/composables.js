import { computed } from 'vue'

export const defaultRow = {
  tag: 'tr',
  style: {},
  child: {
    tag: 'td',
    style: {},
    child: {
      tag: 'table',
      child: {
        tag: 'tr',
        children: []
      }
    }
  }
}

export const defaultCol = {
  tag: 'td',
  style: {},
  children: []
}

export function keyGen() {
  return Math.floor(Math.random() * Date.now())
    .toString()
    .slice(0, 10)
}

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function removeUrl(input) {
  const regex = /url\(['"]?([^'"]+)['"]?\)/
  const match = input.match(regex)

  return match ? match[1] : null
}

export function useModel({ emit, props }) {
  const result = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    }
  })
  return result
}
