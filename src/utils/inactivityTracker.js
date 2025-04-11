export default function createInactivityTracker({
    inactivityTimeout,
    countdownTime,
    onLogout,
    onShowModal,
    onHideModal,
  }) {
    let inactivityTimer = null
    let countdownTimer = null
    let countdownEndTime = null
  
    const startInactivityTimer = () => {
      clearTimers()
      inactivityTimer = setTimeout(() => {
        startCountdownTimer()
      }, inactivityTimeout)
    }
  
    const startCountdownTimer = () => {
      countdownEndTime = Date.now() + countdownTime
      localStorage.setItem('inactivity-countdown-start', Date.now())
      onShowModal()
      countdownTimer = setInterval(() => {
        const remainingTime = countdownEndTime - Date.now()
        if (remainingTime <= 0) {
          clearTimers()
          onLogout()
        }
      }, 1000)
    }
  
    const clearTimers = () => {
      clearTimeout(inactivityTimer)
      clearInterval(countdownTimer)
    }
  
    const resetTimers = () => {
      startInactivityTimer()
      localStorage.setItem('inactivity-reset', Date.now())
    }
  
    const syncBetweenTabs = () => {
      window.addEventListener('storage', (event) => {
        if (event.key === 'inactivity-reset') {
          startInactivityTimer()
        } else if (event.key === 'inactivity-countdown-start') {
          const remainingTime = countdownTime - (Date.now() - event.newValue)
          countdownEndTime = Date.now() + remainingTime
          clearTimers()
          onShowModal()
          countdownTimer = setInterval(() => {
            const remainingTime = countdownEndTime - Date.now()
            if (remainingTime <= 0) {
              clearTimers()
              onLogout()
            }
          }, 1000)
        } 
        else if (event.key === 'inactivity-stay-logged-in') {
          clearTimers()
          onHideModal()
        }
      })
    }
  
    syncBetweenTabs()
    resetTimers()
  
    window.addEventListener('mousemove', resetTimers)
    window.addEventListener('keydown', resetTimers)
  
    return {
      resetTimers,
      clearTimers,
      stayLoggedIn() {
        localStorage.setItem('inactivity-stay-logged-in', Date.now())
        onHideModal()
        resetTimers()
      },
    }
  }