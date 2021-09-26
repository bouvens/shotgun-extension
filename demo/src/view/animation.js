import { moveParticles } from '../model/particles.js'

export function animate() {
  moveParticles()
  requestAnimationFrame(animate)
}
