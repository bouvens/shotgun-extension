import { SLOW_MOTION_MULTIPLIER, GRAVITY_ACCELERATION } from '../config.js'
import { shifted } from '../controller/shift.js'
import { scrollLeft, scrollTop, windowHeight, windowWidth } from '../controller/viewport.js'

export const allParticles = new Set()

export function moveParticles() {
  const slowMotionMultiplier = shifted ? SLOW_MOTION_MULTIPLIER : 1
  let acceleration = GRAVITY_ACCELERATION * (slowMotionMultiplier ** 2)
  allParticles.forEach(particle => {
    const x = particle.x + particle.xVelocity * slowMotionMultiplier
    const y = particle.y + particle.yVelocity * slowMotionMultiplier
    const left = particle.initLeft + x
    const top = particle.initTop + y
    if (left >= windowWidth + scrollLeft
      || top >= windowHeight + scrollTop) {
      allParticles.delete(particle)
      particle.elem.remove()
      return
    }
    const rotation = particle.rotation + particle.rotationSpeed * slowMotionMultiplier
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
