import initialize from './src'

document.addEventListener('readystatechange', (event) => {
  if (event.target.readyState !== 'complete') {
    return
  }
  console.time('initialization')
  initialize()
  console.timeEnd('initialization')
})
