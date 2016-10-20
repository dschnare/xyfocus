"use strict";
var FocusManager_1 = require('./Foundation/FocusManager');
var FocusablePredicateCollection_1 = require('./Foundation/FocusablePredicateCollection');
var KeyboardInputManager_1 = require('./Foundation/KeyboardInputManager');
var XYFocusManager_1 = require('./XYFocusManager');
function create(focusChangeOverride) {
    var focusMgr = new FocusManager_1.default(new FocusablePredicateCollection_1.default());
    if (typeof focusChangeOverride !== 'function') {
        focusChangeOverride = function (currFocusEl, prevFocusEl) {
            currFocusEl.focus();
        };
    }
    focusMgr.focusChangeOverride = focusChangeOverride;
    return new XYFocusManager_1.default(focusMgr, new KeyboardInputManager_1.default());
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = create;
