import initialize from './initialize'

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
