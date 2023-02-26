import { shoot } from '../model/targets.js'
import * as ELEMENT_TYPES from '../element-types.js'

export function handleClick(event) {
  event.stopImmediatePropagation()
  event.preventDefault()

  const { pageX, pageY, shiftKey, ctrlKey, metaKey } = event
  shoot(pageX, pageY, shiftKey, ctrlKey || metaKey, (target) => {
    switch (target.type) {
      case ELEMENT_TYPES.LETTER:
        const flyingLetter = document.createElement('div')

        flyingLetter.textContent = target.elem.textContent
        Object.assign(flyingLetter.style, {
          position: 'absolute',
          top: `${target.elem.offsetTop}px`,
          left: `${target.elem.offsetLeft}px`,
          height: `${target.height}px`,
          width: `${target.width}px`,
          display: 'flex',
          'align-items': 'center',
        })
        target.elem.parentNode.prepend(flyingLetter)
        target.elem.style.visibility = 'hidden'

        return flyingLetter
      case ELEMENT_TYPES.SHARD:
        const flyingImage = document.createElement('canvas')
        flyingImage.width = target.elem.width
        flyingImage.height = target.elem.height
        const context = flyingImage.getContext('2d')
        context.drawImage(target.elem, 0, 0)

        flyingImage.textContent = target.elem.textContent
        Object.assign(flyingImage.style, {
          position: 'absolute',
          top: `${target.elem.offsetTop}px`,
          left: `${target.elem.offsetLeft}px`,
          'box-shadow': '0 0 3px 0 rgba(0, 0, 0, 0.16), 0 0 3px 0 rgba(0, 0, 0, 0.23)',
        })
        target.elem.parentNode.prepend(flyingImage)
        target.elem.style.visibility = 'hidden'

        return flyingImage
      default:
        throw Error('undefined target type')
    }
  })
}
