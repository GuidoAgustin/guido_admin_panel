import { ref, onMounted, onUnmounted, computed } from 'vue'

export function useMobileChecker() {
  const clientWidth = ref(document.documentElement.clientWidth)

  const listener = () => {
    clientWidth.value = document.documentElement.clientWidth
  }

  onMounted(() => {
    // Use window events
    window.addEventListener('load', listener)
    window.addEventListener('resize', listener)
  })

  onUnmounted(() => {
    // Clean up event listeners
    window.removeEventListener('load', listener)
    window.removeEventListener('resize', listener)
  })

  // Return computed value that updates when clientWidth changes
  return computed(() => clientWidth.value < 992)
}
