"use strict";
var FocusManager_1 = require('./Foundation/FocusManager');
var FocusablePredicateCollection_1 = require('./Foundation/FocusablePredicateCollection');
var XYFocusManager_1 = require('./XYFocusManager');
var XYInputManager_1 = require('./XYInputManager');
function create() {
    return new XYFocusManager_1.default(new FocusManager_1.default(new FocusablePredicateCollection_1.default()), new XYInputManager_1.default());
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = create;
