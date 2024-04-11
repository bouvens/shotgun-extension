import {
  BIG_SHOT_MULTIPLIER,
  FAST_ROTATION_PERIOD_S,
  FIRE_RADIUS_PX,
  INITIAL_SPEED_MULTIPLIER,
  SLOW_ROTATION_PERIOD_S,
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

function getDistance(x1, y1, x2, y2) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
}

function getDispersedValue(c) {
  return (Math.random() * 2 - 1) * c
}

function getRandomVectorCoordinate() {
  return Math.random() * 2 - 1
}

export function shoot(x, y, big, createFlyingElem) {
  const radius = FIRE_RADIUS_PX * (big ? BIG_SHOT_MULTIPLIER : 1)

  allTargets.forEach((target) => {
    const distanceToTarget = getDistance(x, y, target.x, target.y)
    if (distanceToTarget > radius) {
      return
    }
    allTargets.delete(target)
    const time = distanceToTarget / INITIAL_SPEED_MULTIPLIER
    const speedShift = getDispersedValue(SPEED_DISPERSION)
    const xVelocity = ((target.x - x) / time + speedShift)
    const yVelocity = ((target.y - y) / time + speedShift)

    allParticles.add({
      elem: createFlyingElem(target),
      x: 0,
      y: 0,
      initTop: target.top,
      initLeft: target.left,
      xVelocity,
      yVelocity,
      rotation: 0,
      rotationX: getRandomVectorCoordinate(),
      rotationY: getRandomVectorCoordinate(),
      rotationZ: getRandomVectorCoordinate(),
      rotationSpeed: (Math.random() * (SLOW_ROTATION_PERIOD_S - FAST_ROTATION_PERIOD_S)
        + FAST_ROTATION_PERIOD_S),
    })
  })
}
