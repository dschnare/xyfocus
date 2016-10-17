import EventDispatcher from './EventDispatcher'
import isElementVisible from './isElementVisible'

export default class FocusManager extends EventDispatcher {
  constructor (focusablePredicateCollection) {
    super()

    this._currFocusEl = null
    this._tabbableEls = null

    this.focusablePredicates = focusablePredicateCollection
    this.focusablePredicates.add(function (el) { return el.nodeName === 'A' && el.getAttribute('href') })
    this.focusablePredicates.add(function (el) { return el.nodeName === 'AREA' && el.getAttribute('href') })
    this.focusablePredicates.add(function (el) { return el.tabIndex >= 0 })
  }

  currentFocusElement () {
    return this._currFocusEl
  }

  setCurrentFocusElement (el) {
    if (el !== this._currFocusEl) {
      var prev = this._currFocusEl
      var cancelled = !this.dispatchEvent({
        type: 'focuschanging',
        focusElement: el,
        previousFocusElement: prev,
        cancelable: true
      })

      if (cancelled) return false

      this._currFocusEl = el
      this.focusChangeOverride(this._currFocusEl, prev)

      this.dispatchEvent({
        type: 'focuschanged',
        focusElement: this._currFocusEl,
        previousFocusElement: prev
      })

      return true
    }

    return false
  }

  focusChangeOverride (currentFocusElement, previousFocusElement) {
    // NOTE: This function would be overridden to perform the actual focus
    // logic (i.e. adding/removing CSS classes, calling DOM focus methods,
    // etc.)
  }

  getTabbableElements () {
    if (!this._tabbableEls) {
      // Cache the list of all tabbable elements.
      this._tabbableEls = [].slice.call(document.querySelectorAll('[tabindex], a[href], area[href], input, select, button, textarea, object'))
    }
    return this._tabbableEls
  }

  invalidateTabbableElements () {
    this._tabbableEls = null
  }

  getNextTabbableElement (currentEl, offset) {
    currentEl = currentEl || document.activeElement
    offset = isNaN(offset) ? 1 : offset

    var els = this.getTabbableElements()
      .filter(isElementTabbable)
      .sort(function (a, b) {
        return a.tabindex - b.tabindex
      })

    var nextTabbableEl = null
    var k = els.indexOf(currentEl)
    if (k >= 0) nextTabbableEl = els[k + offset]

    return nextTabbableEl
  }

  isElementTabbable (el) {
    return el.nodeType === 1 &&
      el.tabIndex >= 0 &&
      el.offsetWidth &&
      el.offsetHeight &&
      // We must check the visibility of our ancestors.
      isElementVisible(el)
  }

  isElementFocusable (el) {
    return el.nodeType === 1 &&
      el.tabIndex >= 0 &&
      el.offsetWidth &&
      el.offsetHeight &&
      // NOTE: We assume elements tested with this function
      // are visible (i.e. ancestors don't have visibility set to hidden).
      // This is a performance optimization. Otherwise we could just call
      // isElementTabbable(el) in addition to checking our focusable predicates.
      this.focusablePredicates.some(function (predicate) {
        return predicate(el)
      })
  }
}
