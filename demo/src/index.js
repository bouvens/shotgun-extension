import { onViewportSizeUpdate } from './model/targets.js'
import { animate } from './view/animation.js'
import { addShield, decomposePage } from './view/preparation.js'
import { updateShifted } from './controller/shift.js'
import { updateViewport } from './controller/viewport.js'

export default function initialize() {
  updateShifted()
  updateViewport(onViewportSizeUpdate)

  addShield()
  decomposePage()
  animate()
}
