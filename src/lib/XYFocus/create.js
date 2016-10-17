import FocusManager from './Foundation/FocusManager'
import FocusablePredicateCollection from './Foundation/FocusablePredicateCollection'
import KeyboardInputManager from './Foundation/KeyboardInputManager'
import XYFocusManager from './XYFocusManager'


export default function create (focusChangeOverride) {
  var focusMgr = new FocusManager(new FocusablePredicateCollection())

  if (typeof focusChangeOverride !== 'function') {
    focusChangeOverride = function (currFocusEl, prevFocusEl) {
      currFocusEl.focus()
    }
  }

  focusMgr.focusChangeOverride = focusChangeOverride

  return new XYFocusManager(focusMgr, new XYInputManager())
}
