"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDispatcher_1 = require('./EventDispatcher');
var XYInputManager = (function (_super) {
    __extends(XYInputManager, _super);
    function XYInputManager() {
        _super.call(this);
        this.map = Object.create(null);
        this.setupDomListeners();
    }
    // addKeyMapping(keyClass, keyMapping)
    // addKeyMapping(keyClass, keyMappings)
    XYInputManager.prototype.addKeyMapping = function (keyClass, keyMappings) {
        if (!Array.isArray(keyMappings))
            keyMappings = [keyMappings];
        keyMappings = keyMappings.slice();
        var theKeyMappings;
        while (keyMappings.length) {
            theKeyMappings = this.map[keyClass] || [];
            theKeyMappings.push(keyMappings.pop());
            this.map[keyClass] = theKeyMappings;
        }
    };
    XYInputManager.prototype.getKeyMappings = function (keyClass) {
        return (this.map[keyClass] || []).slice();
    };
    XYInputManager.prototype.clear = function () {
        this.map = Object.create(null);
    };
    XYInputManager.prototype.getKeyClassForKeyboardEvent = function (keyboardEvent) {
        var keyMappings = null;
        var isMapped = false;
        function keyMappingMatchesKeyboardEvent(keyMapping) {
            var keyCodeMatches = keyMapping.keyCode === keyboardEvent.keyCode;
            var keyMatches = ('key' in keyMapping && 'key' in keyboardEvent) ? keyMapping === keyboardEvent.key : false;
            var shiftKeyMatches = ('shiftKey' in keyMapping && 'shiftKey' in keyboardEvent) ? keyMapping.shiftKey === keyboardEvent.shiftKey : true;
            return (keyCodeMatches || keyMatches) && shiftKeyMatches;
        }
        for (var keyClass in this.map) {
            keyMappings = this.map[keyClass];
            isMapped = keyMappings.some(keyMappingMatchesKeyboardEvent);
            if (isMapped)
                return keyClass;
        }
        return '';
    };
    XYInputManager.prototype.setupDomListeners = function () {
        var self = this;
        document.documentElement.addEventListener('keydown', function (event) {
            var keyClass = self.getKeyClassForKeyboardEvent(event);
            if (keyClass) {
                var inputEvent = { type: 'keyinput', keyClass: keyClass };
                var cancelled = !self.dispatchEvent(inputEvent);
                if (cancelled)
                    event.preventDefault();
                if (inputEvent.propagationStopped)
                    event.stopImmediatePropagation();
            }
        }, true);
    };
    return XYInputManager;
}(EventDispatcher_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = XYInputManager;
/*
interface KeyMapping {
  key?: string
  keyCode: number
  shiftKey?: boolean
}
*/
