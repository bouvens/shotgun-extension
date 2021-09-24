const allTargets = new Set()
const allParticles = new Set()
const FIRE_RADIUS = 100
const X_INITIAL_SPEED = 3
const Y_INITIAL_SPEED = 3
const SPEED_DISPERSION = 0.3
const Y_ACCELERATION = 0.05

let scrollLeft
let scrollTop
let windowWidth
let windowHeight

function distance(x1, y1, x2, y2) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
}

function getDispersion(c) {
  return (Math.random() * 2 - 1) * c
}

function handleClick(event) {
  // TODO add coverage for a whole page to prevent other events, elem.style.cursor = 'crosshair'
  event.stopImmediatePropagation()
  event.preventDefault()
  const { pageX, pageY } = event

  allTargets.forEach(target => {
    const curDistance = distance(pageX, pageY, target.x, target.y)
    if (curDistance > FIRE_RADIUS) {
      return
    }
    allTargets.delete(target)
    const xVelocity = (target.x - pageX) / curDistance * X_INITIAL_SPEED +
      getDispersion(SPEED_DISPERSION)
    const yVelocity = (target.y - pageY) / curDistance * Y_INITIAL_SPEED +
      getDispersion(SPEED_DISPERSION)
    allParticles.add({
      elem: target.elem,
      x: 0,
      y: 0,
      initBottom: target.bottom,
      initRight: target.right,
      xVelocity,
      yVelocity,
    })
    Object.assign(target.elem.style, {
      position: 'relative',
      transform: 'translate(0, 0)',
    })
  })
}

function position(elem) {
  const rect = elem.getBoundingClientRect()
  const bottom = rect.bottom + scrollTop
  const right = rect.right + scrollLeft
  return { bottom, right, y: bottom - rect.height / 2, x: right - rect.width / 2 }
}

function prepareElement(elem) {
  if (!isVisible(elem)) {
    return
  }

  Object.assign(elem.style, {
    cursor: 'crosshair',
    'user-select': 'none',
  })
  elem.childNodes.forEach(child => {
    if (!child.nodeValue) {
      return
    }
    const str = child.nodeValue
    const letters = []
    for (const letter of str) {
      const letterElement = document.createElement('span')
      letterElement.textContent = letter
      letters.push(letterElement)
    }
    child.remove()
    elem.prepend(...letters)
    letters.forEach((letterElement) => {
      allTargets.add({
        elem: letterElement,
        ...position(letterElement),
      })
    })
  })
}

function animate() {
  allParticles.forEach(particle => {
    const x = particle.x + particle.xVelocity
    const y = particle.y + particle.yVelocity
    const right = particle.initRight + x
    const bottom = particle.initBottom + y
    if (right >= windowWidth + scrollLeft
      || bottom >= windowHeight + scrollTop) {
      Object.assign(particle.elem.style, {
        visibility: 'hidden',
        top: '0px',
        left: '0px',
      })
      allParticles.delete(particle)
      return
    }
    particle.x = x
    particle.y = y
    particle.yVelocity += Y_ACCELERATION

    Object.assign(particle.elem.style, {
      left: `${x}px`,
      top: `${y}px`,
    })
  })
  requestAnimationFrame(animate)
}

function isVisible(elem) {
  // return elem.offsetParent !== null
  // slower and appropriate for fixed elements
  const style = window.getComputedStyle(elem)
  return style.display !== 'none'
}

const allElements = document.querySelectorAll('body *')
const visibleElements = Array.prototype.filter.call(allElements, isVisible)

function updateScroll() {
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  scrollTop = window.pageYOffset || document.documentElement.scrollTop
}

function updateSize() {
  windowWidth = window.innerWidth || document.documentElement.clientWidth
  windowHeight = window.innerHeight || document.documentElement.clientHeight
}

function initialize() {
  console.time('initialization')
  updateScroll()
  updateSize()
  window.addEventListener('click', handleClick)
  visibleElements.forEach(prepareElement)
  requestAnimationFrame(animate)
  console.timeEnd('initialization')
}

document.addEventListener('readystatechange', (event) => {
  if (event.target.readyState !== 'complete') {
    return
  }
  initialize()
})

window.addEventListener('scroll', updateScroll)

window.addEventListener('resize', updateSize)
