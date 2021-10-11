import { handleClick } from '../controller/click.js'
import { scrollLeft, scrollTop } from '../controller/viewport.js'
import { makeAddTarget } from '../model/targets.js'
import { SHARD_SIZE } from '../config.js'
import * as ELEMENT_TYPES from '../element-types.js'

const ABSOLUTE_POSITIONS = ['absolute', 'fixed']
const IMG_TAGS = ['IMG', 'CANVAS']

export function addShield() {
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

function divideImage(img) {
  const addTarget = makeAddTarget(scrollTop, scrollLeft, ELEMENT_TYPES.SHARD)
  const shards = []
  const { clientWidth, clientHeight } = img
  const columns = Math.ceil(clientWidth / SHARD_SIZE)
  const rows = Math.ceil(clientHeight / SHARD_SIZE)

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const canvas = document.createElement('canvas')
      const sx = x * SHARD_SIZE
      const sy = y * SHARD_SIZE
      const width = sx + SHARD_SIZE > img.clientWidth
        ? clientWidth - sx
        : SHARD_SIZE
      const height = sy + SHARD_SIZE > img.clientHeight
        ? clientHeight - sy
        : SHARD_SIZE
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      context.drawImage(img, sx, sy, width, height, 0, 0, width, height)
      shards.push(canvas)
    }
  }

  const imgWrapper = document.createElement('div')
  let absolute = ABSOLUTE_POSITIONS.includes(img.style.position)
  Object.assign(imgWrapper.style, {
    ...absolute ? {
      position: 'absolute',
      top: `${img.offsetTop}px`,
      left: `${img.offsetLeft}px`,
    } : {},
    width: `${clientWidth}px`,
    height: `${clientHeight}px`,
    display: 'flex',
    'flex-wrap': 'wrap',
  })
  imgWrapper.append(...shards)

  img.parentNode.replaceChild(imgWrapper, img)

  shards.forEach(addTarget)
}

function divideText(text) {
  text.childNodes.forEach(child => {
    if (!child.nodeValue) {
      return
    }
    const addTarget = makeAddTarget(scrollTop, scrollLeft, ELEMENT_TYPES.LETTER)
    const str = child.nodeValue
    const letters = []
    for (const letter of str) {
      const letterElement = document.createElement('span')
      letterElement.textContent = letter
      letters.push(letterElement)
    }
    child.remove()
    text.prepend(...letters)
    letters.forEach(addTarget)
  })
}

function prepareElement(elem) {
  if (IMG_TAGS.includes(elem.tagName)) {
    divideImage(elem)
    return
  }

  divideText(elem)
}

function isVisible(elem) {
  const style = window.getComputedStyle(elem)
  return style.display !== 'none'
}

export function decomposePage() {
  const allElements = document.querySelectorAll('body *')
  const visibleElements = Array.prototype.filter.call(allElements, isVisible)
  visibleElements.forEach(prepareElement)
}

