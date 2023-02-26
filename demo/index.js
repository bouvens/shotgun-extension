import initialize from './src'

const INITIALIZATION_TIMER_NAME = '🔫 Initialization'

document.addEventListener('readystatechange', (event) => {
  if (event.target.readyState !== 'complete') {
    return
  }
  console.time(INITIALIZATION_TIMER_NAME)
  initialize()
  console.timeEnd(INITIALIZATION_TIMER_NAME)
})
