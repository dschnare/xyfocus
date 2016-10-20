import * as XYDirections from './XYDirections'
import getElementsHitByVec from './Foundation/getElementsHitByVec'
import * as XYVectors from './Foundation/XYVectors'
import XYFocusManagerFocusRootMixin from './XYFocusManagerFocusRootMixin'
import XYFocusManagerFocusEngagementMixin from './XYFocusManagerFocusEngagementMixin'

class XYFocusManager {
  constructor (focusManager, keyboardInputManager) {
    this.focusManager = focusManager

    this.keyboardInputManager = keyboardInputManager
    keyboardInputManager.addKeyMapping(XYDirections.DIR_RIGHT, { key: 'ArrowRight', keyCode: 39 })
    keyboardInputManager.addKeyMapping(XYDirections.DIR_RIGHT, { key: 'Tab', keyCode: 9 })
    keyboardInputManager.addKeyMapping(XYDirections.DIR_LEFT, { key: 'ArrowLeft', keyCode: 37 })
    keyboardInputManager.addKeyMapping(XYDirections.DIR_LEFT, { key: 'Tab', keyCode: 9, shiftKey: true })
    keyboardInputManager.addKeyMapping(XYDirections.DIR_UP, { key: 'ArrowUp', keyCode: 38 })
    keyboardInputManager.addKeyMapping(XYDirections.DIR_DOWN, { key: 'ArrowDown', keyCode: 40 })

    var self = this
    this.keyboardInputManager.addEventListener('keyinput', function (event) {
      switch (event.keyClass) {
        case XYDirections.DIR_RIGHT:
        case XYDirections.DIR_LEFT:
        case XYDirections.DIR_UP:
        case XYDirections.DIR_DOWN:
          var nextFocusEl = self.getNextFocusElement(event.keyClass)
          if (nextFocusEl) {
            self.focusManager.setCurrentFocusElement(nextFocusEl)
            event.preventDefault()
            event.stopImmediatePropagation()
          }
          break
      }
    })
  }

  getFocusElementNavigationVectorOrigin (el, xyDirection) {
    var rect = el.getBoundingClientRect()
    var origin = {
      x: Math.round(rect.left + rect.width / 2),
      y: Math.round(rect.top + rect.height / 2)
    }

    switch (xyDirection) {
      case XYDirections.DIR_RIGHT:
        origin.x = rect.left + rect.width
        break
      case XYDirections.DIR_DOWN:
        origin.y = rect.top + rect.height
        break
      case XYDirections.DIR_LEFT:
        origin.x = rect.left
        break
      case XYDirections.DIR_UP:
        origin.y = rect.top
        break
      default:
        throw new Error('XY direction not supported "' + xyDirection + '"')
    }

    return origin
  }

  // getNextFocusElement()
  // getNextFocusElement(xyDirection)
  getNextFocusElement (xyDirection) {
    var el = this.focusManager.currentFocusElement()
    var vec = null

    xyDirection = xyDirection || XYDirections.DIR_RIGHT

    if (!el) return null
    if (el.dataset[xyDirection + 'NextFocus']) return document.querySelector(el.dataset[xyDirection + 'NextFocus'])

    var { x, y } = this.getFocusElementNavigationVectorOrigin(el, xyDirection)

    switch (xyDirection) {
      case XYDirections.DIR_RIGHT:
        vec = XYVectors.VEC_RIGHT
        break
      case XYDirections.DIR_LEFT:
        vec = XYVectors.VEC_LEFT
        break
      case XYDirections.DIR_UP:
        vec = XYVectors.VEC_UP
        break
      case XYDirections.DIR_DOWN:
        vec = XYVectors.VEC_DOWN
        break
      default:
        throw new Error('XY direction not supported "' + xyDirection + '"')
    }

    var nextFocusEl = getElementsHitByVec(x, y, vec)
      .filter(this.focusManager.isElementFocusable.bind(this.focusManager))
      .shift()

    if (!nextFocusEl) {
      var offset = (xyDirection === XYDirections.DIR_RIGHT || xyDirection === XYDirections.DIR_DOWN) ? 1 : -1
      nextFocusEl = this.focusManager.getNextTabbableElement(el, offset)
    }

    return nextFocusEl
  }
}

export default XYFocusManagerFocusEngagementMixin(
    XYFocusManagerFocusRootMixin(XYFocusManager)
)
