export let shifted = false

export function updateShifted(onShift, onUnshift) {
  function update(e) {
    const newShifted = e.shiftKey
    if (newShifted && !shifted) {
      onShift()
      shifted = true
    } else if (!newShifted && shifted) {
      onUnshift()
      shifted = false
    }
  }

  window.document.addEventListener('keydown', update)
  window.document.addEventListener('keyup', update)
}
