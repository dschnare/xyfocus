"use strict";
var XYDirections = require('./xyDirections');
var getElementsHitByVec_1 = require('./Foundation/getElementsHitByVec');
var XYVectors = require('./Foundation/XYVectors');
var XYFocusManagerFocusRootMixin_1 = require('./XYFocusManagerFocusRootMixin');
var XYFocusManagerFocusEngagementMixin_1 = require('./XYFocusManagerFocusEngagementMixin');
var XYFocusManager = (function () {
    function XYFocusManager(focusManager, xyInputManager) {
        this.focusManager = focusManager;
        this.xyInputManager = xyInputManager;
        this.xyInputManager.addKeyMapping(XYDirections.DIR_RIGHT, { key: 'ArrowRight', keyCode: 39 });
        this.xyInputManager.addKeyMapping(XYDirections.DIR_RIGHT, { key: 'Tab', keyCode: 9 });
        this.xyInputManager.addKeyMapping(XYDirections.DIR_LEFT, { key: 'ArrowLeft', keyCode: 37 });
        this.xyInputManager.addKeyMapping(XYDirections.DIR_LEFT, { key: 'TAB', keyCode: 9, shiftKey: true });
        this.xyInputManager.addKeyMapping(XYDirections.DIR_UP, { key: 'ArrowUp', keyCode: 38 });
        this.xyInputManager.addKeyMapping(XYDirections.DIR_DOWN, { key: 'ArrowDown', keyCode: 40 });
        var self = this;
        this.xyInputManager.addEventListener('keyinput', function (event) {
            switch (event.keyClass) {
                case XYDirections.DIR_RIGHT:
                case XYDirections.DIR_LEFT:
                case XYDirections.DIR_UP:
                case XYDirections.DIR_DOWN:
                    var nextFocusEl = self.getNextFocusElement(event.keyClass);
                    if (nextFocusEl) {
                        self.focusManager.setCurrentFocusElement(nextFocusEl);
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    }
                    break;
            }
        });
    }
    XYFocusManager.prototype.getNextFocusElementPositionOverride = function (xyDirection, el) {
        var rect = el.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
    };
    XYFocusManager.prototype.getNextFocusElement = function (xyDirection) {
        var el = this.focusManager.currentFocusElement();
        var vec = null;
        xyDirection = xyDirection || XYDirections.DIR_RIGHT;
        if (!el)
            return null;
        if (el.dataset[xyDirection + 'NextFocus'])
            return document.querySelector(el.dataset[dir + 'NextFocus']);
        var pos = this.getNextFocusElementPositionOverride(xyDirection, el);
        var x = pos.x;
        var y = pos.y;
        switch (xyDirection) {
            case XYDirections.DIR_RIGHT:
                vec = XYVectors.VEC_RIGHT;
                break;
            case XYDirections.DIR_LEFT:
                vec = XYVectors.VEC_LEFT;
                break;
            case XYDirections.DIR_UP:
                vec = XYVectors.VEC_UP;
                break;
            case XYDirections.DIR_DOWN:
                vec = XYVectors.VEC_DOWN;
                break;
            default:
                throw new Error('XY direction not supported "' + xyDirection + '"');
        }
        var nextFocusEl = getElementsHitByVec_1.default(x, y, vec)
            .filter(this.focusManager.isElementFocusable.bind(this.focusManager))
            .shift();
        if (!nextFocusEl) {
            var offset = (xyDirection === XYDirections.DIR_RIGHT || xyDirection === XYDirections.DIR_DOWN) ? 1 : -1;
            nextFocusEl = this.focusManager.getNextTabbableElement(el, offset);
        }
        return nextFocusEl;
    };
    return XYFocusManager;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = XYFocusManagerFocusEngagementMixin_1.default(XYFocusManagerFocusRootMixin_1.default(XYFocusManager));
