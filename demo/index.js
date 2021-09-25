const allTargets = new Set()
const allParticles = new Set()
const FIRE_RADIUS = 100
const INITIAL_SPEED = 3
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
  event.stopImmediatePropagation()
  event.preventDefault()
  const { pageX, pageY } = event

  allTargets.forEach((target) => {
    const curDistance = distance(pageX, pageY, target.x, target.y)
    if (curDistance > FIRE_RADIUS) {
      return
    }
    allTargets.delete(target)
    const xVelocity = (target.x - pageX) / curDistance * INITIAL_SPEED +
      getDispersion(SPEED_DISPERSION)
    const yVelocity = (target.y - pageY) / curDistance * INITIAL_SPEED +
      getDispersion(SPEED_DISPERSION)
    const flyingElement = document.createElement('div')
    flyingElement.textContent = target.elem.textContent
    Object.assign(flyingElement.style, {
      position: 'absolute',
      top: `${target.elem.offsetTop}px`,
      left: `${target.elem.offsetLeft}px`,
    })
    target.elem.parentNode.prepend(flyingElement)
    target.elem.style.visibility = 'hidden'
    allParticles.add({
      elem: flyingElement,
      x: 0,
      y: 0,
      initTop: target.top,
      initLeft: target.left,
      xVelocity,
      yVelocity,
    })
  })
}

function position(elem) {
  const rect = elem.getBoundingClientRect()
  const top = rect.top + scrollTop
  const left = rect.left + scrollLeft
  return {
    top,
    left,
    y: top + rect.height / 2,
    x: left + rect.width / 2,
    height: rect.height,
    width: rect.width,
  }
}

function prepareElement(elem) {
  if (!isVisible(elem)) {
    return
  }

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
    const left = particle.initLeft + x
    const top = particle.initTop + y
    if (left >= windowWidth + scrollLeft
      || top >= windowHeight + scrollTop) {
      particle.elem.style.display = 'none'
      allParticles.delete(particle)
      return
    }
    particle.x = x
    particle.y = y
    particle.yVelocity += Y_ACCELERATION

    particle.elem.style.transform = `translate(${x}px, ${y}px)`
  })
  requestAnimationFrame(animate)
}

function isVisible(elem) {
  const style = window.getComputedStyle(elem)
  return style.display !== 'none'
}

const allElements = document.querySelectorAll('body *')
const visibleElements = Array.prototype.filter.call(allElements, isVisible)

function addShield() {
  const elem = document.createElement('div')
  Object.assign(elem.style, {
    cursor: 'crosshair',
    'user-select': 'none',
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '100%',
  })
  elem.addEventListener('click', handleClick)
  document.body.append(elem)
}

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
  addShield()
  updateScroll()
  updateSize()
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
