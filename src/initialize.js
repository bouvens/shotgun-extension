import { onViewportSizeUpdate } from './model/targets.js'
import { animate } from './view/animation.js'
import { addShield, decomposePage } from './view/preparation.js'
import { watchShifted } from './controller/shift.js'
import { watchViewport } from './view/viewport.js'
import { handleClick } from './controller/click.js'

export default function initialize() {
  watchShifted()
  watchViewport(onViewportSizeUpdate)

  decomposePage()
  addShield(handleClick)
  animate()
}
