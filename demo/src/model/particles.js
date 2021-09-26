import { MEGA_MULTIPLIER, Y_ACCELERATION } from '../config.js'
import { shifted } from '../controller/shift.js'
import { scrollLeft, scrollTop, windowHeight, windowWidth } from '../controller/viewport.js'

export const allParticles = new Set()

export function slowMotionOn() {
  allParticles.forEach((particle) => {
    Object.assign(particle, {
      xVelocity: particle.xVelocity * MEGA_MULTIPLIER,
      yVelocity: particle.yVelocity * MEGA_MULTIPLIER,
      rotationSpeed: particle.rotationSpeed * MEGA_MULTIPLIER,
    })
  })
}

export function slowMotionOff() {
  allParticles.forEach((particle) => {
    Object.assign(particle, {
      xVelocity: particle.xVelocity / MEGA_MULTIPLIER,
      yVelocity: particle.yVelocity / MEGA_MULTIPLIER,
      rotationSpeed: particle.rotationSpeed / MEGA_MULTIPLIER,
    })
  })
}

export function moveParticles() {
  let acceleration = Y_ACCELERATION * (shifted ? MEGA_MULTIPLIER ** 2 : 1)
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
    const rotation = particle.rotation + particle.rotationSpeed
    Object.assign(particle, {
      x,
      y,
      yVelocity: particle.yVelocity + acceleration,
      rotation,
    })

    particle.elem.style.transform =
      `translate(${x}px, ${y}px) rotate3d(${particle.rotationX}, ${particle.rotationY}, ${particle.rotationZ}, ${rotation}deg)`
  })
}
