import EventDispatcher from './EventDispatcher'

export default class XYInputManager extends EventDispatcher {
  constructor () {
    super()
    this.map = Object.create(null)
    this.setupDomListeners()
  }

  // addKeyMapping(keyClass, keyMapping)
  // addKeyMapping(keyClass, keyMappings)
  addKeyMapping (keyClass, keyMappings) {
    if (!Array.isArray(keyMappings)) keyMappings = [keyMappings]

    keyMappings = keyMappings.slice()
    var theKeyMappings
    while (keyMappings.length) {
      theKeyMappings = this.map[keyClass] || []
      theKeyMappings.push(keyMappings.pop())
      this.map[keyClass] = theKeyMappings
    }
  }

  getKeyMappings (keyClass) {
    return (this.map[keyClass] || []).slice()
  }

  clear () {
    this.map = Object.create(null)
  }

  getKeyClassForKeyboardEvent (keyboardEvent) {
    var keyMappings = null
    var isMapped = false

    function keyMappingMatchesKeyboardEvent (keyMapping) {
      var keyCodeMatches = keyMapping.keyCode === keyboardEvent.keyCode
      var keyMatches = ('key' in keyMapping && 'key' in keyboardEvent) ? keyMapping === keyboardEvent.key : false
      var shiftKeyMatches = ('shiftKey' in keyMapping && 'shiftKey' in keyboardEvent) ? keyMapping.shiftKey === keyboardEvent.shiftKey : true
      return (keyCodeMatches || keyMatches) && shiftKeyMatches
    }

    for (var keyClass in this.map) {
      keyMappings = this.map[keyClass]
      isMapped = keyMappings.some(keyMappingMatchesKeyboardEvent)
      if (isMapped) return keyClass
    }

    return ''
  }

  setupDomListeners () {
    var self = this
    document.documentElement.addEventListener('keydown', function (event) {
      var keyClass = self.getKeyClassForKeyboardEvent(event)
      if (keyClass) {
        var inputEvent = { type: 'keyinput', keyClass: keyClass }
        var cancelled = !self.dispatchEvent(inputEvent)

        if (cancelled) event.preventDefault()
        if (inputEvent.propagationStopped) event.stopImmediatePropagation()
      }
    }, true)
  }
}

/*
interface KeyMapping {
  key?: string
  keyCode: number
  shiftKey?: boolean
}
*/
