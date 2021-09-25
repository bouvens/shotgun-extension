const allTargets = new Set()
const allParticles = new Set()
const FIRE_RADIUS = 100
const MEGA_MULTIPLIER = 0.1
const getInitialSpeed = (animationSpeed) => 3 * animationSpeed
const getSpeedDispersion = (animationSpeed) => 0.3 * animationSpeed
const getYAcceleration = (animationSpeed) => 0.05 * (animationSpeed ** 2)
const ROTATION_VARIANTS = 30
const getFastRotation = (animationSpeed) => 2 / animationSpeed
const getSlowRotation = (animationSpeed) => 5 / animationSpeed

let scrollLeft
let scrollTop
let windowWidth
let windowHeight
let shifted = false

function distance(x1, y1, x2, y2) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
}

function getDispersion(c) {
  return (Math.random() * 2 - 1) * c
}

function handleClick(event) {
  event.stopImmediatePropagation()
  event.preventDefault()
  const { pageX, pageY, shiftKey } = event
  const animationSpeed = shiftKey ? MEGA_MULTIPLIER : 1

  allTargets.forEach((target) => {
    const curDistance = distance(pageX, pageY, target.x, target.y)
    if (curDistance > FIRE_RADIUS) {
      return
    }
    allTargets.delete(target)
    // TODO rewrite shorter
    const xVelocity = (target.x - pageX) / curDistance * getInitialSpeed(animationSpeed) +
      getDispersion(getSpeedDispersion(animationSpeed))
    const yVelocity = (target.y - pageY) / curDistance * getInitialSpeed(animationSpeed) +
      getDispersion(getSpeedDispersion(animationSpeed))

    const rotatingElement = document.createElement('div')
    Object.assign(rotatingElement.style, {
      'animation-duration': `${Math.random() *
      (getSlowRotation(animationSpeed) - getFastRotation(animationSpeed)) +
      getFastRotation(animationSpeed)}s`,
      'animation-iteration-count': 'infinite',
      'animation-name': `rotate${Math.floor(Math.random() * ROTATION_VARIANTS)}`,
    })
    rotatingElement.textContent = target.elem.textContent

    const flyingElement = document.createElement('div')
    Object.assign(flyingElement.style, {
      position: 'absolute',
      top: `${target.elem.offsetTop}px`,
      left: `${target.elem.offsetLeft}px`,
      height: `${target.height}px`,
      width: `${target.width}px`,
      display: 'flex',
      'align-items': 'center',
    })
    flyingElement.append(rotatingElement)

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

function moveParticles() {
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
    particle.yVelocity += getYAcceleration(shifted ? MEGA_MULTIPLIER : 1)

    particle.elem.style.transform = `translate(${x}px, ${y}px)`
  })
  requestAnimationFrame(moveParticles)
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

  allTargets.forEach((target) => {
    Object.assign(target, { ...position(target.elem) })
  })
}

function updateShifted() {
  function update(e) {
    const newShifted = e.shiftKey
    if (newShifted && !shifted) {
      allParticles.forEach((particle) => {
        Object.assign(particle, {
          xVelocity: particle.xVelocity * MEGA_MULTIPLIER,
          yVelocity: particle.yVelocity * MEGA_MULTIPLIER,
        })
      })
      shifted = true
    } else if (!newShifted && shifted) {
      allParticles.forEach((particle) => {
        Object.assign(particle, {
          xVelocity: particle.xVelocity / MEGA_MULTIPLIER,
          yVelocity: particle.yVelocity / MEGA_MULTIPLIER,
        })
      })
      shifted = false
    }
  }

  window.document.addEventListener('keydown', update)
  window.document.addEventListener('keyup', update)
}

function getVectorCoordinate() {
  return Math.random() * 2 - 1
}

function addAnimations() {
  const style = document.createElement('style')
  document.head.append(style)
  for (let i = 0; i < ROTATION_VARIANTS; i++) {
    style.sheet.insertRule(`
        @keyframes rotate${i} {
          to {
            transform: rotate3d(${getVectorCoordinate()}, ${getVectorCoordinate()}, ${getVectorCoordinate()}, 360deg);
          }
        }
      `)
  }
}

function initialize() {
  console.time('initialization')
  addShield()
  updateScroll()
  updateSize()
  updateShifted()
  window.addEventListener('scroll', updateScroll)
  window.addEventListener('resize', updateSize)
  addAnimations()
  visibleElements.forEach(prepareElement)
  requestAnimationFrame(moveParticles)
  console.timeEnd('initialization')
}

document.addEventListener('readystatechange', (event) => {
  if (event.target.readyState !== 'complete') {
    return
  }
  initialize()
})
