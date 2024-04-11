import { allParticles, makeMoveParticle } from '../model/particles.js'
import { scrollLeft, scrollTop, windowHeight, windowWidth } from './viewport.js'

function repaintElement(particle, handleOut) {
  const { x, y } = particle

  const left = particle.initLeft + x
  const top = particle.initTop + y
  if (left >= windowWidth + scrollLeft
    || left < -particle.elem.width
    || Number.isNaN(particle.elem.width)
    || top >= windowHeight + scrollTop) {
    handleOut()
    return
  }

  particle.elem.style.transform = `translate(${x}px, ${y}px) rotate3d(${particle.rotationX}, ${particle.rotationY}, ${particle.rotationZ}, ${particle.rotation}deg)`
}

export function animate() {
  const moveParticle = makeMoveParticle()

  allParticles.forEach((particle) => {
    moveParticle(particle)
    repaintElement(particle, () => {
      allParticles.delete(particle)
      particle.elem.remove()
    })
  })

  requestAnimationFrame(animate)
}
