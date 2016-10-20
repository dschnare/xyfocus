"use strict";
var EventDispatcher = (function () {
    function EventDispatcher(eventTargetProxy) {
        this.eventTargetProxy = eventTargetProxy || this;
        this.listeners = Object.create(null);
    }
    EventDispatcher.prototype.addEventListener = function (eventType, listener) {
        var stack = this.listeners[eventType] || [];
        stack.push(listener);
        this.listeners[eventType] = stack;
    };
    EventDispatcher.prototype.removeEventListener = function (eventType, listener) {
        var stack = this.listeners[eventType];
        if (stack) {
            for (var i = 0, l = stack.length; i < l; i += 1) {
                if (stack[i] === listener) {
                    stack.splice(i, 1);
                }
            }
        }
    };
    EventDispatcher.prototype.dispatchEvent = function (event) {
        var stack = this.listeners[event.type];
        var listener;
        var propagationStopped = false;
        var defaultPrevented = false;
        if (event.target) {
            throw new Error('Cannot dispatch event that already has a target.');
        }
        if (stack) {
            event.target = this.eventTargetProxy || this;
            event.eventPhase = 2; // AT_TARGET
            event.stopPropagation = function () {
                propagationStopped = true;
                event.propagationStopped = true;
            };
            event.stopImmediatePropagation = event.stopPropagation;
            event.preventDefault = function () {
                if (event.cancelable) {
                    defaultPrevented = true;
                    event.defaultPrevented = true;
                }
            };
            for (var i = 0, l = stack.length; i < l; i += 1) {
                listener = stack[i];
                if (listener)
                    listener(event);
                if (!propagationStopped)
                    break;
            }
            event.defaultPrevented = defaultPrevented;
            event.propagationStopped = propagationStopped;
        }
        return !defaultPrevented;
    };
    return EventDispatcher;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventDispatcher;
