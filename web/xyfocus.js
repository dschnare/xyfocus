var XYFocus =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var EventDispatcher_1 = __webpack_require__(1);
	exports.EventDispatcher = EventDispatcher_1.default;
	var FocusablePredicateCollection_1 = __webpack_require__(2);
	exports.FocusablePredicateCollection = FocusablePredicateCollection_1.default;
	var FocusManager_1 = __webpack_require__(3);
	exports.FocusManager = FocusManager_1.default;
	var getElementsHitByVec_1 = __webpack_require__(5);
	exports.getElementsHitByVec = getElementsHitByVec_1.default;
	var isElementVisible_1 = __webpack_require__(4);
	exports.isElementVisible = isElementVisible_1.default;
	var KeyboardInputManager_1 = __webpack_require__(6);
	exports.KeyboardInputManager = KeyboardInputManager_1.default;
	__export(__webpack_require__(7));
	var create_1 = __webpack_require__(8);
	exports.create = create_1.default;
	__export(__webpack_require__(10));
	var XYFocusManager_1 = __webpack_require__(9);
	exports.XYFocusManager = XYFocusManager_1.default;


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var isElementVisible_1 = __webpack_require__(4);
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


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	function getElementsHitByVec(x, y, vec, step, limit) {
	    var els = [];
	    var el = null;
	    step = Math.max(5, step) || 5;
	    limit = Math.max(0, limit) || Infinity;
	    el = document.elementFromPoint(x, y);
	    while (el && els.length <= limit) {
	        if (els.indexOf(el) < 0)
	            els.push(el);
	        step += step;
	        el = document.elementFromPoint(x + (vec.x * step), y + (vec.y * step));
	    }
	    return els;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = getElementsHitByVec;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
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


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	exports.VEC_RIGHT = { x: 1, y: 0 };
	exports.VEC_LEFT = { x: -1, y: 0 };
	exports.VEC_UP = { x: 0, y: -1 };
	exports.VEC_DOWN = { x: 0, y: 1 };


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var FocusManager_1 = __webpack_require__(3);
	var FocusablePredicateCollection_1 = __webpack_require__(2);
	var KeyboardInputManager_1 = __webpack_require__(6);
	var XYFocusManager_1 = __webpack_require__(9);
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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var XYDirections = __webpack_require__(10);
	var getElementsHitByVec_1 = __webpack_require__(5);
	var XYVectors = __webpack_require__(7);
	var XYFocusManagerFocusRootMixin_1 = __webpack_require__(11);
	var XYFocusManagerFocusEngagementMixin_1 = __webpack_require__(12);
	var XYFocusManager = (function () {
	    function XYFocusManager(focusManager, keyboardInputManager) {
	        this.focusManager = focusManager;
	        this.keyboardInputManager = keyboardInputManager;
	        keyboardInputManager.addKeyMapping(XYDirections.DIR_RIGHT, { key: 'ArrowRight', keyCode: 39 });
	        keyboardInputManager.addKeyMapping(XYDirections.DIR_RIGHT, { key: 'Tab', keyCode: 9 });
	        keyboardInputManager.addKeyMapping(XYDirections.DIR_LEFT, { key: 'ArrowLeft', keyCode: 37 });
	        keyboardInputManager.addKeyMapping(XYDirections.DIR_LEFT, { key: 'Tab', keyCode: 9, shiftKey: true });
	        keyboardInputManager.addKeyMapping(XYDirections.DIR_UP, { key: 'ArrowUp', keyCode: 38 });
	        keyboardInputManager.addKeyMapping(XYDirections.DIR_DOWN, { key: 'ArrowDown', keyCode: 40 });
	        var self = this;
	        this.keyboardInputManager.addEventListener('keyinput', function (event) {
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
	    XYFocusManager.prototype.getFocusElementNavigationVectorOrigin = function (el, xyDirection) {
	        var rect = el.getBoundingClientRect();
	        var origin = {
	            x: Math.round(rect.left + rect.width / 2),
	            y: Math.round(rect.top + rect.height / 2)
	        };
	        switch (xyDirection) {
	            case XYDirections.DIR_RIGHT:
	                origin.x = rect.left + rect.width;
	                break;
	            case XYDirections.DIR_DOWN:
	                origin.y = rect.top + rect.height;
	                break;
	            case XYDirections.DIR_LEFT:
	                origin.x = rect.left;
	                break;
	            case XYDirections.DIR_UP:
	                origin.y = rect.top;
	                break;
	            default:
	                throw new Error('XY direction not supported "' + xyDirection + '"');
	        }
	        return origin;
	    };
	    // getNextFocusElement()
	    // getNextFocusElement(xyDirection)
	    XYFocusManager.prototype.getNextFocusElement = function (xyDirection) {
	        var el = this.focusManager.currentFocusElement();
	        var vec = null;
	        xyDirection = xyDirection || XYDirections.DIR_RIGHT;
	        if (!el)
	            return null;
	        if (el.dataset[xyDirection + 'NextFocus'])
	            return document.querySelector(el.dataset[xyDirection + 'NextFocus']);
	        var _a = this.getFocusElementNavigationVectorOrigin(el, xyDirection), x = _a.x, y = _a.y;
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


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	exports.DIR_TOP = 'top';
	exports.DIR_RIGHT = 'right';
	exports.DIR_DOWN = 'down';
	exports.DIR_LEFT = 'left';


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var isElementVisible_1 = __webpack_require__(4);
	var XYDirections = __webpack_require__(10);
	function XYFocusManagerFocusRootMixin(XYFocusManager) {
	    return (function (_super) {
	        __extends(XYFocusManagerFocusRoot, _super);
	        function XYFocusManagerFocusRoot(focusManager, keyboardInputManager) {
	            _super.call(this, focusManager, keyboardInputManager);
	            this._currFocusRoot = null;
	            this._currFocusEl = null;
	            // Prevent clicks and touches on the document from taking focus away from the
	            // current focus root. This will only occur if the body of the web page is
	            // really short and there is blank space below the body in the browser.
	            document.documentElement.addEventListener('mousedown', function (event) {
	                if (event.eventPhase === 2 /* AT_TARGET */) {
	                    event.preventDefault();
	                    event.stopImmediatePropagation();
	                }
	            });
	            var self = this;
	            this.focusManager.addEventListener('focuschanging', function (event) {
	                var focusRoot = self.getFocusRoot(event.focusElement);
	                if (this._currFocusRoot && focusRoot !== this._currFocusRoot) {
	                    event.preventDefault();
	                }
	            });
	            this.focusManager.addEventListener('focuschanged', function (event) {
	                var focusRoot = self.getFocusRoot(event.focusElement);
	                self._currFocusEl = event.focusElement;
	                self._currFocusRoot = focusRoot;
	            });
	            document.body.tabIndex = -1;
	            document.body.dataset['focusRoot'] = '';
	            var nextFocusEl = this.getFirstFocusableChild(document.body);
	            this.focusManager.setCurrentFocusElement(nextFocusEl);
	        }
	        XYFocusManagerFocusRoot.prototype.currentFocusRoot = function () {
	            return this._currFocusRoot;
	        };
	        XYFocusManagerFocusRoot.prototype.currentFocusElement = function () {
	            return this._currFocusEl;
	        };
	        XYFocusManagerFocusRoot.prototype.getFirstFocusableChild = function (parentEl) {
	            return [].slice.call(parentEl.childNodes)
	                .filter(this.focusManager.isElementFocusable.bind(this.focusManager))
	                .filter(isElementVisible_1.default)
	                .shift();
	        };
	        XYFocusManagerFocusRoot.prototype.getFocusRoot = function (el) {
	            el = el.parentNode;
	            while (el && el.dataset && el.dataset['focusRoot'] !== '') {
	                el = el.parentNode;
	            }
	            if (el && el.dataset && el.dataset['focusRoot'] === '')
	                return el;
	            return null;
	        };
	        // Overriddes
	        XYFocusManagerFocusRoot.prototype.getNextFocusElement = function (xyDirection) {
	            var nextFocusEl = _super.prototype.getNextFocusElement.call(this, xyDirection);
	            if (nextFocusEl) {
	                var focusRoot = this.getFocusRoot(nextFocusEl);
	                if (focusRoot !== this._currFocusRoot) {
	                    // Find the next tabbable element that is in our current focus root.
	                    // We get here when the next focusable element is inside a different focus root
	                    // than our current focus root. So we are effectively trying to skip over the
	                    // next focus root.
	                    do {
	                        var offset = (xyDirection === XYDirections.DIR_RIGHT || xyDirection === XYDirections.DIR_DOWN) ? 1 : -1;
	                        nextFocusEl = this.focusManager.getNextTabbableElement(nextFocusEl, offset);
	                    } while (nextFocusEl && this.getFocusRoot(nextFocusEl) !== this._currFocusRoot);
	                }
	            }
	            return nextFocusEl;
	        };
	        return XYFocusManagerFocusRoot;
	    }(XYFocusManager));
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = XYFocusManagerFocusRootMixin;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
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


/***/ }
/******/ ]);