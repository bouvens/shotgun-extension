import { shoot } from '../model/targets.js'

export function handleClick(event) {
  event.stopImmediatePropagation()
  event.preventDefault()

  const { pageX, pageY, shiftKey, ctrlKey } = event
  shoot(pageX, pageY, shiftKey, ctrlKey, (target) => {
    const flyingElem = document.createElement('div')

    flyingElem.textContent = target.elem.textContent
    Object.assign(flyingElem.style, {
      position: 'absolute',
      top: `${target.elem.offsetTop}px`,
      left: `${target.elem.offsetLeft}px`,
      height: `${target.height}px`,
      width: `${target.width}px`,
      display: 'flex',
      'align-items': 'center',
    })
    target.elem.parentNode.prepend(flyingElem)
    target.elem.style.visibility = 'hidden'

    return flyingElem
  })
}
