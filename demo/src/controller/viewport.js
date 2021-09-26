export let scrollLeft
export let scrollTop
export let windowWidth
export let windowHeight

export function updateViewport(onSizeUpdate) {
  function updateScroll() {
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    scrollTop = window.pageYOffset || document.documentElement.scrollTop
  }

  function updateSize() {
    windowWidth = window.innerWidth || document.documentElement.clientWidth
    windowHeight = window.innerHeight || document.documentElement.clientHeight

    onSizeUpdate(scrollTop, scrollLeft)
  }

  window.addEventListener('scroll', updateScroll)
  window.addEventListener('resize', updateSize)

  updateScroll()
  updateSize()
}
