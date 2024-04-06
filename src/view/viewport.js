export let scrollLeft
export let scrollTop
export let windowWidth
export let windowHeight

export function watchViewport(onSizeUpdate) {
  function updateScroll() {
    scrollLeft = document.documentElement.scrollLeft
    scrollTop = document.documentElement.scrollTop
  }

  function updateSize() {
    windowWidth = document.documentElement.clientWidth
    windowHeight = document.documentElement.clientHeight

    onSizeUpdate(scrollTop, scrollLeft)
  }

  window.addEventListener('scroll', updateScroll)
  window.addEventListener('resize', updateSize)

  updateScroll()
  updateSize()
}
