// set file extensions to use the uncompressed script as a module
import initialize from './initialize.js'
import { HELP, INITIALIZATION_TIMER_NAME, NOT_LOADED_ERROR_MESSAGE } from './config.js'

window.startShooting = () => {
  if (window.document.readyState !== 'complete') {
    console.error(NOT_LOADED_ERROR_MESSAGE)
    return
  }

  console.time(INITIALIZATION_TIMER_NAME)
  initialize()
  console.timeEnd(INITIALIZATION_TIMER_NAME)

  alert(HELP)
}

// window.addEventListener('load', startShooting)
