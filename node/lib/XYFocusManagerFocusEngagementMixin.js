"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDispatcher_1 = require('./Foundation/EventDispatcher');
function XYFocusManagerFocusEngagementMixin(XYFocusManager) {
    return (function (_super) {
        __extends(XYFocusManagerFocusEngagement, _super);
        function XYFocusManagerFocusEngagement(focusManager, keyboardInputManager) {
            _super.call(this, focusManager, keyboardInputManager);
            this.focusStack = [];
            this.dispatcher = new EventDispatcher_1.default(this);
            [].slice.call(document.querySelectorAll('[data-focus-engagement]'))
                .forEach(function (el) {
                el.dataset['focusRoot'] = '';
                el.tabIndex = 0;
            });
            this.focusManager.focusablePredicates.add(function (el) {
                return el.dataset['focusEngagement'] === '';
            });
            this.keyboardInputManager.addKeyMapping('activateFocusEngagement', { key: 'Enter', keyCode: 13 });
            this.keyboardInputManager.addKeyMapping('deactivateFocusEngagement', { key: 'Escape', keyCode: 27 });
            var self = this;
            this.keyboardInputManager.addEventListener('keyinput', function (event) {
                switch (event.keyClass) {
                    case 'activateFocusEngagement':
                        if (self.activateFocusEngagement(self._currFocusEl)) {
                            event.preventDefault();
                        }
                        break;
                    case 'deactivateFocusEngagement':
                        if (self.deactivateFocusEngagement()) {
                            event.preventDefault();
                        }
                        break;
                }
            });
        }
        XYFocusManagerFocusEngagement.prototype.activateFocusEngagement = function (focusEl) {
            if (focusEl && focusEl.dataset['focusEngagement'] === '' && !focusEl.$isFocusEngaged) {
                var cancelled = !this.dispatchEvent({
                    type: 'focusengaging',
                    focusElement: focusEl,
                    cancelable: true
                });
                if (cancelled)
                    return false;
                this.focusStack.push(this._currFocusEl, this._currFocusRoot);
                this._currFocusRoot = focusEl;
                this._currFocusRoot.$isFocusEngaged = true;
                // Set tabIndex and data-focus-root just in case the element being
                // engaged was just added to the DOM, say like a modal popup.
                this._currFocusRoot.tabIndex = 0;
                this._currFocusRoot.dataset['focusRoot'] = '';
                var selector = this._currFocusEl.dataset['focusEngagementInitialFocus'];
                var nextFocusEl = selector ? this._currFocusEl.querySelector(selector) : null;
                if (!nextFocusEl) {
                    // Get the first focusable child.
                    nextFocusEl = this.getFirstFocusableChild(this._currFocusRoot);
                }
                if (nextFocusEl) {
                    this._currFocusEl = nextFocusEl;
                    this.focusManager.setCurrentFocusElement(this._currFocusEl);
                }
                else {
                    throw new Error('No focusable child found for engaged focus root.');
                }
                this.dispatchEvent({
                    type: 'focusengaged',
                    focusElement: this._currFocusRoot
                });
                return true;
            }
            return false;
        };
        XYFocusManagerFocusEngagement.prototype.deactivateFocusEngagement = function () {
            if (this.focusStack.length) {
                var engagedEl = this._currFocusRoot;
                var cancelled = !this.dispatchEvent({
                    type: 'focusdisengaging',
                    focusElement: engagedEl,
                    cancelable: true
                });
                if (cancelled)
                    return false;
                delete engagedEl.$isFocusEngaged;
                this.currFocusRoot = this.focusStack.pop();
                this._currFocusEl = this.focusStack.pop();
                if (this._currFocusEl) {
                    this.focusManager.setCurrentFocusElement(this._currFocusEl);
                }
                this.dispatchEvent({
                    type: 'focusdisengaged',
                    focusElement: engagedEl
                });
                return true;
            }
            return false;
        };
        // EventDispatcher API
        XYFocusManagerFocusEngagement.prototype.addEventListener = function (eventType, listener) {
            this.dispatcher.addEventListener(eventType, listener);
        };
        XYFocusManagerFocusEngagement.prototype.removeEventListener = function (eventType, listener) {
            this.dispatcher.removeEventListener(eventType, listener);
        };
        XYFocusManagerFocusEngagement.prototype.dispatchEvent = function (event) {
            return this.dispatcher.dispatchEvent(event);
        };
        return XYFocusManagerFocusEngagement;
    }(XYFocusManager));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = XYFocusManagerFocusEngagementMixin;
