// set the file extension to use the uncompressed script as a module
import initialize from './initialize.js'

const INITIALIZATION_TIMER_NAME = '🔫 Initialization'
const NOT_LOADED_ERROR_MESSAGE = "Page isn't ready"

window.startShooting = () => {
  if (window.document.readyState !== 'complete') {
    console.error(NOT_LOADED_ERROR_MESSAGE)
    return
  }
  // TODO add alert with help
  console.time(INITIALIZATION_TIMER_NAME)
  initialize()
  console.timeEnd(INITIALIZATION_TIMER_NAME)
}

// window.addEventListener('load', startShooting)
