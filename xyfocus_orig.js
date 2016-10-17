var XYFocus = (function () {
  // Foundation //

  var VEC_RIGHT = { x: 1, y: 0 }
  var VEC_LEFT = { x: -1, y: 0 }
  var VEC_UP = { x: 0, y: -1 }
  var VEC_DOWN = { x: 0, y: 1 }

  function getElementsHitByVec (x, y, vec, step) {
    var els = []
    var el = null
    step = isNaN(step) ? 5 : Math.max(5, step)

    el = document.elementFromPoint(x, y)
    while (el) {
      if (els.indexOf(el) < 0) els.push(el)
      step += step
      el = document.elementFromPoint(x + (vec.x * step), y + (vec.y * step))
    }

    return els
  }

  var validVisibility = ['','visible','inherit']
  function isElementVisible (el) {
    while (el && el.style && validVisibility.indexOf(el.style.visibility) >= 0) {
      el = el.parentNode
    }
    return !el || !el.style
  }

  function isElementTabbable (el) {
    return el.nodeType === 1 &&
      el.tabIndex >= 0 &&
      el.offsetWidth &&
      el.offsetHeight &&
      // We must check the visibility of our ancestors.
      isElementVisible(el)
  }

  // Cache the list of all tabbable elements.
  var tabbableEls = []
  function updateTabbableElements () {
    tabbableEls = [].slice.call(document.querySelectorAll('[tabindex], a[href], area[href], input, select, button, textarea, object'))
  }
  updateTabbableElements()

  // getNextTabbableElement()
  // getNextTabbableElement(startEl)
  // getNextTabbableElement(startEl, offset)
  function getNextTabbableElement (startEl, offset) {
    startEl = startEl || document.activeElement
    offset = isNaN(offset) ? 1 : offset

    var els = tabbableEls
      .filter(isElementTabbable)
      .sort(function (a, b) {
        return a.tabindex - b.tabindex
      })

    var nextTabbableEl = null
    var k = els.indexOf(startEl)
    if (k >= 0) nextTabbableEl = els[k + offset]

    return nextTabbableEl
  }

  // XY Focus //

  var focusablePredicates = [
    function (el) { return el.nodeName === 'A' && el.getAttribute('href') },
    function (el) { return el.nodeName === 'AREA' && el.getAttribute('href') },
    function (el) { return el.tabIndex >= 0 }
  ]
  focusablePredicates.addFocusableClass = function (className) {
    [].slice.call(document.querySelectorAll('.' + className))
      .forEach(function (el) { el.tabIndex = 0 })

    focusablePredicates.push(function (el) {
      // IE10+
      // return el.classList.contains(className)
      return el.className.replace(/^\s+|\s+$/g, '').split(/\s+/).indexOf(className) >= 0
    })
  }

  function isElementFocusable (el) {
    return el.nodeType === 1 &&
      el.offsetWidth &&
      el.offsetHeight &&
      el.tabIndex >= 0 &&
      // NOTE: We assume elements tested with this function
      // are visible (i.e. ancestors don't have visibility set to hidden).
      // This is a performance optimization. Otherwise we could just call
      // isElementTabbable(el) in addition to checking our focusable predicates.
      focusablePredicates.some(function (predicate) {
        return predicate(el)
      })
  }

  var DIR_RIGHT = 'right'
  var DIR_LEFT = 'left'
  var DIR_UP = 'up'
  var DIR_DOWN = 'down'
  var getNextFocusElementPositionHook = function (dir, el) {
    var rect = el.getBoundingClientRect()
    return { x: rect.left, y: rect.top }
  }
  var getNextFocusElement = function (dir) {
    var el = document.activeElement
    var vec = null

    dir = dir || DIR_RIGHT

    if (!el) return null
    if (el.dataset[dir + 'NextFocus']) return document.querySelector(el.dataset[dir + 'NextFocus'])

    var pos = getNextFocusElementPositionHook(dir, el)
    var x = pos.x
    var y = pos.y

    switch (dir) {
      case DIR_RIGHT:
        vec = VEC_RIGHT
        break
      case DIR_LEFT:
        vec = VEC_LEFT
        break
      case DIR_UP:
        vec = VEC_UP
        break
      case DIR_DOWN:
        vec = VEC_DOWN
        break
      default:
        vec = VEC_RIGHT
        dir = DIR_RIGHT
    }

    var nextFocusEl = getElementsHitByVec(x, y, vec)
      .filter(isElementFocusable)
      .shift()

    if (!nextFocusEl) {
      nextFocusEl = getNextTabbableElement(el, (dir === 'right' || dir === 'down') ? 1 : -1)
    }

    return nextFocusEl
  }

  var directionalKeyMap = {
    right: [
      { key: 'ArrowRight', keyCode: 39 },
      { key: 'Tab', keyCode: 9 }
    ],
    left: [
      { key: 'ArrowLeft', keyCode: 37 },
      { key: 'Tab', keyCode: 9, shiftKey: true }
    ],
    up: [{ key: 'ArrowUp', keyCode: 38 }],
    down: [{ key: 'ArrowDown', keyCode: 40 }]
  }

  function keyboardEventMatchAnyKeys (keyboardEvent, keyMappings) {
    return keyMappings.some(function (keyMapping) {
      return (keyMapping.keyCode === keyboardEvent.keyCode ||
        (('key' in keyboardEvent && 'key' in keyMapping) ? (keyMapping.key === keyboardEvent.key) : false)) &&
        ('shiftKey' in keyMapping ? keyMapping.shiftKey === keyboardEvent.shiftKey : true)

    })
  }

  document.body.addEventListener('keydown', function (event) {
    var dir, keyMappings, nextFocusEl

    for (dir in directionalKeyMap) {
      keyMappings = directionalKeyMap[dir]

      if (keyboardEventMatchAnyKeys(event, keyMappings)) {
        event.preventDefault()
        event.stopImmediatePropagation()

        nextFocusEl = getNextFocusElement(dir)
        if (nextFocusEl) nextFocusEl.focus()

        break
      }
    }
  }, true)

  // XY Focus Roots //

  var currFocusRoot = null
  var currFocusEl = null

  document.body.tabIndex = -1
  document.body.dataset['focusRoot'] = ''

  function getFirstFocusableChild (parentEl) {
    return [].slice.call(parentEl.childNodes)
      .filter(isElementFocusable)
      .filter(isElementVisible)
      .shift()
  }

  function swallowEventHandler (event) {
    if (event.eventPhase === 2 /* AT_TARGET */) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
  }

  // Prevent clicks and touches on the document from taking focus away from the
  // current focus root. This will only occur if the body of the web page is
  // really short and there is blank space below the body in the browser.
  document.documentElement.addEventListener('mousedown', swallowEventHandler)

  // Give the Focus Engagement "plugin" a chance to add to focusablePredicates.
  setTimeout(function () {
    var child = getFirstFocusableChild(document.body)
    if (child) child.focus()
  }, 0)

  function getFocusRoot (el) {
    el = el.parentNode
    while (el && el.dataset && el.dataset['focusRoot'] !== '') {
      el = el.parentNode
    }
    if (el && el.dataset && el.dataset['focusRoot'] === '') return el
    return null
  }

  getNextFocusElementPositionHook = function (dir, el) {
    var isFocusRoot = el.dataset['focusRoot'] === ''
    var rect = el.getBoundingClientRect()

    if (isFocusRoot) {
      switch (dir) {
        case 'right':
          return { x: rect.left + rect.width, y: rect.top }
        case 'down':
          return { x: rect.left, y: rect.top + rect.height }
      }
    }

    return { x: rect.left, y: rect.top }
  }

  getNextFocusElement = (function (base) {
    return function getNextFocusElementFocusRootAspect (dir) {
      var nextFocusEl = base.call(void 0, dir)

      if (nextFocusEl) {
        var focusRoot = getFocusRoot(nextFocusEl)
        if (focusRoot !== currFocusRoot) {
          // Find the next tabbable element that is in our current focus root.
          // We get here when the next focusable element is inside a different focus root
          // than our current focus root. So are effectively trying to skip over the this
          // next focus root.
          do {
            nextFocusEl = getNextTabbableElement(nextFocusEl, (dir === 'right' || dir === 'down') ? 1 : -1)
          } while (nextFocusEl && getFocusRoot(nextFocusEl) !== currFocusRoot);
        }
      }

      return nextFocusEl
    }
  }(getNextFocusElement))

  // When focus changes we check to see if we are still in the current focus root.
  // If we the element that recived focus is not in our current focus root then
  // we prevent the focus switch.
  document.body.addEventListener('focus', function (event) {
    var focusRoot = getFocusRoot(event.target)

    if (focusRoot === currFocusRoot || !currFocusRoot) {
      currFocusEl = event.target
      currFocusRoot = focusRoot
    } else {
      event.stopImmediatePropagation()
      currFocusEl.focus()
    }
  }, true)

  // XY Focus Engagement //

  var focusStack = []
  var activateFocusEngagementKeyMappings = [{ key: 'Enter', keyCode: 13 }]
  var deactivateFocusEngagementKeyMappings = [{ key: 'Escape', keyCode: 27 }]

  // CustomEvent polyfill for IE9+
  (function () {
    if ( typeof window.CustomEvent === 'function' ) return

    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined }
      var evt = document.createEvent( 'CustomEvent' )
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail )
      return evt
    }

    CustomEvent.prototype = window.Event.prototype
    window.CustomEvent = CustomEvent
  }())

  document.body.addEventListener('keydown', function (event) {
    if (keyboardEventMatchAnyKeys(event, activateFocusEngagementKeyMappings)) {
      if (activateFocusEngagement(currFocusEl)) {
        event.preventDefault()
      }
    } else if (keyboardEventMatchAnyKeys(event, deactivateFocusEngagementKeyMappings)) {
      if (deactivateFocusEngagement()) {
        event.preventDefault()
      }
    }
  }, true)

  function activateFocusEngagement (focusEl) {
    if (focusEl && focusEl.dataset['focusEngagement'] === '' && !focusEl.$isFocusEngaged) {
      // Trigger a cancelable 'focusEngaged' event
      var cancelled = !focusEl.dispatchEvent(new CustomEvent('focusEngaged', { bubbles: true, cancelable: true }))
      if (cancelled) return false

      focusStack.push(currFocusEl, currFocusRoot)
      currFocusRoot = focusEl
      currFocusRoot.$isFocusEngaged = true
      // Set tabIndex and data-focus-root just in case the element being
      // engaged was just added to the DOM, say like a modal popup.
      currFocusRoot.tabIndex = 0
      currFocusRoot.dataset['focusRoot'] = ''

      var selector = currFocusEl.dataset['focusEngagementInitialFocus']
      var nextFocusEl = selector ? currFocusEl.querySelector(selector) : null

      if (!nextFocusEl) {
        // Get the first focusable child.
        nextFocusEl = getFirstFocusableChild(currFocusRoot)
      }

      if (nextFocusEl) {
        currFocusEl = nextFocusEl
        currFocusEl.focus()
      } else {
        throw new Error('No focusable child found for engaged focus root.')
      }

      return true
    }

    return false
  }

  function deactivateFocusEngagement () {
    if (focusStack.length) {
      var engagedEl = currFocusRoot

      delete engagedEl.$isFocusEngaged
      currFocusRoot = focusStack.pop()
      currFocusEl = focusStack.pop()
      if (currFocusEl) currFocusEl.focus()

      // Trigger a non-cancelable 'focusDisengaged' event
      engagedEl.dispatchEvent(new CustomEvent('focusDisengaged', { bubbles: true, cancelable: false }))

      return true
    }

    return false
  }

  // Configure elements that have a 'data-focus-engagement' attribute
  // so they can be focused.
  [].slice.call(document.querySelectorAll('[data-focus-engagement]'))
    .forEach(function (el) {
      el.dataset['focusRoot'] = ''
      el.tabIndex = 0
    })
  focusablePredicates.push(function (el) {
    return el.dataset['focusEngagement'] === ''
  })

  return {
    getElementsHitByVec: getElementsHitByVec,
    getNextFocusElement: getNextFocusElement,
    isElementFocusable: isElementFocusable,
    isElementTabbable: isElementTabbable,
    updateTabbableElements: updateTabbableElements,
    activateFocusEngagement: activateFocusEngagement,
    deactivateFocusEngagement: deactivateFocusEngagement,
    currentFocusRoot: function () { return currFocusRoot },
    currentFocusElement: function () { return currFocusEl },
    mapActivateFocusEngagementKey: function (keyMapping) {
      activateFocusEngagementKeyMappings.push(keyMapping)
    },
    mapDeactivateFocusEngagementKey: function (keyMapping) {
      deactivateFocusEngagementKeyMappings.push(keyMapping)
    },
    mapDirectionalKey: function (direction, keyMapping) {
      switch (direction) {
        case DIR_RIGHT:
          directionalKeyMap.right.push(keyMapping)
          break
        case DIR_LEFT:
          directionalKeyMap.left.push(keyMapping)
          break
        case DIR_UP:
          directionalKeyMap.up.push(keyMapping)
          break
        case DIR_DOWN:
          directionalKeyMap.down.push(keyMapping)
          break
        default:
          throw new Error('Directional key cannot be mapped for direction "' + direction + '"')
      }
    }
  }
}())
