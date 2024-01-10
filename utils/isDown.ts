export const isDown = {
  ctrl: false,
  shift: false,
}

const addListeners = () => {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey) isDown.ctrl = true
  })
  document.addEventListener('keyup', e => {
    if (!e.ctrlKey) isDown.ctrl = false
  })
  
  document.addEventListener('keydown', e => {
    if (e.shiftKey) isDown.shift = true
  })
  document.addEventListener('keyup', e => {
    if (!e.shiftKey) isDown.shift = false
  })
}

export const clickAndHold = (key: keyof typeof isDown, callback: Function, fallback?: Function) => {
  if (isDown[key]) callback()
  if (!isDown[key] && fallback) fallback()
}

addListeners()
