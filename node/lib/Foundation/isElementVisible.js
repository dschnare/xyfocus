"use strict";
var validVisibility = ['', 'visible', 'inherit'];
function isElementVisible(el) {
    while (el && el.style && validVisibility.indexOf(el.style.visibility) >= 0) {
        el = el.parentNode;
    }
    return !el || !el.style;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isElementVisible;
