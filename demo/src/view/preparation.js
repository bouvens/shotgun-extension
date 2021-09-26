import { handleClick } from '../controller/click.js'
import { scrollLeft, scrollTop } from '../controller/viewport.js'
import { makeAddTarget } from '../model/targets.js'

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

function prepareElement(elem) {
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
    letters.forEach(makeAddTarget(scrollTop, scrollLeft))
  })
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

