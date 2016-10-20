"use strict";
var FocusablePredicateCollection = (function () {
    function FocusablePredicateCollection() {
        this.array = [];
    }
    FocusablePredicateCollection.prototype.add = function (predicate) {
        if (typeof predicate === 'function') {
            this.array.push(predicate);
        }
    };
    FocusablePredicateCollection.prototype.addFocusableClass = function (className) {
        [].slice.call(document.querySelectorAll('.' + className))
            .forEach(function (el) { el.tabIndex = 0; });
        this.array.push(function (el) {
            // IE10+
            // return el.classList.contains(className)
            return el.className.replace(/^\s+|\s+$/g, '').split(/\s+/).indexOf(className) >= 0;
        });
    };
    FocusablePredicateCollection.prototype.clear = function () {
        this.array = [];
    };
    FocusablePredicateCollection.prototype.some = function (visitor) {
        return this.array.some(visitor);
    };
    return FocusablePredicateCollection;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FocusablePredicateCollection;
/*
interface FocusablePredicate {
  (el: HTMLElement): boolean
}
*/
