import { GRAVITY_ACCELERATION, SLOW_MOTION_MULTIPLIER } from '../config.js'
import { shifted } from '../controller/shift.js'

export const allParticles = new Set()

export function makeMoveParticle() {
  const slowMotionMultiplier = shifted ? SLOW_MOTION_MULTIPLIER : 1
  const acceleration = GRAVITY_ACCELERATION * (slowMotionMultiplier ** 2)
  return (particle) => {
    const x = particle.x + particle.xVelocity * slowMotionMultiplier
    const y = particle.y + particle.yVelocity * slowMotionMultiplier
    const rotation = particle.rotation + particle.rotationSpeed * slowMotionMultiplier
    Object.assign(particle, {
      x,
      y,
      yVelocity: particle.yVelocity + acceleration,
      rotation,
    })
  }
}
