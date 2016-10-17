export default class FocusablePredicateCollection {
  constructor () {
    this.array = []
  }

  add (predicate) {
    if (typeof predicate === 'function') {
      this.array.push(predicate)
    }
  }

  addFocusableClass (className) {
    [].slice.call(document.querySelectorAll('.' + className))
      .forEach(function (el) { el.tabIndex = 0 })

    this.array.push(function (el) {
      // IE10+
      // return el.classList.contains(className)
      return el.className.replace(/^\s+|\s+$/g, '').split(/\s+/).indexOf(className) >= 0
    })
  }

  clear () {
    this.array = []
  }

  some (visitor) {
    return this.array.some(visitor)
  }
}

/*
interface FocusablePredicate {
  (el: HTMLElement): boolean
}
*/
