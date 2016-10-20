import isElementVisible from './Foundation/isElementVisible'
import * as XYDirections from './XYDirections'

export default function XYFocusManagerFocusRootMixin (XYFocusManager) {
  return class XYFocusManagerFocusRoot extends XYFocusManager {
    constructor (focusManager, keyboardInputManager) {
      super(focusManager, keyboardInputManager)

      this._currFocusRoot = null
      this._currFocusEl = null

      // Prevent clicks and touches on the document from taking focus away from the
      // current focus root. This will only occur if the body of the web page is
      // really short and there is blank space below the body in the browser.
      document.documentElement.addEventListener('mousedown', function (event) {
        if (event.eventPhase === 2 /* AT_TARGET */) {
          event.preventDefault()
          event.stopImmediatePropagation()
        }
      })

      var self = this
      this.focusManager.addEventListener('focuschanging', function (event) {
        var focusRoot = self.getFocusRoot(event.focusElement)
        if (this._currFocusRoot && focusRoot !== this._currFocusRoot) {
          event.preventDefault()
        }
      })
      this.focusManager.addEventListener('focuschanged', function (event) {
        var focusRoot = self.getFocusRoot(event.focusElement)
        self._currFocusEl = event.focusElement
        self._currFocusRoot = focusRoot
      })

      document.body.tabIndex = -1
      document.body.dataset['focusRoot'] = ''

      var nextFocusEl = this.getFirstFocusableChild(document.body)
      this.focusManager.setCurrentFocusElement(nextFocusEl)
    }

    currentFocusRoot () {
      return this._currFocusRoot
    }

    currentFocusElement () {
      return this._currFocusEl
    }

    getFirstFocusableChild (parentEl) {
      return [].slice.call(parentEl.childNodes)
        .filter(this.focusManager.isElementFocusable.bind(this.focusManager))
        .filter(isElementVisible)
        .shift()
    }

    getFocusRoot (el) {
      el = el.parentNode
      while (el && el.dataset && el.dataset['focusRoot'] !== '') {
        el = el.parentNode
      }
      if (el && el.dataset && el.dataset['focusRoot'] === '') return el
      return null
    }

    // Overriddes

    getNextFocusElement (xyDirection) {
      var nextFocusEl = super.getNextFocusElement(xyDirection)

      if (nextFocusEl) {
        var focusRoot = this.getFocusRoot(nextFocusEl)
        if (focusRoot !== this._currFocusRoot) {
          // Find the next tabbable element that is in our current focus root.
          // We get here when the next focusable element is inside a different focus root
          // than our current focus root. So we are effectively trying to skip over the
          // next focus root.
          do {
            var offset = (xyDirection === XYDirections.DIR_RIGHT || xyDirection === XYDirections.DIR_DOWN) ? 1 : -1
            nextFocusEl = this.focusManager.getNextTabbableElement(nextFocusEl, offset)
          } while (nextFocusEl && this.getFocusRoot(nextFocusEl) !== this._currFocusRoot)
        }
      }

      return nextFocusEl
    }
  }
}
