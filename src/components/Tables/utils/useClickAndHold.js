import { ref } from 'vue'

export function useClickAndHold(threshold = 500) {
  const isHold = ref(false)
  let holdTimeout = null

  const startHoldTimer = (onHold) => {
    isHold.value = false
    holdTimeout = setTimeout(() => {
      isHold.value = true
      if (onHold && typeof onHold === 'function') {
        onHold()
      }
    }, threshold)
  }

  const endHoldTimer = () => {
    clearTimeout(holdTimeout)
  }

  const cancelHoldTimer = () => {
    clearTimeout(holdTimeout)
  }

  return {
    isHold,
    startHoldTimer,
    endHoldTimer,
    cancelHoldTimer
  }
}
