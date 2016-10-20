"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDispatcher_1 = require('./EventDispatcher');
var isElementVisible_1 = require('./isElementVisible');
var FocusManager = (function (_super) {
    __extends(FocusManager, _super);
    function FocusManager(focusablePredicateCollection) {
        _super.call(this);
        this._currFocusEl = null;
        this._tabbableEls = null;
        this.focusablePredicates = focusablePredicateCollection;
        this.focusablePredicates.add(function (el) { return el.nodeName === 'A' && el.getAttribute('href'); });
        this.focusablePredicates.add(function (el) { return el.nodeName === 'AREA' && el.getAttribute('href'); });
        this.focusablePredicates.add(function (el) { return el.tabIndex >= 0; });
    }
    FocusManager.prototype.currentFocusElement = function () {
        return this._currFocusEl;
    };
    FocusManager.prototype.setCurrentFocusElement = function (el) {
        if (el !== this._currFocusEl) {
            var prev = this._currFocusEl;
            var cancelled = !this.dispatchEvent({
                type: 'focuschanging',
                focusElement: el,
                previousFocusElement: prev,
                cancelable: true
            });
            if (cancelled)
                return false;
            this._currFocusEl = el;
            this.focusChangeOverride(this._currFocusEl, prev);
            this.dispatchEvent({
                type: 'focuschanged',
                focusElement: this._currFocusEl,
                previousFocusElement: prev
            });
            return true;
        }
        return false;
    };
    FocusManager.prototype.focusChangeOverride = function (currentFocusElement, previousFocusElement) {
        // NOTE: This function would be overridden to perform the actual focus
        // logic (i.e. adding/removing CSS classes, calling DOM focus methods,
        // etc.)
    };
    FocusManager.prototype.getTabbableElements = function () {
        if (!this._tabbableEls) {
            // Cache the list of all tabbable elements.
            this._tabbableEls = [].slice.call(document.querySelectorAll('[tabindex], a[href], area[href], input, select, button, textarea, object'));
        }
        return this._tabbableEls;
    };
    FocusManager.prototype.invalidateTabbableElements = function () {
        this._tabbableEls = null;
    };
    FocusManager.prototype.getNextTabbableElement = function (currentEl, offset) {
        currentEl = currentEl || document.activeElement;
        offset = isNaN(offset) ? 1 : offset;
        var els = this.getTabbableElements()
            .filter(this.isElementTabbable)
            .sort(function (a, b) {
            return a.tabindex - b.tabindex;
        });
        var nextTabbableEl = null;
        var k = els.indexOf(currentEl);
        if (k >= 0)
            nextTabbableEl = els[k + offset];
        return nextTabbableEl;
    };
    FocusManager.prototype.isElementTabbable = function (el) {
        return el.nodeType === 1 &&
            el.tabIndex >= 0 &&
            el.offsetWidth &&
            el.offsetHeight &&
            // We must check the visibility of our ancestors.
            isElementVisible_1.default(el);
    };
    FocusManager.prototype.isElementFocusable = function (el) {
        return el.nodeType === 1 &&
            el.tabIndex >= 0 &&
            el.offsetWidth &&
            el.offsetHeight &&
            // NOTE: We assume elements tested with this function
            // are visible (i.e. ancestors don't have visibility set to hidden).
            // This is a performance optimization. Otherwise we could just call
            // isElementTabbable(el) in addition to checking our focusable predicates.
            this.focusablePredicates.some(function (predicate) {
                return predicate(el);
            });
    };
    return FocusManager;
}(EventDispatcher_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FocusManager;
