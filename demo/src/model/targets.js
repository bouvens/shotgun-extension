import {
  FAST_ROTATION,
  FIRE_RADIUS,
  INITIAL_SPEED,
  MEGA_MULTIPLIER,
  SLOW_ROTATION,
  SPEED_DISPERSION,
} from '../config.js'
import { allParticles } from './particles.js'

export const allTargets = new Set()

function makePosition(topOffset, leftOffset) {
  return (elem) => {
    const rect = elem.getBoundingClientRect()
    const top = rect.top + topOffset
    const left = rect.left + leftOffset
    return {
      top,
      left,
      y: top + rect.height / 2,
      x: left + rect.width / 2,
      height: rect.height,
      width: rect.width,
    }
  }
}

export function makeAddTarget(topOffset, leftOffset, type) {
  const position = makePosition(topOffset, leftOffset)

  return (elem) => {
    allTargets.add({ ...position(elem), elem, type })
  }
}

export function onViewportSizeUpdate(topOffset, leftOffset) {
  const position = makePosition(topOffset, leftOffset)
  allTargets.forEach((target) => {
    Object.assign(target, { ...position(target.elem) })
  })
}

function distance(x1, y1, x2, y2) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
}

function getDispersion(c) {
  return (Math.random() * 2 - 1) * c
}

function getVectorCoordinate() {
  return Math.random() * 2 - 1
}

export function shoot(x, y, slowMotion, big, createFlyingElem) {
  const animationSpeed = slowMotion ? MEGA_MULTIPLIER : 1
  const radius = FIRE_RADIUS / (big ? MEGA_MULTIPLIER : 1)

  allTargets.forEach((target) => {
    const curDistance = distance(x, y, target.x, target.y)
    if (curDistance > radius) {
      return
    }
    allTargets.delete(target)
    const time = curDistance / INITIAL_SPEED
    const speedShift = getDispersion(SPEED_DISPERSION)
    const xVelocity = ((target.x - x) / time + speedShift) * animationSpeed
    const yVelocity = ((target.y - y) / time + speedShift) * animationSpeed

    allParticles.add({
      elem: createFlyingElem(target),
      x: 0,
      y: 0,
      initTop: target.top,
      initLeft: target.left,
      xVelocity,
      yVelocity,
      rotation: 0,
      rotationX: getVectorCoordinate(),
      rotationY: getVectorCoordinate(),
      rotationZ: getVectorCoordinate(),
      rotationSpeed: (Math.random() * (SLOW_ROTATION - FAST_ROTATION) + FAST_ROTATION) *
        animationSpeed,
    })
  })
}
