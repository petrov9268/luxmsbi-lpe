(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["lpe"] = factory();
	else
		root["lpe"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 108);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(6);
var core = __webpack_require__(8);
var hide = __webpack_require__(16);
var redefine = __webpack_require__(12);
var ctx = __webpack_require__(20);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(49)('wks');
var uid = __webpack_require__(37);
var Symbol = __webpack_require__(6).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(7)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(5);
var IE8_DOM_DEFINE = __webpack_require__(76);
var toPrimitive = __webpack_require__(36);
var dP = Object.defineProperty;

exports.f = __webpack_require__(2) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(61);
var defined = __webpack_require__(32);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(32);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0);
var core = __webpack_require__(8);
var fails = __webpack_require__(7);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(6);
var hide = __webpack_require__(16);
var has = __webpack_require__(15);
var SRC = __webpack_require__(37)('src');
var $toString = __webpack_require__(120);
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(8).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(87);
var enumBugKeys = __webpack_require__(59);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (console);

/***/ }),
/* 15 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(4);
var createDesc = __webpack_require__(27);
module.exports = __webpack_require__(2) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(50);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return isNumber; });
/* unused harmony export isBoolean */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isHash; });
/* unused harmony export isFunction */
/* unused harmony export makeMacro */
/* harmony export (immutable) */ __webpack_exports__["c"] = makeSF;
/* harmony export (immutable) */ __webpack_exports__["a"] = eval_lisp;
/* unused harmony export init_lisp */
/* unused harmony export evaluate */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_string_iterator__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_string_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_string_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_array_from__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_array_from___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_array_from__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_match__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_match___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_match__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_array_sort__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_array_sort___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_array_sort__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_es6_regexp_split__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_es6_regexp_split___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_modules_es6_regexp_split__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_modules_es7_object_values__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_modules_es7_object_values___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_modules_es7_object_values__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_array_iterator__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_array_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_array_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_object_keys__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_modules_es6_regexp_constructor__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_modules_es6_regexp_constructor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_modules_es6_regexp_constructor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_modules_es7_symbol_async_iterator__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_modules_es7_symbol_async_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_modules_es7_symbol_async_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_symbol__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_modules_web_dom_iterable__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_modules_web_dom_iterable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_modules_web_dom_iterable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_modules_es6_regexp_to_string__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_modules_es6_regexp_to_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_modules_es6_regexp_to_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_fn_symbol__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_fn_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_fn_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__console_console__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__lpep__ = __webpack_require__(23);














function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 *  miniMAL lisp interpreter
 *  Copyright (C) 2014 Joel Martin
 *  Licensed under MPL 2.0
 *  https://github.com/kanaka/mal
 * 
 */

/**
 *  The code has been reworked to suite LuxmsBI needs
 *  by esix & Dmitry Dorofeev
 *  2017-2019
 */



var isArray = function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};
var isString = function isString(arg) {
  return typeof arg === 'string';
};
var isNumber = function isNumber(arg) {
  return typeof arg === 'number';
};
var isBoolean = function isBoolean(arg) {
  return arg === true || arg === false;
};
var isHash = function isHash(arg) {
  return _typeof(arg) === 'object' && arg !== null && !isArray(arg);
};
var isFunction = function isFunction(arg) {
  return typeof arg === 'function';
};
/**
 * Get or Set variable in context
 * @param {*} ctx - array, hashmap or function that stores variables 
 * @param {*} varName - the name of variable
 * @param {*} value - optional value to set (undefined if get)
 * @param {*} resolveOptions - options on how to resolve
 */

function $var$(ctx, varName, value, resolveOptions) {
  if (isArray(ctx)) {
    // contexts chain
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = ctx[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var theCtx = _step.value;
        var result = $var$(theCtx, varName, value, resolveOptions);
        if (result === undefined) continue; // no such var in context

        if (value === undefined) return result; // get => we've got a result

        return $var$(theCtx, varName, value, resolveOptions); // set => redirect 'set' to context with variable.
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (value === undefined) return undefined; // get => variable not found in all contexts

    if (ctx.length) $var$(ctx[0], varName, value, resolveOptions); // set => set variable to HEAD context

    return undefined; // ??? ctx.length = 0
  }

  if (isFunction(ctx)) {
    return ctx(varName, value, resolveOptions);
  }

  if (isHash(ctx)) {
    if (value === undefined) {
      // get from hash
      var _result = ctx[varName];

      if (_result !== undefined) {
        // found value in hash
        return _result;
      }

      if (varName.substr(0, 3) !== 'sf:' && isFunction(ctx['sf:' + varName])) {
        // user-defined special form
        return makeSF(ctx['sf:' + varName]);
      }

      return undefined;
    } else {
      return ctx[varName] = value;
    }
  }

  return undefined;
}

function makeMacro(fn, ast) {
  fn.ast = ast || [[], {}, [], 1]; // mark as macro

  return fn;
}

function isMacro(fn) {
  if (!isFunction(fn)) return false;
  if (!isArray(fn.ast)) return false;
  return !!fn.ast[3];
}

function makeSF(fn) {
  fn.__isSpecialForm = true;
  return fn;
}

function isSF(fn) {
  if (!isFunction(fn)) return false;
  return !!fn.__isSpecialForm;
}

function makeLetBindings(ast, ctx, rs) {
  var result = {};

  if (isHash(ast)) {
    for (var varName in ast) {
      result[varName] = EVAL(ast[varName], ctx, rs);
    }
  } else if (isArray(ast) && isString(ast[0])) {
    result[ast[0]] = EVAL(ast[1], ctx, rs);
  } else if (isArray(ast)) {
    ast.forEach(function (pair) {
      return result[pair[0]] = EVAL(pair[1], ctx, rs);
    });
  } else if (isFunction(ast)) {
    return ast;
  } else {
    throw new Error('LISP: let expression invalid form in ' + ast);
  }

  return result;
}

var SPECIAL_FORMS = {
  // built-in special forms
  'let': makeSF(function (ast, ctx, rs) {
    return EVAL(['begin'].concat(_toConsumableArray(ast.slice(1))), [makeLetBindings(ast[0], ctx, rs), ctx], rs);
  }),
  '`': makeSF(function (ast, ctx) {
    return ast[0];
  }),
  // quote
  'macroexpand': makeSF(macroexpand),
  'begin': makeSF(function (ast, ctx, rs) {
    return ast.reduce(function (acc, astItem) {
      return EVAL(astItem, ctx, rs);
    }, null);
  }),
  'do': makeSF(function (ast, ctx) {
    throw new Error('DO not implemented');
  }),
  'if': makeSF(function (ast, ctx, ro) {
    return EVAL(ast[0], ctx, _objectSpread({}, ro, {
      resolveString: false
    })) ? EVAL(ast[1], ctx, ro) : EVAL(ast[2], ctx, ro);
  }),
  '~': makeSF(function (ast, ctx, rs) {
    // mark as macro
    var f = EVAL(ast[0], ctx, rs); // eval regular function

    f.ast.push(1); // mark as macro

    return f;
  }),
  '.-': makeSF(function (ast, ctx, rs) {
    // get or set attribute
    var _ast$map = ast.map(function (a) {
      return EVAL(a, ctx, rs);
    }),
        _ast$map2 = _slicedToArray(_ast$map, 3),
        obj = _ast$map2[0],
        propertyName = _ast$map2[1],
        value = _ast$map2[2]; // hack


    if (propertyName === undefined && isString(ast[1])) {
      // string propertyName tried to evaluate in rs context
      propertyName = ast[1];
    }

    try {
      return value !== undefined ? obj[propertyName] = value : obj[propertyName];
    } catch (err) {
      return value; // undefined when 'get'
    }
  }),
  '.': makeSF(function (ast, ctx, rs) {
    // call object method
    var _ast$map3 = ast.map(function (a) {
      return EVAL(a, ctx, rs);
    }),
        _ast$map4 = _toArray(_ast$map3),
        obj = _ast$map4[0],
        methodName = _ast$map4[1],
        args = _ast$map4.slice(2);

    var fn = obj[methodName];
    return fn.apply(obj, args);
  }),
  'try': makeSF(function (ast, ctx, rs) {
    // try/catch
    try {
      return EVAL(ast[0], ctx, rs);
    } catch (e) {
      var errCtx = env_bind([ast[1][0]], ctx, [e]);
      return EVAL(ast[1][1], errCtx, rs);
    }
  }),
  '||': makeSF(function (ast, ctx, rs) {
    return ast.some(function (a) {
      return !!EVAL(a, ctx, rs);
    });
  }),
  // logical or
  '&&': makeSF(function (ast, ctx, rs) {
    return ast.every(function (a) {
      return !!EVAL(a, ctx, rs);
    });
  }),
  // logical and
  'fn': makeSF(function (ast, ctx, rs) {
    // define new function (lambda)
    var f = function f() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return EVAL(ast[1], env_bind(ast[0], ctx, args), rs);
    };

    f.ast = [ast[1], ctx, ast[0]]; // f.ast compresses more than f.data

    return f;
  }),
  'def': makeSF(function (ast, ctx, rs) {
    // update current environment
    var value = EVAL(ast[1], ctx, rs);
    var result = $var$(ctx, ast[0], value);
    return result;
  }),
  'resolve': makeSF(function (ast, ctx, rs) {
    var result = $var$(ctx, ast[0]);
    return result;
  }),
  'eval_lpe': makeSF(function (ast, ctx, rs) {
    var lpeCode = eval_lisp(ast[0], ctx, rs);
    var lisp = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__lpep__["a" /* parse */])(lpeCode);
    var result = eval_lisp(lisp, ctx);
    return result;
  }),
  'filterit': makeSF(function (ast, ctx, rs) {
    //console.log("FILTERIT: " + JSON.stringify(ast))
    var array = eval_lisp(ast[0], ctx, rs);
    var conditionAST = ast[1];
    var result = Array.prototype.filter.call(array, function (it, idx) {
      return !!eval_lisp(conditionAST, [{
        it: it,
        idx: idx
      }, ctx], rs);
    });
    return result;
  }),
  'mapit': makeSF(function (ast, ctx, rs) {
    var array = eval_lisp(ast[0], ctx, rs);
    var conditionAST = ast[1];
    var result = Array.prototype.map.call(array, function (it, idx) {
      return eval_lisp(conditionAST, [{
        it: it,
        idx: idx
      }, ctx], rs);
    });
    return result;
  }),
  'get_in': makeSF(function (ast, ctx, rs) {
    var array = eval_lisp(ast[1], ctx, rs); // но вообще-то вот так ещё круче ["->","a",3,1]
    // const m = ["->"].concat( array.slice(1).reduce((a, b) => {a.push([".-",b]); return a}, [[".-", ast[0], array[0]]]) );

    var m = ["->", ast[0]].concat(array); //console.log('get_in', JSON.stringify(m))

    return eval_lisp(m, ctx, rs);
  }),
  'assoc_in': makeSF(function (ast, ctx, rs) {
    var array = eval_lisp(ast[1], ctx, rs); // удивительно, но работает set(a . 3 , 2, "Hoy")
    //const m = ["->", ast[0]].concat( array.slice(0,-1) );
    //const e = ["set", m, array.pop(), ast[2]]
    // первый аргумент в ast - ссылка на контекст/имя переменной
    //console.log('assoc_in var:', JSON.stringify(ast))

    var focus = $var$(ctx, ast[0], undefined, rs);
    var top = focus;

    for (var i = 0; i < array.length - 1; i++) {
      if (focus[array[i]] === undefined) {
        // нужно создать
        if (isString(array[i + 1])) {
          focus = focus[array[i]] = {};
        } else {
          focus = focus[array[i]] = [];
        }
      } else {
        focus = focus[array[i]];
      }
    }

    var e = ["set", focus, array.pop(), ast[2]]; //console.log(JSON.stringify(e), JSON.stringify(eval_lisp(e, ctx, rs)))

    return eval_lisp(e, ctx, rs);
  }),
  'cp': makeSF(function (ast, ctx, rs) {
    var from = eval_lisp(ast[0], ctx, rs);
    var to = eval_lisp(ast[1], ctx, rs); //console.log('CP to ', JSON.stringify(to))

    var lpe = ["assoc_in", to[0], ["["].concat(to.slice(1)), ["get_in", from[0], ["["].concat(from.slice(1))]]; //console.log('CP', JSON.stringify(lpe))

    return eval_lisp(lpe, ctx, rs);
  }),
  'ctx': makeSF(function (ast, ctx, rs) {
    //FIXME will work only for single keys, we want: ctx(k1,k2,k3.df)
    var ret = {};
    ast.map(function (k) {
      return ret[k] = $var$(ctx, k, undefined, rs);
    });
    return ret;
  })
};

var STDLIB = _objectSpread({
  // built-in constants
  '#t': true,
  '#f': false,
  'NIL': null,
  'null': null,
  // js specific
  'true': true,
  'false': false,
  'Array': Array,
  // TODO: consider removing these properties
  'Object': Object,
  'Hashmap': {},
  'Date': Date,
  'console': __WEBPACK_IMPORTED_MODULE_14__console_console__["a" /* default */],
  'JSON': JSON
}, SPECIAL_FORMS, {
  // built-in functions
  '=': function _() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return args.every(function (v) {
      return v == args[0];
    });
  },
  '+': function _() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return args.reduce(function (a, b) {
      return a + b;
    });
  },
  '-': function _() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return args.length === 1 ? -args[0] : args.reduce(function (a, b) {
      return a - b;
    });
  },
  '*': function _() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return args.reduce(function (a, b) {
      return a * b;
    });
  },
  '/': function _() {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return args.length === 1 ? 1 / args[0] : args.reduce(function (a, b) {
      return a / b;
    });
  },
  '<': function _() {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return args.every(function (v, i) {
      return i === 0 ? true : args[i - 1] < args[i];
    });
  },
  '>': function _() {
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    return args.every(function (v, i) {
      return i === 0 ? true : args[i - 1] > args[i];
    });
  },
  '<=': function _() {
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    return args.every(function (v, i) {
      return i === 0 ? true : args[i - 1] <= args[i];
    });
  },
  '>=': function _() {
    for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    return args.every(function (v, i) {
      return i === 0 ? true : args[i - 1] >= args[i];
    });
  },
  '!=': function _() {
    for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    return !args.every(function (v) {
      return v == args[0];
    });
  },
  //  "'": a => `'${a}'`,
  '[': function _() {
    for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
    }

    return args;
  },
  'RegExp': function (_RegExp) {
    function RegExp() {
      return _RegExp.apply(this, arguments);
    }

    RegExp.toString = function () {
      return _RegExp.toString();
    };

    return RegExp;
  }(function () {
    for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
      args[_key13] = arguments[_key13];
    }

    return RegExp.apply(RegExp, args);
  }),
  'count': function count(a) {
    return a.length;
  },
  'del': function del(a, b) {
    return delete a[b];
  },
  // 'del': (a, b) => Reflect.deleteProperty(a, b),
  'isa': function isa(a, b) {
    return a instanceof b;
  },
  'type': function type(a) {
    return _typeof(a);
  },
  'new': function _new() {
    for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
      args[_key14] = arguments[_key14];
    }

    return new (args[0].bind.apply(args[0], args))();
  },
  'not': function not(a) {
    return !a;
  },
  'list': function list() {
    for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
      args[_key15] = arguments[_key15];
    }

    return args;
  },
  'vector': function vector() {
    for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
      args[_key16] = arguments[_key16];
    }

    return args;
  },
  'map': function map(arr, fn) {
    return arr.map(function (it) {
      return fn(it);
    });
  },
  'filter': function filter(arr, fn) {
    return arr.filter(function (it) {
      return fn(it);
    });
  },
  'throw': function _throw(a) {
    throw a;
  },
  'identity': function identity(a) {
    return a;
  },
  'pluck': function pluck(c, k) {
    return c.map(function (el) {
      return el[k];
    });
  },
  // for each array element, get property value, present result as array.
  'read-string': function readString(a) {
    return JSON.parse(a);
  },
  'rep': function rep(a) {
    return JSON.stringify(EVAL(JSON.parse(a), STDLIB));
  },
  // TODO: fix ctx and rs arguments
  'null?': function _null(a) {
    return a === null || a === undefined;
  },
  // ??? add [] ???
  'true?': function _true(a) {
    return a === true;
  },
  'false?': function _false(a) {
    return a === false;
  },
  'string?': isString,
  'list?': isArray,
  'contains?': function contains(a, b) {
    return a.hasOwnProperty(b);
  },
  'str': function str() {
    for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
      args[_key17] = arguments[_key17];
    }

    return args.map(function (x) {
      return isString(x) ? x : JSON.stringify(x);
    }).join('');
  },
  'get': function get(a, b) {
    return a.hasOwnProperty(b) ? a[b] : undefined;
  },
  'nth': function nth(a, b) {
    return a.hasOwnProperty(b) ? a[b] : undefined;
  },
  'set': function set(a, b, c) {
    return a[b] = c, a;
  },
  'keys': function keys(a) {
    return Object.keys(a);
  },
  'vals': function vals(a) {
    return Object.values(a);
  },
  'rest': function rest(a) {
    return a.slice(1);
  },
  'split': function split(s, d) {
    return s.split(d);
  },
  'println': function println() {
    for (var _len18 = arguments.length, args = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
      args[_key18] = arguments[_key18];
    }

    return __WEBPACK_IMPORTED_MODULE_14__console_console__["a" /* default */].log(args.map(function (x) {
      return isString(x) ? x : JSON.stringify(x);
    }).join(' '));
  },
  'empty?': function empty(a) {
    return isArray(a) ? a.length === 0 : false;
  },
  'cons': function cons(a, b) {
    return [].concat([a], b);
  },
  'prn': function prn() {
    for (var _len19 = arguments.length, args = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
      args[_key19] = arguments[_key19];
    }

    return __WEBPACK_IMPORTED_MODULE_14__console_console__["a" /* default */].log(args.map(function (x) {
      return JSON.stringify(x);
    }).join(' '));
  },
  'slice': function slice(a, b) {
    return a.slice(b, (arguments.length <= 2 ? 0 : arguments.length - 2) > 0 ? arguments.length <= 2 ? undefined : arguments[2] : a.length);
  },
  'first': function first(a) {
    return a.length > 0 ? a[0] : null;
  },
  'last': function last(a) {
    return a[a.length - 1];
  },
  'sort': function sort(a) {
    return isArray(a) ? a.sort() : [];
  },
  // https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript
  // only for numbers!
  'max': function max(a) {
    return isArray(a) ? a.reduce(function (p, v) {
      return p > v ? p : v;
    }) : [];
  },
  'min': function min(a) {
    return isArray(a) ? a.reduce(function (p, v) {
      return p < v ? p : v;
    }) : [];
  },
  'apply': function apply(f) {
    for (var _len20 = arguments.length, b = new Array(_len20 > 1 ? _len20 - 1 : 0), _key20 = 1; _key20 < _len20; _key20++) {
      b[_key20 - 1] = arguments[_key20];
    }

    return f.apply(f, b);
  },
  'concat': function concat() {
    for (var _len21 = arguments.length, a = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
      a[_key21] = arguments[_key21];
    }

    return [].concat.apply([], a);
  },
  'pr_str': function pr_str() {
    for (var _len22 = arguments.length, a = new Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
      a[_key22] = arguments[_key22];
    }

    return a.map(function (x) {
      return JSON.stringify(x);
    }).join(' ');
  },
  'classOf': function classOf(a) {
    return Object.prototype.toString.call(a);
  },
  'join': function join(a, sep) {
    return Array.prototype.join.call(a, sep);
  },
  // operator from APL language
  '⍴': function _(len) {
    for (var _len23 = arguments.length, values = new Array(_len23 > 1 ? _len23 - 1 : 0), _key23 = 1; _key23 < _len23; _key23++) {
      values[_key23 - 1] = arguments[_key23];
    }

    return Array.apply(null, Array(len)).map(function (a, idx) {
      return values[idx % values.length];
    });
  },
  re_match: function re_match(t, r, o) {
    return t.match(new RegExp(r, o));
  },
  // not implemented yet
  // 'hash-table->alist'
  // macros
  '"': makeMacro(function (a) {
    return a.toString();
  }),
  '\'': makeMacro(function (a) {
    return a.toString();
  }),
  // '()': makeMacro((...args) => ['begin', ...args]), from 2022 It is just grouping of expressions
  '()': makeMacro(function (args) {
    return args;
  }),
  '->': makeMacro(function (acc) {
    for (var _len24 = arguments.length, ast = new Array(_len24 > 1 ? _len24 - 1 : 0), _key24 = 1; _key24 < _len24; _key24++) {
      ast[_key24 - 1] = arguments[_key24];
    }

    // thread first macro
    // императивная лапша для макроса ->
    // надо вот так: https://clojuredocs.org/clojure.core/-%3E%3E
    // AST[["filterit",[">",1,0]]]
    // console.log("---------> " +JSON.stringify(acc) + " " + JSON.stringify(ast));
    for (var _i2 = 0; _i2 < ast.length; _i2++) {
      var arr = ast[_i2];

      if (!isArray(arr)) {
        arr = [".-", acc, arr]; // это может быть обращение к хэшу или массиву через индекс или ключ....
      } else if (arr[0] === "()" && arr.length === 2 && (isString(arr[1]) || isNumber(arr[1]))) {
        arr = [".-", acc, arr[1]];
      } else {
        arr = arr.slice(0); // must copy array before modify

        arr.splice(1, 0, acc); //console.log("AST !!!!" + JSON.stringify(arr))     
        // AST[["filterit",[">",1,0]]]
        // AST !!!!["filterit","locations",[">",1,0]]                                  
        // подставляем "вычисленное" ранее значение в качестве первого аргумента... классика thread first
      }

      acc = arr;
    } //console.log("AST !!!!" + JSON.stringify(acc))


    if (!isArray(acc)) {
      return ["resolve", acc];
    }

    return acc;
  }),
  '->>': makeMacro(function (acc) {
    for (var _len25 = arguments.length, ast = new Array(_len25 > 1 ? _len25 - 1 : 0), _key25 = 1; _key25 < _len25; _key25++) {
      ast[_key25 - 1] = arguments[_key25];
    }

    // thread last macro
    // императивная лапша для макроса ->>
    // надо вот так: https://clojuredocs.org/clojure.core/-%3E%3E
    for (var _i3 = 0; _i3 < ast.length; _i3++) {
      var arr = ast[_i3];
      arr.push(acc);
      acc = arr;
    }

    return acc;
  }),
  'invoke': makeMacro(function () {
    for (var _len26 = arguments.length, ast = new Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
      ast[_key26] = arguments[_key26];
    }

    /// мы не можем использовать точку в LPE для вызова метода объекта, так как она уже замаплена на ->
    /// поэтому для фанатов ООП пришлось добавить макрос invoke - вызов метода по его текстовому названию.
    /// invoke хорошо стыкуется с ->
    ast.splice(0, 0, ".");
    return ast;
  }),
  'and': makeMacro(function () {
    for (var _len27 = arguments.length, ast = new Array(_len27), _key27 = 0; _key27 < _len27; _key27++) {
      ast[_key27] = arguments[_key27];
    }

    if (ast.length === 0) return true;
    if (ast.length === 1) return ast[0];
    return ["let", ["__and", ast[0]], ["if", "__and", ["and"].concat(ast.slice(1)), "__and"]];
  }),
  'or': makeMacro(function () {
    for (var _len28 = arguments.length, ast = new Array(_len28), _key28 = 0; _key28 < _len28; _key28++) {
      ast[_key28] = arguments[_key28];
    }

    if (ast.length === 0) return false;
    if (ast.length === 1) return ast[0];
    return ["let", ["__or", ast[0]], ["if", "__or", "__or", ["or"].concat(ast.slice(1))]];
  }),
  // system functions & objects
  // 'js': eval,
  eval: function _eval(a) {
    return EVAL(a, STDLIB);
  }
});

function macroexpand(ast, ctx) {
  var resolveString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  //console.log("MACROEXPAND: " + JSON.stringify(ast))
  while (true) {
    if (!isArray(ast)) break;
    if (!isString(ast[0])) break;
    var v = $var$(ctx, ast[0]); //const v = $var$(ctx, ast[0], undefined, {"resolveString": resolveString}); возможно надо так 

    if (!isFunction(v)) break;
    if (!isMacro(v)) break;
    ast = v.apply(v, ast.slice(1)); // Это макрос! 3-й элемент макроса установлен в 1 через push
  } //console.log("MACROEXPAND RETURN: " + JSON.stringify(ast))


  return ast;
}
/**
 * Return new ctx with symbols in ast bound to
 * corresponding values in exprs
 * @param ast
 * @param ctx
 * @param exprs
 * @returns {*[]}
 */


function env_bind(ast, ctx, exprs) {
  var newCtx = {};

  for (var i = 0; i < ast.length; i++) {
    if (ast[i] === "&") {
      // variable length arguments
      newCtx[ast[i + 1]] = Array.prototype.slice.call(exprs, i);
      break;
    } else {
      newCtx[ast[i]] = exprs[i];
    }
  }

  return [newCtx, ctx];
}

function EVAL(ast, ctx, resolveOptions) {
  while (true) {
    //ast = macroexpand(ast, ctx);
    //ast = macroexpand(ast, ctx, resolveOptions && resolveOptions.resolveString ? true: false);
    if (!isArray(ast)) {
      // atom
      if (isString(ast)) {
        var value = $var$(ctx, ast, undefined, resolveOptions); //console.log(`${JSON.stringify(resolveOptions)} var ${ast} resolved to ${JSON.stringify(value)}`)

        if (value !== undefined) {
          // variable
          //console.log(`resolved var ${value}`)
          return value;
        }

        return resolveOptions && resolveOptions.resolveString ? ast : undefined; // if string and not in ctx
      }

      return ast;
    } // apply
    // c 2022 делаем macroexpand сначала, а не после


    ast = macroexpand(ast, ctx, resolveOptions && resolveOptions.resolveString ? true : false);
    if (!Array.isArray(ast)) return ast; // TODO: do we need eval here?

    if (ast.length === 0) return null; // TODO: [] => empty list (or, maybe return vector [])
    //console.log("EVAL1: ", JSON.stringify(resolveOptions),  JSON.stringify(ast))

    var _ast = ast,
        _ast2 = _toArray(_ast),
        opAst = _ast2[0],
        argsAst = _ast2.slice(1);

    var op = EVAL(opAst, ctx, _objectSpread({}, resolveOptions, {
      wantCallable: true
    })); // evaluate operator

    if (typeof op !== 'function') {
      throw new Error('Error: ' + String(op) + ' is not a function');
    }

    if (isSF(op)) {
      // special form
      var sfResult = op(argsAst, ctx, resolveOptions);
      return sfResult;
    } //console.log("EVAL NOT SF evaluated args 11111: ", op.name, JSON.stringify(argsAst))


    var args = argsAst.map(function (a) {
      return EVAL(a, ctx, resolveOptions);
    }); // evaluate arguments
    //console.log("EVAL NOT SF evaluated args: ", JSON.stringify(args)) 

    if (op.ast) {
      __WEBPACK_IMPORTED_MODULE_14__console_console__["a" /* default */].log("EVAL NOT SF evaluated args AST: ", JSON.stringify(ast));
      ast = op.ast[0];
      ctx = env_bind(op.ast[2], op.ast[1], args); // TCO
    } else {
      //console.log("EVAL NOT SF evaluated args APPLY: ", op.name, ' ', JSON.stringify(args)) 

      /*
        toString.apply(toString, ['aa'])
        '[object Function]'
      */
      var fnResult = op.apply(op, args);
      return fnResult;
    }
  }
} // EVAL


function eval_lisp(ast, ctx, options) {
  var result = EVAL(ast, [ctx || {}, STDLIB], options || {
    "resolveString": true
  });
  return result;
} // Use with care

function init_lisp(ctx) {
  ctx = [ctx || {}, STDLIB];
  return {
    eval: function _eval(ast) {
      return eval_lisp(ast, ctx);
    },
    val: function val(varName, value) {
      return $var$(ctx, varName, value);
    }
  };
} // deprecated

function evaluate(ast, ctx) {
  return eval_lisp(ast, ctx);
}

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(19);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(35);
var createDesc = __webpack_require__(27);
var toIObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(36);
var has = __webpack_require__(15);
var IE8_DOM_DEFINE = __webpack_require__(76);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(2) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(6);
var has = __webpack_require__(15);
var DESCRIPTORS = __webpack_require__(2);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(12);
var META = __webpack_require__(25).KEY;
var $fails = __webpack_require__(7);
var shared = __webpack_require__(49);
var setToStringTag = __webpack_require__(48);
var uid = __webpack_require__(37);
var wks = __webpack_require__(1);
var wksExt = __webpack_require__(98);
var wksDefine = __webpack_require__(67);
var enumKeys = __webpack_require__(119);
var isArray = __webpack_require__(79);
var anObject = __webpack_require__(5);
var isObject = __webpack_require__(3);
var toIObject = __webpack_require__(9);
var toPrimitive = __webpack_require__(36);
var createDesc = __webpack_require__(27);
var _create = __webpack_require__(26);
var gOPNExt = __webpack_require__(86);
var $GOPD = __webpack_require__(21);
var $DP = __webpack_require__(4);
var $keys = __webpack_require__(13);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(45).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(35).f = $propertyIsEnumerable;
  __webpack_require__(46).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(33)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(16)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parse;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_array_find__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_array_find___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_array_find__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__console_console__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lisp__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lpel__ = __webpack_require__(109);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_3__lpel__["c"]; });


/**
 * LuxPath expressions parser
 *
 * VERSION: 1.0.1
 * 
 * DVD: added sexpr property to the token as array to keep s-expressions.
 *      arity and first, second etc will be removed
 * 
 */
// Parser for Simplified JavaScript written in Simplified JavaScript
// From Top Down Operator Precedence
// http://javascript.crockford.com/tdop/index.html
// http://crockford.com/javascript/tdop/tdop.html
// Douglas Crockford
// 2010-06-26
//////////////////////////////////////////////////
// Later hacked to parse LPE instead of JavaScript
// Dmitry Dorofeev
// 2017-01-20

/*

lbp = left binding power
rbp = right binding power
nud = null denotation
led = left denotation
std = statement denotation
*/




var make_parse = function make_parse() {
  var m_symbol_table = {};
  var m_token;
  var m_tokens;
  var m_token_nr; // стэк для типов выражений

  var m_expr_scope = {
    pop: function pop() {}
  }; // для разбора логических выражений типа (A and B or C)
  // для хранения алиасов для операций

  var m_operator_aliases = {};

  var operator_alias = function operator_alias(from, to) {
    m_operator_aliases[from] = to;
  };

  var itself = function itself() {
    return this;
  };

  var scope = {
    find: function find(n) {
      var e = this,
          o;
      var s = Object.create(original_symbol);
      s.nud = itself;
      s.led = null;
      s.lbp = 0;
      return s;
    }
  };
  var expr_logical_scope = {
    pop: function pop() {
      m_expr_scope = this.parent;
    },
    parent: null,
    tp: "logical"
  };
  var expr_lpe_scope = {
    pop: function pop() {
      m_expr_scope = this.parent;
    },
    parent: null,
    tp: "lpe"
  };

  var new_expression_scope = function new_expression_scope(tp) {
    var s = m_expr_scope;
    m_expr_scope = Object.create(tp === "logical" ? expr_logical_scope : expr_lpe_scope);
    m_expr_scope.parent = s;
    return m_expr_scope;
  };

  var advance = function advance(id) {
    var a, o, t, v;

    if (id && m_token.id !== id) {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lpel__["a" /* makeError */])(m_token, "Got " + m_token.value + " but expected '" + id + "'.");
    }

    if (m_token_nr >= m_tokens.length) {
      m_token = m_symbol_table["(end)"];
      return;
    }

    t = m_tokens[m_token_nr];
    m_token_nr += 1;
    v = t.value;
    a = t.type;

    if (a === "name") {
      if (v === 'true' || v === 'false' || v === 'null') {
        o = m_symbol_table[v];
        a = "literal";
      } else if (m_expr_scope.tp == "logical") {
        if (v === "or" || v === "and" || v === "not" || v === "in" || v === "is") {
          //a = "operator";
          o = m_symbol_table[v]; //console.log("OPERATOR>", v , " ", JSON.stringify(o))

          if (!o) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lpel__["a" /* makeError */])(t, "Unknown logical operator.");
          }
        } else {
          o = scope.find(v);
        }
      } else {
        o = scope.find(v);
      }
    } else if (a === "operator") {
      o = m_symbol_table[v];

      if (!o) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lpel__["a" /* makeError */])(t, "Unknown operator.");
      }
    } else if (a === "string_double") {
      o = m_symbol_table["(string_literal_double)"];
      a = "literal";
    } else if (a === "string_single") {
      o = m_symbol_table["(string_literal_single)"];
      a = "literal";
    } else if (a === "number") {
      o = m_symbol_table["(number_literal)"];
      a = "literal";
    } else {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lpel__["a" /* makeError */])(t, "Unexpected token.");
    }

    m_token = Object.create(o);
    m_token.from = t.from;
    m_token.to = t.to;
    m_token.value = v;
    m_token.arity = a;

    if (a == "operator") {
      m_token.sexpr = m_operator_aliases[v];
    } else {
      m_token.sexpr = v; // by dima
    }

    return m_token;
  };

  var statement = function statement() {
    var n = m_token,
        v;

    if (n.std) {
      advance(); //scope.reserve(n);

      return n.std();
    }

    v = expression(0); //if (!v.assignment && v.id !== "(") {

    /*  if (v.id !== "(" && v.id !== "name" && v.id !== "number") {
        console.log(v);
        v.error("Bad expression statement.");
    }*/
    //advance(";");

    return v;
  };

  var statements = function statements() {
    var a = [],
        s;

    while (true) {
      //console.log(token);
      if (m_token.id === "(end)") {
        break;
      } else if (m_token.value === ';') {
        // skip optional ;
        advance();
      }

      s = statement(); //console.log("STATEMENT ", s);

      if (s) {
        a.push(s);
      }
    }

    return a.length === 0 ? null : a.length === 1 ? a[0] : {
      "sexpr": ["begin"].concat(a.map(function (el) {
        return el["sexpr"];
      }))
    };
  };

  var expression = function expression(rbp) {
    var left;
    var t = m_token;
    advance();
    left = t.nud();

    while (rbp < m_token.lbp) {
      t = m_token;
      advance();
      left = t.led(left);
    }

    return left;
  };

  var original_symbol = {
    nud: function nud() {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lpel__["a" /* makeError */])(this, "Undefined.");
    },
    led: function led(left) {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lpel__["a" /* makeError */])(this, "Missing operator.");
    }
  };

  var symbol = function symbol(id, bp) {
    var s = m_symbol_table[id];
    bp = bp || 0;

    if (s) {
      if (bp >= s.lbp) {
        s.lbp = bp;
      }
    } else {
      s = Object.create(original_symbol);
      s.id = s.value = id;
      s.lbp = bp;
      m_symbol_table[id] = s;
    }

    operator_alias(id, id);
    return s;
  };

  var infix = function infix(id, bp, led) {
    var s = symbol(id, bp);

    s.led = led || function (left) {
      this.first = left;
      var right = expression(bp);
      this.second = right;
      this.arity = "binary";
      this.sexpr = [this.sexpr, left.sexpr, right.sexpr];
      return this;
    };

    return s;
  }; // infix operators are left associative. 
  // We can also make right associative operators, such as short-circuiting logical operators, 
  // by reducing the right binding power.


  var infixr = function infixr(id, bp, led) {
    var s = symbol(id, bp);

    s.led = led || function (left) {
      this.first = left;
      var right = expression(bp - 1);
      this.second = right;
      this.arity = "binary";
      this.sexpr = [this.sexpr, left.sexpr, right.sexpr];
      return this;
    };

    return s;
  };

  var prefix = function prefix(id, nud) {
    var s = symbol(id);

    s.nud = nud || function () {
      // scope.reserve(this);
      var expr = expression(70);
      this.first = expr;
      this.arity = "unary";
      this.sexpr = [this.sexpr, expr.sexpr];
      return this;
    };

    return s;
  };

  var stmt = function stmt(s, f) {
    var x = symbol(s);
    x.std = f;
    return x;
  };

  symbol("(end)");
  symbol("(name)");
  symbol("(null)");
  symbol(":");
  symbol(";");
  symbol(")");
  symbol("]");
  symbol("}");

  symbol("true").nud = function () {
    this.sexpr = true;
    return this;
  };

  symbol("false").nud = function () {
    this.sexpr = false;
    return this;
  };

  symbol("null").nud = function () {
    this.sexpr = null;
    return this;
  }; // allow to skip values in function calls....


  var comma = symbol(",");

  symbol("(string_literal_double)").nud = function () {
    this.first = '"';
    this.arity = "unary";
    this.sexpr = ['"', this.sexpr];
    return this;
  };

  symbol("(string_literal_single)").nud = function () {
    this.first = "'";
    this.arity = "unary";
    this.sexpr = ["'", this.sexpr];
    return this;
  };

  symbol("(number_literal)").nud = itself; // [esix]: commented as in conflict with SQL operator ':'
  // infix("?", 20, function (left) {
  //   this.first = left;
  //   this.second = expression(0);
  //   advance(":");
  //   this.third = expression(0);
  //   this.arity = "ternary";
  //   this.sexpr = ["if", this.first.sexpr, this.second.sexpr, this.third.sexpr];
  //   return this;
  // });
  // [esix]: ternary operator with no conflict on ':' operator

  infix('?', 20, function (left) {
    this.first = left;
    this.second = expression(0);
    this.arity = 'binary';

    if (this.second.arity === 'binary' && this.second.value === ':') {
      this.sexpr = ["if", this.first.sexpr, this.second.sexpr[1], this.second.sexpr[2]];
    } else {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lpel__["a" /* makeError */])(this.second, "Invalid ternary operator.");
    }

    return this;
  });
  infixr("&&", 30);
  infixr("∧", 30);
  operator_alias("&&", "and");
  operator_alias("∧", "and");
  infixr("||", 30);
  infixr("∨", 30);
  operator_alias("||", "or");
  operator_alias("∨", "or");
  infixr('⍱', 30);
  operator_alias('⍱', 'nor');
  infixr('⍲', 30);
  operator_alias('⍲', 'nand');
  infixr('⊣', 30);
  operator_alias('⊣', 'car');
  infixr('⊢', 30);
  operator_alias('⊢', 'cdr');
  infixr('⍴', 30);
  /* will be used in logical scope, allow (a or and(b,c,ss)) */

  infixr("and", 30).nud = function () {
    return this;
  };
  /* allow (a and or(b,c,ss)) */


  infixr("or", 30).nud = function () {
    return this;
  }; // required for SQL logical scope where a in (1,2,3)


  infixr("in", 30);
  infixr("is", 30); // for SQL types: '10'::BIGINT

  infixr("::", 90); // for SQL as

  infixr(":", 80);
  infix(":=", 30);
  infixr('~', 40);
  infixr('!~', 40);
  infixr('=', 40);
  infixr('≠', 40);
  operator_alias('≠', '!='); // from to canonical form;

  infixr('==', 40);
  infixr('!==', 40);
  infixr('!=', 40);
  infixr('<', 40);
  infixr('<=', 40);
  infixr('≤', 40);
  operator_alias('≤', '<=');
  infixr(">", 40);
  infixr(">=", 40);
  infixr("≥", 40);
  operator_alias("≥", ">=");
  infixr("<>", 40);
  infix("+", 50);
  infix("-", 50);
  infix("*", 60);
  infix("/", 60);
  infix("(", 80, function (left) {
    var a = []; //console.log("FUNC>", left.value)

    if (left.id === "[") {
      // FIXME TODO
      this.arity = "ternary";
      this.first = left.first;
      this.second = left.second;
      this.third = a;
    } else {
      this.arity = "binary";
      this.first = left;
      this.value = "("; // it was '(' by dima

      this.second = a;

      if ((left.arity !== "unary" || left.id !== "function") && left.arity !== "name" && left.id !== "(" && left.id !== "&&" && left.id !== "||" && left.id !== "?") {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lpel__["a" /* makeError */])(left, "Expected a variable name.");
      }
    } // dima support for missed function arguments...


    if (m_token.id !== ")") {
      if (false) {
        // специальный парсер для where - logical expression.
        // тут у нас выражение с использованием скобок, and, or, not и никаких запятых...
        // DIMA 2021: logexpr function will be generic name for logical things
        // where && filter is used for SQL generation and should not be changed....
        // expr is deprecated name for logexpr
        // FIXME: make transition to the logexpr!
        new_expression_scope("logical");
        var e = expression(0); //console.log("LOGICAL" +  left.value + " " + JSON.stringify(e));

        m_expr_scope.pop();
        a.push(e);
      } else {
        new_expression_scope("lpe");

        while (true) {
          // console.log(">" + token.arity + " NAME:" + left.value);
          if (m_token.id === ',') {
            a.push({
              value: null,
              arity: "literal"
            });
            advance();
          } else if (m_token.id === ')') {
            a.push({
              value: null,
              arity: "literal"
            });
            break;
          } else {
            new_expression_scope("logical");
            var e = expression(0); //console.log("LOGICAL????? " + JSON.stringify(e));

            m_expr_scope.pop(); // var e = statements();

            a.push(e);

            if (m_token.id !== ",") {
              break;
            }

            advance(",");
          }
        }

        m_expr_scope.pop();
      }
    }

    this.sexpr = [this.first.value].concat(a.map(function (el) {
      return el.sexpr;
    }));
    advance(")");
    return this;
  });

  function lift_funseq(node) {
    if (node.value === "->") {
      return lift_funseq(node.first).concat(lift_funseq(node.second));
    } else
      /*if (node.value === "(") {
      console.log("() DETECTED" + JSON.stringify(node))
      //if (node.first.value === "->"){
      // если у нас в скобки взято выражение "->", то скобки можно удалить
      // if (true).(frst().second()) === if(true) => [->> [first] [second]] скобки не нужны, 
      // так как seq уже группирует вызовы в цепочку
      // DIMA 2022 на самом деле нет для
      // if(a=b).(yes().yes()).(no().no3())
      // получаем
      // ["->",["if",["=","a","b"]],["yes"],["yes"],["no"],["no3"]]
      // что выглядит странно со вснх сторон
      //  return [["->"].concat(lift_funseq(node.first.first)).concat(lift_funseq(node.first.second))];
      //} else {
      return lift_funseq(node.first);
      //}
      } else */
      {
        //console.log("?? DETECTED" + JSON.stringify(node))
        return [node.sexpr];
      }
  }

  function lift_funseq_2(node) {
    if (node.value === "->>") {
      return lift_funseq(node.first).concat(lift_funseq(node.second));
    } else
      /*if (node.value === "()") {
      //if (node.first.value === "->>"){
      // если у нас в скобки взято выражение "->", то скобки можно удалить
      // if (true).(frst().second()) === if(true) => [->> [first] [second]] скобки не нужны, 
      // так как seq уже группирует вызовы в цепочку
      //  return [["->>"].concat(lift_funseq(node.first.first)).concat(lift_funseq(node.first.second))];
      //} else {
      return lift_funseq(node.first);
      //}
      } else */
      {
        return [node.sexpr];
      }
  }

  infix(".", 70, function (left) {
    this.first = left; // this.second = expression(0);

    this.second = expression(70);
    this.arity = "binary";
    this.value = "->";
    this.sexpr = ["->"].concat(lift_funseq(this));
    return this;
  });
  infix("..", 70, function (left) {
    this.first = left; // this.second = expression(0);

    this.second = expression(70);
    this.arity = "binary";
    this.value = "->>";
    this.sexpr = ["->>"].concat(lift_funseq_2(this));
    return this;
  }); // WARNING HACK FIXME DIMA - добавил чтобы писать order_by(+a)
  // А также замена /table на +table в htSQL

  prefix("+");
  prefix("!"); // allow func().not(a)   а также f(a is not null)

  var n = prefix("not", function () {
    // it is nud function
    var expr = expression(70); //console.log("AHTUNG expr is " + JSON.stringify(expr))

    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lisp__["d" /* isArray */])(expr.sexpr) && expr.sexpr[0] === '()') {
      /* выражение not() выдаёт вот такое:
        {
          from: 0,
          to: 3,
          value: 'not',
          arity: 'unary',
          sexpr: [ 'not', [ '()' ] ],
          first: {from: 3,to: 4,value: '(',arity: 'binary',sexpr: [ '()' ],
                  first: { from: 3, to: 4, value: '()', arity: 'name', sexpr: ['()'] }
          }
        }
        not(1) даёт такое, a not(1,2) нельзя написать = ошибка !!!
          {
            from: 0,
            to: 3,
            value: 'not',
            arity: 'unary',
            sexpr: [ 'not', [ '()', 1 ] ],
            first: { from: 4, to: 5, value: 1, arity: 'literal', sexpr: [ '()', 1 ] }
          }
        надо его преобразовать в
          {
            from: 1,
            to: 2,
            value: '(',
            arity: 'binary',
            sexpr: [ 'f' ],
            first: { from: 0, to: 1, value: 'f', arity: 'name', sexpr: 'f' },
            second: []
          }
        или с параметром (одним!)
          {
            from: 1,
            to: 2,
            value: '(',
            arity: 'binary',
            sexpr: [ 'f', 1 ],
            first: { from: 0, to: 1, value: 'f', arity: 'name', sexpr: 'f' },
            second: [ { from: 2, to: 3, value: 1, arity: 'literal', sexpr: 1 } ]
          }
      */
      this.arity = 'name';
      this.value = 'not';
      this.sexpr = 'not';
      var e = {
        from: 0,
        to: 2,
        value: '(',
        arity: 'binary',
        sexpr: ['not'],
        first: this
      };

      if (expr.sexpr.length > 1) {
        e.second = [{
          from: 4,
          to: 5,
          value: expr.sexpr[1],
          arity: 'literal',
          sexpr: expr.sexpr[1]
        }];
        e.sexpr.push(expr.sexpr); // keep () in the parsed AST
        //e.sexpr = e.sexpr.concat(expr.sexpr) // keep () in the parsed AST
      }

      return e;
    } // simple operator `not expr`


    this.first = expr;
    this.arity = "unary";
    this.sexpr = [this.sexpr, expr.sexpr]; //console.log("2NOT nud:" + JSON.stringify(this))

    return this;
  });

  n.led = function (left) {
    //console.log("NOT led left:" + JSON.stringify(left))
    return this;
  }; // will be used in logical scope


  prefix("¬");
  operator_alias("!", "not");
  operator_alias("¬", "not"); // trying to optimize, when we have negated -number

  prefix("-");
  prefix(".", function () {
    var v = expression(70);

    if (v.value !== "(") {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lpel__["a" /* makeError */])(v, "Only functions may have dot (.) unary operator.");
    } // this.first = v;
    // this.arity = "unary";
    // return this;
    // skip unary dot !!!


    return v;
  });
  prefix("(", function () {
    var e;

    if (m_token.value === ')') {
      // если это просто () две скобки, то возвращаем сразу кусок AST,генерим функцию с именем "()"
      // {"from":3,"to":4,"value":"(","arity":"operator","sexpr":"("}
      this.arity = "binary";
      this.sexpr = ["()"];
      this.first = {
        from: this.from,
        to: this.to + 1,
        value: '()',
        arity: 'name',
        sexpr: ['()']
      };
      advance(")");
      return this;
    }

    e = expression(0); //console.log('(), got e' + JSON.stringify(e))

    if (m_expr_scope.tp == "logical") {
      // we should remember all brackets to restore original user expression
      e.value = "("; // FIXME: why not make it '()' ?? and looks like function `()` call ?

      e.sexpr = ["()", e.sexpr];
    } else {
      if (e.value === "->") {
        // в скобки взято выражение из цепочки LPE вызовов, нужно запомнить скобки, делаем push "()" в текущий AST 
        e = {
          first: e,
          value: "(",
          arity: "binary",
          sexpr: ["()", e.sexpr]
        };
      }
    }

    advance(")"); //console.log('(), return e' + JSON.stringify(e))

    return e;
  });
  prefix("[", function () {
    var a = [];

    if (m_token.id !== "]") {
      while (true) {
        a.push(expression(0)); // a.push(statements());

        if (m_token.id !== ",") {
          break;
        }

        advance(",");
      }
    }

    advance("]");
    this.first = a;
    this.arity = "unary";
    this.sexpr = ["["].concat(a.map(function (el) {
      return el.sexpr;
    }));
    return this;
  });
  return function (source) {
    m_tokens = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lpel__["b" /* tokenize */])(source, '=<>!+-*&|/%^:.', '=<>&|:.');
    m_token_nr = 0;
    new_expression_scope("logical");
    advance();
    var s = statements(); // var s = expression(0);

    advance("(end)");
    return s;
  };
};

var parser = make_parse(); // console.log('LPE Parser initialized')

function parse(str) {
  try {
    var parseResult = parser(str); // from, to, value, arity, sexpr

    return parseResult.sexpr;
  } catch (err) {
    __WEBPACK_IMPORTED_MODULE_1__console_console__["a" /* default */].error("Error", err.message);
    __WEBPACK_IMPORTED_MODULE_1__console_console__["a" /* default */].error("Error", err.stack);
    throw err;
  }
}


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(37)('meta');
var isObject = __webpack_require__(3);
var has = __webpack_require__(15);
var setDesc = __webpack_require__(4).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(7)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(5);
var dPs = __webpack_require__(85);
var enumBugKeys = __webpack_require__(59);
var IE_PROTO = __webpack_require__(66)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(74)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(121).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__(62);
var anObject = __webpack_require__(5);
var speciesConstructor = __webpack_require__(125);
var advanceStringIndex = __webpack_require__(58);
var toLength = __webpack_require__(17);
var callRegExpExec = __webpack_require__(47);
var regexpExec = __webpack_require__(65);
var fails = __webpack_require__(7);
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { RegExp(MAX_UINT32, 'y'); });

// @@split logic
__webpack_require__(42)('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(151);
var anObject = __webpack_require__(5);
var $flags = __webpack_require__(43);
var DESCRIPTORS = __webpack_require__(2);
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__(12)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__(7)(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(67)('asyncIterator');


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(41);
var TAG = __webpack_require__(1)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(15);
var toObject = __webpack_require__(10);
var IE_PROTO = __webpack_require__(66)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(3);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 37 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(57);
var step = __webpack_require__(64);
var Iterators = __webpack_require__(24);
var toIObject = __webpack_require__(9);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(63)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(5);
var toLength = __webpack_require__(17);
var advanceStringIndex = __webpack_require__(58);
var regExpExec = __webpack_require__(47);

// @@match logic
__webpack_require__(42)('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = db_quote_literal;
/* harmony export (immutable) */ __webpack_exports__["b"] = db_quote_ident;
/* harmony export (immutable) */ __webpack_exports__["c"] = reports_get_columns;
/* harmony export (immutable) */ __webpack_exports__["f"] = reports_get_column_info;
/* harmony export (immutable) */ __webpack_exports__["e"] = reports_get_table_sql;
/* harmony export (immutable) */ __webpack_exports__["g"] = reports_get_join_path;
/* harmony export (immutable) */ __webpack_exports__["h"] = reports_get_join_conditions;
/* unused harmony export get_source_database */
/* harmony export (immutable) */ __webpack_exports__["d"] = get_data_source_info;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_regexp_match__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_regexp_match___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_regexp_match__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_regexp_split__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_regexp_split___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_regexp_split__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_to_string__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_to_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_to_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_regexp_replace__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_regexp_replace___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_regexp_replace__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lisp__ = __webpack_require__(18);





function db_quote_literal(intxt) {
  return "'" + intxt.toString().replace(/\'/g, "''") + "'";
}
function db_quote_ident(intxt) {
  return '"' + intxt.toString() + '"';
} // for debugging outside of database !!!
// FIXME: dims has all info about columns !!!

function reports_get_columns(cubeId, dims) {
  var r = [];

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lisp__["d" /* isArray */])(globalThis.MOCKcubeColumns)) {
    r = globalThis.MOCKcubeColumns;
  } else {
    //console.log("Built in Cube COLUMNS")
    var r = [{
      "id": "ch.fot_out.Val",
      "type": "NUMBER",
      "title": "Val",
      "sql_query": "\"Val\"",
      "config": {}
    }, {
      "id": "ch.fot_out.My version",
      "type": "STRING",
      "title": "My version",
      "sql_query": "\"My version\"",
      "config": {}
    }, {
      "id": "ch.fot_out.dt",
      "type": "PERIOD",
      "title": "dt",
      "sql_query": "NOW() - INERVAL '1 DAY'",
      "config": {}
    }, {
      "id": "ch.fot_out.hcode_id",
      "type": "NUMBER",
      "title": "hcode_id",
      "sql_query": "hcode_id",
      "config": {}
    }, {
      "id": "ch.fot_out.hcode_name",
      "type": "STRING",
      "title": "hcode_name",
      "sql_query": "hcode_name",
      "config": {}
    }, {
      "id": "ch.fot_out.unit_name",
      "type": "STRING",
      "title": "unit_name",
      "sql_query": "unit_name",
      "config": {}
    }, {
      "id": "ch.fot_out.date_type_id",
      "type": "NUMBER",
      "title": "date_type_id",
      "sql_query": "date_type_id",
      "config": {}
    }, {
      "id": "ch.fot_out.dor_id",
      "type": "NUMBER",
      "title": "dor_id",
      "sql_query": "dor_id",
      "config": {}
    }, {
      "id": "ch.fot_out.dor_tlg",
      "type": "STRING",
      "title": "dor_tlg",
      "sql_query": "dor_tlg",
      "config": {}
    }, {
      "id": "ch.fot_out.dor_name",
      "type": "STRING",
      "title": "dor_name",
      "sql_query": "dor_name",
      "config": {}
    }, {
      "id": "ch.fot_out.obj_id",
      "type": "NUMBER",
      "title": "obj_id",
      "sql_query": "obj_id",
      "config": {}
    }, {
      "id": "ch.fot_out.tlg",
      "type": "STRING",
      "title": "tlg",
      "sql_query": "tlg",
      "config": {}
    }, {
      "id": "ch.fot_out.obj_name",
      "type": "STRING",
      "title": "obj_name",
      "sql_query": "obj_name",
      "config": {}
    }, {
      "id": "ch.fot_out.oe_type",
      "type": "STRING",
      "title": "oe_type",
      "sql_query": "oe_type",
      "config": {}
    }, {
      "id": "ch.fot_out.priox_int",
      "type": "NUMBER",
      "title": "priox_int",
      "sql_query": "priox_int",
      "config": {}
    }, {
      "id": "ch.fot_out.type_oe_bi",
      "type": "STRING",
      "title": "type_oe_bi",
      "sql_query": "type_oe_bi",
      "config": {}
    }, {
      "id": "ch.fot_out.dor1",
      "type": "STRING",
      "title": "dor1",
      "sql_query": "dor1",
      "config": {}
    }, {
      "id": "ch.fot_out.dor2",
      "type": "STRING",
      "title": "dor2",
      "sql_query": "dor2",
      "config": {}
    }, {
      "id": "ch.fot_out.dor3",
      "type": "STRING",
      "title": "dor3",
      "sql_query": "dor3",
      "config": {}
    }, {
      "id": "ch.fot_out.dor4",
      "type": "STRING",
      "title": "dor4",
      "sql_query": "dor4",
      "config": {}
    }, {
      "id": "ch.fot_out.dor5",
      "type": "STRING",
      "title": "dor5",
      "sql_query": "dor5",
      "config": {}
    }, {
      "id": "ch.fot_out.dor6",
      "type": "STRING",
      "title": "dor6",
      "sql_query": "dor6",
      "config": {}
    }, {
      "id": "ch.fot_out.branch1",
      "type": "STRING",
      "title": "branch1",
      "sql_query": "branch1",
      "config": {}
    }, {
      "id": "ch.fot_out.branch2",
      "type": "STRING",
      "title": "branch2",
      "sql_query": "branch2",
      "config": {}
    }, {
      "id": "ch.fot_out.branch3",
      "type": "STRING",
      "title": "branch3",
      "sql_query": "branch3",
      "config": {}
    }, {
      "id": "ch.fot_out.branch4",
      "type": "STRING",
      "title": "branch4",
      "sql_query": "branch4",
      "config": {}
    }, {
      "id": "ch.fot_out.branch5",
      "type": "STRING",
      "title": "branch5",
      "sql_query": "branch5",
      "config": {}
    }, {
      "id": "ch.fot_out.branch6",
      "type": "STRING",
      "title": "branch6",
      "sql_query": "branch6",
      "config": {}
    }, {
      "id": "ch.fot_out.ss1",
      "type": "STRING",
      "title": "ss1",
      "sql_query": "ss1",
      "config": {}
    }, {
      "id": "ch.fot_out.ss2",
      "type": "STRING",
      "title": "ss2",
      "sql_query": "ss2",
      "config": {}
    }, {
      "id": "ch.fot_out.ss3",
      "type": "STRING",
      "title": "ss3",
      "sql_query": "ss3",
      "config": {}
    }, {
      "id": "ch.fot_out.ss4",
      "type": "STRING",
      "title": "ss4",
      "sql_query": "ss4",
      "config": {}
    }, {
      "id": "ch.fot_out.ss5",
      "type": "STRING",
      "title": "ss5",
      "sql_query": "ss5",
      "config": {}
    }, {
      "id": "ch.fot_out.ss6",
      "type": "STRING",
      "title": "ss6",
      "sql_query": "ss6",
      "config": {}
    }, {
      "id": "ch.fot_out.indicator_v",
      "type": "NUMBER",
      "title": "indicator_v",
      "sql_query": "indicator_v",
      "config": {}
    }, {
      "id": "ch.fot_out.group_pay_name",
      "type": "STRING",
      "title": "group_pay_name",
      "sql_query": "group_pay_name",
      "config": {
        "follow": ["fot_out.group_pay_id"],
        "children": ["fot_out.pay_name", "fot_out.pay_code"],
        "memberALL": "Не задано"
      }
    }, {
      "id": "ch.fot_out.pay_code",
      "type": "STRING",
      "title": "pay_code",
      "sql_query": "pay_code",
      "config": {
        "memberALL": "Не задано",
        "follow": ["fot_out.pay_name"]
      }
    }, {
      "id": "ch.fot_out.pay_title",
      "type": "STRING",
      "title": "pay_title",
      "sql_query": "dictGet('gpn.group_pay_dict', 'some_real_field', tuple(pay_code))",
      "config": {}
    }, {
      "id": "ch.fot_out.pay_name",
      "type": "STRING",
      "title": "pay_name",
      "sql_query": "pay_name",
      "config": {
        "memberALL": "Не задано",
        "follow": ["fot_out.pay_code"]
      }
    }, {
      "id": "ch.fot_out.category_name",
      "type": "STRING",
      "title": "category_name",
      "sql_query": "category_name",
      "config": {}
    }, {
      "id": "ch.fot_out.sex_code",
      "type": "STRING",
      "title": "sex_code",
      "sql_query": "sex_code",
      "config": {
        "memberALL": null,
        "altDimensions": ["fot_out.sex_name"]
      }
    }, {
      "id": "ch.fot_out.sex_name",
      "type": "STRING",
      "title": "sex_name",
      "sql_query": "sex_name",
      "config": {
        "memberALL": "Все",
        "altDimensions": ["fot_out.sex_code"]
      }
    }, {
      "id": "ch.fot_out.area_name",
      "type": "STRING",
      "title": "area_name",
      "sql_query": "area_name",
      "config": {}
    }, {
      "id": "ch.fot_out.region_name",
      "type": "STRING",
      "title": "region_name",
      "sql_query": "region_name",
      "config": {}
    }, {
      "id": "ch.fot_out.municipal_name",
      "type": "STRING",
      "title": "municipal_name",
      "sql_query": "municipal_name",
      "config": {}
    }, {
      "id": "ch.fot_out.prod_group_name",
      "type": "STRING",
      "title": "prod_group_name",
      "sql_query": "prod_group_name",
      "config": {}
    }, {
      "id": "ch.fot_out.profession_name",
      "type": "STRING",
      "title": "profession_name",
      "sql_query": "profession_name",
      "config": {}
    }, {
      "id": "ch.fot_out.v_agg",
      "type": "AGGFN",
      "title": "v_agg",
      "sql_query": "max(sum(v_main))",
      "config": {}
    }, {
      "id": "ch.fot_out.v_rel_fzp",
      "type": "SUM",
      "title": "v_rel_fzp",
      "sql_query": "v_rel_fzp",
      "config": {}
    }, {
      "id": "ch.fot_out.v_main",
      "type": "SUM",
      "title": "v_main",
      "sql_query": "v_main",
      "config": {}
    }, {
      "id": "ch.fot_out.v_rel_fzp",
      "type": "SUM",
      "title": "v_rel_fzp",
      "sql_query": "v_rel_fzp",
      "config": {}
    }, {
      "id": "ch.fot_out.v_rel_pp",
      "type": "SUM",
      "title": "v_rel_pp",
      "sql_query": "v_rel_pp",
      "config": {}
    }, {
      "id": "ch.fot_out.fackt",
      "type": "SUM",
      "title": "fackt",
      "sql_query": "round(v_main,2)",
      "config": {}
    }];
  }

  var parts = cubeId.split('.');
  var res = {};
  res[parts[0]] = {};
  var deep = {};
  r.map(function (el) {
    var ids = el.id.split('.');
    el["_ds"] = ids[0];
    el["_cube"] = ids[1];
    el["_col"] = ids[2];
    deep[el["_col"]] = el;
    res[el.id] = el;
  });
  res[parts[0]][parts[1]] = deep;
  return res;
}
function reports_get_column_info(srcId, col) {
  var parts = col.split('.');
  return {
    "id": col,
    "sql_query": parts[2],
    "type": "STRING",
    "config": {}
  };
}
function reports_get_table_sql(target_db_type, tbl, cube) {
  var table_name = tbl.split('.')[1];

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lisp__["b" /* isHash */])(cube)) {
    console.log("Cube SQL provided as func arg");
    var sql = cube.sql_query;
    if (sql.match(/ /) !== null) sql = "(".concat(sql, ")"); // it's select ... FROM or something like this

    if (target_db_type === 'oracle') {
      return {
        "query": "".concat(sql, " ").concat(tsable_name),
        "config": cube.config
      };
    }

    return {
      "query": "".concat(sql, " AS ").concat(table_name),
      "config": cube.config
    };
  }

  if (globalThis.MOCKCubeSQL !== undefined && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lisp__["b" /* isHash */])(globalThis.MOCKCubeSQL["".concat(target_db_type, "-").concat(tbl)])) {
    return globalThis.MOCKCubeSQL["".concat(target_db_type, "-").concat(tbl)];
  }

  if (target_db_type === 'oracle') {
    return {
      "query": "".concat(table_name, " ").concat(table_name),
      "config": {
        "is_template": 0
      }
    };
  }

  return {
    "query": "".concat(table_name, " AS ").concat(table_name),
    "config": {
      "is_template": 0
    } // hcode_name
    // and ${filters(group_pay_name)}
    //return {"query": `${table_name} AS ${table_name} where ` + '${filters(sex_code,pay_code)} ', "config": {"is_template": 1,"skip_where":0}}

  };
}
/* should find path to JOIN all tables listed in cubes array */

/* returns list of tables and list of links between them */

function reports_get_join_path(cubes) {
  return {
    "links": [],
    "nodes": cubes
  };
} // should return LPE STRUCT

function reports_get_join_conditions(link_struct) {
  return 'TRUE';
} // we should get it from JDBC Connect String
// DEPRECATED, remove in 2023, use get_data_source_info()

function get_source_database(srcIdent) {
  if (srcIdent === 'oracle') {
    return 'oracle';
  } else {
    return 'postgresql';
  }
}
function get_data_source_info(srcIdent) {
  if (srcIdent === 'oracle') {
    return {
      'flavor': 'oracle'
    };
  } else {
    return {
      'flavor': 'postgresql'
    };
  }
}

/***/ }),
/* 41 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(150);
var redefine = __webpack_require__(12);
var hide = __webpack_require__(16);
var fails = __webpack_require__(7);
var defined = __webpack_require__(32);
var wks = __webpack_require__(1);
var regexpExec = __webpack_require__(65);

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(5);
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Forced replacement prototype accessors methods
module.exports = __webpack_require__(33) || !__webpack_require__(7)(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () { /* empty */ });
  delete __webpack_require__(6)[K];
});


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(87);
var hiddenKeys = __webpack_require__(59).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(31);
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(4).f;
var has = __webpack_require__(15);
var TAG = __webpack_require__(1)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(8);
var global = __webpack_require__(6);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(33) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 50 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var aFunction = __webpack_require__(19);
var toObject = __webpack_require__(10);
var fails = __webpack_require__(7);
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(126)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(10);
var $keys = __webpack_require__(13);

__webpack_require__(11)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(5);
var toObject = __webpack_require__(10);
var toLength = __webpack_require__(17);
var toInteger = __webpack_require__(50);
var advanceStringIndex = __webpack_require__(58);
var regExpExec = __webpack_require__(47);
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__(42)('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $values = __webpack_require__(88)(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__(38);
var getKeys = __webpack_require__(13);
var redefine = __webpack_require__(12);
var global = __webpack_require__(6);
var hide = __webpack_require__(16);
var Iterators = __webpack_require__(24);
var wks = __webpack_require__(1);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = sql_where_context;
/* harmony export (immutable) */ __webpack_exports__["a"] = eval_sql_where;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es7_symbol_async_iterator__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es7_symbol_async_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_modules_es7_symbol_async_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_symbol__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es7_object_values__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es7_object_values___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_modules_es7_object_values__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_regexp_search__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_regexp_search___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_regexp_search__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_es6_regexp_match__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_es6_regexp_match___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_modules_es6_regexp_match__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_modules_web_dom_iterable__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_modules_web_dom_iterable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_modules_web_dom_iterable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_array_iterator__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_array_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_array_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_object_keys__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_modules_es6_regexp_replace__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_modules_es6_regexp_replace___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_modules_es6_regexp_replace__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_modules_es6_array_sort__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_modules_es6_array_sort___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_modules_es6_array_sort__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_regexp_split__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_regexp_split___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_regexp_split__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_modules_es6_regexp_constructor__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_modules_es6_regexp_constructor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_modules_es6_regexp_constructor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_modules_es6_function_name__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_modules_es6_function_name___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_modules_es6_function_name__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_modules_es6_regexp_to_string__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_modules_es6_regexp_to_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_modules_es6_regexp_to_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__console_console__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__lpep__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__utils_utils__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__lisp__ = __webpack_require__(18);















function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 Copyright (c) 2019 Luxms Inc.

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the Software
 is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */




/*
where - всегда возвращает слово WHERE, а потом условия. На пустом входе вернёт WHERE TRUE
filter - на пустом входе вернёт пустую строку
*/

function sql_where_context(_vars) {
  // для отслеживания переменных, значения которых отсутствуют для cond
  // cond('col in $(row.var)', [])
  var track_undefined_values_for_cond = []; // try to get datasource Ident
  // table lookup queries should be sending us key named sourceId = historical name!

  var srcIdent = _vars["sourceId"];

  if (srcIdent !== undefined) {
    var ds_info = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__utils_utils__["d" /* get_data_source_info */])(srcIdent);
    _vars["_target_database"] = ds_info["flavor"];
  }

  var _context = _vars;

  var try_to_quote_column = function try_to_quote_column(colname) {
    if (_typeof(_vars['_columns']) == 'object') {
      var h = _vars['_columns'][colname];

      if (_typeof(h) == "object") {
        h = h['name'].toString(); // console.log("-: try_to_quote_column " + JSON.stringify(h));
        // console.log("-: try_to_quote_column " + (typeof h));

        if (h.length > 0) {
          // return '"' + h + '"';
          return h;
        }
      }
    }

    return colname.toString();
  };

  var try_to_quote_order_by_column = function try_to_quote_order_by_column(colname) {
    var res = colname.toString();

    if (_typeof(_vars['_columns']) == 'object') {
      var h = _vars['_columns'][colname];

      if (_typeof(h) == "object") {
        var o = h['order'];

        if (o === undefined) {
          o = h['name'];
        } //console.log("-: try_to_quote_order_by_column " + JSON.stringify(o));
        //console.log("-: try_to_quote_order_by_column " + (typeof o));


        if (o !== undefined && o.length > 0) {
          o = o.toString();
          var regExp = new RegExp(/^\w[\w\d]*$/, "i"); // quote only literals that are not standard!

          var schema_table = o.split('.');

          if (schema_table.length < 4) {
            res = schema_table.map(function (item) {
              return regExp.test(item) ? item : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__utils_utils__["b" /* db_quote_ident */])(item);
            }).join('.');
          } else {
            throw new Error('Too many dots for column name ' + o);
          }
        }
      }
    }

    return res;
  };

  var resolve_literal = function resolve_literal(lit) {
    //console.log('LITERAL ', lit, '  CONTEXT:', _vars[lit]);
    if (_vars[lit] == undefined) {
      return try_to_quote_column(lit);
    } else {
      // есть возможность переименовать имена столбцов! или сделать ещё какие-то подстановки
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(lit, _vars);
    }
  };

  var resolve_order_by_literal = function resolve_order_by_literal(lit) {
    //console.log('OB LITERAL ', lit, ' CONTEXT:', _vars[lit]);
    if (_vars[lit] === undefined) {
      return try_to_quote_order_by_column(lit);
    } else {
      // есть возможность переименовать имена столбцов! или сделать ещё какие-то подстановки
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(lit, _vars);
    }
  };
  /* заполняем контекст функциями и макросами, заточенными на SQL */


  _context['order_by'] = function () {
    var ret = [];
    var ctx = {};

    var get_extra_order = function get_extra_order(colname) {
      if (_typeof(_vars['_columns']) == 'object') {
        var h = _vars['_columns'][colname];

        if (_typeof(h) == "object") {
          var o = h['order_extra'];

          if (o !== undefined) {
            return " ".concat(o);
          }
        }
      }

      return "";
    };

    for (var key in _vars) {
      ctx[key] = _vars[key];
    } // так как order_by будет выполнять eval_lisp, когда встретит имя столба с минусом -a, то мы
    // с помощью макросов + и - в этом случае перехватим вызов и сделаем обработку.
    // а вот когда работает обработчик аргументов where - там eval_lisp почти никогда не вызывается...


    ctx['+'] = function (a) {
      return resolve_order_by_literal(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(a, _vars)) + get_extra_order(a);
    };

    ctx['+'].ast = [[], {}, [], 1]; // mark as macro

    ctx['-'] = function (a) {
      return resolve_order_by_literal(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(a, _vars)) + ' DESC' + get_extra_order(a);
    };

    ctx['-'].ast = [[], {}, [], 1]; // mark as macro
    // вот так будет работать: order_by(-short_tp,y)
    // Но у нас может быть ситуация, когда мы столбцы для сотрировки передали в массиве _vars["sort"] 
    // Это koob lookup
    // поэтому делаем разбор этого массива и дописываем аргументы
    // что-то похожее делается прямо в  function eval_sql_where, но там проверяется что _vars["sort"] = строка.

    var args = Array.prototype.slice.call(arguments);

    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["d" /* isArray */])(_vars["sort"])) {
      var extra_args = _vars["sort"].map(function (el) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__lpep__["a" /* parse */])(el);
      });

      args = args.concat(extra_args);
    }

    for (var i = 0; i < args.length; i++) {
      //console.log(`step ${i} ${JSON.stringify(args[i])}`)
      if (args[i] instanceof Array) {
        ret.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(args[i], ctx));
      } else {
        // try_to_quote_column берёт текст в двойные кавычки для известных столбцов!!!
        var a = args[i].toString();
        ret.push(resolve_order_by_literal(a) + get_extra_order(a));
      }
    }

    if (ret.length > 0) {
      return 'ORDER BY ' + ret.join(',');
    } else {
      return '';
    }
  };

  _context['order_by'].ast = [[], {}, [], 1]; // mark as macro

  _context['lpe_pg_tstz_at_time_zone'] = function (timestamp, zone) {
    // FIXME: check quotes !!!
    if (/'/.test(timestamp)) {
      throw 'Wrong timestamp: ' + JSON.stringify(timestamp);
    } //console.log("lpe_pg_tstz_at_time_zone" + timestamp);


    return "'" + timestamp + "'" + "::timestamptz at time zone '" + zone + "'";
  };

  _context['pg_interval'] = function (cnt, period_type) {
    var pt;

    if (period_type instanceof Object) {
      pt = period_type["unit"];
    } else {
      pt = period_type;
    }

    if (/^\d+$/.test(pt)) {
      // all numbers....
      switch (pt) {
        case 1:
          pt = 'second';
          break;

        case 2:
          pt = 'minute';
          break;

        case 3:
          pt = 'hour';
          break;

        case 4:
          pt = 'day';
          break;

        case 5:
          pt = 'week';
          break;

        case 6:
          pt = 'month';
          break;

        case 7:
          pt = 'quarter';
          break;

        case 8:
          pt = 'year';
          break;

        default:
          throw "wrong period type:" + pt;
      }
    } else {
      var reg = new RegExp("['\"]+", "g");
      pt = pt.replace(reg, "");
    }

    var regExp = new RegExp(/quarter/, "i");

    if (regExp.test(pt)) {
      return "'" + cnt * 3 + " month'::interval";
    }

    return "'" + cnt + " " + pt + "'::interval";
  };

  _context["ql"] = function (el) {
    // NULL values should not be quoted
    // console.log('QL: ' + JSON.stringify(el))
    return el === null ? null : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__utils_utils__["a" /* db_quote_literal */])(el);
  };

  _context["includes"] = function (col, el) {
    // First arg = column name, second arg = string literal
    return "".concat(col, " ? ").concat(el);
  }; // required for Oracle Reports


  _context["to_timestamp"] = function (el, fmt, nls) {
    return "to_timestamp(".concat(el, ")");
  }; // required for Oracle Reports


  _context["to_char"] = function (el, tp, fmt) {
    return "to_char()";
  }; // required for Oracle Reports


  _context["to_date"] = function (el, fmt, nls) {
    if (fmt && nls) {
      return "to_date(".concat(el, ", ").concat(fmt, ", ").concat(nls, ")");
    }

    if (fmt) {
      return "to_date(".concat(el, ", ").concat(fmt, ")");
    }

    return "to_date(".concat(el, ")");
  };
  /*
  _context["'"] = function (expr) {
    // we should eval things in the cond ( a = '$(abs.ext)')
    //console.log('FOUND EXPR: ' + expr)
    if (expr.match(/^\s*\$\(.*\)\s*$/)){
      return `'{eval_lisp(expr, _context)}'`
    }
  }*/
  // table lookup filters with auto-filling


  _context['filters'] = function () {
    // for(var i = 0; i < arguments.length; i++) {
    var a = Array.prototype.slice.call(arguments); // нужно включить ВСЕ элементы из _vars.context.row, 
    // "row":{"short_tp":["=","ГКБ"],"y":["=",2021]}

    var row = _vars.context.row;

    if (a.length > 0) {
      // возможно есть except???
      var except;
      var args = [];

      for (var i = 0; i < a.length; i++) {
        var el = a[i];

        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["d" /* isArray */])(el) && el[0] === 'except') {
          except = el;
        } else {
          args.push(el);
        }
      }

      if (except) {
        // console.log('EXCEPT !!!' + JSON.stringify(except))
        // нужно почистить _vars.context.row от лишних ключей
        // считаем, что в except идут исключительно имена столбцов
        except.slice(1).map(function (key) {
          return delete row[key];
        });
      }

      if (args.length > 0) {
        // есть элементы, которые явно указаны, генерим условия только для них
        // нужно почистить _vars.context.row от лишних ключей
        // args.map( el => console.log("ITER:" + JSON.stringify(el)) )
        var r = {};
        args.map(function (el) {
          if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["d" /* isArray */])(el)) {
            if (el[0] === ':') {
              //ITER:[":","short_tp","tp"]
              if (el[1] in row) {
                r[el[2]] = row[el[1]];
              }
            }
          } else {
            if (el in row) {
              r[el] = row[el];
            }
          }
        });
        row = r;
      }
    } // FIXME: REMOVE el!=='measures' in Sept. 2022


    var expr = Object.keys(row).filter(function (el) {
      return el !== 'measures' && el !== '$measures';
    }).map(function (col) {
      var ar = row[col]; //console.log("ITERITER:" + col + " " + JSON.stringify(ar))

      if ((ar[0] === '=' || ar[0] === '!=') && ar.length > 2) {
        return [ar[0], col, ['['].concat(ar.slice(1).map(function (el) {
          return ["ql", el];
        }))];
      }

      return [ar[0], col].concat(ar.slice(1).map(function (el) {
        return ["ql", el];
      }));
    });

    if (expr.length === 0) {
      return "1=1";
    }

    if (expr.length > 1) {
      expr = ["filter", ["and"].concat(expr)];
    } else {
      expr = ["filter", expr[0]];
    } //console.log("FILTERS:" + JSON.stringify(expr))


    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(expr, _context);
  };

  _context['filters'].ast = [[], {}, [], 1]; // mark as macro
  // filter

  _context['filter'] = function () {
    var ctx = {};

    for (var key in _vars) {
      ctx[key] = _vars[key];
    }

    var quote_scalar = function quote_scalar(el) {
      if (typeof el === "string") {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__utils_utils__["a" /* db_quote_literal */])(el);
      } else if (typeof el === "number") {
        return el;
      } else {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__utils_utils__["a" /* db_quote_literal */])(JSON.stringify(el));
      }
    };

    var prnt = function prnt(ar) {
      //console.log("PRNT:" + JSON.stringify(ar))
      if (ar instanceof Array) {
        if (ar[0] === '$' || ar[0] === '"' || ar[0] === "'" || ar[0] === "str" || ar[0] === "[" || ar[0] === 'parse_kv' || ar[0] === 'parse_cond' || ar[0] === "=" || ar[0] === "!=" || ar[0] === "ql" || ar[0] === "pg_interval" || ar[0] === "lpe_pg_tstz_at_time_zone" || ar[0] === "column" || ar[0] === "cond" || ar[0] === "includes") {
          return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(ar, ctx);
        } else {
          if (ar.length == 2) {
            // unary
            if (ar[0] == "not") {
              return ar[0] + ' ' + prnt(ar[1]);
            } else if (ar[0] == "()") {
              return "(" + prnt(ar[1]) + ")";
            } else if (ar[0].match(/^[^\w]+$/)) {
              return ar[0] + prnt(ar[1]);
            } else {
              return prnt(ar[0]) + "(" + prnt(ar[1]) + ")";
            }
          } else if (ar.length == 3) {
            if (ar[0] == "->") {
              // наш LPE использует точку, как разделитель вызовов функций и кодирует её как ->
              // в логических выражениях мы это воспринимаем как ссылку на <ИМЯ СХЕМЫ>.<ИМЯ ТАБЛИЦЫ>
              //return '"' + ar[1]+ '"."' + ar[2] + '"';
              return ar[1] + '.' + ar[2];
            } else if (ar[0] == "and" || ar[0] == "or") {
              return prnt(ar[1]) + ' ' + ar[0] + ' ' + prnt(ar[2]);
            } else if (ar[0] == "~") {
              //_source_database
              // Oracle has no ~ operator !!!
              if (_vars["_target_database"] === 'oracle') {
                return "REGEXP_LIKE( ".concat(prnt(ar[1]), " , ").concat(prnt(ar[2]), " )");
              } else if (_vars["_target_database"] === 'mysql') {
                return "".concat(prnt(ar[1]), " REGEXP ").concat(prnt(ar[2]));
              } else {
                return prnt(ar[1]) + ' ' + ar[0] + ' ' + prnt(ar[2]);
              }
            } else if (ar[0] == "ilike") {
              //_source_database
              // Oracle has no ilike !!!!
              if (_vars["_target_database"] === 'oracle' || _vars["_target_database"] === 'sqlserver') {
                // UPPER(last_name) LIKE 'SM%' 
                return "UPPER( ".concat(prnt(ar[1]), " ) LIKE UPPER(").concat(prnt(ar[2]), ")");
              } else {
                return prnt(ar[1]) + ' ' + ar[0] + ' ' + prnt(ar[2]);
              }
            } else if (ar[0] == "like" || ar[0] == "in" || ar[0] == "is" || ar[0].match(/^[^\w]+$/)) {
              // имя функции не начинается с буквы
              //console.log("PRNT FUNC x F z " + JSON.stringify(ar))
              // ["~",["column","vNetwork.folder"],"XXX"]
              if (Array.isArray(ar[1]) && ar[1][0] === 'column' && Array.isArray(ar[2]) && ar[2][0] !== 'column' || !Array.isArray(ar[2])) {// справа значение, которое нужно квотировать!
              }

              return prnt(ar[1]) + ' ' + ar[0] + ' ' + prnt(ar[2]);
            } else {
              return ar[0] + '(' + prnt(ar[1]) + ',' + prnt(ar[2]) + ')';
            }
          } else if (ar[0] == "and" || ar[0] == "or") {
            // много аргументов для логической функции
            return ar.slice(1).map(prnt).join(' ' + ar[0] + ' ');
          } else if (ar[0] == "between") {
            return '(' + prnt(ar[1]) + ' BETWEEN ' + prnt(ar[2]) + ' AND ' + prnt(ar[3]) + ')';
          } else {
            // это неизвестная функция с неизвестным кол-вом аргументов
            return ar[0] + '(' + ar.slice(1).map(function (argel) {
              return prnt(argel);
            }).join(',') + ')';
          }
        }
      } else {
        return ar;
      }
    };

    ctx['cond'] = function (expr, ifnull) {
      //console.log('COND MACRO expr: ' + JSON.stringify(expr));
      //console.log('COND MACRO ifnull: ' + JSON.stringify(ifnull));
      //COND MACRO expr: ["\"","myfunc($(period.title1)) = 234"]
      //COND MACRO ifnull: ["["]
      var parsed = expr; //console.log('COND PARSED:' + JSON.stringify(parsed));
      //Мы будем использовать спец флаг, были ли внутри этого cond доступы к переменным,
      // которые дали undefined. через глобальную переменную !!!

      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["f" /* isNumber */])(ifnull) || ifnull === null || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["d" /* isArray */])(ifnull) && ifnull.length === 2 && (ifnull[0] === '"' || ifnull[0] === "'")) {
        var val = prnt(ifnull);
        track_undefined_values_for_cond.unshift(val);
      } else {
        track_undefined_values_for_cond.unshift(false);
      }

      var evaluated = prnt(parsed);
      var unresolved = track_undefined_values_for_cond.shift(); //console.log('UNRESOLVED:' + unresolved);

      if (unresolved === true) {
        // не удалось найти значение, результат зависит от второго аргумента!

        /*
        если значение var == null
        cond('col in $(row.var)', []) = значит убрать cond вообще (с учётом or/and)
        cond('col = $(row.var)', ['col is null']) = полная замена col is null
        */
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["d" /* isArray */])(ifnull) && ifnull[0] === '[') {
          if (ifnull.length === 1) {
            return '1=1';
          } else {
            // надо вычислить значение по умолчанию!!!
            // ["\"","myfunc(1)"]
            var ast = ifnull[1];
            var p = prnt(ast);

            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["d" /* isArray */])(ast) && (ast[0] === '"' || ast[0] === "'")) {
              // убираем кавычки
              p = p.slice(1, -1);
            }

            return p;
          }
        }
      } //console.log('COND1:' + evaluated);


      return evaluated;
    };

    ctx['cond'].ast = [[], {}, [], 1]; // mark as macro

    ctx['"'] = function (el) {
      return '"' + el.toString() + '"';
    };

    ctx['"'].ast = [[], {}, [], 1]; // mark as macro

    ctx["'"] = function (expr) {
      // we should eval things in the cond ( a = '$(abs.ext)')
      //console.log("QUOT:" + expr)
      if (expr.match(/^\s*\$\(.*\)\s*$/)) {
        var parsed = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__lpep__["a" /* parse */])(expr);
        return "'".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(parsed, ctx), "'");
      } else {
        return "'" + expr.toString() + "'";
      }
    };

    ctx["'"].ast = [[], {}, [], 1]; // mark as macro: IF it is not a macro, than '*' is evaled to func body!

    ctx["["] = function (el) {
      return "[" + Array.prototype.slice.call(arguments).join(',') + "]";
    };

    function eq_not_eq(l, r, op) {
      // понимаем a = [null] как a is null
      // a = [] просто пропускаем, А кстати почему собственно???
      // a = [null, 1,2] как a in (1,2) or a is null
      // ["=",["column","vNetwork.cluster"],["[","SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]]
      //console.log('========'+ JSON.stringify(l) + ' <> ' + JSON.stringify(r))
      if (r instanceof Array) {
        if (r.length === 0) {
          return op === 'eq' ? 'TRUE' : 'FALSE';
        }

        if (r[0] === '[') {
          r = ['['].concat(r.slice(1).map(function (el) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(el, _context);
          }));
          var nonnull = r.filter(function (el) {
            return el !== null;
          });

          if (nonnull.length === r.length) {
            if (nonnull.length === 1) {
              return op === '=' ? 'TRUE' : 'FALSE';
            } else {
              return prnt(l) + (op === '=' ? " IN (" : " NOT IN (") + r.slice(1).map(function (el) {
                return prnt(el);
              }).join(',') + ")";
            }
          } else {
            var col = prnt(l);

            if (nonnull.length === 1) {
              return col + (op === '=' ? " IS NULL" : " IS NOT NULL");
            } else {
              if (op === '=') {
                return "(" + col + " IS NULL OR " + col + " IN (" + nonnull.slice(1).map(function (el) {
                  return prnt(el);
                }).join(',') + "))";
              } else {
                return "(" + col + " IS NOT NULL OR " + col + " NOT IN (" + nonnull.slice(1).map(function (el) {
                  return prnt(el);
                }).join(',') + "))";
              }
            }
          }
        } else {
          //console.log(r[0] + " RESOLVING VAR " + JSON.stringify(r[1]));
          // FIXME: сюда может прилететь ->
          //console.log("RESOLVING VAR " + JSON.stringify(_context));
          var var_expr;

          if (r[0] === '$') {
            /* FIXME !!!
            _context contains just hash with defined vars (key/value).
            $(expr) inside sql_where should resolve to vars or generate exception with user refer to not defined var!!!
            it is better than default eval_lisp behavior where undefined var reolves to itself (atom). 
            */
            //var_expr = eval_lisp(r[1], _context);
            var_expr = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(r[1], _context); // actually, we might do eval_lisp(r, ctx) but that will quote everything, including numbers!
            // здесь мы получаем в том числе и массив, хорошо бы понимать, мы находимся в cond или нет
            // ["=","ГКБ"]
            //console.log("RESOLVED $" + JSON.stringify(var_expr) )

            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["d" /* isArray */])(var_expr)) {
              if (var_expr[0] === '=') {
                if (var_expr.length === 2) {
                  // всё хорошо !!! Это похоже на koob lookup
                  var_expr = var_expr[1];
                } else {
                  throw new Error("Resolved value is array with length of not 2, which is not yet supported. ".concat(JSON.stringify(var_expr)));
                }
              } else {
                // array here: pass it to the next logic
                __WEBPACK_IMPORTED_MODULE_14__console_console__["a" /* default */].log('array in $ evaluation'); // возможно значение переменной резолвится в массив???
                //throw new Error(`Resolved value is array, with operation different from = which is not yet supported. ${JSON.stringify(var_expr)}`)
              }
            }
          } else {
            var_expr = prnt(r, ctx);
          }

          if (var_expr !== undefined) {
            if (var_expr instanceof Array) {
              //console.log(`EVAL = ${op}` + JSON.stringify(l) + ' ' + JSON.stringify(var_expr));
              return ctx[op](l, ['['].concat(var_expr));
            } else {
              //console.log("EVAL = " + JSON.stringify(l) + ' ' + JSON.stringify(var_expr));
              return ctx[op](l, var_expr);
            }
          }
        }
      }

      if (r === null || r === undefined) {
        var defVal = track_undefined_values_for_cond[0]; //console.log("$ CHECK " + defVal)

        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["e" /* isString */])(defVal) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["f" /* isNumber */])(defVal) || defVal === null) {
          return defVal;
        } else {
          // ставим метку, что был резолвинг неопределённого значения
          track_undefined_values_for_cond[0] = true;
        }

        return prnt(l) + (op === '=' ? " IS NULL " : " IS NOT NULL ");
      } else if (r === '') {
        return prnt(l) + " ".concat(op, " ''");
      } else {
        return prnt(l) + " ".concat(op, " ") + prnt(r);
      }
    }

    ctx['='] = function (l, r) {
      return eq_not_eq(l, r, '=');
    };

    ctx['='].ast = [[], {}, [], 1]; // mark as macro

    ctx['!='] = function (l, r) {
      return eq_not_eq(l, r, '!=');
    };

    ctx['!='].ast = [[], {}, [], 1]; // mark as macro
    // $(name) will quote text elements !!! suitable for generating things like WHERE title in ('a','b','c')
    // also, we should evaluate expression, if any.

    ctx['$'] = function (inexpr) {
      //console.log("$$$$$$$$$" + JSON.stringify(inexpr))
      var expr = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(inexpr, _context); // evaluate in a normal LISP context without vars, not in WHERE context
      // здесь мы получаем в том числе и массив, хорошо бы понимать, мы находимся в cond или нет
      //console.log("$$$$$$$$$ = " + JSON.stringify(expr))
      // ["=","ГКБ"]

      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["d" /* isArray */])(expr)) {
        if (expr[0] === '=') {
          if (expr.length === 2) {
            // всё хорошо !!! Это похоже на koob lookup
            return expr[1];
          }
        } //throw new Error(`Resolved value is array, which is not yet supported. ${JSON.stringify(expr)}`)

      }
      /* есть возможность определить, что мы внутри cond()
      if (track_undefined_values_for_cond.length > 0) {
        console.log('$$$ inside cond!')
      }*/


      if (expr instanceof Array) {
        // try to print using quotes, use plv8 !!!
        if (_vars["_quoting"] === 'explicit') {
          return expr.map(function (el) {
            return el;
          }).join(',');
        } else {
          return expr.map(function (el) {
            return quote_scalar(el);
          }).join(',');
        }
      }

      if (expr === undefined) {
        // значит по этому ключу нет элемента в _vars например !!!
        var defVal = track_undefined_values_for_cond[0]; //console.log("$ CHECK " + defVal)

        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["e" /* isString */])(defVal) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["f" /* isNumber */])(defVal) || defVal === null) {
          return defVal;
        } else {
          // ставим метку, что был резолвинг неопределённого значения
          track_undefined_values_for_cond[0] = true;
        }

        return '';
      } // May break compatibility WITH THE OLD templates !!!!!


      if (_vars["_quoting"] === 'explicit') {
        return expr;
      } else {
        // Old style templates, try to auto quote...
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__utils_utils__["a" /* db_quote_literal */])(expr);
      }
    };

    ctx['$'].ast = [[], {}, [], 1]; // mark as macro
    //  пока что считаем что у нас ОДИН аргумент и мы его интерпретируем как таблица.столбец

    ctx['parse_kv'] = function (expr) {
      if (expr instanceof Array) {
        if (expr[0] === '->') {
          var sql = 'select "' + expr[2] + '" from "' + expr[1] + '" where id = $1::INT';
          var id_val = resolve_literal(expr[1].replace(/.$/, "_id")); //console.log('SQL: ', sql, " val:", id_val);

          var res_json = plv8.execute(sql, [id_val]); //var res_json = [{"src_id":"$a:Вася:$b:Петя"}];

          var frst = res_json[0]; //console.log('SQL RES: ', frst);

          if (frst !== undefined && frst[expr[2]] !== null && frst[expr[2]].length > 0) {
            var axis_condition = function axis_condition(e) {
              var result = e.split(':').map(function (e2) {
                e2 = e2.replace(/\'/g, "''"); //' be safe

                return e2.indexOf('$') == 0 ? ' AND ' + e2.substr(1) + '=' : "'" + e2 + "'";
              }).join('').substr(5);
              return result;
            };

            var result = axis_condition(frst[expr[2]]);
            if (result === undefined || result.length == 0) return '(/*kv not resolved*/ 0=1)';
            return result;
          }
        }
      } // return everything, FIXME: is it right thing to do ?


      return '(/*parse_kv EMPTY*/ 1=1)';
    };

    ctx['parse_kv'].ast = [[], {}, [], 1]; // mark as macro
    // we should parse all logic: & | ! () but we are cheating at the moment....
    // NOTE: it is unrelated to cond func!!!

    ctx['parse_cond'] = function (expr) {
      if (expr instanceof Array) {
        if (expr[0] === '->') {
          var sql = 'select "' + expr[2] + '" from "' + expr[1] + '" where id = $1::INT';
          var id_val = resolve_literal(expr[1].replace(/.$/, "_id")); //console.log('SQL: ', sql, " val:", id_val);

          var res_json = plv8.execute(sql, [id_val]); //var res_json = [{"src_id":"dor_id=96&obj_id=64024775"}];

          var frst = res_json[0]; //console.log('SQL RES: ', frst);

          if (frst !== undefined && frst[expr[2]] !== null && frst[expr[2]].length > 0) {
            var axis_condition = function axis_condition(e) {
              var result = e.split('&').map(function (e2) {
                return e2;
              }).join(' and ');
              return result;
            };

            var result = axis_condition(frst[expr[2]]);
            if (result === undefined || result.length == 0) return '(/*cond not resolved*/ 0=1)';
            return result;
          }
        }
      } // return everything, FIXME: is it right thing to do ?


      return '(/*parse_cond EMPTY*/ 1=1)';
    };

    ctx['parse_cond'].ast = [[], {}, [], 1]; // mark as macro

    var ret = []; //console.log("where IN: ", JSON.stringify(Array.prototype.slice.call(arguments)));

    var fts = _vars['fts'];
    var tree = arguments;

    if (fts !== undefined && fts.length > 0) {
      fts = fts.replace(/\'/g, "''"); //' be safe
      // Full Text Search based on column_list

      if (_typeof(_vars['_columns']) == 'object') {
        var generator_func = function generator_func(col) {
          return col["search"] !== undefined ? ["ilike", col["search"], ["'", '%' + fts + '%']] : null;
        };

        var ilike = Object.values(_vars['_columns']).map(generator_func).filter(function (el) {
          return el !== null;
        }).reduce(function (ac, el) {
          return ac ? ['or', ac, el] : el;
        }, null) || [];
        __WEBPACK_IMPORTED_MODULE_14__console_console__["a" /* default */].log("FTS PARSED: ", JSON.stringify(ilike)); //console.log( "FTS PARSED: ",  JSON.stringify(tree));

        if (ilike !== undefined && ilike.length > 0) {
          // добавляем корень AND с нашим поиском
          if (tree[0]) {
            tree = [["and", tree[0], ['()', ilike]]];
          } else {
            tree = [['()', ilike]];
          }
        }
      }
    } // Проверяем волшебный ключ в контексте _rls_filters


    var rls = _vars["_rls_filters"];

    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["d" /* isArray */])(rls) && rls.length > 0) {
      // добавляем корень AND с нашими фильтрами
      if (tree[0]) {
        tree = [["and", tree[0], ['()', rls]]];
      } else {
        tree = [['()', rls]];
      }
    }

    for (var i = 0; i < tree.length; i++) {
      // console.log("array ", JSON.stringify(Array.prototype.slice.call(tree[i])));
      ret.push(prnt(tree[i], ctx));
    }

    var r = ret[0]; // у нас только один результат должен быть !!!

    if (r == undefined) {
      r = '';
    }

    return r;
  };

  _context['filter'].ast = [[], {}, [], 1]; // mark as macro
  // where - we should not eval arguments, so we must mark where as macro!!!

  _context['where'] = function () {
    // we should always get ONE argument, for example: ["=",["$",["->","period","title"]],3]
    // BUT if we get two, or more arguments, we eval them one by one, AND combine later with AND operand, skipping empty results...
    var tree = arguments;
    var ret = [];

    if (tree.length > 0) {
      for (var i = 0; i < tree.length; i++) {
        // console.log("array ", JSON.stringify(Array.prototype.slice.call(tree[i])));
        var r = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(["filter", tree[i]], _context); // r should be string

        if (r.length > 0) {
          ret.push(r);
        }
      }
    } else {
      var r = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(["filter"], _context); // r should be string

      if (r.length > 0) {
        ret.push(r);
      }
    }

    if (ret.length > 0) {
      if (ret.length > 1) {
        return 'WHERE (' + ret.join(') AND (') + ')';
      } else {
        return 'WHERE ' + ret[0];
      }
    } else {
      return 'WHERE TRUE';
    }
  };

  _context['where'].ast = [[], {}, [], 1]; // mark as macro

  return _context;
}
function eval_sql_where(_expr, _vars) {
  if (typeof _vars === 'string') _vars = JSON.parse(_vars);
  var sexpr = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__lpep__["a" /* parse */])(_expr); //console.log('sql_where parse: ', JSON.stringify(sexpr));

  if (sexpr instanceof Array && (sexpr[0] === 'filter' && sexpr.length <= 2 || sexpr[0] === 'order_by' || sexpr[0] === 'if' || sexpr[0] === 'where' || sexpr[0] === 'pluck' || sexpr[0] === 'str' || sexpr[0] === 'prnt' || sexpr[0] === 'cond' || sexpr[0] === 'filters' || sexpr[0] === '->' // it is dot operator, FIXME: add correct function call check !
  )) {
    // ok
    if (sexpr[0] === 'order_by' && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["e" /* isString */])(_vars['sort']) && _vars['sort'].length > 0) {
      // we should inject content of the sort key, which is coming from the GUI.
      // do it in a safe way
      var extra_srt_expr = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__lpep__["a" /* parse */])("order_by(".concat(_vars['sort'], ")")); //console.log('sql_where ORDER BY MIXED0: ', JSON.stringify(extra_srt_expr));
      //console.log('sql_where ORDER BY MIXED1: ', JSON.stringify(_vars));

      sexpr = sexpr.concat(extra_srt_expr.slice(1)); //console.log('sql_where ORDER BY MIXED: ', JSON.stringify(sexpr));
    } else {
      if (sexpr[0] === 'cond') {
        sexpr = ["filter", ["cond", sexpr[1], sexpr[2]]];
      }
    }
  } else {
    throw "Found unexpected top-level func: " + sexpr[0];
  }

  var _context = sql_where_context(_vars);

  var ret = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__lisp__["a" /* eval_lisp */])(sexpr, _context); // console.log('ret: ',  JSON.stringify(ret));

  return ret;
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(1)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(16)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__(95)(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),
/* 59 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(20);
var call = __webpack_require__(80);
var isArrayIter = __webpack_require__(78);
var anObject = __webpack_require__(5);
var toLength = __webpack_require__(17);
var getIterFn = __webpack_require__(99);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(41);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(3);
var cof = __webpack_require__(41);
var MATCH = __webpack_require__(1)('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(33);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(12);
var hide = __webpack_require__(16);
var Iterators = __webpack_require__(24);
var $iterCreate = __webpack_require__(81);
var setToStringTag = __webpack_require__(48);
var getPrototypeOf = __webpack_require__(34);
var ITERATOR = __webpack_require__(1)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__(43);

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(49)('keys');
var uid = __webpack_require__(37);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(6);
var core = __webpack_require__(8);
var LIBRARY = __webpack_require__(33);
var wksExt = __webpack_require__(98);
var defineProperty = __webpack_require__(4).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(114)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(57)(KEY);


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(20);
var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var call = __webpack_require__(80);
var isArrayIter = __webpack_require__(78);
var toLength = __webpack_require__(17);
var createProperty = __webpack_require__(73);
var getIterFn = __webpack_require__(99);

$export($export.S + $export.F * !__webpack_require__(82)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(95)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(63)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(9);
var toLength = __webpack_require__(17);
var toAbsoluteIndex = __webpack_require__(127);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(4);
var createDesc = __webpack_require__(27);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);
var document = __webpack_require__(6).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(1)('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(2) && !__webpack_require__(7)(function () {
  return Object.defineProperty(__webpack_require__(74)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);
var setPrototypeOf = __webpack_require__(93).set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(24);
var ITERATOR = __webpack_require__(1)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(41);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(5);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(26);
var descriptor = __webpack_require__(27);
var setToStringTag = __webpack_require__(48);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(16)(IteratorPrototype, __webpack_require__(1)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(1)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(13);
var gOPS = __webpack_require__(46);
var pIE = __webpack_require__(35);
var toObject = __webpack_require__(10);
var IObject = __webpack_require__(61);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(7)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(4);
var gOPD = __webpack_require__(21);
var ownKeys = __webpack_require__(89);
var toIObject = __webpack_require__(9);

module.exports = function define(target, mixin) {
  var keys = ownKeys(toIObject(mixin));
  var length = keys.length;
  var i = 0;
  var key;
  while (length > i) dP.f(target, key = keys[i++], gOPD.f(mixin, key));
  return target;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(4);
var anObject = __webpack_require__(5);
var getKeys = __webpack_require__(13);

module.exports = __webpack_require__(2) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(9);
var gOPN = __webpack_require__(45).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(15);
var toIObject = __webpack_require__(9);
var arrayIndexOf = __webpack_require__(72)(false);
var IE_PROTO = __webpack_require__(66)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys = __webpack_require__(13);
var toIObject = __webpack_require__(9);
var isEnum = __webpack_require__(35).f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__(45);
var gOPS = __webpack_require__(46);
var anObject = __webpack_require__(5);
var Reflect = __webpack_require__(6).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(12);
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),
/* 92 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(3);
var anObject = __webpack_require__(5);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(20)(Function.call, __webpack_require__(21).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(6);
var dP = __webpack_require__(4);
var DESCRIPTORS = __webpack_require__(2);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(50);
var defined = __webpack_require__(32);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(62);
var defined = __webpack_require__(32);

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(1);


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(31);
var ITERATOR = __webpack_require__(1)('iterator');
var Iterators = __webpack_require__(24);
module.exports = __webpack_require__(8).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(4).f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__(2) && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(31);
var test = {};
test[__webpack_require__(1)('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(12)(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(6);
var inheritIfRequired = __webpack_require__(77);
var dP = __webpack_require__(4).f;
var gOPN = __webpack_require__(45).f;
var isRegExp = __webpack_require__(62);
var $flags = __webpack_require__(43);
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__(2) && (!CORRECT_NEW || __webpack_require__(7)(function () {
  re2[__webpack_require__(1)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(12)(global, 'RegExp', $RegExp);
}

__webpack_require__(94)('RegExp');


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __webpack_require__(0);
var toLength = __webpack_require__(17);
var context = __webpack_require__(96);
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(75)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = deparse;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es7_symbol_async_iterator__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es7_symbol_async_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_modules_es7_symbol_async_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_symbol__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_split__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_split___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_split__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_regexp_to_string__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_regexp_to_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_regexp_to_string__);





function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isArray = function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

var isString = function isString(arg) {
  return typeof arg === 'string';
};

var isNumber = function isNumber(arg) {
  return typeof arg === 'number';
};

var isBoolean = function isBoolean(arg) {
  return arg === true || arg === false;
};

var isHash = function isHash(arg) {
  return _typeof(arg) === 'object' && arg !== null && !isArray(arg);
};

var isFunction = function isFunction(arg) {
  return typeof arg === 'function';
};

var OPERATORS = {
  '+': true,
  '-': true,
  '*': true,
  '/': true,
  '=': true,
  'and': '&&',
  'or': '||'
};
var PRIORITY = {
  '=': 40,
  '||': 30
};
var safeReplace = {
  '\n': '\\n',
  '\r': '\\r',
  '\"': '\\"',
  '\'': '\\\'',
  '\\': '\\\\'
};

function fixString(s) {
  return s.split('').map(function (char) {
    return char in safeReplace ? safeReplace[char] : char;
  }).join('');
}

function deparseWithOptionalBrackets(sexpr, op) {
  var res = deparse(sexpr);

  if (isArray(sexpr) && sexpr.length && OPERATORS[sexpr[0]]) {
    if (op === sexpr[0]) {
      return res;
    }

    var priority1 = PRIORITY[op];
    var priority2 = PRIORITY[sexpr[0]];

    if (priority1 && priority2 && priority1 < priority2) {
      // no need on brackets
      return res;
    }

    return '(' + res + ')';
  } else {
    return res;
  }
}

function deparseSexpr(sexpr) {
  var op = sexpr[0];
  var args = sexpr.slice(1);
  if (op === '"') return '"' + fixString(args[0]) + '"';
  if (op === '\'') return '\'' + fixString(args[0]) + '\'';
  if (op === '[') return '[' + args.map(deparse).join(', ') + ']';
  if (op === '()') return '(' + args.map(deparse).join(', ') + ')';
  if (op === '->') return args.map(deparse).join('.');

  if (OPERATORS[op] === true) {
    return args.map(function (arg) {
      return deparseWithOptionalBrackets(arg, op);
    }).join(' ' + op + ' ');
  }

  if (isString(OPERATORS[op])) {
    return args.map(function (arg) {
      return deparseWithOptionalBrackets(arg, OPERATORS[op]);
    }).join(' ' + OPERATORS[op] + ' ');
  }

  if (op === 'begin') return args.map(deparse).join('; ');
  return op + '(' + sexpr.slice(1).map(deparse).join(', ') + ')';
}

function deparse(lispExpr) {
  if (isString(lispExpr)) {
    return lispExpr;
  } else if (isNumber(lispExpr)) {
    return lispExpr.toString();
  } else if (isBoolean(lispExpr)) {
    return lispExpr.toString();
  } else if (isArray(lispExpr) && lispExpr.length === 0) {
    return '[]';
  } else if (lispExpr === null) {
    return 'null';
  } else if (isArray(lispExpr)) {
    return deparseSexpr(lispExpr);
  } else {
    return String(lispExpr);
  }
}

/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export sql_context */
/* harmony export (immutable) */ __webpack_exports__["a"] = eval_sql_expr;
/* harmony export (immutable) */ __webpack_exports__["b"] = parse_sql_expr;
/* harmony export (immutable) */ __webpack_exports__["c"] = generate_report_sql;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_array_from__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_array_from___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_array_from__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es7_symbol_async_iterator__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es7_symbol_async_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_modules_es7_symbol_async_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_symbol__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_array_sort__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_array_sort___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_modules_es6_array_sort__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_web_dom_iterable__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_web_dom_iterable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_modules_web_dom_iterable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_modules_es6_array_iterator__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_modules_es6_array_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_modules_es6_array_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_string_iterator__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_string_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_string_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_set__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_modules_es6_regexp_split__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_modules_es6_regexp_split___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_modules_es6_regexp_split__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_modules_es6_regexp_match__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_modules_es6_regexp_match___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_modules_es6_regexp_match__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_regexp_to_string__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_regexp_to_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_regexp_to_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_modules_es6_regexp_replace__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_modules_es6_regexp_replace___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_modules_es6_regexp_replace__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_modules_es6_array_find__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_modules_es6_array_find___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_modules_es6_array_find__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__console_console__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__lisp__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__sql_where__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__lpep__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__utils_utils__ = __webpack_require__(40);














function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
    Copyright (c) 2019 Luxms Inc.

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the Software
    is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
    OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/




 // polyfill = remove in 2020 !!!

if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }

    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }

    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];

      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }

    return undefined;
  };
}

function sql_context(_vars) {
  var _context = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__sql_where__["b" /* sql_where_context */])(_vars);
  /* заполняем контекст функциями и макросами, заточенными на SQL */


  _context['sql'] = function () {
    var q; // resulting sql

    var args = Array.prototype.slice.call(arguments); //console.log('SQL IN: ', args);
    // use sql-struct!

    var command = ["sql-struct"].concat(args);
    var struct = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(command, _context);
    q = "".concat(struct["select"], " ").concat(struct["from"]);

    if (struct["where"] !== undefined) {
      q = "".concat(q, " WHERE ").concat(struct["where"]);
    }

    if (struct["group_by"] !== undefined) {
      q = "".concat(q, " ").concat(struct["group_by"]);
    }

    if (struct["order_by"] !== undefined) {
      q = "".concat(q, " ").concat(struct["order_by"]);
    }

    if (struct["limit_offset"] !== undefined) {
      if (_vars["_target_database"] === 'oracle') {
        q = "SELECT * FROM (\n          ".concat(q, "\n        ) WHERE ").concat(struct["limit_offset"]);
      } else {
        q = "".concat(q, " ").concat(struct["limit_offset"]);
      }
    }

    return q;
  };

  _context['sql'].ast = [[], {}, [], 1]; // mark as macro

  /* возвращает структуру запроса, при этом все элементы уже превращены в TEXT */

  _context['sql-struct'] = function () {
    var q = {
      "select": undefined,
      "from": undefined,
      "where": undefined,
      "order_by": undefined,
      "limit_offset": undefined,
      "group_by": undefined
    }; // resulting sql

    var args = Array.prototype.slice.call(arguments); //console.log('SQL-STRUCT IN: ', args);

    var find_part = function find_part(p) {
      return args.find(function (el) {
        return p == el[0];
      });
    };

    var sel = find_part('select'); //console.log('FOUND select: ', sel);

    q.select = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(sel, _context);
    var from = find_part('from'); //console.log('FOUND from: ', from);

    q.from = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(from, _context);
    var where = find_part('filter'); //console.log("FOUND where: ", where);

    if (where instanceof Array && where.length > 1) {
      q.where = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(where, _context);
    }

    var grp = find_part('group_by'); //console.log('FOUND group_by: ', grp);

    if (grp instanceof Array && grp.length > 1) {
      q.group_by = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(grp, _context);
    }

    var srt = find_part('order_by'); //console.log('FOUND sort: ', srt);

    if (srt instanceof Array && srt.length > 1) {
      q.order_by = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(srt, _context);
    } //slice(offset, pageItemsNum)


    var s = find_part('slice'); //console.log("FOUND slice: ", s);

    if (s instanceof Array && s.length > 1) {
      q.limit_offset = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(s, _context);
    }

    return q;
  };

  _context['sql-struct'].ast = [[], {}, [], 1]; // mark as macro

  function prnt(a) {
    //console.log('prnt IN: ', a);
    if (a instanceof Array) {
      if (a.length > 0) {
        if (a[0] === '::' && a.length == 3) {
          return a[1] + '::' + a[2];
        } else if (a[0] === ':') {
          return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(a, _context); //return prnt(a[1]) + ' as "' + a[2].replace(/"/,'\\"') + '"';
        } else if (a[0] === "->") {
          // наш LPE использует точку, как разделитель вызовов функций и кодирует её как ->
          // в логических выражениях мы это воспринимаем как ссылку на <ИМЯ СХЕМЫ>.<ИМЯ ТАБЛИЦЫ>
          // return '"' + a[1] + '"."' + a[2] + '"';
          return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(a, _context);
        } else {
          return a[0] + '(' + a.slice(1).map(function (argel) {
            return prnt(argel);
          }).join(',') + ')';
        }
      } else {
        return '';
      }
    } else {
      return a;
    }
  } // table.column 


  _context['->'] = function () {
    var a = Array.prototype.slice.call(arguments); //console.log("->   " + JSON.stringify(a));

    return a.join('.');
  };

  _context[':'] = function () {
    var a = Array.prototype.slice.call(arguments); //console.log("->   " + JSON.stringify(a));

    return prnt(a[0]) + ' as ' + a[1].replace(/"/, '\\"');
  }; // должен вернуть СТРОКУ


  _context['select'] = function () {
    var a = Array.prototype.slice.call(arguments); //console.log("select IN: ",  JSON.stringify(a));

    if (a.length < 1) {
      return "SELECT *";
    } else {
      return "SELECT " + a.map(prnt).join(',');
    }
  };

  _context['select'].ast = [[], {}, [], 1]; // mark as macro

  _context['from'] = function () {
    var a = Array.prototype.slice.call(arguments); //console.log('from IN: ', a);

    if (a.length < 1) {
      return "";
    } else {
      return "FROM " + a.map(prnt).join(', ');
    }
  };

  _context['from'].ast = [[], {}, [], 1]; // mark as macro

  _context['slice'] = function () {
    var a = Array.prototype.slice.call(arguments); //console.log('slice IN: ', a);

    if (a.length < 1) {
      return "";
    } else {
      if (_vars["_target_database"] === 'oracle') {
        if (parseInt(a[0]) === 0) {
          return "ROWNUM <= ".concat(parseInt(a[1]));
        } else {
          return "ROWNUM > ".concat(parseInt(a[0]), " AND ROWNUM <= ").concat(parseInt(a[1]) + parseInt(a[0]));
        }
      } else if (_vars["_target_database"] === 'sqlserver') {
        return "OFFSET ".concat(parseInt(a[0]), " ROWS FETCH NEXT ").concat(parseInt(a[1]), " ROWS ONLY");
      } else {
        return "LIMIT ".concat(parseInt(a[1]), " OFFSET ").concat(parseInt(a[0]));
      }
    }
  };

  _context['slice'].ast = [[], {}, [], 1]; // mark as macro

  _context['group_by'] = function () {
    var a = Array.prototype.slice.call(arguments);

    if (a.length === 0) {
      return "";
    } else {
      return "GROUP BY " + a.join(' , ');
    }
  };

  return _context;
}
/*
Это не дописано!!! Идея была сделать синтаксис, похожий на htSQL. типа +table(col1,col2).where(col1>3)
но например, как указать схему? сейчас парсер фигню выдаёт, так как точка не всегда корректно отрабатывает +sch.table(col1,col2)
Тщательнее надо....

select lpe.eval_sql_expr($$metrics(id).where(id='abcd')$$);


Примеры htSQL:
/course.filter(credits<3).select(department_code, no, title)
/course.sort(credits-).limit(10){department_code, no, credits}
/course.limit(10).sort(credits-){department_code, no, credits}

То есть, у нас имя таблицы идёт первым в любом случае. В LuxPath предлагаю использовать
комюинацию htSQL select и список столбцов {} в одном макросе +имя_таблицы(...)
мы будем использовать + вместо / Но слэш в htSQL не является частью синтаксиса, имя таблицы просто всегда идёт первым!!!

*/

function eval_sql_expr(_expr, _vars) {
  var ctx = sql_context(_vars);
  var _context = ctx; // for(var key in _vars) _context[key] = _vars[key];

  _context['sql->entrypoint'] = function () {
    //console.log("++++++++++++++++++");
    var ret = [];

    for (var i = 0; i < arguments.length; i++) {
      ret.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(arguments[i], _context)); //console.log(JSON.stringify(ret));
    }

    return ret.join(',');
  };

  _context['sql->entrypoint'].ast = [[], {}, [], 1]; // mark as macro

  var sexpr = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__lpep__["a" /* parse */])(_expr); //console.log("parsed eval_sql_expr IN: ", sexpr);

  /*
  if (ctx.hasOwnProperty('where')){
    console.log('W O W');
  }
  */
  // точка входа всегда должна быть sql->entrypoint, так как мы определили sql->entrypoint как макроc чтобы иметь возможность
  // перекодировать имена таблиц в вызов .from()
  // а parse возвращает нам ->, так что меняем!

  if (sexpr[0] === '->') {
    sexpr[0] = 'sql->entrypoint';
  }

  if (sexpr[0] !== 'sql->entrypoint') {
    sexpr = ['sql->entrypoint', sexpr];
  } // теперь нужно пройтись по списку вызовов и привести к нормальной форме.
  // в нормальной форме всё выглядит вот так: (seq sql(select() from()) sql(...) sql(...) )
  // ["seq",["metrics","a","d",["max","c"]],["where"]]
  // ["seq",["+",["metrics","a","d",["max","c"]]],["where"]]

  /* на вход прилетает IN:
    metrics(a,d,max(c)).where(a>1 and i < 4).periods.where(a>4)
    ["seq",["metrics","a","d",["max","c"]],["where",["and",[">","a","1"],["<","i","4"]]],"periods",["where",[">","a","4"]]]
    ["seq",["sql",["select","a","d",["max","c"]],["from","metrics"],["filter",["and",[">","a","1"],["<","i","4"]]]],["sql",["select"],["from","periods"],["filter",[">","a","4"]]]]
  */


  var sql = ['sql'];

  var do_select_from = function do_select_from(sel) {
    if (!(sel instanceof Array)) {
      sel = [sel];
    }

    var fr = sel[0];
    var p = false;

    if (fr != 'where' && fr != 'select' && fr != 'sort' && fr != 'filter' && fr != 'from' && fr != 'slice') {
      sel[0] = 'select';
      p = true;
    }

    sql.push(sel);

    if (p) {
      sql.push(["from", fr]);
    } //console.log("parse do_select_from: ", sql);

  };

  for (var i = 1; i < sexpr.length; i++) {
    var expr = sexpr[i];

    if (expr instanceof Array) {
      // expr: ["metrics","a","d",["max","c"]]
      // if (expr[0] === 'order_by') {expr[0]='sort'};
      if (expr[0] === 'where') {
        expr[0] = 'filter';
      }

      ;

      if (expr[0] === '+') {
        // expr: ["+",["metrics","a","d",["max","c"]]]
        do_select_from(expr[1]);
      } else if (_context[expr[0].toString()] === undefined) {
        // это имя таблицы... так как мы проверили на ключевые слова,
        // распознаваемые нашим интерпретатором
        // expr: ["metrics","a","d",["max","c"]]
        do_select_from(expr);
      } else {
        sql.push(sexpr[i]);
      }
    } else if (_context[expr.toString()] === undefined) {
      // это литерал = имя таблицы...
      // expr: "metrics"
      do_select_from(expr);
    } else {
      throw 'unexpected call: ' + JSON.stringify(expr);
    }
  } //console.log('parse: ', sql);


  var ret = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(sql, _context); // console.log("parse: ", ret);

  return ret;
}
/* returns struct, which is suitable to build full SQL text:
            {
                from: undefined,
                limit_offset: undefined,
                order_by: undefined,
                select: 'SELECT *',
                where: undefined,
                group_by: undefined
              }
*/

function parse_sql_expr(_expr, _vars, _forced_table, _forced_where) {
  var ctx = sql_context(_vars);
  var _context = ctx; // for(var key in _vars) _context[key] = _vars[key];

  if (_expr === null || _expr === '' || typeof _expr === "undefined") {
    _expr = 'filter()'; // that should generate empty struct
  }

  var sexpr = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__lpep__["a" /* parse */])(_expr);

  if (sexpr[0] === '->') {
    sexpr[0] = 'sql->entrypoint';
  }

  if (sexpr[0] !== 'sql->entrypoint') {
    // это значит, что на входе у нас всего один вызов функции, мы его обернём в ->
    sexpr = ['sql->entrypoint', sexpr];
  } //console.log("DBAPI IN: ", sexpr);

  /*
  if (ctx.hasOwnProperty('where')){
    console.log('W O W');
  }
  */
  // теперь нужно пройтись по списку вызовов и привести к нормальной форме.
  // в нормальной форме у нас должен быть один вызов sql() а внутри select().from().where()
  // причём 
  // select(a,b) === select(a).select(b)
  // order_by(a,b) === order_by(a).order_by(b)
  // where(a>1).where(b<1) === where(a>1 and b<1)
  // from(a).from(b).from(c) === from(c)
  // в последнем случае берётся последний from, а все первые игнорятся, но см. test.js = там есть другой пример !!!!


  var sql = ['sql-struct']; // wrapped by sql call...

  var cache = {
    "filter": [],
    "select": [],
    "order_by": [],
    "from": [],
    "slice": []
  };

  for (var i = 1; i < sexpr.length; i++) {
    var expr = sexpr[i];

    if (expr instanceof Array) {
      var fr = expr[0];

      if (fr != 'where' && fr != 'select' && fr != 'order_by' && fr != 'from' && fr != ':' && fr != 'slice' && fr != 'filter') {
        throw 'unexpected func: ' + JSON.stringify(fr);
      } // have no idea how to support aliases for selects...


      if (fr === ':' && expr[1][0] === 'select') {
        cache["select"].push(expr[1]);
      } else {
        if (fr === 'where') {
          fr = 'filter';
        }

        cache[fr].push(expr);
      }
    } else {
      throw 'unexpected literal: ' + JSON.stringify(expr);
    }
  }

  if (_forced_table !== undefined) {
    cache[fr].push(["from", _forced_table]);
  } //console.log("DEBUG", JSON.stringify(cache));


  var args = cache["select"].map(function (ar) {
    return ar.slice(1);
  });
  var sel = [].concat.apply(["select"], args); //flat

  sql.push(sel);
  var f = cache["from"].pop();

  if (f) {
    sql.push(f);
  }

  f = cache["order_by"].pop();

  if (f) {
    sql.push(f);
  }

  f = cache["slice"].pop();

  if (f) {
    sql.push(f);
  }

  args = cache["filter"].map(function (ar) {
    return ar.slice(1);
  });
  args = [].concat.apply([], args); //flat

  if (args.length > 0) {
    var w = ["()", args[0]];

    if (args.length > 1) {
      for (var i = 1; i < args.length; i++) {
        w = ["and", w, ["()", args[i]]];
      }
    }

    sql.push(["filter", w]);
  } //console.log("WHERE", JSON.stringify(w));
  //console.log('DBAPI parse: ', sql);


  var ret = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(sql, _context);
  return ret;
}
function generate_report_sql(_cfg, _vars) {
  var ctx = sql_context(_vars);
  var _context = ctx;
  /* Для генерации SELECT запросов из конфигов, созданных для Reports */

  /* while we wrapping aggregate functions around columns, we should keep track of the free columns, so we will be able to
     generate correct group by !!!!
  */

  var group_by = _cfg["columns"].map(function (h) {
    return h["id"];
  });

  var wrap_aggregate_functions = function wrap_aggregate_functions(col, cfg, col_id) {
    ret = col; // Empty agg arrays can be used for AGGFN type ! We happily support it

    if (Array.isArray(cfg["agg"])) {
      group_by = group_by.filter(function (id) {
        return id !== col_id;
      });
      var r = cfg["agg"].reduce(function (a, currentFunc) {
        return "".concat(currentFunc, "( ").concat(a, " )");
      }, ret);
      /* it is a special default formatter, which should be implemented per column with LPE!!!! DISABLED
      if (_context["_target_database"] === 'oracle' || _context["_target_database"] === 'postgresql') {
        // automatically format number
        r = `to_char( ${r}, '999G999G999G999G990D00')`
      }
      */

      return r;
    }

    return ret;
  };

  _context["column"] = function (col) {
    var col_info = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__utils_utils__["f" /* reports_get_column_info */])(_cfg["sourceId"], col);
    var col_sql = col_info["sql_query"];

    if (col_sql.match(/^\S+$/) === null) {
      // we have whitespace here, so it is complex expression :-()
      return "".concat(col_sql);
    } // we have just column name, prepend table alias !


    var parts = col.split('.');
    return "".concat(parts[1], ".").concat(col_sql);
  };

  _context['generate_sql_struct_for_report'] = function (cfg) {
    //console.log(JSON.stringify(cfg))
    if (_typeof(cfg) === 'object' && Array.isArray(cfg)) {
      throw new Error("reports_sql expected {...} as argument");
    }
    /* нужно сгенерить что-то типа такого:
    [  'sql-struct',
    [
      'select',
      'a',
      'b',
      [ '->', 'department_code', 'alias' ],
      [ '::', 'no', 'TEXT' ],
      [ 'max', 'credits' ]
    ],
    [ 'from', [ '->', 'bm', 'tbl' ] ],
    [ 'order_by', 'a', [ '-', 'b' ] ],
    [ 'filter', [ '()', [Array] ] ]
    ]
    */

    /*
      var convert_in_to_eq = function(in_lpe){
        if (in_lpe[0] === 'in'){
          in_lpe[0] = '=';
        }
         in_lpe.map(el => {
           if (Array.isArray(el)) {
            convert_in_to_eq(el)
           }      
          })
        return in_lpe;
      }*/


    var convert_in_to_eq = function convert_in_to_eq(in_lpe) {
      if (!Array.isArray(in_lpe) || in_lpe.length === 0) return in_lpe;
      return [in_lpe[0] === 'in' ? '=' : in_lpe[0]].concat(_toConsumableArray(in_lpe.slice(1).map(convert_in_to_eq)));
    }; // на входе вложенная структура из конфига.
    // расчитываем, что структура создана в GUI и порядок следования элементов стандартный


    var quote_text_constants = function quote_text_constants(in_lpe) {
      if (!Array.isArray(in_lpe)) return in_lpe;

      if (in_lpe[0] === 'IN') {
        // example: ["IN",["column","vNetwork.cluster"],["SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]]
        // Transform to AST form
        in_lpe[0] = 'in';
        in_lpe[2] = ['['].concat(in_lpe[2]); // and process further
      } //console.log("quote_text_constants" + JSON.stringify(in_lpe))


      if (in_lpe[0] === 'in') {
        if (Array.isArray(in_lpe[1])) {
          if (in_lpe[1][0] === 'column') {
            if (Array.isArray(in_lpe[2]) && in_lpe[2][0] === '[') {
              // ["=",["column","vNetwork.cluster"],["[","SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]]
              var info = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__utils_utils__["f" /* reports_get_column_info */])(_cfg["sourceId"], in_lpe[1][1]);

              if (info["type"] === 'PERIOD' && _context["_target_database"] === 'oracle') {
                in_lpe[2] = ['['].concat(in_lpe[2].slice(1).map(function (el) {
                  return ["to_date", ["ql", el], "'YYYY-MM-DD'"];
                }));
              } else {
                in_lpe[2] = ['['].concat(in_lpe[2].slice(1).map(function (el) {
                  return ["ql", el];
                }));
              }
            }
          }
        }
      } else {
        if (in_lpe.length > 2 && in_lpe[0] !== 'not') {
          if (Array.isArray(in_lpe[1])) {
            if (in_lpe[1][0] === 'column') {
              if (!Array.isArray(in_lpe[2])) {
                // ANY OPERATOR
                // ["~",["column","vNetwork.cluster"],"SPB99-DMZ02"]
                var info = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__utils_utils__["f" /* reports_get_column_info */])(_cfg["sourceId"], in_lpe[1][1]);

                if (info["type"] === 'PERIOD' && _context["_target_database"] === 'oracle') {
                  in_lpe[2] = ["to_date", ["ql", in_lpe[2]], "'YYYY-MM-DD'"];
                } else {
                  in_lpe[2] = ["ql", in_lpe[2]];
                }
              }

              if (in_lpe.length === 4) {
                // between
                if (!Array.isArray(in_lpe[3])) {
                  //["between",["column","vNetwork.period_month"],"2019-09-10","2019-09-20"]
                  var info = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__utils_utils__["f" /* reports_get_column_info */])(_cfg["sourceId"], in_lpe[1][1]);

                  if (info["type"] === 'PERIOD' && _context["_target_database"] === 'oracle') {
                    in_lpe[3] = ["to_date", ["ql", in_lpe[3]], "'YYYY-MM-DD'"];
                    in_lpe[4] = ["to_date", ["ql", in_lpe[4]], "'YYYY-MM-DD'"];
                  } else {
                    in_lpe[3] = ["ql", in_lpe[3]];
                    in_lpe[4] = ["ql", in_lpe[4]];
                  }
                }
              }
            }
          }
        }
      }

      in_lpe.map(function (el) {
        //console.log("RECURS" + JSON.stringify(el))
        quote_text_constants(el);
      });
      return in_lpe;
    };

    var struct = ['sql'];
    var allSources = cfg["columns"].map(function (h) {
      return h["id"].split('.')[0];
    });

    var uniq = _toConsumableArray(new Set(allSources));

    if (uniq.length != 1) {
      throw new Error("We support select from one source only, joins are not supported! Sources detected: " + JSON.stringify(uniq));
    }

    var allTables = cfg["columns"].map(function (h) {
      return h["id"].split('.').slice(0, 2).join('.');
    }); // !!!!!!!!!!!!! uniq will be used later in from!!!

    var uniqTables = _toConsumableArray(new Set(allTables));

    var join_struct = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__utils_utils__["g" /* reports_get_join_path */])(uniqTables);

    if (join_struct.nodes.length === 0) {
      throw new Error("Can not find path to JOIN tables: " + JSON.stringify(uniqTables));
    } // HACK as we miss _cfg["sourceId"]


    var srcIdent = _cfg["sourceId"];

    if (srcIdent === undefined) {
      srcIdent = join_struct.nodes[0].split('.')[0];
    }

    var ds_info = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__utils_utils__["d" /* get_data_source_info */])(srcIdent);
    _context["_target_database"] = ds_info["flavor"]; // column should always be represented as full path source.cube.column
    // for aggregates we should add func names as suffix ! like source.cube.column.max_avg

    var sel = ['select'].concat(cfg["columns"].map(function (h) {
      var col_info = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__utils_utils__["f" /* reports_get_column_info */])(cfg["sourceId"], h["id"]);
      var col_sql = col_info["sql_query"];
      var parts = h.id.split('.'); //if ( col_sql.match( /^\S+$/ ) !== null ) {

      if (col_sql === parts[2]) {
        // we have just column name, prepend table alias !
        col_sql = "".concat(parts[1], ".").concat(col_sql);
      } // This is hack to implement AGGFN type !
      // aggFormula should be used in the same way as AGGFN


      if (col_info["config"]["aggFormula"] || col_info["type"] == "AGGFN") {
        // We should remove column from GROUP BY
        // group_by is global, it is sad but true
        group_by = group_by.filter(function (id) {
          return id !== h["id"];
        });
      }

      var wrapped_column_sql = wrap_aggregate_functions(col_sql, h, h["id"]);
      var as = "".concat(h.id);

      if (Array.isArray(h["agg"])) {
        as = "\"".concat(h.id, ".").concat(h["agg"].join('.'), "\"");
      } //return `${wrapped_column_sql} AS ${as}`
      // oracle has limit 30 chars in identifier!
      // we can skip it for now.


      return "".concat(wrapped_column_sql); // return [':', `${wrapped_column_sql}`, 'abc']
    }));

    if (group_by.length === cfg["columns"].length) {
      group_by = ["group_by"];
    } else {
      // we should provide group_by!
      group_by = ["group_by"].concat(group_by.map(function (c) {
        return ["column", c];
      }));
    } // will return something like     (select * from abc) AS a


    var from = ['from'].concat(join_struct.nodes.map(function (t) {
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__utils_utils__["e" /* reports_get_table_sql */])(ds_info["flavor"], t);
    }));
    var order_by = ['order_by'].concat(cfg["columns"].map(function (h) {
      if (h["sort"] == 1) {
        return ["+", ["column", h["id"]]];
      } else if (h["sort"] == 2) {
        return ["-", ["column", h["id"]]];
      }
    }));
    order_by = order_by.filter(function (el) {
      return el !== undefined;
    });
    var filt = cfg["filters"].map(function (h) {
      return h["lpe"] ? convert_in_to_eq(quote_text_constants(h["lpe"])) : null;
    }).filter(function (el) {
      return el !== null;
    }); //console.log("========= reports_get_join_conditions " + JSON.stringify(join_struct))

    if (join_struct.nodes.length > 1) {
      filt = filt.concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__utils_utils__["h" /* reports_get_join_conditions */])(join_struct));
    }

    if (filt.length > 1) {
      filt = ['and'].concat(filt);
    } else if (filt.length == 1) {
      filt = filt[0];
    }

    if (filt.length > 0) {
      filt = ["filter", filt];
    } else {
      filt = ["filter"];
    }

    struct.push(sel, from, order_by, filt, group_by);

    if (cfg["limit"] !== undefined) {
      var offset = cfg["offset"] || 0;
      struct.push(["slice", offset, cfg["limit"]]);
    } //console.log(JSON.stringify(struct))
    //console.log(`USING ${target_db_type} as target database`)


    var ret = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(struct, _context);
    return ret;
  }; // по хорошему, надо столбцы засунуть в _context в _columns и подгрузить их тип из базы!!!
  // но мы типы столбцов будем определять здесь (в этой функции) и пытаться закавычить константы заранее....


  var ret = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__lisp__["a" /* eval_lisp */])(["generate_sql_struct_for_report", _cfg], _context);
  return ret;
}

/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = generate_koob_sql;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_string_iterator__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_string_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_string_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_array_from__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_array_from___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_array_from__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_replace__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_replace___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_modules_es6_regexp_replace__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es7_array_includes__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es7_array_includes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_modules_es7_array_includes__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_es6_string_includes__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_es6_string_includes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_modules_es6_string_includes__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_modules_es7_symbol_async_iterator__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_modules_es7_symbol_async_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_modules_es7_symbol_async_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_symbol__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_modules_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_array_find__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_array_find___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_modules_es6_array_find__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_modules_es7_object_values__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_modules_es7_object_values___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_modules_es7_object_values__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_modules_es6_regexp_to_string__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_modules_es6_regexp_to_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_modules_es6_regexp_to_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_string_starts_with__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_string_starts_with___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_modules_es6_string_starts_with__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_modules_es6_array_sort__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_modules_es6_array_sort___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_modules_es6_array_sort__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_modules_web_dom_iterable__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_modules_web_dom_iterable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_modules_web_dom_iterable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_modules_es6_array_iterator__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_modules_es6_array_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_modules_es6_array_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_modules_es6_object_keys__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_modules_es6_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_modules_es6_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_core_js_modules_es6_regexp_split__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_core_js_modules_es6_regexp_split___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_core_js_modules_es6_regexp_split__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_core_js_modules_es6_regexp_match__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_core_js_modules_es6_regexp_match___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_core_js_modules_es6_regexp_match__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__console_console__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__lisp__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__sql_where__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__lpep__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__utils_utils__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_core_js_fn_object__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_core_js_fn_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22_core_js_fn_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23_core_js_fn_dict__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23_core_js_fn_dict___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_23_core_js_fn_dict__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_core_js_core_function__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_core_js_core_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_24_core_js_core_function__);


















function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
    Copyright (c) 2019 Luxms Inc.

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the Software
    is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
    OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


 //import {eval_sql_where} from './sql_where';





 //import util from 'license-report/lib/util';
//const SQL_where_context = sql_where_context({});

/* Постановка
На входе имеем структуру данных из браузера:
          { "with":"czt.fot",
              "filters": {
              "dor1": ["=", "ГОРЬК"],
              "dor2": ["=", "ПОДГОРЬК"],
              "dor4": ["=", null],
              "dor5": ["=", null],
              "Пол":  ["or", ["!="], ["ilike", "Муж"]],
              "dt": ["BETWEEN", "2020-01", "2020-12"],
              "sex_name": ["=", "Мужской"],
              "": [">", ["+",["col1", "col2"]], 100]
            },
            "having": {
              "dt": [">","2020-08"],
            },
            "return": "count", // возможно такое!!!
            "columns": ["dor3", "czt.fot.dor4", "fot.dor5", 'sum((val3+val1)/100):summa', {"new":"old"}, ["sum", ["column","val2"]],  {"new":  ["avg", ["+",["column","val2"],["column","val3"]]]} ],
            "sort": ["-dor1","val1",["-","val2"],"-czt.fot.dor2", "summa"]
          }

Требуется 
1) тексты отпарсить в скоботу и сделать готовые для eval структуры.
2) на основе with сходить в базу и получить всю инфу про столбцы куба, подготовить context для поиска столбцов по короткому и длинному имени.
3) выполнить eval для части columns -> получить массив структур, готовых к построению части SELECT.
   'sum((val3+val1)/100):summa' ===> 
   {
     expr: 'sum((fot.val3+fot.val1)/100)',
     alias: "summa",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true
     cubes: ["czt.fot"]
   }
   можно также в процессе вычисления определить тип столбца из базы, и автоматом навесить agg, например sum
4) на основе columns_struct вычислить group_by, проверить, требуется ли JOIN.
5) при вычислении фильтров, учесть group_by и сделать дополнение для столбцов, у которых в конфиге указано как селектить ALL (memberALL)
6) создать какое-то чудо, которое будет печатать SQL из этих структур.
7) при генерации SQL в ПРОСТОМ случае, когда у нас один единственный куб, генрим КОРОТКИЕ имена столбцов
*/
// из клиента приходят имена столбов в разных регистрах, и ответ клиент ждёт тоже в разных
// регистрах...

function should_quote_alias(name) {
  return name.match(/^[_a-z][_a-z0-9]*$/) === null;
}

function upper_by_default(db) {
  return db === 'oracle' || db === 'teradata' || db === 'sap';
}
/**
 * возвращает строку `col AS alias`
 * @param {*} db 
 * @param {*} src 
 * @param {*} alias 
 * @returns 
 */


function quot_as_expression(db, src, alias) {
  // 1 определяем, нужно ли квотировать 
  var should_quote = false;

  if (upper_by_default(db)) {
    should_quote = true; // `select col from dual` вернёт в JDBC `COL` заглавными буквами !!!
    // это ломает клиент, который ждёт lowercase названия объектов
    // teradata не понимает max(a) as max
    // Поэтому, для оракла будем брать в кавычки все абсолютно столбцы и делать из них алиасы!
    // потом в условиях order by надо будет добавить кавычки тоже!

    /*if (alias.match(/^[a-zA-Z]\w*$/) === null) {
      should_quote = true
    }*/
  } else {
    // если есть хоть одна заглавная буква, пробел или не ASCII символ
    if (should_quote_alias(alias)) {
      should_quote = true;
    }
  }

  if (!should_quote) {
    return "".concat(src, " as ").concat(alias);
  }

  if (db === 'mysql') {
    return "".concat(src, " as ") + "`" + "".concat(alias) + "`";
  } else {
    return "".concat(src, " as \"").concat(alias, "\"");
  }
}
/***************************************************************
 * Дописывает имена столбцов в структуре _cfg, до полных имён, используя префикс cube_prefix, там, где это очевидно.
 * простые тексты переводит в LPE скоботу
 * Считаем, что любой встреченный литерал является именем столбца.
 * в контексте ctx[_columns] должны быть описания столбцов из базы
 */


function normalize_koob_config(_cfg, cube_prefix, ctx) {
  var parts = cube_prefix.split('.');
  var ds = parts[0];
  var cube = parts[1];
  var ret = {
    "ds": ds,
    "cube": cube,
    "filters": {},
    "having": {},
    "columns": [],
    "sort": [],
    "limit": _cfg["limit"],
    "offset": _cfg["offset"],
    "subtotals": _cfg["subtotals"],
    "options": __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_cfg["options"]) ? _cfg["options"] : [],
    "return": _cfg["return"],
    "config": _cfg["config"]
  };
  var aliases = {};
  if (_cfg["distinct"]) ret["distinct"] = [];
  /* expand_column также будем делать в процессе выполнения LPE, там будет вся инфа про куб, и про его дименшены. 
     мы будем точно знать, является ли суффикс именем столбца из куба или нет.
     То есть нужна правильная реализация функции column и правильная реализация для неизвестного литерала, с учётом алиасов !!!
  */

  var expand_column = function expand_column(col) {
    return col.match(/("[^"]+"|[^\.]+)\.("[^"]+"|[^\.]+)/) === null ? ctx._columns["".concat(cube_prefix, ".").concat(col)] ? "".concat(cube_prefix, ".").concat(col) : col : col;
  }; // для фильтров заменяем ключи на полные имена


  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(_cfg["filters"])) {
    Object.keys(_cfg["filters"]).filter(function (k) {
      return k !== "";
    }).map(function (key) {
      ret["filters"][expand_column(key)] = _cfg["filters"][key];
    });
    ret["filters"][""] = _cfg["filters"][""];
  } // для фильтров заменяем ключи на полные имена, но у нас может быть массив [{},{}]


  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_cfg["filters"])) {
    var processed = _cfg["filters"].map(function (obj) {
      var result = {};

      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(obj)) {
        Object.keys(obj).filter(function (k) {
          return k !== "";
        }).map(function (key) {
          result[expand_column(key)] = obj[key];
        });
        result[""] = obj[""];
      }

      return result;
    });

    ret["filters"] = processed; // [{},{}]
  } // probably we should use aliased columns a AS b!!


  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_cfg["having"])) {
    Object.keys(_cfg["having"]).filter(function (k) {
      return k !== "";
    }).map(function (key) {
      return ret["having"][expand_column(key)] = _cfg["having"][key];
    });
  } // "sort": ["-dor1","val1",["-","val2"],"-czt.fot.dor2", ["-",["column","val3"]]]
  // FIXME: нужна поддержка "sort": [1,3,-2]
  // FIXME: может быть лучше перейти на ORDER BY 2, 1 DESC, 4 ???? 
  // FIXME: тогда не надо будет париться с квотацией


  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_cfg["sort"])) {
    ret["sort"] = _cfg["sort"].map(function (el) {
      if (Array.isArray(el)) {
        if (el.length === 2) {
          if (el[0] === "-" || el[0] === "+") {
            if (Array.isArray(el[1])) {
              if (el[1][0] === "column") {
                return [el[0], ["column", expand_column(el[1][1])]];
              }
            } else {
              return [el[0], ["colref", el[1]]];
            }
          }
        }
      } else if (el && typeof el === 'string') {
        // тут может быть ссылка как на столбец, так и на alias, надо бы научиться отличать одно от другого
        // чтобы отличить alias от столбца - не делаем expand_column сейчас, и используем вызов colref!
        // FIXME: colref сейчас объявлен только для контекста sort!
        // FIXME: мы теряем имя куба: cube_prefix
        if (el.startsWith("-")) {
          return ["-", ["colref", el.substring(1)]];
        } else if (el.startsWith("+")) {
          return ["+", ["colref", el.substring(1)]];
        } else {
          return ["+", ["colref", el]];
        }
      }
    });
  } // "columns": ["dor3", "src.cube.dor4", "cube.col", 'sum((val3+val1)/100):summa', {"new":"old"}, ["sum", ["column","val2"]],  {"new":  ["avg", ["+",["column","val2"],["column","val3"]]]} ],

  /* возвращает примерно вот такое:
  [["column","ch.fot_out.dor3"],["->","src","cube","dor4"],["->","cube","col"],[":",["sum",["/",["()",["+","val3","val1"]],100]],"summa"],[":",["column","ch.fot_out.old"],"new"],["sum",["column","val2"]],[":",["avg",["+",["column","val2"],["column","val3"]]],"new"]]
  простые случаи раскладывает в скоботу сразу, чтобы не запускать eval_lisp
  */


  var expand_column_expression = function expand_column_expression(el) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(el)) {
      // do not call parse on simple strings, which looks like column names !!!
      if (el.match(/^[a-zA-Z_][\w ]*$/) !== null) {
        return ["column", expand_column(el)];
      } // exactly full column name, но может быть лучше это скинуть в ->


      if (el.match(/^([a-zA-Z_][\w ]*\.){1,2}[a-zA-Z_][\w ]*$/) !== null) {
        return ["column", el];
      }

      var ast = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_20__lpep__["a" /* parse */])("expr(".concat(el, ")"));

      if (typeof ast === 'string') {
        // but if it was string, try to expand
        return ["column", expand_column(ast)];
      }

      return ast;
    } else if (Array.isArray(el)) {
      return el;
    } else {
      throw new Error("Wrong element in the columns array: ".concat(el.toString()));
    }
  }; // turn text lpe representations into AST, keep AST as is...


  ret["columns"] = _cfg["columns"].map(function (el) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(el)) {
      return [":", expand_column_expression(Object.values(el)[0]), Object.keys(el)[0]];
    } else {
      return expand_column_expression(el);
    }
  }); //console.log(`COLUMNS: ${JSON.stringify(ret["sort"])}`)

  return ret;
}

function init_udf_args_context(_cube, _vars, _target_database, _cfg) {
  // ожидаем на вход хэш с фильтрами прямо из нашего запроса koob...
  // _context._target_database === 'postgresql'

  /*
   {"dt":["between",2019,2022],"id":["=",23000035],"regions":["=","Moscow","piter","tumen"]}
  udf_args:  ["dir","regions","id","id","dt","dt"]
  udf_args:  ["dir",["ql","regions"],"id","id","dt","dt"]
  для квотации уже не работает, нужен кастомный резолвер имён ;-) а значит специальный контекст, в котором
  надо эвалить каждый второй аргумент: TODO
   если ключ (нечётный аргумент - пустой, то пишем без имени аргумента...)
   where @dir = 'Moscow@piter@tumen', @id = 23000035 => sep(@)
  'VAL1, VAL2, VAL3'                                => sep(,)
  '''VAL1'',''VAL2'',''VAL3'''                      => sep(,), quot( ql2 )
  */
  var udf_arg_cfg = {
    "sqlserver": {
      "arg_prefix": "",
      "arg_suffix": "",
      "arg_sep": ", ",
      "array_val_sep": "@",
      "array_val_quot": "",
      "array_val_quot_enforced": true,
      // always quoting, ignore what user wants
      "array_quot": "ql",
      "varname_prefix": "@",
      "varname_suffix": " = "
    },
    "sap": {
      "arg_prefix": "'PLACEHOLDER' = (",
      "arg_suffix": ")",
      "arg_sep": ", ",
      "array_val_sep": ",",
      "array_val_quot": "ql",
      // if ql() provided in template we call this func
      "array_val_quot_enforced": false,
      "array_quot": "ql",
      // hard coded func called in any case !
      "varname_prefix": "'$$",
      "varname_suffix": "$$', "
    },
    "postgresql": {
      "arg_prefix": "",
      "arg_suffix": "",
      "arg_sep": ", ",
      "array_val_sep": ",",
      "array_val_quot": "qj",
      // quot JSON val with "" 
      "array_val_quot_enforced": true,
      // always quoting, ignore what user wants
      "array_quot": "",
      // if empty, then try array_prefix
      "array_prefix": "$lpe_array_quot$[",
      "array_suffix": "]$lpe_array_quot$",
      // '["val1","val2","val\"123"]'
      "varname_prefix": null,
      // means that var name should be skipped!!!
      "varname_suffix": null
    }
  };
  var c = udf_arg_cfg[_target_database];

  var generate_array_literal = function generate_array_literal(list, is_in_ql_call) {
    var possible_quot = c.array_val_quot;

    if (!c.array_val_quot_enforced && !is_in_ql_call) {
      possible_quot = "";
    }

    if (possible_quot === "") {
      return list.join(c.array_val_sep);
    } else if (possible_quot === "ql") {
      return list.map(function (v) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["a" /* db_quote_literal */])(v);
      }).join(c.array_val_sep);
    } else if (possible_quot === "qj") {
      // json quoting
      return list.map(function (v) {
        return JSON.stringify(v);
      }).join(c.array_val_sep);
    }
  };

  var _ctx = {};

  var quote_array_literal = function quote_array_literal(v) {
    if (c.array_quot === "ql") {
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["a" /* db_quote_literal */])(v);
    } else if (c.array_prefix) {
      return "".concat(c.array_prefix).concat(v).concat(c.array_suffix);
    } else {
      return v;
    }
  };
  /* we may need to query datbase to generate val list
  for example: ["between", '2001-01-01','2002-02-01'] should generate list of dates...
  for now this part is buggy and very limited...
  basically it either return one value, or list value
    */


  function eval_filters_expr(filters, name) {
    if (filters[0] === '=') {
      if (filters.length > 2) {
        // return array
        return filters.slice(1);
      } else {
        if (filters.length === 2) {
          // return just value
          return filters[1];
        }
      }
    }

    throw new Error("udf_args() can not handle filter op ".concat(filters[0], " yet"));
  } // возвращает JSON запрос целиком! 


  _ctx["koob_filters"] = function () {
    //console.log(JSON.stringify(_vars))
    //return JSON.stringify(_vars)
    return _vars;
  };

  _ctx["udf_args"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast, ctx) {
    // аргументы = пары значениий, 
    //console.log(`udf_args: `, JSON.stringify(ast))
    if (udf_arg_cfg[_target_database] === undefined) {
      throw new Error("udf_args() is not yet supported for: ".concat(_target_database));
    }

    var print_val_var_pair = function print_val_var_pair(k, v, is_array) {
      //console.log(`KV: ${k} = ${v}`)
      var s = c.arg_prefix;

      if (c.varname_prefix === null) {
        // skip var name completely !!! usefull for postgresql??
        // and other positional arg functions
        s = "".concat(s);
      } else {
        s = "".concat(s).concat(c.varname_prefix).concat(k).concat(c.varname_suffix);
      }

      if (is_array) {
        return "".concat(s).concat(quote_array_literal(v)).concat(c.arg_suffix);
      } else {
        return "".concat(s).concat(v).concat(c.arg_suffix);
      }
    };

    var pairs = ast.reduce(function (list, _, index, source) {
      if (index % 2 === 0) {
        var name = source[index];
        var filter_ast = source[index + 1];
        name = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(name, _ctx); // should eval to itself !

        var filters = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(filter_ast, ctx, {
          "resolveString": false
        }); // включая _vars !
        //console.log('filters evaled to ' + JSON.stringify(filters))

        if (filters !== undefined) {
          if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(filters)) {
            var vallist = eval_filters_expr(filters);

            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(vallist)) {
              var expr = generate_array_literal(vallist, false);

              if (expr.length > 0) {
                list.push(print_val_var_pair(name, expr, true));
              } else {
                throw new Error("udf_args() has filter without value, only op ".concat(filters[0]));
              }
            } else {
              list.push(print_val_var_pair(name, vallist));
            }
          } else {
            //console.log(`NEVER BE HERE! ${filters}`)
            if (filters.length > 0) {
              if (name && name.length > 0) {
                list.push(print_val_var_pair(name, filters));
              } else {
                // postgresql might skip names ???
                list.push("".concat(filters));
              }
            }
          }
        }
      }

      return list;
    }, []);
    return pairs.join(c.arg_sep);
  });

  _ctx["ql"] = function (arg) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(arg)) {
      //console.log('QL:'  + JSON.stringify(arg))
      var vallist = eval_filters_expr(arg);

      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(vallist)) {
        var expr = generate_array_literal(vallist, true); // enforce quoting as it is ql() call

        return quote_array_literal(expr);
      } else {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["a" /* db_quote_literal */])(vallist);
      }
    } else {
      if (arg !== undefined) {
        //console.log(`QUOT FOR ${arg}`)
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(arg)) {
          // This is JSON as hash, we should quote it as string!
          return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["a" /* db_quote_literal */])(JSON.stringify(arg));
        }

        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["a" /* db_quote_literal */])(arg);
      }
    }

    return undefined;
  };

  return [_ctx, // функция, которая резолвит имена столбцов для случаев, когда имя функции не определено в явном виде в _vars/_context
  // а также пытается зарезолвить коэффициенты
  function (key, val, resolveOptions) {
    var fullname = "".concat(_cube, ".").concat(key);
    return _vars[fullname];
  }];
}
/*********************************
 * 
 * init_koob_context
 * на входе контекст может быть массивом, а может быть хэшем. Стало сложнее с этим работать!
 * Cчитаем, что на входе может быть только хэш с уже прочитанными именами столбцов!!
 */


function init_koob_context(_vars, default_ds, default_cube) {
  var _ctx = []; // это контекст где будет сначала список переменных, включая _columns, и функции

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(_vars)) {
    _ctx = [_vars];
  }

  var _context = _ctx[0]; // пытается определить тип аргумента, если это похоже на столбец, то ищет про него инфу в кэше и определяет тип,
  // а по типу можно уже думать, квотировать значения или нет.

  var shouldQuote = function shouldQuote(col, v) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(col) && col[0] === 'column') {
      //try to detect column type
      var c = _context["_columns"][col[1]];

      if (c) {
        return c.type !== 'NUMBER';
      }

      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(v);
    } // это формула над какими-то столбцами...
    // смотрим на тип выражения v, если это текст, то возвращаем true,
    // но сначала проверим, вдруг это alias???


    if (_context["_aliases"][v]) {
      return false;
    } // left and right side looks like a column names, don't quote


    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(col) && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(v) && (col.match(/^[A-Za-z_]+\w*$/) || col.match(/^[A-Za-z_]+\w*\.[A-Za-z_]+\w*$/)) && (v.match(/^[A-Za-z_]+\w*$/) || v.match(/^[A-Za-z_]+\w*\.[A-Za-z_]+\w*$/))) {
      return false;
    }

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(v);
  };

  var quoteLiteral = function quoteLiteral(lit) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(lit) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["f" /* isNumber */])(lit) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(lit) && lit[0] !== "ql") {
      return ["ql", lit];
    }

    return lit;
  };
  /* если нужно, берёт в кавычки, но не делает eval для первого аргумента! */

  /* Считается, что первый аргумент - строка или числоб но не ast */


  var evalQuoteLiteral = function evalQuoteLiteral(lit) {
    return lit === null ? null : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["a" /* db_quote_literal */])(lit);
  }; // функция, которая резолвит имена столбцов для случаев, когда имя функции не определено в явном виде в _vars/_context
  // а также пытается зарезолвить коэффициенты


  _ctx.push(function (key, val, resolveOptions) {
    // console.log(`WANT to resolve ${key} ${val}`, JSON.stringify(resolveOptions));
    // вызываем функцию column(ПолноеИмяСтолбца) если нашли столбец в дефолтном кубе
    if (_context["_columns"][key]) return _context["column"](key);
    if (_context["_columns"][default_ds][default_cube][key]) return _context["column"]("".concat(default_ds, ".").concat(default_cube, ".").concat(key)); // reference to alias!
    //console.log("DO WE HAVE SUCH ALIAS?" , JSON.stringify(_context["_aliases"]))

    if (_context["_aliases"][key]) {
      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_context["_result"]["columns"])) {
        _context["_result"]["columns"] = [];
      } // remeber reference to alias as column name!


      _context["_result"]["columns"].push(key); // mark our expression same as target
      // FIXME: setting window will result in BUGS
      //_context["_result"]["window"] = _context["_aliases"][key]["window"]


      _context["_result"]["agg"] = _context["_aliases"][key]["agg"]; // Mark agg function to display expr as is

      _context["_result"]["outerVerbatim"] = true;
      return key;
    }

    if (resolveOptions && resolveOptions.wantCallable) {
      if (key.match(/^\w+$/)) {
        if (_context["_result"]) {
          //console.log("HUY!! " + JSON.stringify(key))
          // в этом списке только стандартные вещи, которые во всех базах одинаково пишутся
          if (['sum', 'avg', 'min', 'max', 'count'].find(function (el) {
            return el === key;
          })) {
            _context["_result"]["agg"] = true;
          }
        }

        return function () {
          var a = Array.prototype.slice.call(arguments); //console.log(`FUNC RESOLV ${key}`, JSON.stringify(a))

          if (key.match(/^between$/i)) {
            //console.log(`between(${a.join(',')})`)
            var e = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(["between"].concat(a), _ctx);
            return e;
          }

          if (key === 'count') {
            if (_context._target_database == 'clickhouse') {
              // console.log('COUNT:' + JSON.stringify(a))
              // у нас всегда должен быть один аргумент и он уже прошёл eval !!!
              // Это БАГ в тыкдоме v21 = отдаёт текстом значения, если count делать :-()
              return "toUInt32(count(".concat(a[0], "))");
            }
          }

          if (key === 'only1' || key === 'on1y') {
            // особый режим выполнения SQL.
            // ставим флаг, потом будем оптимизировать запрос!
            _context["_result"]["only1"] = true;
            return a[0];
          }

          return "".concat(key, "(").concat(a.join(','), ")");
        };
      } else {
        // -> ~ > < != <> and so on,
        //  FIXME: мы должны вернуть более умный макрос, который будет искать вызовы column в левой и правой части и делать ql при необходимости
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast, ctx) {
          //console.log(`ANY FUNC ${key}`, JSON.stringify(ast))
          var k = key;
          var col = ast[0]; //FIXME: надо бы тоже quoteLiteral вызывать для c

          var c = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, ctx);

          if (ast.length === 1) {
            // например `-1 * sum(col)`
            return "".concat(k).concat(c);
          }

          var v = ast[1];

          if (!(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(v) && v.startsWith('$'))) {
            // коэфициент не надо квотировать, оно должно замениться на конкретное число!
            if (shouldQuote(col, v)) v = quoteLiteral(v);
          }

          v = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(v, ctx);
          return "".concat(c, " ").concat(k, " ").concat(v);
        });
      }
    }

    if (key.startsWith('$')) {
      // возможно, это коэффициент?
      var _val = _context["_coefficients"][key];

      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["f" /* isNumber */])(_val)) {
        return _val;
      }
    } // We may have references to yet unresolved aliases....


    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(_context["_result"])) {
      if (key.match(/^[A-Za-z_]+\w*$/)) {
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_context["_result"]["unresolved_aliases"])) {
          _context["_result"]["unresolved_aliases"] = [];
        }

        _context["_result"]["unresolved_aliases"].push(key);
      }
    }

    return key;
  }); // end of _ctx.push()


  _context["median"] = function (col) {
    _context["_result"]["agg"] = true;

    if (_context._target_database === 'clickhouse') {
      return "quantile(0.5)(".concat(col, ")");
    } else if (_context._target_database === 'postgresql' || _context._target_database === 'oracle') {
      return "percentile_cont(0.5) WITHIN GROUP (ORDER BY ".concat(col, " DESC)");
    } else if (_context._target_database === 'teradata' || _context._target_database === 'sap') {
      return "median(".concat(col, ")");
    } else {
      throw Error("median() is not implemented for ".concat(_context._target_database, " yet"));
    }
  };

  _context["mode"] = function (col) {
    _context["_result"]["agg"] = true;

    if (_context._target_database === 'clickhouse') {
      return "arrayElement(topK(1)(".concat(col, "),1)");
    } else if (_context._target_database === 'postgresql') {
      return "mode() WITHIN GROUP (ORDER BY ".concat(col, ")");
    } else if (_context._target_database === 'oracle') {
      return "STATS_MODE(".concat(col, ")");
    } else {
      throw Error("mode() is not implemented for ".concat(_context._target_database, " yet"));
    }
  };

  _context["var_pop"] = function (col) {
    _context["_result"]["agg"] = true;

    if (_context._target_database === 'clickhouse') {
      return "varPop(".concat(col, ")");
    } else if (_context._target_database === 'postgresql' || _context._target_database === 'oracle' || _context._target_database === 'teradata' || _context._target_database === 'vertica' || _context._target_database === 'sap') {
      return "var_pop(".concat(col, ")");
    } else if (_context._target_database === 'sqlserver') {
      return "VarP(".concat(col, ")");
    } else {
      throw Error("var_pop() is not implemented for ".concat(_context._target_database, " yet"));
    }
  };

  _context["var_samp"] = function (col) {
    _context["_result"]["agg"] = true;

    if (_context._target_database === 'clickhouse') {
      return "varSamp(".concat(col, ")");
    } else if (_context._target_database === 'postgresql' || _context._target_database === 'oracle' || _context._target_database === 'teradata' || _context._target_database === 'vertica' || _context._target_database === 'sap') {
      return "var_samp(".concat(col, ")");
    } else if (_context._target_database === 'sqlserver') {
      return "Var(".concat(col, ")");
    } else {
      throw Error("var_samp() is not implemented for ".concat(_context._target_database, " yet"));
    }
  };

  _context["stddev_samp"] = function (col) {
    _context["_result"]["agg"] = true;

    if (_context._target_database === 'clickhouse') {
      return "stddevSamp(".concat(col, ")");
    } else if (_context._target_database === 'postgresql' || _context._target_database === 'oracle' || _context._target_database === 'teradata' || _context._target_database === 'vertica' || _context._target_database === 'sap') {
      return "stddev_samp(".concat(col, ")");
    } else if (_context._target_database === 'sqlserver') {
      return "Stdev(".concat(col, ")");
    } else {
      throw Error("var_samp() is not implemented for ".concat(_context._target_database, " yet"));
    }
  };

  _context["stddev_pop"] = function (col) {
    _context["_result"]["agg"] = true;

    if (_context._target_database === 'clickhouse') {
      return "stddevPop(".concat(col, ")");
    } else if (_context._target_database === 'postgresql' || _context._target_database === 'oracle' || _context._target_database === 'teradata' || _context._target_database === 'vertica' || _context._target_database === 'sap') {
      return "stddev_pop(".concat(col, ")");
    } else if (_context._target_database === 'sqlserver') {
      return "StdevP(".concat(col, ")");
    } else {
      throw Error("var_samp() is not implemented for ".concat(_context._target_database, " yet"));
    }
  };

  _context["_sequence"] = 0; // magic sequence number for uniq names generation

  _context["column"] = function (col) {
    // считаем, что сюда приходят только полностью резолвенные имена с двумя точками...
    var c = _context["_columns"][col];

    if (c) {
      // side-effect to return structure (one per call)
      if (_context["_result"]) {
        _context["_result"]["columns"].push(col);

        if (c["type"] === "AGGFN") {
          _context["_result"]["agg"] = true;
        }
      }

      var parts = col.split('.');
      var colname = parts[2];

      if (colname.localeCompare(c.sql_query, undefined, {
        sensitivity: 'accent'
      }) === 0 || "\"".concat(colname, "\"").localeCompare(c.sql_query, undefined, {
        sensitivity: 'accent'
      }) === 0) {
        // we have just column name, prepend table alias !
        return "".concat(c.sql_query); // temporarily disabled by DIMA FIXME
        //return `${parts[1]}.${c.sql_query}`
      } else {
        //console.log(`OPANKI: ${c.sql_query}`)
        // FIXME: WE JUST TRY TO match getDict, if ANY. there should be a better way!!!
        // dictGet('gpn.group_pay_dict', some_real_field, tuple(pay_code))
        //console.log(`OPANKI: ${c.sql_query}`, JSON.stringify(_context))
        if (_context._target_database == 'clickhouse') {
          // for the SELECT part make sure we produce different things for INNER and OUTER SQL
          // SELECT part is denoted by _context["_result"]
          if (_context["_result"] && c.sql_query.match(/dictGet\(/)) {
            //console.log(`OPANKI1: ${c.sql_query}`)
            _context["_result"]["outer_expr"] = c.sql_query;
            _context["_result"]["outer_alias"] = parts[2];
            var m = c.sql_query.match(/,[^,]+,(.*)/);

            if (m) {
              m = m[1]; //console.log(`OPANKI11: ${m}`)
              // ' tuple(pay_code))'

              var t = m.match(/tuple\((\w+)\)/);

              if (t) {
                //console.log(`OPANKI22: ${c.sql_query}  ${t[1]}`)
                _context["_result"]["alias"] = t[1];
                return t[1];
              } else {
                t = m.match(/(\w+)/);

                if (t) {
                  _context["_result"]["alias"] = t[1];
                  return t[1];
                }
              }
            }
          }
        }

        if (_context["_result"]) {
          // make alias for calculated columns
          var _parts = col.split('.');

          if (_parts.length === 3) _context["_result"]["alias"] = _parts[2];
        }

        return "(".concat(c.sql_query, ")");
      }
    } //console.log("COL FAIL", col)
    // возможно кто-то вызовет нас с коротким именем - нужно знать дефолт куб!!!
    //if (_context["_columns"][default_ds][default_cube][key]) return `${default_cube}.${key}`;


    return col;
  };
  /*
     expr: "initializeAggregation('sumState',sum(s2.deb_cre_lc )) as mnt",
     alias: "mnt",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true,
     window: true,
     outer_expr: "runningAccumulate(mnt, (comp_code,gl_account)) as col1",
     outer_alias: 'col1'
  */


  _context["running"] = function () {
    _context["_result"]["agg"] = true; // mark that we are aggregate function for correct 'group by'

    _context["_result"]["window"] = true;
    var a = Array.prototype.slice.call(arguments); //console.log("RUNNING" , JSON.stringify(a))
    //console.log("Flavor" , JSON.stringify(_context._target_database))

    if (_context._target_database !== 'clickhouse') {
      throw Error('running function is only supported for clickhouse SQL flavour');
    } //
    // we have 3 args ["sum","v_main",["-","hcode_name"]]
    // or we have 2 args: ["lead","rs"]
    // and should generate: initializeAggregation('sumState',sum(s2.deb_cre_lc )) as mnt 


    var fname = a[0];
    var colname = a[1];
    var order_by = '';
    var expr = '';

    if (fname === 'sum') {
      order_by = a[2]; // array!

      order_by = order_by[1]; // FIXME! may crash on wrong input!!! use eval !!!
      // We have 2 phases, inner and outer.
      // For inner phase we should generate init:

      expr = "initializeAggregation('".concat(fname, "State',").concat(fname, "(").concat(colname, "))"); // For outer phase we should generate 
      // runningAccumulate(wf1, (comp_code,gl_account)) AS end_lc,
      // BUT WIITHOUT AS end_lc

      var alias = '_w_f_' + ++_context["_sequence"];
      _context["_result"]["expr"] = expr;
      _context["_result"]["columns"] = [colname];
      _context["_result"]["inner_order_by_excl"] = order_by;
      _context["_result"]["outer_expr"] = "runningAccumulate(".concat(alias, ", partition_columns())"); //it should not be used as is

      _context["_result"]["outer_expr_eval"] = true; // please eval outer_expr !!!

      _context["_result"]["outer_alias"] = alias;
    } else if (fname === 'lead') {
      // or we have 2 args: ["lead","rs"]
      // if this column is placed BEFORE referenced column, we can not create correct outer_expr
      // in this case we provide placeholder...
      var init = _context["_aliases"][colname];

      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(init) && init["alias"]) {
        _context["_result"]["outer_expr"] = "finalizeAggregation(".concat(init["alias"], ")");
      } else {
        _context["_result"]["outer_expr"] = "finalizeAggregation(resolve_alias())";
        _context["_result"]["outer_expr_eval"] = true;
        _context["_result"]["eval_reference_to"] = colname;
      }

      expr = null; // no inner expr for this func!
    }

    return expr;
  };

  _context['running'].ast = [[], {}, [], 1]; // mark as macro
  // сюда должны попадать только хитрые варианты вызова функций с указанием схемы типа utils.smap()

  _context["->"] = function () {
    var a = Array.prototype.slice.call(arguments); //console.log("-> !" , JSON.stringify(a))

    return a.map(function (el) {
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(el) ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(el, _ctx) : el;
    }).join('.');
  };

  _context['->'].ast = [[], {}, [], 1]; // mark as macro

  _context[':'] = function (o, n) {
    //var a = Array.prototype.slice.call(arguments);
    //console.log(":   " + JSON.stringify(o) + ` ${JSON.stringify(n)}`);
    //return a[0] + ' as ' + a[1].replace(/"/,'\\"');
    // если нам придёт вот такое "count(v_rel_pp):'АХТУНГ'",
    var al = n;

    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(n) && n[0] == "'" || n[0] == '"') {
      al = n[1];
    } //console.log("AS   " + JSON.stringify(_ctx));


    var otext = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(o, _ctx);

    if (_context["_result"]) {
      // мы кидаем значение alias в _result, это подходит для столбцов
      // для TABLE as alias не надо вызывать _result
      // также есть outer_alias для оконных функций, мы его поменяем!!!
      if (_context["_result"]["outer_alias"]) {
        _context["_result"]["alias"] = _context["_result"]["outer_alias"];
        _context["_result"]["outer_alias"] = al;
      } else {
        _context["_result"]["alias"] = al;
      }

      return otext;
    }

    return quot_as_expression(_context["_target_database"], otext, n);
  };

  _context[':'].ast = [[], {}, [], 1]; // mark as macro

  _context['toString'] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast, ctx) {
    // we need to use makeSF, as normal LISP context will not evaluate column names ???
    //console.log(JSON.stringify(ast))
    var col = ast[0];
    var s = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context);

    if (_context._target_database === 'clickhouse') {
      return "toString(".concat(s, ")");
    } else if (_context._target_database === 'postgresql') {
      return "".concat(s, "::TEXT");
    } else {
      return "cast(".concat(s, " AS VARCHAR)");
    }
  }); // Clickhouse way.... will create extra dataset
  // range(end), range([start, ] end [, step])
  // Returns an array of UInt numbers from start to end - 1 by step.
  // either 1 or 3 args !!!

  _context['range'] = function (from, to, step) {
    if (_context._target_database === 'clickhouse') {
      if (to === undefined) {
        return "arrayJoin(range(".concat(from, "))");
      } else {
        if (step === undefined) {
          return "arrayJoin(range(".concat(from, ",").concat(to, "))");
        } else {
          return "arrayJoin(range(".concat(from, ",").concat(to, ", ").concat(step, "))");
        }
      }
    } else if (_context._target_database === 'postgresql') {
      var s = '';

      if (to === undefined) {
        s = "generate_series(0, ".concat(from, "-1)");
      } else {
        if (step === undefined) {
          s = "generate_series(".concat(from, ", ").concat(to, "-1)");
        } else {
          s = "generate_series(".concat(from, ", ").concat(to, "-1, ").concat(step, ")");
        }
      }

      _context["_result"]["is_range_column"] = true;
      _context["_result"]["expr"] = 'koob__range__';
      _context["_result"]["columns"] = ["koob__range__"];
      _context["_result"]["join"] = {
        "type": "inner",
        "alias": "koob__range__",
        "expr": "".concat(s)
      };
      return 'koob__range__';
    } else if (_context._target_database === 'teradata') {
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // JOIN и WHERE!!!
      // select  _koob__range__table__.day_of_calendar, procurement_subject 
      // FROM bi.fortests, sys_calendar.CALENDAR as koob__range__table__
      // where purch_id = 8585 and day_of_calendar BETWEEN 1 AND 10;
      // max count is limited to 73414
      if (step !== undefined) {
        throw Error("range(with step argument) is not supported for ".concat(_context._target_database));
      }

      var f;

      if (to === undefined) {
        f = ['<=', from];
      } else {
        f = ['between', from + 1, to];
      }

      _context["_result"]["is_range_column"] = true;
      _context["_result"]["expr"] = 'koob__range__table__.day_of_calendar - 1';
      _context["_result"]["columns"] = ["day_of_calendar"];
      _context["_result"]["alias"] = 'koob__range__';
      _context["_result"]["join"] = {
        "type": "inner",
        "table": "sys_calendar.CALENDAR",
        "alias": "koob__range__table__",
        "filters": {
          "koob__range__table__.day_of_calendar": f
        }
      };
      return 'koob__range__table__.day_of_calendar - 1'; // FIXME: это попадает в GROUP BY !!!
    } else if (_context._target_database === 'oracle') {
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // JOIN и WHERE!!!
      // ONLY FOR Oracle 10g and above!
      if (step === undefined) {
        step = '';
      } else {
        step = " and MOD(LEVEL, ".concat(step, ") = 0");
      }

      if (to === undefined) {
        to = from;
        from = 0;
      }

      _context["_result"]["is_range_column"] = true;
      _context["_result"]["expr"] = 'koob__range__';
      _context["_result"]["columns"] = ["koob__range__"];
      _context["_result"]["join"] = {
        "type": "inner",
        "expr": "(\n      select LEVEL-1 AS koob__range__ from dual\n      where LEVEL between ".concat(from, "+1 and ").concat(to).concat(step, "\n      connect by LEVEL <= ").concat(to, "\n      )")
      };
      return 'koob__range__'; // FIXME: это автоматически попадает в GROUP BY !!!
    } else if (_context._target_database === 'sqlserver') {
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // только JOIN 
      // 
      if (step === undefined) {
        step = 1;
      }

      if (to === undefined) {
        to = from;
        from = 0;
      }

      var numbers = [];

      for (var i = from; i < to; i += step) {
        numbers.push("(".concat(i, ")"));
      }

      _context["_result"]["is_range_column"] = true;
      _context["_result"]["expr"] = 'koob__range__';
      _context["_result"]["columns"] = ["koob__range__"];
      _context["_result"]["join"] = {
        "type": "inner",
        "alias": "koob__range__table__",
        "expr": "(\n      select koob__range__ FROM (VALUES ".concat(numbers.join(", "), ") vals(koob__range__)\n      )") // (select n FROM (VALUES (0), (1), (2)) v1(n)) as t

      };
      return 'koob__range__'; // FIXME: это автоматически попадает в GROUP BY !!!
    } else if (_context._target_database === 'vertica') {
      // возвращаем здесь просто имя столбца, но потом нужно будет сгенерить
      // только JOIN 
      // 
      if (step === undefined) {
        step = '';
      } else {
        step = " WHERE MOD(koob__range__, ".concat(step, ") = 0");
      }

      if (to === undefined) {
        to = from - 1;
        from = 0;
      } else {
        to = to - 1;
      }

      _context["_result"]["is_range_column"] = true;
      _context["_result"]["expr"] = 'koob__range__';
      _context["_result"]["columns"] = ["koob__range__"];
      _context["_result"]["join"] = {
        "type": "inner",
        "alias": "koob__range__table__",
        "expr": "(\n          WITH koob__range__table__seq AS (\n            SELECT ROW_NUMBER() OVER() - 1 AS koob__range__ FROM (\n                SELECT 1 FROM (\n                    SELECT date(0) + INTERVAL '".concat(from, " second' AS se UNION ALL\n                    SELECT date(0) + INTERVAL '").concat(to, " seconds' AS se ) a\n                TIMESERIES tm AS '1 second' OVER(ORDER BY se)\n            ) b  \n        )\n        SELECT koob__range__ FROM koob__range__table__seq").concat(step, ")")
      };
      return 'koob__range__'; // FIXME: это автоматически попадает в GROUP BY !!!
    } else if (_context._target_database === 'sap') {
      // SAP HANA
      if (step === undefined) {
        step = '1';
      } else {
        step = "".concat(step);
      }

      if (to === undefined) {
        to = from;
        from = 0;
      }

      _context["_result"]["is_range_column"] = true;
      _context["_result"]["expr"] = 'koob__range__';
      _context["_result"]["columns"] = ["koob__range__"];
      _context["_result"]["join"] = {
        "type": "inner",
        "expr": "(\n      select GENERATED_PERIOD_START AS koob__range__ from SERIES_GENERATE_INTEGER(".concat(step, ", ").concat(from, ", ").concat(to, ")\n      )")
      };
      return 'koob__range__'; // FIXME: это автоматически попадает в GROUP BY !!!
    } else {
      throw Error("range() is not supported in ".concat(_context._target_database));
    }
  };

  _context['pointInPolygon'] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast, ctx) {
    //console.log(JSON.stringify(ast))
    // [["tuple","lat","lng"],["[",["tuple",0,0],["tuple",0,1],["tuple",1,0],["tuple",1,1]]]
    var point = ast[0];
    var pnt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(point, _context); // point as first argument

    var poly = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[1], _context);

    if (_context._target_database === 'clickhouse') {
      return "pointInPolygon(".concat(pnt, ", [").concat(poly, "])");
    } else if (_context._target_database === 'postgresql') {
      // circle '((0,0),2)' @> point '(1,1)'        	polygon '((0,0),(1,1))'
      return "polygon '(".concat(poly, ")' @> point").concat(pnt);
    } else {
      throw Error("pointInPolygon is not supported in ".concat(_context._target_database));
    }
  });

  _context['pointInEllipses'] = function () {
    if (_context._target_database !== 'clickhouse') {
      throw Error("pointInEllipses is not supported in ".concat(_context._target_database));
    }

    var a = Array.prototype.slice.call(arguments);

    if ((a.length - 2) % 4 != 0) {
      throw Error("pointInEllipses should contain correct number of coordinates!");
    }

    return "pointInEllipses(".concat(a.join(','), ")");
  };

  _context['pointInCircle'] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast, ctx) {
    // ["lat","lng", 0,0,R]
    var point = ast[0];
    var x = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[0], ctx); // point x

    var y = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[1], ctx);
    var cx = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[2], ctx); // center of circle 

    var cy = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[3], ctx); // center of circle 

    var R = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[4], ctx);

    if (_context._target_database === 'clickhouse') {
      return "pointInEllipses(".concat(x, ",").concat(y, ",").concat(cx, ",").concat(cy, ",").concat(R, ",").concat(R, ")");
    } else if (_context._target_database === 'postgresql') {
      return "circle(point(".concat(cx, ",").concat(cy, "),").concat(R, ") @> point(").concat(x, ",").concat(y, ")");
    } else {
      throw Error("pointInPolygon is not supported in ".concat(_context._target_database));
    }
  });

  _context['()'] = function (a) {
    return "(".concat(a, ")");
  };

  _context['if'] = function (cond, truthy, falsy) {
    return "CASE WHEN ".concat(cond, " THEN ").concat(truthy, " ELSE ").concat(falsy, " END");
  };

  _context['tuple'] = function (first, second) {
    if (_context._target_database === 'clickhouse') {
      return "tuple(".concat(first, ",").concat(second, ")");
    } else {
      return "(".concat(first, ",").concat(second, ")");
    }
  };

  _context['expr'] = function (a) {
    // Just placeholder for logical expressions, which should keep ()
    return a;
  };

  var partial_filter = function partial_filter(a) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(a[0]) && a[0][0] === "ignore(me)") {
      var ignoreme = a.shift();
      a = a.map(function (el) {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(el)) {
          el.splice(1, 0, ignoreme);
          return el;
        } else {
          return el;
        }
      });
    } //console.log("OR->OR->OR", JSON.stringify(a))


    a = a.map(function (el) {
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(el, _ctx);
    });
    return a;
  };

  _context['or'] = function () {
    // Первый аргумент может быть ["ignore(me)",[]] = и надо его передать дальше!!!!
    // #244
    var a = Array.prototype.slice.call(arguments); //console.log("OR OR OR", JSON.stringify(a))
    // [["ignore(me)",["column","ch.fot_out.pay_code"]],["!="],["ilike","Муж"]]

    a = partial_filter(a);

    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(a)) {
      if (a.length > 0) {
        return "(".concat(a.join(') OR ('), ")");
      }
    } // https://mathematica.stackexchange.com/questions/264386/logical-functions-with-no-arguments


    return '1=0';
  };

  _context['or'].ast = [[], {}, [], 1]; // mark as macro

  _context['and'] = function () {
    var a = Array.prototype.slice.call(arguments);
    a = partial_filter(a);

    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(a)) {
      if (a.length > 0) {
        return "(".concat(a.join(') AND ('), ")");
      }
    } // https://mathematica.stackexchange.com/questions/264386/logical-functions-with-no-arguments


    return '1=1';
  };

  _context['and'].ast = [[], {}, [], 1]; // mark as macro

  _context['not'] = function () {
    var a = Array.prototype.slice.call(arguments);
    a = partial_filter(a);
    return "NOT ".concat(a[0]);
  };

  _context['not'].ast = [[], {}, [], 1]; // mark as macro

  _context["'"] = function (a) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["a" /* db_quote_literal */])(a);
  }; // overwrite STDLIB! or we will treat (a = 'null') as (a = null) which is wrong in SQL !


  _context['null'] = 'null';
  _context['true'] = 'true';
  _context['false'] = 'false';

  _context["ql"] = function (el) {
    // NULL values should not be quoted
    // plv8 version of db_quote_literal returns E'\\d\\d' for '\d\d' which is not supported in ClickHose :-()
    // so we created our own version...
    return el === null ? null : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["a" /* db_quote_literal */])(el);
  };
  /* тут мы не пометили AGG !!!
  _context['count'] = makeSF( (ast,ctx) => {
    var a;
    if (ast.length == 1) {
      a = ast[0]
    } else {
      a = ast
    }
    if (_context._target_database == 'clickhouse') {
      // Это БАГ в тыкдоме = отдаёт текстом значения, если count делать Ж-()
      return `toUInt32(count(${eval_lisp(a, ctx)}))`
    } else {
      return `count(${eval_lisp(a, ctx)})`
    }
  });*/


  _context['between'] = function (col, var1, var2) {
    if (shouldQuote(col, var1)) var1 = quoteLiteral(var1);
    if (shouldQuote(col, var2)) var2 = quoteLiteral(var2);
    var l = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(var1, _context);
    var r = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(var2, _context);

    if (l === null || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(l) && (l.length === 0 || l === "''")) {
      if (r === null || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(r) && (r.length === 0 || r === "''")) {
        // both are empty, we should not generate any conditions!
        // FIXME: Should we return null?
        return '1=1';
      } else {
        // l is null, r is real
        return "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " <= ").concat(r);
      }
    } else {
      if (r === null || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(r) && (r.length === 0 || r === "''")) {
        // l is real, r is null
        return "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " >= ").concat(l);
      } else {
        // both l and r is real
        return "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " BETWEEN ").concat(l, " AND ").concat(r);
      }
    }
  };

  _context['between'].ast = [[], {}, [], 1]; // mark as macro

  _context['~'] = function (col, tmpl) {
    if (shouldQuote(col, tmpl)) tmpl = quoteLiteral(tmpl); // в каждой базе свои regexp

    if (_vars["_target_database"] === 'oracle') {
      return "REGEXP_LIKE( ".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " , ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context), " )");
    } else if (_vars["_target_database"] === 'mysql') {
      return "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " REGEXP ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context));
    } else if (_vars["_target_database"] === 'clickhouse') {
      // case is important !!!
      return "match( ".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " , ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context), " )");
    } else {
      return "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " ~ ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context));
    }
  };

  _context['~'].ast = [[], {}, [], 1]; // mark as macro

  _context['~*'] = function (col, tmpl) {
    if (shouldQuote(col, tmpl)) tmpl = quoteLiteral(tmpl); // в каждой базе свои regexp

    if (_vars["_target_database"] === 'oracle') {
      return "REGEXP_LIKE( ".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " , ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context), ", 'i')");
    } else if (_vars["_target_database"] === 'mysql') {
      return "REGEXP_LIKE( ".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), ", ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context), ", 'i')");
    } else if (_vars["_target_database"] === 'clickhouse') {
      // case is not important !!!
      var pattern = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context); // should be in quotes! 'ddff'

      pattern = "(?i:".concat(pattern.slice(1, -1), ")");
      return "match( ".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " , '").concat(pattern, "' )");
    } else {
      return "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " ~* ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context));
    }
  };

  _context['~*'].ast = [[], {}, [], 1]; // mark as macro

  _context['!~'] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast, ctx) {
    return "NOT " + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(["~"].concat(ast), ctx);
  });
  _context['!~*'] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast, ctx) {
    return "NOT " + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(["~*"].concat(ast), ctx);
  });

  _context['like'] = function (col, tmpl) {
    if (shouldQuote(col, tmpl)) tmpl = quoteLiteral(tmpl);
    return "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " LIKE ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context));
  };

  _context['like'].ast = [[], {}, [], 1]; // mark as macro

  _context['ilike'] = function (col, tmpl) {
    if (shouldQuote(col, tmpl)) tmpl = quoteLiteral(tmpl);

    if (_vars["_target_database"] === 'clickhouse') {
      // FIXME: detect column type !!!
      return "toString(".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), ") ILIKE ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context));
    } else if (_vars["_target_database"] === 'oracle' || _vars["_target_database"] === 'sqlserver') {
      // FIXME! Oracle has something similar to ilike in v12 only :-()
      // FIXME: use regexp
      return "UPPER(".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), ") LIKE UPPER(").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context), ")");
    } else if (_vars["_target_database"] === 'mysql') {
      // https://www.oreilly.com/library/view/mysql-cookbook/0596001452/ch04s11.html
      return "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " LIKE ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context));
    } else {
      return "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context), " ILIKE ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(tmpl, _context));
    }
  };

  _context['ilike'].ast = [[], {}, [], 1]; // mark as macro

  _context['ignore(me)'] = function (arg) {
    return arg;
  };
  /*
  f1 / lpe_total(sum, f2)
  We should make subselect with full aggregation, but using our local WHERE!!!
  local WHERE is not Yet known, so we should post=pone execution???
   But we probably can inject EVAL part into _context["_result"]["expr"] ??
  if (_context["_result"]){
   */


  _context['lpe_subtotal'] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast, ctx) {
    if (_context["_result"]) {
      var seq = ++_context["_sequence"];

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(_context["_result"]["lpe_subtotals"])) {
        _context["_result"]["lpe_subtotals"] = {};
      } //console.log("AST: ", ast)
      // FIXME: pleaqse check that we have agg func in the AST, overwise we will get SQL errors from the DB
      //AST:  [ [ 'sum', 'v_rel_pp' ] ]
      //AST:  [ [ '+', [ 'avg', 'v_rel_pp' ], 99 ] ]


      _context["_result"]["lpe_subtotals"]["lpe_subtotal_".concat(seq)] = {
        "ast": ast,
        "expr": "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[0], ctx)) // in simple cases we wil have this: {"lpe_totals":{
        // "lpe_total_2":{"ast":[["avg", "v_rel_pp"]],"expr":"avg(fot_out.v_rel_pp)"}}

      };
      _context["_result"]["eval_expr"] = true;
    } // naive!!!


    return "lpe_subtotal_".concat(seq, "()"); // ${ast[0]}, ${ast[1]}
  });
  _context['='] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast, ctx) {
    // понимаем a = [null] как a is null
    // a = [] просто пропускаем, А кстати почему собственно???
    // a = [null, 1,2] как a in (1,2) or a is null
    // ["=",["column","vNetwork.cluster"],SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]
    // var a = Array.prototype.slice.call(arguments)
    // console.log("=========" + JSON.stringify(ast))
    var col = ast[0];
    /* FIXME !!! AGHTUNG !!!!
    было var c = eval_lisp(col, _context) и сложные выражения типа if ( sum(v_rel_pp)=0, 0, sum(pay_code)/sum(v_rel_pp)):d
    не резолвились, так как функции sum,avg,min и т.д. сделаны в общем виде!!!
    Видимо, надо везде переходить на _ctx !!!!
    */

    var c = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _ctx);

    var resolveValue = function resolveValue(v) {
      if (shouldQuote(col, v)) v = evalQuoteLiteral(v, _context);
      return v; // [["ignore(me)",["column","ch.fot_out.hcode_name"]],"-","2020-03-01"]
      // если делать eval, то - будет читаться как функция!!!
      //return eval_lisp(v,_context)
    };

    if (ast.length === 1) {
      return '1=0';
    } else if (ast.length === 2) {
      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(ast[1])) {
        if (ast[1][0] === "[") {
          var a = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[1], _context);
          ast = [c].concat(a);
        } else {
          // assuming if (ast[1][0] === "'")
          var v = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[1], _context);
          return v === null ? "".concat(c, " IS NULL") : "".concat(c, " = ").concat(v);
        }
      } else {
        var _v = resolveValue(ast[1]);

        return _v === null ? "".concat(c, " IS NULL") : "".concat(c, " = ").concat(_v);
      }
    } // check if we have null in the array of values...


    var resolvedV = ast.slice(1).map(function (el) {
      return resolveValue(el);
    }).filter(function (el) {
      return el !== null;
    });
    var hasNull = resolvedV.length < ast.length - 1;
    var ret = "".concat(c, " IN (").concat(resolvedV.join(', '), ")");
    if (hasNull) ret = "".concat(ret, " OR ").concat(c, " IS NULL");
    return ret;
  });
  _context['!='] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast, ctx) {
    // понимаем a != [null] как a is not null
    // a != [] просто пропускаем, А кстати почему собственно???
    // a != [null, 1,2] как a not in (1,2) and a is not null
    // ["!=",["column","vNetwork.cluster"],SPB99-DMZ02","SPB99-ESXCL02","SPB99-ESXCL04","SPB99-ESXCLMAIL"]
    // var a = Array.prototype.slice.call(arguments)
    //console.log(JSON.stringify(ast))
    var col = ast[0];
    var c = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(col, _context);

    var resolveValue = function resolveValue(v) {
      if (shouldQuote(col, v)) v = quoteLiteral(v);
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(v, _context);
    };

    if (ast.length === 1) {
      return '1=1';
    } else if (ast.length === 2) {
      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(ast[1]) && ast[1][0] === "[") {
        var a = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[1], _context);
        ast = [c].concat(a);
      } else {
        var v = resolveValue(ast[1]);
        return v === null ? "".concat(c, " IS NOT NULL") : "".concat(c, " != ").concat(v);
      }
    } // check if we have null in the array of values...


    var resolvedV = ast.slice(1).map(function (el) {
      return resolveValue(el);
    }).filter(function (el) {
      return el !== null;
    });
    var hasNull = resolvedV.length < ast.length - 1;
    var ret = "".concat(c, " NOT IN (").concat(resolvedV.join(', '), ")");
    if (hasNull) ret = "".concat(ret, " AND ").concat(c, " IS NOT NULL");
    return ret;
  }); //console.log('CONTEXT!', _context['()'])

  return _ctx;
}

function extend_context_for_order_by(_context, _cfg) {
  // создаём контекст с двумя макросами + и -, а они вызовут обычный контекст....
  // можно пробовать переопределить реализацию функции column и поиска литералов/алиасов
  // но пока что будет так 
  var aliasContext = [// 
  {
    "colref": __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (col) {
      /* col[0] содержит ровно то, что было в изначальном конфиге на входе!
      */
      //console.log("NEW COLREF!!!:", JSON.stringify(col))

      /*
        Postgresql: order by random()
        Greenplum:  order by random()
        Oracle:     order by dbms_random.value()
        MS SQL:     order by newid()
        Mysql:      order by rand()
        Clickhouse: order by rand()
        DB2:        order by rand()
        */
      if (col[0] === 'rand()') {
        var tdb = _context[0]._target_database;

        if (tdb === 'postgresql') {
          return 'random()';
        } else if (tdb === 'oracle') {
          return 'dbms_random.value()';
        } else if (tdb === 'sqlserver') {
          return 'newid()';
        } else {
          return 'rand()';
        }
      }

      if (col[0] in _cfg["_aliases"]) {
        if (upper_by_default(_context[0]._target_database) || should_quote_alias(col[0])) {
          return "\"".concat(col[0], "\"");
        } else {
          return col[0];
        }
      }

      var parts = col[0].split('.');

      if (parts.length === 3) {
        return "".concat(parts[1], ".").concat(parts[2]); //return parts[2]
      } else {
        if (upper_by_default(_context[0]._target_database) || should_quote_alias(col[0])) {
          // пытаемся полечить проблему Oracle UPPER CASE имён
          //console.log(`HOPP ${JSON.stringify(_cfg["_aliases"])}`)
          // в алиасах у нас нет такого столбца
          return "\"".concat(col[0], "\"");
        }
      }

      return col[0];
      /*
      if (_context[0]["_columns"][key]) return _context["column"](key)
      if (_context[0]["_columns"][default_ds][default_cube][key]) return _context["column"](`${default_ds}.${default_cube}.${key}`)
      
      return col*/
    }),
    "column": __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (col) {
      /* примерно на 222 строке есть обработчик-резолвер литералов, там хардкодный вызов функции 
        if (_context["_columns"][key]) return _context["column"](key)
        то есть вызывается функция column в явном виде, а тут мы просто печатаем, что нам прислали.
         FIXME: ИМЕЕТ смысл сделать функцию colref() и типа ссылаться на какой-то столбец.
        И тут мы можем умно резолвить имена столбцов и алиасы и подставлять то, что нам надо.
        ЛИБО объявить тут функцию как МАКРОС и тогда уже правильно отработать column
        NEW COL: ["ch.fot_out.dor1"]
        console.log("NEW COL", col)
         _context[0]["_columns"] содержит описания из БД
      */
      var parts = col[0].split('.');

      if (parts.length === 3) {
        return "".concat(parts[1], ".").concat(parts[2]); //return parts[2]
      } else {
        return col[0];
      }
      /*
      if (_context[0]["_columns"][key]) return _context["column"](key)
      if (_context[0]["_columns"][default_ds][default_cube][key]) return _context["column"](`${default_ds}.${default_cube}.${key}`)
      
      return col*/

    })
  }].concat(_toConsumableArray(_context));
  var _ctx = {};
  _ctx["+"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[0], aliasContext);
  });
  _ctx["-"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["c" /* makeSF */])(function (ast) {
    return "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast[0], aliasContext), " DESC");
  });
  return _ctx;
}
/* В итоге у нас получается явный GROUP BY по указанным столбцам-dimensions и неявный group by по всем остальным dimensions куба.
 Свободные дименшены могут иметь мембера ALL, и во избежание удвоения сумм, требуется ВКЛЮЧИТЬ мембера ALL в суммирование как некий кэш.
 Другими словами, по ВСЕМ свободным дименшенам, у которых есть мембер ALL (см. конфиг) требуется добавить фильтр dimX = 'ALL' !
  Также можно считать агрегаты на лету, но для этого требуется ИСКЛЮЧИТЬ memberALL из агрегирования!!!
  Для указанных явно дименшенов доп. условий не требуется, клиент сам должен задать фильтры и понимать последствия.
 В любом случае по group by столбцам не будет удвоения, memberAll будет явно представлен отдельно в результатах
*/


function inject_all_member_filters(_cfg, columns) {
  /* _cfg.filters может быть {} а может быть [{},{}] и тут у нас дикий код */
  var processed = {};

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(_cfg["filters"])) {
    _cfg["filters"] = get_all_member_filters(_cfg, columns, _cfg["filters"]);
  } else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_cfg["filters"])) {
    _cfg["filters"] = _cfg["filters"].map(function (obj) {
      return get_all_member_filters(_cfg, columns, obj);
    });
  }

  return _cfg;
}

function inject_parallel_hierarchy_filters(_cfg, columns) {
  /* _cfg.filters может быть {} а может быть [{},{}] и тут у нас дикий код */
  var processed = {};

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(_cfg["filters"])) {
    _cfg["filters"] = get_parallel_hierarchy_filters(_cfg, columns, _cfg["filters"]);
  } else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_cfg["filters"])) {
    _cfg["filters"] = _cfg["filters"].map(function (obj) {
      return get_parallel_hierarchy_filters(_cfg, columns, obj);
    });
  }

  return _cfg;
}

function get_parallel_hierarchy_filters(_cfg, columns, _filters) {
  //console.log("FILTERS", JSON.stringify(_filters))
  //console.log("columns", JSON.stringify(columns))
  // Ищем dimensions, у которых тип parallel и они ещё не указаны в фильтрах
  // ПО ВСЕМ СТОЛБАМ!!!
  Object.values(columns).map(function (el) {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(el.config)) {
      // если это параллельный дименшн и нет явно фильтра по нему
      //if (el.config.hierarchyType === 'parallel' && !isArray(_filters[el.id])){
      // НА САМОМ ДЕЛЕ ЭТО sharedDimension ???? conflicting
      // если есть значение по умолчанию, и не было явно указано фильтров, то ставим значение по умолчанию
      if (el.config.defaultValue !== undefined && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_filters[el.id])) {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(el.config.defaultValue)) {
          // This is parsed lpe AST
          _filters[el.id] = el.config.defaultValue;
        } else {
          _filters[el.id] = ["=", el.config.defaultValue];
        }
      }
    }
  });
  return _filters;
}
/*
Если у нас есть group by, то используем memeberALL,

Потом, к тем фильтрам, которые получились, добавляем фильтры по столбцам, где есть ключ "hierarchy_type":"parallel"
и делаем фильтр "default_value", НО ТОЛЬКО ЕСЛИ В ЗАПРОСЕ НЕТУ КЛЮЧА "distinct": "force"

*/


function get_all_member_filters(_cfg, columns, _filters) {
  var processed = {}; // лучше его использовать как аккумулятор для накопления ответа, это вам не Clojure!

  var h = {}; // заполняем хэш h длинными именами столбцов, по которым явно есть GROUP BY

  _cfg["_group_by"].map(function (el) {
    el.columns.map(function (e) {
      return h[e] = true;
    });
  }); //console.log("FILTERS", JSON.stringify(_filters))
  //console.log("columns", JSON.stringify(columns))
  // Ищем dimensions, по которым явно указан memeber ALL, и которых НЕТ в нашем явном списке...
  // ПО ВСЕМ СТОЛБАМ!!!


  Object.values(columns).map(function (el) {
    if (h[el.id] === true) {
      return; // столбец уже есть в списке group by!
    }

    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(el.config)) {
      // Если для столбца прописано в конфиге follow=[], и нашего столбца ещё нет в списке фильтров, то надо добавить фильтр
      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(el.config.follow) && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_filters[el.id])) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = el.config.follow[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var alt = _step.value;
            // names should skip datasource
            var altId = "".concat(_cfg.ds, ".").concat(alt); //console.log(`###checking ${el.config.follow} ${altId}`, JSON.stringify(_filters[el.id]) )
            // По столбцу за которым мы следуем есть условие

            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_filters[altId])) {
              if (_filters[altId].length == 2) {
                // у столбца описан memberAll
                if (columns[altId].config.memberALL === null || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(columns[altId].config.memberALL) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["f" /* isNumber */])(columns[altId].config.memberALL)) {
                  var f = _filters[altId];

                  if (f[1] == columns[altId].config.memberALL) {
                    // Есть условие по столбцу, которому мы должны следовать, надо добавить такое же условие!
                    _filters[el.id] = [f[0], f[1]];
                    break;
                  }
                }
              } // так как есть условие по основному столбцу, мы не знаем точно, какое наше значение ему соответствует, 
              // и чтобы не добавлялся memberALL ниже, мы пропускаем наш столбец


              return;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      if (el.config.memberALL === null || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(el.config.memberALL) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["f" /* isNumber */])(el.config.memberALL)) {
        // есть значение для члена ALL, и оно в виде строки или IS NULL
        // добавляем фильтр, но только если по этому столбцу нет другого фильтра (который задали в конфиге)!!!
        // NOTE: по ключу filters ещё не было нормализации !!! 
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_filters[el.id])) {
          // Также нужно проверить нет ли уже фильтра по столбцу, который является altId
          if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(el.config.altDimensions)) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = el.config.altDimensions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _alt = _step2.value;
                // names must skip datasource, but may skip cube, let's add our cube if it is missed...
                var _altId = '';

                if (_alt.includes('.')) {
                  _altId = "".concat(_cfg.ds, ".").concat(_alt);
                } else {
                  _altId = "".concat(_cfg.ds, ".").concat(_cfg.cube, ".").concat(_alt);
                } //console.log("ALT", JSON.stringify(altId))


                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_filters[_altId]) || h[_altId] === true) {
                  // уже есть условие по столбцу из altId, не добавляем новое условие
                  // но только в том случае, если у нас явно просят этот столбец в выдачу
                  // if ( h[])
                  return;
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          } //console.log(`!!!!checking  ${el.id} children`, JSON.stringify(el.config.children) )
          // Если есть дочерние столбцы, то надо проверить нет ли их в GROUP BY или В Фильтрах


          if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(el.config.children)) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = el.config.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _alt2 = _step3.value;
                var _altId2 = '';

                if (_alt2.includes('.')) {
                  _altId2 = "".concat(_cfg.ds, ".").concat(_alt2);
                } else {
                  _altId2 = "".concat(_cfg.ds, ".").concat(_cfg.cube, ".").concat(_alt2);
                }

                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_filters[_altId2]) || h[_altId2] === true) {
                  // children уже специфицированы, не надо добавлять меня!
                  return;
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }

          _filters[el.id] = ["=", el.config.memberALL];
        }
      }
    }
  }); //console.log("FILTERS AFTER", JSON.stringify(_filters))

  return _filters;
}
/* возвращает все или некоторые фильтры в виде массива
если указаны required_columns и negate == falsy, то возвращает фильтры, соответсвующие required_columns
если указаны required_columns и negate == trufy, то возвращает все, кроме указанных в required_columns фильтров
Это спец. функционал для апробации
*/


function get_filters_array(context, filters_array, cube, required_columns, negate) {
  //console.log("get_filters_array " + JSON.stringify(filters_array))
  //console.log(`get_filters_array ${negate} required_columns: ` + JSON.stringify(required_columns))
  //console.log("======")
  var comparator = function comparator(k) {
    return k !== "";
  };

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(required_columns) && required_columns.length > 0) {
    required_columns = required_columns.map(function (el) {
      return cube + '.' + el;
    });

    if (negate) {
      comparator = function comparator(k) {
        return k !== "" && !required_columns.includes(k);
      };
    } else {
      comparator = function comparator(k) {
        return k !== "" && required_columns.includes(k);
      };
    }
  }

  var ret = filters_array.map(function (_filters) {
    var part_where = null;
    var pw = Object.keys(_filters).filter(function (k) {
      return comparator(k);
    }).map(function (key) {
      // специальная функция `ignore(me)` = которая ничего не делает, но является меткой для
      // and or not
      var _filters$key = _toArray(_filters[key]),
          op = _filters$key[0],
          args = _filters$key.slice(1);

      return [op, ["ignore(me)", ["column", key]]].concat(_toConsumableArray(args));
      /*
      let el = _filters[key].slice(0)
      el.splice(1,0,["ignore(me)",["column",key]])
      return el*/
    }); //console.log("step:" + JSON.stringify(pw))
    // условия по пустому ключу "" подставляем только если у нас генерация полного условия WHERE,
    // а если это filter(col1,col2) то не надо

    if (required_columns === undefined || negate === true) {
      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_filters[""])) {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(pw)) {
          pw.push(_filters[""]);
        } else {
          pw = _filters[""];
        }
      }
    }

    if (pw.length > 0) {
      var wh = ["and"].concat(pw); // console.log("WHERE", JSON.stringify(wh))
      // возможно, тут нужен спец. контекст с правильной обработкой or/and  функций.
      // ибо первым аргументом мы тут всегда ставим столбец!!! 
      // console.log('*****: ' + JSON.stringify(wh))

      part_where = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(JSON.parse(JSON.stringify(wh)), context); //console.log('.....: ' + JSON.stringify(filters_array))
    } else {
      part_where = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(JSON.parse(JSON.stringify(pw)), context);
    }

    return part_where;
  }).filter(function (el) {
    return el !== null && el.length > 0;
  }); //console.log("RET: " + ret)
  //console.log(JSON.stringify(filters_array))
  //console.log("---------------------------")

  return ret;
}
/* Добавляем ключ "_aliases", чтобы можно было легко найти столбец по алиасу */


function cache_alias_keys(_cfg) {
  /*
  "_columns":[{"columns":["ch.fot_out.dt"],"expr":"(NOW() - INERVAL '1 DAY')"},
   {"columns":["ch.fot_out.branch4"],"expr":"fot_out.branch4"},{"columns":[],"expr":"fot_out.ss1"},{"columns":
   ["ch.fot_out.v_main","ch.fot_out.v_rel_fzp"],"agg":true,"alias":"summa","expr":"sum((fot_out.v_main + utils.func(fot_out.v_rel_fzp)) / 100)"},
   {"columns":["ch.fot_out.obj_name"],"alias":"new","expr":"fot_out.obj_name"},{"columns":["ch.fot_out.v_rel_pp"],"agg":true,"expr":
   "sum(fot_out.v_rel_pp)"},{"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr":
   "avg(fot_out.indicator_v + fot_out.v_main)"}]
   */
  _cfg["_aliases"] = {};

  _cfg["_columns"].map(function (el) {
    var k = el["alias"];

    if (k && k.length > 0) {
      // включаем это в кэш
      if (_cfg["_aliases"][k]) {
        // EXCEPTION, duplicate aliases
        throw Error("Duplicate alias ".concat(k, " for ").concat(JSON.stringify(el)));
      }

      _cfg["_aliases"][k] = el;
    } else {// SKIPPED, no Alias found !!!
    }
  }); //console.log("######", JSON.stringify(_cfg))


  return _cfg;
} //  но возможно для teradata и oracle мы захотим брать в двойные кавычки...


function genereate_subtotals_group_by(cfg, group_by_list) {
  var subtotals = cfg["subtotals"];
  var ret = {
    'group_by': '',
    'select': [] //console.log(`GROUP BY: ${JSON.stringify(subtotals)} ${JSON.stringify(group_by_list)}`)

  };

  if (group_by_list.length === 0) {
    return ret;
  } //cfg["_group_by"].map(el => console.log(JSON.stringify(el)))
  //subtotals.map(el => console.log(JSON.stringify(el)))


  var group_by_exprs = group_by_list.map(function (el) {
    return el.expr;
  });
  var group_by_aliases = group_by_list.map(function (el) {
    return el.alias;
  }).filter(function (el) {
    return el !== undefined;
  });
  var group_by_sql = group_by_exprs.join(', ');

  var check_column_existence = function check_column_existence(col) {
    var i = group_by_exprs.indexOf(col);

    if (i === -1) {
      i = group_by_exprs.indexOf("\"".concat(col, "\""));

      if (i === -1) {
        i = group_by_aliases.indexOf(col);

        if (i === -1) {
          i = group_by_aliases.indexOf("\"".concat(col, "\"")); //FIXME - не уверен что в алиасы попадут заквотированные имена!

          if (i === -1) {
            //console.log(`GROUP BY for ${col} : ${JSON.stringify(group_by_list)}`)
            throw Error("looking for column ".concat(col, " listed in subtotals, but can not find in group_by"));
          }
        }
      }
    }
  }; // {"options": ["CrossSubtotals"] }


  var cross_subtotals_combinations = function cross_subtotals_combinations() {
    return subtotals.map(function (col) {
      check_column_existence(col); //console.log(JSON.stringify(group_by_list.filter(c => c !== col).join(', ')))

      return group_by_list.filter(function (c) {
        return c.expr !== col && c.expr !== "\"".concat(col, "\"") && c.alias !== col && c.alias !== "\"".concat(col, "\"");
      }).map(function (c) {
        return c.expr;
      }).join(', ');
    });
  };

  var hier_subtotals_combinations = function hier_subtotals_combinations() {
    // check existance of range() column, we should include it as first column in every grouping set!
    var range_cols = group_by_list.filter(function (el) {
      return el.is_range_column === true;
    });
    var range_col = range_cols[0];
    var accum_val = range_col ? [range_col.expr] : [];
    var res = subtotals.reduce(function (accum, col) {
      check_column_existence(col); //console.log(`accum: ${JSON.stringify(accum)} + col: ${col} + first: ${JSON.stringify(accum.slice(-1).pop())}`)

      var match = group_by_list.filter(function (c) {
        return c.expr == col || c.expr == "\"".concat(col, "\"") || c.alias == col || c.alias == "\"".concat(col, "\"");
      });

      if (match.length == 0) {
        throw Error("hier_subtotals_combinations: looking for column ".concat(col, " listed in subtotals, but can not find in group_by"));
      } //console.log(`FOUND: ${JSON.stringify(match)} in ${JSON.stringify(group_by_list)}`)


      return accum.concat([accum.slice(-1).pop().concat(match[0].expr)]);
    }, [accum_val]);
    res.shift();
    return res;
  };

  var conf = cfg["config"] || {};
  var subtotals_combinations = conf["subtotalsMode"] == "AllButOneInterleaved" ? cross_subtotals_combinations : hier_subtotals_combinations;
  ret.group_by = "\nGROUP BY GROUPING SETS ((".concat(group_by_sql, '),', "\n                        (".concat(subtotals_combinations().join("),\n                        ("), ')'), "\n                       )"); // делать дедупликацию пока что сложно, поэтому временно сделаем distinct
  // FIXME

  if (conf["subtotalsMode"] != "AllButOneInterleaved") {
    if (group_by_list.length == subtotals.length) {
      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(cfg["distinct"])) {
        // ou! changing global hash :()
        cfg["distinct"] = [];
      }
    }
  } // This might be a hard problem:
  // {"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr": "avg(fot_out.indicator_v + fot_out.v_main)"}


  var get_alias = function get_alias(el) {
    var r;

    if (el.alias !== undefined) {
      r = el.alias;
    } else {
      r = el.expr;
    }

    if (r.startsWith('"')) {
      return r.replace(/^"/, '"∑');
    } else {
      return "\"\u2211".concat(r, "\"");
    }
  };

  ret.select = group_by_list.map(function (el) {
    return "GROUPING(".concat(el.expr, ") AS ").concat(get_alias(el));
  });
  return ret;
}
/* в _vars могут быть доп. настройки для контекста.
Вообще говоря это должен быть настоящий контекст! с помощью init_koob_context() мы дописываем в этот 
контекст новые ключи, типа _columns, _aliases и т.д. Снаружи мы можем получить доп. фильтры. в ключе
_access_filters

_vars["_dimensions"] соддержит уже выбранные из базы записи из koob.dimensions для нужного куба
_vars["_cube"] содержит уже выбранную запись из базы из koob.cubes для нужного куба
*/


function generate_koob_sql(_cfg, _vars) {
  var _context = _vars;

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(_cfg["coefficients"])) {
    _context["_coefficients"] = _cfg["coefficients"];
  }
  /*
  {
  "with":"czt.fot",
    "filters": {
    "dor1": ["=", "ГОРЬК"],
    "dor2": ["=", "ПОДГОРЬК"],
    "dor4": ["=", null],
    "dor5": ["=", null],
    "dt": ["BETWEEN", "2020-01", "2020-12"],
    "sex_name": ["=", "Мужской"],
    "": [">", ["+",["col1", "col2"]], 100]
  },
  "having": {
    "dt": [">","2020-08"],
  },
  "columns": ["dor3", 'sum(val3):summa', {"new":"old"}, ["sum", ["column","val2"]],  {"new",  ["avg", ["+",["column","val2"],["column","val3"]]} ],
  "sort": ["-dor1","val1",["-","val2"],"-czt.fot.dor2"] 
  }
  */


  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(_vars["_data_source"]) && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(_vars["_data_source"]["url"])) {
    var url = _vars["_data_source"]["url"];
    var matched = url.match(/^jdbc\:([^:]+)\:/); //console.log(`JSON DATA SOURCE URL MATCHED ${JSON.stringify(matched)}`)

    if (matched != null && matched.length > 1) {
      _context["_target_database"] = matched[1];
    } else {
      _context["_target_database"] = 'postgresql';
    }
  }

  var ds_info = {};

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(_cfg["with"])) {
    var w = _cfg["with"];
    _context["_columns"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["c" /* reports_get_columns */])(w, _vars["_dimensions"]);
    _context["_aliases"] = {}; // will be filled while we are parsing columns
    // это корректный префикс: "дс.перв"."куб.2"  так что тупой подсчёт точек не катит.

    if (w.match(/^("[^"]+"|[^\.]+)\.("[^"]+"|[^\.]+)$/) !== null) {
      _cfg = normalize_koob_config(_cfg, w, _context);

      if (_context["_target_database"] === undefined) {
        // это выполняется в БД на лету
        ds_info = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["d" /* get_data_source_info */])(w.split('.')[0]);
        _context["_target_database"] = ds_info["flavor"];
      } else {
        //Это выполняется в тестах
        ds_info = {
          "flavor": _context["_target_database"]
        };
      }
    } else {
      // это строка, но она не поддерживается, так как либо точек слишком много, либо они не там, либо их нет
      throw new Error("Request contains with key, but it has the wrong format: ".concat(w, " Should be datasource.cube with exactly one dot in between."));
    }
  } else {
    throw new Error("Default cube must be specified in with key");
  }

  if (_cfg["columns"].length === 0) {
    throw new Error("Empty columns in the request. Can not create SQL.");
  }

  _context = init_koob_context(_context, _cfg["ds"], _cfg["cube"]); //console.log("NORMALIZED CONFIG FILTERS: ", JSON.stringify(_cfg))
  //console.log("NORMALIZED CONFIG COLUMNS: ", JSON.stringify(_cfg["columns"]))

  /*
    while we evaluating each column, koob_context will fill JSON structure in the context like this:
   {
     expr: "sum((fot.val3+fot.val1)/100) as summa",
     alias: "summa",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true
   }
    For window func clickhouse flavor we may get this inner/outer SQL:
  {
     expr: "runningAccumulate(mnt, (comp_code,gl_account)) as col1",
     alias: "col1",
     columns: ["czt.fot.val3","czt.fot.val1"],
     agg: true,
     window: true,
     inner_expr: "initializeAggregation('sumState',sum(s2.deb_cre_lc )) as mnt",
     inner_alias: 'mnt'
   } 
  */

  var columns_s = [];
  var global_only1 = false;
  var global_joins = [];

  var columns = _cfg["columns"].map(function (el) {
    // eval should fill in _context[0]["_result"] object
    // hackers way to get results!!!!
    _context[0]["_result"] = {
      "columns": []
    };
    var r = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(el, _context);
    var col = _context[0]["_result"];

    if (col["only1"] === true) {
      global_only1 = true;
    }

    columns_s.push(col);

    if (col["alias"]) {
      _context[0]["_aliases"][col["alias"]] = col;
    }

    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(col["join"])) {
      // Нужно запомнить условия для JOIN
      var join = col["join"];

      if (join["type"] !== 'inner') {
        throw new Error("Only inner join is supported.");
      }
      /* может быть понадобится
      if (col["is_range_column"] === true) {
        // try to fix where expr using real alias
        join.filters[col.alias] = join.filters["koob__range__"]
        delete join.filters["koob__range__"]
      }*/


      global_joins.push(join); //console.log(`HOY! ${JSON.stringify(col)}`)
      // FIXME: keys might collide!!! do not override!

      _cfg["filters"] = _objectSpread({}, _cfg["filters"], join["filters"]);
    } //FIXME: we should have nested settings for inner/outer 
    // Hope aliases will not collide!


    if (col["outer_alias"]) {
      _context[0]["_aliases"][col["outer_alias"]] = col;
    }

    return r;
  });

  _context[0]["_result"] = null;
  _cfg["_aliases"] = _context[0]["_aliases"]; //console.log("ALIASES" + JSON.stringify(_cfg["_aliases"]))

  var has_window = null;

  for (var i = 0; i < columns.length; i++) {
    columns_s[i]["expr"] = columns[i];

    if (!has_window && columns_s[i]["window"]) {
      //FIXME: for now store here usefull info about order by !!!
      // it will be used later on the SQL generation stage
      has_window = columns_s[i]["inner_order_by_excl"];
    }
  }

  for (var i = 0; i < columns_s.length; i++) {
    // Also, try to resolve unresolved aliases
    //console.log("ITER0 " + JSON.stringify(columns_s[i]))
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(columns_s[i]["unresolved_aliases"])) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = columns_s[i]["unresolved_aliases"][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var al = _step4.value;
          var col = _cfg["_aliases"][al]; //console.log("ITER1 " + JSON.stringify(col))

          if (col) {
            if (col.agg) {
              // we have alias to the agg func, do the magic
              columns_s[i]["agg"] = true;
              columns_s[i]["outer_expr"] = columns_s[i]["expr"]; // so we can skip it in the inner select...

              columns_s[i]["expr"] = null;
              break;
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  } // try to make transitive agg
  // FIXME: try to resolve full column names as well!


  for (var _i = 0; _i < columns_s.length; _i++) {
    var el = columns_s[_i];

    if (el["agg"] !== true) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = el["columns"][Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var al = _step6.value;
          var col = _cfg["_aliases"][al];

          if (col) {
            if (col.agg) {
              el["agg"] = true;
              break;
            }
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }
  } // ищем кандидатов для GROUP BY и заполняем оригинальную структуру служебными полями


  _cfg["_group_by"] = [];
  _cfg["_measures"] = [];
  columns_s.map(function (el) {
    return el["agg"] === true ? _cfg["_measures"].push(el) : _cfg["_group_by"].push(el);
  });
  _cfg["_columns"] = columns_s; //console.log("RES ", JSON.stringify(_cfg["_columns"]))

  if (_cfg["_measures"].length === 0) {
    // do not group if we have no aggregates !!!
    _cfg["_group_by"] = [];
  } //console.log("GBY ", JSON.stringify(_cfg["_group_by"]))

  /* В итоге у нас получается явный GROUP BY по указанным столбцам-dimensions и неявный group by по всем остальным dimensions куба.
   Свободные дименшены могут иметь мембера ALL, и во избежание удвоения сумм, требуется ВКЛЮЧИТЬ мембера ALL в суммирование как некий кэш.
   Другими словами, по ВСЕМ свободным дименшенам, у которых есть мембер ALL (см. конфиг) требуется добавить фильтр dimX = 'ALL' !
    Для указанных явно дименшенов доп. условий не требуется, клиент сам будет разбираться с результатом
  */


  var cube_query_template = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__utils_utils__["e" /* reports_get_table_sql */])(ds_info["flavor"], "".concat(_cfg["ds"], ".").concat(_cfg["cube"]), _vars["_cube"]);
  /* Если есть хотя бы один явный столбец group_by, а иначе, если просто считаем агрегаты по всей таблице без группировки по столбцам */

  if (_cfg["options"].includes('!MemberALL') === false && (_cfg["_group_by"].length > 0 || _cfg["_measures"].length > 0)) {
    _cfg = inject_all_member_filters(_cfg, _context[0]["_columns"]);
  }

  if (_cfg["options"].includes('!ParallelHierarchyFilters') === false) {
    _cfg = inject_parallel_hierarchy_filters(_cfg, _context[0]["_columns"]);
  } // at this point we will have something like this:

  /*
   {"ds":"ch",
   "cube":"fot_out",
   "filters":{"ch.fot_out.dor1":["=","ГОРЬК"],"ch.fot_out.dor2":["=","ПОДГОРЬК"],"ch.fot_out.dor4":["=",null],
   "ch.fot_out.dor5":["=",null],"ch.fot_out.dt":["BETWEEN","2020-01","2020-12"],"ch.fot_out.sex_name":["=","Мужской"],"ch.fot_out.pay_name":
   ["=",null]},
   "having":{"ch.fot_out.dt":[">","2020-08"]},
   "columns":[["column","ch.fot_out.dt"],["column","ch.fot_out.branch4"],
   ["column","fot_out.ss1"],[":",["sum",["/",["()",["+","v_main",["->","utils",["func","v_rel_fzp"]]]],100]],"summa"],[":",
   ["column","ch.fot_out.obj_name"],"new"],["sum",["column","v_rel_pp"]],[":",["avg",["+",["column","ch.fot_out.indicator_v"],["column","v_main"]]],
   "new"]],"sort":[["-",["column","ch.fot_out.dor1"]],["+",["column","val1"]],["-",["column","val2"]],["-",["column","czt.fot.dor2"]],
   ["+",["column","summa"]]],
   "_group_by":[{"columns":["ch.fot_out.dt"],"expr":"(NOW() - INERVAL '1 DAY')"},{"columns":["ch.fot_out.branch4"],
   "expr":"fot_out.branch4"},{"columns":[],"expr":"fot_out.ss1"},{"columns":["ch.fot_out.obj_name"],"alias":"new","expr":"fot_out.obj_name"}],
   "_measures":[{"columns":["ch.fot_out.v_main","ch.fot_out.v_rel_fzp"],"agg":true,"alias":"summa","expr":
   "sum((fot_out.v_main + utils.func(fot_out.v_rel_fzp)) / 100)"},{"columns":["ch.fot_out.v_rel_pp"],"agg":true,"expr":
   "sum(fot_out.v_rel_pp)"},{"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr":
   "avg(fot_out.indicator_v + fot_out.v_main)"}],
   "_columns":[{"columns":["ch.fot_out.dt"],"expr":"(NOW() - INERVAL '1 DAY')"},
   {"columns":["ch.fot_out.branch4"],"expr":"fot_out.branch4"},{"columns":[],"expr":"fot_out.ss1"},{"columns":
   ["ch.fot_out.v_main","ch.fot_out.v_rel_fzp"],"agg":true,"alias":"summa","expr":"sum((fot_out.v_main + utils.func(fot_out.v_rel_fzp)) / 100)"},
   {"columns":["ch.fot_out.obj_name"],"alias":"new","expr":"fot_out.obj_name"},{"columns":["ch.fot_out.v_rel_pp"],"agg":true,"expr":
   "sum(fot_out.v_rel_pp)"},{"columns":["ch.fot_out.indicator_v","ch.fot_out.v_main"],"agg":true,"alias":"new","expr":
   "avg(fot_out.indicator_v + fot_out.v_main)"}]}
  */
  // we populate it dynamically now!
  //_cfg = cache_alias_keys(_cfg)
  // let's get SQL from it! BUT what about window functions ???


  if (has_window) {
    if (_context[0]["_target_database"] != 'clickhouse') {
      throw Error("No Window functions support for flavor: ".concat(_context[0]["_target_database"]));
    } // Try to replace column func to return short names!


    _context[0]["column"] = function (col) {
      // считаем, что сюда приходят только полностью резолвенные имена с двумя точками...
      var c = _context[0]["_columns"][col];

      if (c) {
        var parts = col.split('.');

        if (parts[2].localeCompare(c.sql_query, undefined, {
          sensitivity: 'accent'
        }) === 0) {
          // we have just column name, prepend table alias !
          return "".concat(c.sql_query); //return `${parts[1]}.${c.sql_query}`
        } else {
          return "(".concat(c.sql_query, ")");
        }
      } //console.log("COL FAIL", col)
      // возможно кто-то вызовет нас с коротким именем - нужно знать дефолт куб!!!
      //if (_context["_columns"][default_ds][default_cube][key]) return `${default_cube}.${key}`;


      return col;
    };
  }

  var where = '';
  var part_where = '1=1';
  var filters_array = _cfg["filters"];

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(filters_array)) {
    filters_array = [filters_array];
  } //_context[0]["column"] - это функция для резолва столбца в его текстовое представление


  filters_array = get_filters_array(_context, filters_array, ''); // access filters

  var filters = _context[0]["_access_filters"];
  var ast = []; //console.log("WHERE access filters: ", JSON.stringify(filters))

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["e" /* isString */])(filters) && filters.length > 0) {
    var ast = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_20__lpep__["a" /* parse */])("expr(".concat(filters, ")"));
    ast.splice(0, 1, '()'); // replace expr with ()
  } else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(filters) && filters.length > 0) {
    if (filters[0] === 'expr') {
      filters[0] = '()';
      ast = filters;
    } else if (filters[0] !== '()') {
      ast = ['()', filters];
    }
  } else {} //warning
  //console.log('Access filters are missed.')
  //console.log("WHERE access filters AST", JSON.stringify(ast))


  var access_where = '';

  if (ast.length > 0) {
    // array
    access_where = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast, _context);
  }

  var fw = '';

  if (filters_array.length == 1) {
    fw = filters_array[0];
  } else if (filters_array.length > 1) {
    fw = "(".concat(filters_array.join(")\n   OR ("), ")");
  }

  if (fw.length > 0) {
    if (access_where.length > 0) {
      fw = "(".concat(fw, ")\n   AND\n   ").concat(access_where);
    }
  } else {
    if (access_where.length > 0) {
      fw = access_where;
    }
  }

  if (cube_query_template.config.is_template && cube_query_template.config.skip_where) {
    // не печатаем часть WHERE, даже если она и должна быть, так как в конфиге куба нас просят
    // этого не делать. 
    if (fw.length > 0) {
      part_where = fw;
    }
  } else {
    if (fw.length > 0) {
      where = "\nWHERE ".concat(fw);
      part_where = fw;
    }
  } // для teradata limit/offset 


  var global_extra_columns = []; // Для Oracle

  var global_generate_3_level_sql = false;
  var top_level_where = ''; // for oracle RANGE && LIMIT

  var group_by = _cfg["_group_by"].map(function (el) {
    return el.expr;
  }); // нужно дополнить контекст для +,- и суметь сослатся на алиасы!


  var order_by_context = extend_context_for_order_by(_context, _cfg); //console.log("SORT:", JSON.stringify(_cfg["sort"]))

  var order_by = _cfg["sort"].map(function (el) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(el, order_by_context);
  }); //console.log("ORDER BY:", JSON.stringify(order_by))
  // ORDER BY: ["perda","lead DESC","newid() DESC","newid()"]
  //console.log("SQL:", JSON.stringify(cube_query_template))


  var from = cube_query_template.query;
  var limit = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["f" /* isNumber */])(_cfg["limit"]) ? " LIMIT ".concat(_cfg["limit"]) : '';
  var offset = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["f" /* isNumber */])(_cfg["offset"]) ? " OFFSET ".concat(_cfg["offset"]) : '';
  var limit_offset = '';

  if (_context[0]["_target_database"] === 'oracle') {
    //AHTUNG!! это же условие для WHERE FILTERS !!!
    var _w;

    if (limit) {
      if (offset) {
        _w = "\"koob__row__num__\" > ".concat(parseInt(_cfg["offset"]), " AND \"koob__row__num__\" <= (").concat(parseInt(_cfg["offset"]), " + ").concat(parseInt(_cfg["limit"]), ")");
      } else {
        _w = "\"koob__row__num__\" <= ".concat(parseInt(_cfg["limit"]));
      }
    } else if (offset) {
      _w = "\"koob__row__num__\" > ".concat(parseInt(_cfg["offset"]));
    }

    if (_w) {
      global_generate_3_level_sql = true;

      if (top_level_where.length > 3) {
        top_level_where = "".concat(top_level_where, " AND ").concat(_w);
      } else {
        top_level_where = "\nWHERE ".concat(_w);
      }
    }
  } else if (_context[0]["_target_database"] === 'sqlserver') {
    if (limit) {
      if (offset) {
        limit_offset = "\nOFFSET ".concat(parseInt(_cfg["offset"]), " ROWS FETCH NEXT ").concat(parseInt(_cfg["limit"]), " ROWS ONLY");
      } else {
        limit_offset = "\nOFFSET 0 ROWS FETCH NEXT ".concat(parseInt(_cfg["limit"]), " ROWS ONLY");
      }
    } else if (offset) {
      limit_offset = "\nOFFSET ".concat(parseInt(_cfg["offset"]), " ROWS");
    } // FIXME: кажется это надо делать абсолютно для всех БД
    // и надо с умом подбирать список столбцов


    if (limit_offset.length > 1 && order_by.length === 0) {
      order_by = ["1"];
    }
  } else if (_context[0]["_target_database"] === 'teradata' && (limit || offset)) {
    // Здесь нужно иметь под рукой сотрировку! если её нет, то надо свою выбрать
    var window_order_by;

    if (order_by.length === 0) {
      // надо использовать все столбцы, которые являются dimensions и лежать в group by ??? 
      //throw Error(`Teradata limit/offset without specified sorting order is not YET supported :-(`)
      if (_cfg["_group_by"].length === 0) {
        window_order_by = _cfg["_columns"].map(function (el) {
          if (el.alias) {
            return "\"".concat(el.alias, "\"");
          } else {
            return el.expr;
          }
        }).join(',');
      } else {
        window_order_by = _cfg["_group_by"].map(function (el) {
          return el.expr;
        }).join(',');
      }
    } else {
      window_order_by = order_by.join(', ');
    } //`ROW_NUMBER() OVER (order by ${window_order_by}) as koob__row__num__`


    var column = {
      "columns": [],
      "alias": "koob__row__num__",
      "expr": "ROW_NUMBER() OVER (order by ".concat(window_order_by, ")") // мы не можем добавлять это в общий список столбцов, так как нам потребуется ещё одна обёртка!
      // создаём пока переменную глобальную! но нам нужны вложенные SQL контексты, а не просто outer/inner
      //_cfg["_columns"].unshift(column)

    };
    global_extra_columns.unshift(column);

    if (limit) {
      //QUALIFY __row_num  BETWEEN 1 and 4;
      if (offset) {
        var left = parseInt(_cfg["offset"]) + 1;
        limit_offset = "\nQUALIFY koob__row__num__ BETWEEN ".concat(left, " AND ").concat(parseInt(_cfg["offset"]) + parseInt(_cfg["limit"]));
      } else {
        limit_offset = "\nQUALIFY koob__row__num__ <= ".concat(parseInt(_cfg["limit"]));
      }
    } else if (offset) {
      limit_offset = "\nQUALIFY koob__row__num__ > ".concat(parseInt(_cfg["offset"]));
    }
  } else {
    if (limit) {
      if (offset) {
        limit_offset = " LIMIT ".concat(parseInt(_cfg["limit"]), " OFFSET ").concat(parseInt(_cfg["offset"]));
      } else {
        limit_offset = " LIMIT ".concat(parseInt(_cfg["limit"]));
      }
    } else if (offset) {
      limit_offset = " OFFSET ".concat(parseInt(_cfg["offset"]));
    }
  }

  var ending = ''; // FIXME! Требуется использовать настройки куба, поле config.query_settings.max_threads
  //        Если в кубе нет настроек, то настройки из JDBC connect string сами применятся,
  //        на уровне драйвера !!! Нужна функция по получению инфы про куб (а у нас может быть несколько таблиц!!!)
  // if (isHash(_vars["_data_source"]) && isString(_vars["_data_source"]["url"]) ) {
  //if (_context[0]["_target_database"] === 'clickhouse'){
  // config->'_connection'->'options'->'max_threads'
  // ending = "\nSETTINGS max_threads = 1"
  //}

  var expand_outer_expr = function expand_outer_expr(el) {
    if (el["eval_expr"] === true) {
      //console.log("FOUND EVAL", JSON.stringify(el))
      // only one kind of expressions for now...
      // {"lpe_totals":{
      // "lpe_total_2":{"ast":["avg","v_rel_pp"],"expr":"avg(fot_out.v_rel_pp)"}}
      var expr = el.expr;

      for (var total in el.lpe_subtotals) {
        var hash = el.lpe_subtotals[total];
        expr = expr.replace("".concat(total, "()"), "(SELECT ".concat(hash["expr"], " FROM ").concat(from).concat(where, ")"));
      }

      return expr;
    } else {
      return el.expr;
    }
  };

  if (has_window) {
    // NOW WE NEED OUTER !
    var get_outer_expr = function get_outer_expr(el) {
      if (el.outer_expr) {
        if (el.outer_expr_eval) {
          if (el.eval_reference_to) {
            // resolve_reference!!
            var init = _cfg["_aliases"][el.eval_reference_to];
            return el.outer_expr.replace('resolve_alias()', init["alias"]);
          } else {
            // FIXME, currently we just do simple replace! love LISP: do eval!!!
            var part_columns = group_by.filter(function (el) {
              return el != excl_col;
            });
            part_columns = part_columns.length ? part_columns.map(function (el) {
              var p = el.split('.');
              return p[p.length - 1];
            }).join(', ') : '';

            if (part_columns === '') {
              part_columns = 'tuple(null)';
            } else {
              part_columns = "(".concat(part_columns, ")");
            }

            return el.outer_expr.replace('partition_columns()', part_columns);
          }
        } else {
          var parts = el.outer_expr.match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/);

          if (parts) {
            return parts[2];
          }

          return el.outer_expr;
        }
      } else {
        // FIXME: stupid Javascript IF
        if (el.agg === true && el.outerVerbatim !== true) {
          // try to just use alias or column name!!!
          //console.log("DEPARSE " + JSON.stringify(el))
          if (el.alias) {
            return el.alias;
          } else {
            var parts = el.columns[0].match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/);

            if (parts) {
              return parts[3];
            }
          }
        } else {
          var parts = el.expr.match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/);

          if (parts) {
            return parts[2];
          }
        }

        return el.expr;
      }
    };

    // assuming we are working for clickhouse only....
    // we should generate correct order_by, even though each window func may require it's own order by
    // FIXME: we use only ONE SUCH FUNC FOR NOW, IGNORING ALL OTHERS
    // skip all columns which are references to window funcs!
    var innerSelect = "SELECT "; // могут быть ньюансы квотации столбцов, обозначения AS и т.д. поэтому каждый участок приводим к LPE и вызываем SQLPE функции с адаптацией под конкретные базы

    innerSelect = innerSelect.concat(_cfg["_columns"].map(function (el) {
      //console.log('1: ' + JSON.stringify(el) + " alias:" + el.alias)
      if (el.expr === null) {
        return null;
      }

      if (el.alias) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = el.columns[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var part = _step5.value;
            //console.log('2 part:' + part)
            // if we reference some known alias
            var target = _cfg["_aliases"][part];

            if (target && target.window) {
              // if we reference window function, skip such column from inner select!
              return null;
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return quot_as_expression(_context[0]["_target_database"], el.expr, el.alias);
      } else {
        if (el.columns.length === 1) {
          var parts = el.columns[0].split('.');
          return quot_as_expression(_context[0]["_target_database"], el.expr, parts[2]);
        }

        return el.expr;
      }
    }).filter(function (el) {
      return el !== null;
    }).join(', '));

    var expand_column = function expand_column(col) {
      var cube_prefix = "".concat(_cfg["ds"], ".").concat(_cfg["cube"]);
      return col.match(/("[^"]+"|[^\.]+)\.("[^"]+"|[^\.]+)/) === null ? _context[0]._columns["".concat(cube_prefix, ".").concat(col)] ? "".concat(_cfg["cube"], ".").concat(col) : col : col;
    };

    var excl_col = expand_column(has_window); //console.log(`${_cfg["ds"]}.${_cfg["cube"]}` + " EXPANDING " + has_window + " to " + excl_col)
    //console.log(JSON.stringify(_context[0]["_columns"]))
    // Put excl_col to the last position, so running window will accumulate data over it!

    var inner_order_by = [];

    if (group_by.find(function (el) {
      return el === excl_col;
    })) {
      inner_order_by = group_by.filter(function (el) {
        return el !== excl_col;
      }).concat(excl_col);
    }

    inner_order_by = inner_order_by.length ? "\nORDER BY ".concat(inner_order_by.join(', ')) : '';
    var having = where.replace("WHERE", "HAVING");
    var inner_group_by = group_by.length ? "\nGROUP BY ".concat(group_by.join(', ')) : '';
    var inner = "".concat(innerSelect, "\nFROM ").concat(from).concat(inner_group_by).concat(having).concat(inner_order_by);
    var select = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_cfg["distinct"]) ? "SELECT DISTINCT " : "SELECT ";
    select = select.concat(_cfg["_columns"].map(function (el) {
      //console.log('outer1: ' + JSON.stringify(el) + " alias:" + el.alias)
      if (el.outer_alias) {
        return quot_as_expression(_context[0]["_target_database"], get_outer_expr(el), el.outer_alias);
      } else if (el.alias) {
        return quot_as_expression(_context[0]["_target_database"], get_outer_expr(el), el.alias);
      } else {
        if (el.columns.length === 1) {
          var parts = el.columns[0].match(/^("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)\.("[^"]+"|[A-Za-z_][\w]*)$/); //console.log(`outer2: ${get_outer_expr(el)}` + JSON.stringify(parts))

          if (parts) {
            return quot_as_expression(_context[0]["_target_database"], get_outer_expr(el), parts[3]);
          }

          return "".concat(get_outer_expr(el));
        }

        return "".concat(get_outer_expr(el));
      }
    }).filter(function (el) {
      return el !== null;
    }).join(', '));
    order_by = order_by.length ? "\nORDER BY ".concat(order_by.join(', ')) : '';
    return "".concat(select, "\nFROM (\n").concat(inner, "\n)").concat(order_by).concat(limit_offset).concat(ending);
  } else {
    // NOT WINDOW! normal SELECT
    //---------------------------------------------------------------------
    // могут быть ньюансы квотации столбцов, обозначения AS и т.д. поэтому каждый участок приводим к LPE и вызываем SQLPE функции с адаптацией под конкретные базы
    var normal_level_columns = _cfg["_columns"].map(function (el) {
      // It is only to support dictionaries for Clickhouse!!!
      // FIXME: switch to stacked SELECT idea
      if (el.outer_alias) {
        el.alias = el.outer_alias;
      }

      if (el.outer_expr) {
        el.expr = el.outer_expr;
      } /////////////////////////////////////////////////////
      //console.log("COLUMN:", JSON.stringify(el))

      /* v8.11 возвращает отдельные столбцы с GROUPING(col), generate_grouping больше не актуально */


      var generate_grouping = function generate_grouping(arg) {
        return expand_outer_expr(arg);
      };

      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_cfg["subtotals"])) {
        if (_context[0]["_target_database"] === 'clickhouse') {
          generate_grouping = function generate_grouping(arg) {
            var expanded = expand_outer_expr(arg);

            if (arg.agg === true) {
              return expanded;
            } else {
              // начиная с 22.6 появилась функция grouping
              // начиная с 22.9 она работает правильно, но есть проблема с алиасом на if(GROUPING())!!!
              // Это бага!!! даже в 22.12
              // Поэтому отключаем!!!
              // return `if(GROUPING(${expanded})=0,${expanded},NULL)`
              return expanded;
            }
          };
        } else if (_context[0]["_target_database"] === 'postgresql' ||
        /* есть проблема с генерацией SQL _context[0]["_target_database"]==='oracle' || */
        _context[0]["_target_database"] === 'teradata' || _context[0]["_target_database"] === 'sqlserver' || _context[0]["_target_database"] === 'vertica') {
          generate_grouping = function generate_grouping(arg) {
            var expanded = expand_outer_expr(arg);

            if (arg.agg === true) {
              return expanded;
            } else {
              return "CASE WHEN GROUPING(".concat(expanded, ")=0 THEN ").concat(expanded, " ELSE NULL END");
            }
          };
        }
      }

      if (el.alias) {
        return quot_as_expression(_context[0]["_target_database"], expand_outer_expr(el), el.alias);
      } else {
        if (el.columns.length === 1) {
          var parts = el.columns[0].split('.'); // We may have auto-generated columns, which has no dots in name!
          // COLUMN: {"columns":["ch.fot_out.hcode_name"],"expr":"hcode_name"}
          // COLUMN: {"columns":["koob__range__"],"is_range_column":true,"expr":"koob__range__","join":{

          if (parts.length === 3) {
            return quot_as_expression(_context[0]["_target_database"], expand_outer_expr(el), parts[2]);
          } else {
            return expand_outer_expr(el);
          }
        }

        return expand_outer_expr(el);
      }
    }).join(', ');

    order_by = order_by.length ? "\nORDER BY ".concat(order_by.join(', ')) : '';
    var select_tail = normal_level_columns;

    if (group_by.length == 0) {
      group_by = '';
    } else {
      if (_cfg["subtotals"] === 'cube') {
        if (_context[0]["_target_database"] === 'clickhouse') {
          group_by = "\nGROUP BY ".concat(group_by.join(', '), " WITH CUBE");
        } else {
          // postgresql
          group_by = "\nGROUP BY CUBE (".concat(group_by.join(', '), ")");
        }
      } else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_cfg["subtotals"])) {
        // FIXME: кажется только mysql не алё
        if (_context[0]["_target_database"] === 'postgresql' || _context[0]["_target_database"] === 'oracle' || _context[0]["_target_database"] === 'teradata' || _context[0]["_target_database"] === 'clickhouse' || _context[0]["_target_database"] === 'sqlserver' || _context[0]["_target_database"] === 'vertica') {
          var subtotals = genereate_subtotals_group_by(_cfg, _cfg["_group_by"]);
          group_by = subtotals.group_by;
          select_tail = "".concat(select_tail, ", ").concat(subtotals.select.join(', ')); // We need to add extra columns to the select as well
        } else {
          throw new Error("named subtotals are not yet supported for ".concat(_context[0]["_target_database"]));
        }
      } else {
        group_by = "\nGROUP BY ".concat(group_by.join(', '));
      }
    }

    select = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["d" /* isArray */])(_cfg["distinct"]) ? "SELECT DISTINCT " : "SELECT ";
    select = select.concat(select_tail);
    var final_sql = '';

    if (cube_query_template.config.is_template) {
      var except_replacer = function except_replacer(match, columns_text, offset, string) {
        var columns = columns_text.split(',');
        var filters_array = _cfg["filters"];

        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(filters_array)) {
          filters_array = [filters_array];
        } else {
          throw new Error("Can not split OR SQL WHERE into template parts filters(except(...))). Sorry.");
        } //console.log(JSON.stringify(_cfg["filters"]))


        var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, true);

        if (subst.length == 0) {
          return "1=1";
        }

        return subst;
      };

      var inclusive_replacer = function inclusive_replacer(match, columns_text, offset, string) {
        var columns = columns_text.split(',');
        var filters_array = _cfg["filters"];

        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(filters_array)) {
          filters_array = [filters_array];
        } else {
          throw new Error("Can not split OR SQL WHERE into template parts filters(...). Sorry.");
        } //console.log(JSON.stringify(_cfg["filters"]))


        var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, false);

        if (subst.length == 0) {
          return "1=1";
        }

        return subst;
      };

      var udf_args_replacer = function udf_args_replacer(match, columns_text, offset, string) {
        var filters_array = _cfg["filters"];

        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["b" /* isHash */])(filters_array)) {
          throw new Error("filters as array is not supported for udf_args(). Sorry.");
        } //console.log(JSON.stringify(filters_array))
        //var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, false)


        var ast = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_20__lpep__["a" /* parse */])("udf_args(".concat(columns_text, ")"));

        if (ast.length == 0) {
          return "";
        }

        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast, c);
      };

      var filter_replacer = function filter_replacer(match, expression, offset, string) {
        //console.log(`Detected filters expresssion: ${expression}`)
        //var subst = get_filters_array(_context, filters_array, _cfg.ds + '.' + _cfg.cube, columns, false)
        var ast = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_20__lpep__["a" /* parse */])("filter(".concat(expression, ")"));

        if (ast.length == 0) {
          return "1=1";
        } //console.log(`Parsed expr: ${JSON.stringify(ast)}`)


        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__lisp__["a" /* eval_lisp */])(ast, cc);
      };

      // надо подставить WHERE аккуратно, это уже посчитано, заменяем ${filters} и ${filters()}
      var re = /\$\{filters(?:\(\))?\}/gi;
      var processed_from = from.replace(re, part_where); // access_filters

      if (access_where.length == 0) {
        access_where = '1=1';
      }

      var re = /\$\{access_filters(?:\(\))?\}/gi;
      var processed_from = processed_from.replace(re, access_where); // ищем except()

      re = /\$\{filters\(except\(([^\)]*)\)\)\}/gi;
      processed_from = processed_from.replace(re, except_replacer); // ищем filters(a,v,c)
      // FIXME: не делаем access_filters :()

      re = /\$\{filters\(([^\)]+)\)\}/gi;
      processed_from = processed_from.replace(re, inclusive_replacer); //final_sql = `${select}\nFROM ${processed_from}${group_by}${order_by}${limit_offset}${ending}`
      ///////////////////////////////////////////////////////////////////////
      // ищем ${udf_args(column , title, name1, filter1, ....)}

      re = /\$\{udf_args\(([^\}]+)\)\}/gi;
      var c = init_udf_args_context("".concat(_cfg.ds, ".").concat(_cfg.cube), _cfg["filters"], _context[0]["_target_database"]);
      processed_from = processed_from.replace(re, udf_args_replacer); // функция filter из table lookup, но тут своя реализация... пробуем

      re = /\$\{filter\(([^\}]+)\)\}/gi; // FIXME: надо инитить глобальный контекст, и подкидывать переменные про юзера.
      // let cc = [ {_target_database: "HOY"}, SQL_where_context ];

      var cc = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_19__sql_where__["b" /* sql_where_context */])({
        'user': _vars["_user_info"]
      });
      processed_from = processed_from.replace(re, filter_replacer);
      from = processed_from;
    }

    if (global_joins.length > 0) {
      // нужно ещё сделать JOINS
      from = from + ',' + global_joins.map(function (el) {
        if (el["expr"]) {
          return el["alias"] ? "".concat(el["expr"], " as ").concat(el["alias"]) : el["expr"];
        } else {
          return el["alias"] ? "".concat(el["table"], " as ").concat(el["alias"]) : el["table"];
        }
      });
    }

    if (global_extra_columns.length > 0) {
      var saved_columns = _cfg["_columns"];
      _cfg["_columns"] = global_extra_columns; // нам нужно ещё раз обернуть весь запрос!!!
      // похоже список столбцов нужнео дополнить нашими доп столбцами....

      var top_level_select = 'SELECT ';
      top_level_select = top_level_select.concat(global_extra_columns.map(function (el) {
        // It is only to support dictionaries for Clickhouse!!!
        // FIXME: switch to stacked SELECT idea
        // console.log(`global_extra_columns: ${JSON.stringify(el)}`)
        if (el.outer_alias) {
          el.alias = el.outer_alias;
        }

        if (el.outer_expr) {
          el.expr = el.outer_expr;
        } /////////////////////////////////////////////////////
        //console.log("COLUMN:", JSON.stringify(el))


        if (el.alias) {
          return quot_as_expression(_context[0]["_target_database"], expand_outer_expr(el), el.alias);
        } else {
          if (el.columns.length === 1) {
            var parts = el.columns[0].split('.');
            return quot_as_expression(_context[0]["_target_database"], expand_outer_expr(el), parts[2]);
          }

          return expand_outer_expr(el);
        }
      }).join(', ')); //console.log(`global_extra_columns STEP ${top_level_select}`)

      top_level_select = top_level_select.concat(', ');
      _cfg["_columns"] = saved_columns; // ещё раз надо пройтись по столбцам, но теперь нам нужны ТОЛЬКО АЛИАСЫ !

      top_level_select = top_level_select.concat(_cfg["_columns"].map(function (el) {
        // It is only to support dictionaries for Clickhouse!!!
        // FIXME: switch to stacked SELECT idea
        if (el.outer_alias) {
          el.alias = el.outer_alias;
        }

        if (el.outer_expr) {
          el.expr = el.outer_expr;
        } /////////////////////////////////////////////////////
        //console.log("COLUMN:", JSON.stringify(el))


        if (el.alias) {
          // FIXME: делаем принудительную квотацию для терадаты!!!
          //return quot_as_expression(_context[0]["_target_database"], expand_outer_expr(el), el.alias)
          return "\"".concat(el.alias, "\"");
        } else {
          if (el.columns.length === 1) {
            var parts = el.columns[0].split('.'); //return quot_as_expression(_context[0]["_target_database"], expand_outer_expr(el), parts[2])

            return "\"".concat(parts[2], "\"");
          }

          return "\"".concat(expand_outer_expr(el), "\"");
        }
      }).join(', '));

      if (global_only1 === true) {
        group_by = ''; // plSQL will parse this comment! Sic! 

        top_level_select = "/*ON1Y*/".concat(top_level_select);
      } // Oracle can not handle `table as alias` So we removed AS from final select
      // Teradata: [TeraJDBC 16.20.00.13] [Error 3706] [SQLState 42000] Syntax error: ORDER BY is not allowed in subqueries.


      if (_context[0]["_target_database"] === 'teradata') {
        // FIXME: В терадате используется WINDOW  OVER (ORDER BY) для наших типов запросов, так что должно быть норм. 
        final_sql = "".concat(top_level_select, " FROM (").concat(select, "\nFROM ").concat(from).concat(where).concat(group_by, ") koob__top__level__select__").concat(top_level_where).concat(order_by).concat(limit_offset).concat(ending);
      } else {
        final_sql = "".concat(top_level_select, " FROM (").concat(select, "\nFROM ").concat(from).concat(where).concat(group_by).concat(order_by, ") koob__top__level__select__").concat(top_level_where).concat(limit_offset).concat(ending);
      }
    } else {
      if (global_only1 === true) {
        group_by = ''; // plSQL will parse this comment! Sic! 

        select = "/*ON1Y*/".concat(select);
      }

      if (_context[0]["_target_database"] === 'oracle' && global_generate_3_level_sql === true) {
        // В оракле приходится 3-х этажный селект делать
        final_sql = "SELECT * FROM (SELECT koob__inner__select__.*, ROWNUM AS \"koob__row__num__\" FROM (".concat(select, "\nFROM ").concat(from).concat(where).concat(group_by).concat(order_by, ") koob__inner__select__) koob__top__level__select__").concat(top_level_where).concat(ending);
      } else {
        final_sql = "".concat(select, "\nFROM ").concat(from).concat(where).concat(group_by).concat(order_by).concat(limit_offset).concat(ending);
      }
    }

    if (_cfg["return"] === "count") {
      if (_context[0]["_target_database"] === 'clickhouse') {
        final_sql = "select toUInt32(count(300)) as count from (".concat(final_sql, ")");
      } else {
        // use quotes to interact with our Web client in all cases (prevent upper case)
        final_sql = "select count(300) as \"count\" from (".concat(final_sql, ") koob__count__src__");
      }
    }

    return final_sql;
  }
}

/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = eval_sql_macros;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__console_console__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lpep__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_utils__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lisp__ = __webpack_require__(18);
/**
 Copyright (c) 2022 Luxms Inc.

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the Software
 is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */




var postgresql_typemap = {
  'INT': ['INT', 'utils.safe_convert_to_int'],
  'FLOAT': ['FLOAT', 'utils.safe_convert_to_float8'],
  'DOUBLE': ['FLOAT', 'utils.safe_convert_to_float8'],
  'DATE': ['DATE', 'utils.safe_convert_to_date'],
  'DATETIME': ['TIMESTAMP', 'utils.safe_convert_to_timestamp']
};

function sql_macros_context(_vars) {
  var global_current_column;
  var _ctx = []; // это контекст где будет сначала список переменных, включая _columns, и функции

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lisp__["b" /* isHash */])(_vars)) {
    _ctx = [_vars];
  }

  var _context = {}; // добавляем наш контекст, как имеющий более высокий приоритет над существующим

  _ctx.unshift(_context);

  _context["cast"] = function (column, typeTo, optional_default) {
    // utils.convert_softly('foo', /*new type*/ 'INT', /* default*/ NULL);
    var def_val;
    var dbType = postgresql_typemap[typeTo];

    if (dbType === undefined) {
      throw Error("Conversion to ".concat(typeTo, " is not supported"));
    }

    if (optional_default === null) {
      def_val = "NULL::".concat(dbType[0]);
    } else {
      def_val = optional_default === undefined ? "NULL::".concat(dbType[0]) : "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["a" /* db_quote_literal */])(optional_default), "::").concat(dbType[0]);
    }

    var sql = "    ALTER COLUMN ".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["b" /* db_quote_ident */])(column), " SET DATA TYPE ").concat(dbType[0], "\n    USING ").concat(dbType[1], "(").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["b" /* db_quote_ident */])(column), ", ").concat(def_val, ")");
    return sql;
  };

  _context["regexp"] = function (first, second) {
    if (second === undefined) {
      return "(regexp_match(".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["b" /* db_quote_ident */])(global_current_column), ", '").concat(first, "'))[1]");
    } else {
      return "(regexp_match(".concat(first, ", '").concat(second, "'))[1]");
    }
  };

  _context["to_date"] = function (first, second) {
    if (second === undefined) {
      return "to_date(".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["b" /* db_quote_ident */])(global_current_column), ", ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["a" /* db_quote_literal */])(first), ")");
    } else {
      return "to_date(".concat(first, ", ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["a" /* db_quote_literal */])(second), ")");
    }
  };

  _context["to_datetime"] = function (first, second) {
    if (second === undefined) {
      return "to_timestamp(".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["b" /* db_quote_ident */])(global_current_column), ", ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["a" /* db_quote_literal */])(first), ")");
    } else {
      return "to_timestamp(".concat(first, ", ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["a" /* db_quote_literal */])(second), ")");
    }
  };

  _context["left"] = function (first, second) {
    if (second === undefined) {
      //console.log(`isNumber ${first}: ${isNumber(first)}`)
      return "left(".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["b" /* db_quote_ident */])(global_current_column), ", ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["a" /* db_quote_literal */])(first), ")");
    } else {
      //console.log(`isNumber ${second}: ${isNumber(second)}`)
      return "left(".concat(first, ", ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["a" /* db_quote_literal */])(second), ")");
    }
  };

  _context["castWithExpr"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lisp__["c" /* makeSF */])(function (ast, ctx) {
    // column, typeTo, expr, optional_default
    var column = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lisp__["a" /* eval_lisp */])(ast[0], ctx);
    var typeTo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lisp__["a" /* eval_lisp */])(ast[1], ctx);
    var dbType = postgresql_typemap[typeTo];

    if (dbType === undefined) {
      throw Error("Conversion to ".concat(typeTo, " is not supported"));
    } // remember for use in other functions


    global_current_column = column;
    var def_val, optional_default;

    if (ast[3] === null) {
      def_val = "NULL::".concat(dbType[0]);
    } else {
      if (ast[3] === undefined) {
        def_val = "NULL::".concat(dbType[0]);
      } else {
        optional_default = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lisp__["a" /* eval_lisp */])(ast[3], ctx);
        def_val = "".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["a" /* db_quote_literal */])(optional_default), "::").concat(dbType[0]);
      }
    }

    if (dbType[0] === 'DATE' && ast[2][0] === 'to_date' || dbType[0] === 'DATETIME' && ast[2][0] === 'to_datetime') {
      // делаем быстрый хэк 
      var arg = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lisp__["a" /* eval_lisp */])(ast[2][1], ctx);

      var _sql = "    ALTER COLUMN ".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["b" /* db_quote_ident */])(column), " SET DATA TYPE ").concat(dbType[0], "\n    USING ").concat(dbType[1], "(").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["b" /* db_quote_ident */])(column), ", ").concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["a" /* db_quote_literal */])(arg), ", ").concat(def_val, ")");

      return _sql;
    } //console.log(JSON.stringify(ast[2]))


    var expr = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lisp__["a" /* eval_lisp */])(ast[2], ctx); //console.log(expr)

    var sql = "    ALTER COLUMN ".concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_utils__["b" /* db_quote_ident */])(column), " SET DATA TYPE ").concat(dbType[0], "\n    USING ").concat(dbType[1], "(").concat(expr, ", ").concat(def_val, ")");
    return sql;
  });
  return _ctx;
}

function eval_sql_macros(_sexpr, _vars) {
  if (typeof _vars === 'string') _vars = JSON.parse(_vars); //console.log('sql_where parse: ', JSON.stringify(sexpr));

  var _context = sql_macros_context(_vars);

  var ret = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lisp__["a" /* eval_lisp */])(_sexpr, _context); // console.log('ret: ',  JSON.stringify(ret));

  return ret;
}

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eval_lpe", function() { return eval_lpe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__console_console__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lpep__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lped__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lisp__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sql_where__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sql_context__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sql_koob__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__sql_macros__ = __webpack_require__(107);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return __WEBPACK_IMPORTED_MODULE_1__lpep__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "deparse", function() { return __WEBPACK_IMPORTED_MODULE_2__lped__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LPESyntaxError", function() { return __WEBPACK_IMPORTED_MODULE_1__lpep__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "eval_lisp", function() { return __WEBPACK_IMPORTED_MODULE_3__lisp__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "eval_sql_where", function() { return __WEBPACK_IMPORTED_MODULE_4__sql_where__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "eval_sql_expr", function() { return __WEBPACK_IMPORTED_MODULE_5__sql_context__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "parse_sql_expr", function() { return __WEBPACK_IMPORTED_MODULE_5__sql_context__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "generate_report_sql", function() { return __WEBPACK_IMPORTED_MODULE_5__sql_context__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "generate_koob_sql", function() { return __WEBPACK_IMPORTED_MODULE_6__sql_koob__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "eval_sql_macros", function() { return __WEBPACK_IMPORTED_MODULE_7__sql_macros__["a"]; });









function eval_lpe(lpe, ctx) {
  var ast = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__lpep__["a" /* parse */])(lpe);
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lisp__["a" /* eval_lisp */])(ast, ctx);
}

 // test:
// var ast = parse('2+2*2');
// console.log(ast);
// var res = eval_lisp(ast, []);
// console.log(res);
// test:
// var result = eval_sql_where("where(id=[1,2,3,4] and metric.tree_level(id) = 3 and max(id)=now() and $metric_id = 3)", {"$metric_id":"COOL","id":"ID"});
// console.log(result);

/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = LPESyntaxError;
/* harmony export (immutable) */ __webpack_exports__["a"] = makeError;
/* harmony export (immutable) */ __webpack_exports__["b"] = tokenize;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_string_starts_with__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_string_starts_with___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_modules_es6_string_starts_with__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_function_name__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_function_name___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_modules_es6_function_name__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__console_console__ = __webpack_require__(14);


// http://javascript.crockford.com/tdop/tdop.html
// 2010-02-23
// (c) 2006 Douglas Crockford
// Produce an array of simple token objects from a string.
// A simple token object contains these members:
//      type: 'name', 'string', 'number', 'operator'
//      value: string or number value of the token
//      from: index of first character of the token
//      to: index of the last character + 1
// Comments of the // type are ignored.
// Operators are by default single characters. Multicharacter
// operators can be made by supplying a string of prefix and
// suffix characters.
// characters. For example,
//      '<>+-&', '=>&:'
// will match any of these:
//      <=  >>  >>>  <>  >=  +: -: &: &&: &&


var isDigit = function isDigit(c) {
  return c >= '0' && c <= '9';
}; //const isLetter = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
// https://stackoverflow.com/questions/9862761/how-to-check-if-character-is-a-letter-in-javascript
//const isLetter = (c) => RegExp(/^\p{L}$/,'u').test(c);


var isLetter = function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}; // Transform a token object into an exception object and throw it.


function LPESyntaxError(message) {
  this.constructor.prototype.__proto__ = Error.prototype;
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message; // this.stack = (new Error()).stack;
}
function makeError(t, message) {
  t.message = message;
  var errorDescription = JSON.stringify(t, ['name', 'message', 'from', 'to', 'key', 'value', 'arity', 'first', 'second', 'third', 'fourth'], 4);
  throw new LPESyntaxError(errorDescription);
}
function tokenize(s) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '<>+-&';
  var suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '=>&:';
  if (s.startsWith('lpe:')) s = s.substr(4);
  if (s.startsWith('⚡')) s = s.substr(1);
  var c; // The current character.

  var from; // The index of the start of the token.

  var i = 0; // The index of the current character.

  var length = s.length;
  var n; // The number value.

  var q; // The quote character.

  var str; // The string value.

  var result = []; // An array to hold the results.

  var make = function make(type, value) {
    return {
      type: type,
      value: value,
      from: from,
      to: i
    };
  }; // Make a token object.
  // If the source string is empty, return nothing.


  if (!s) {
    return [];
  } // Loop through this text, one character at a time.


  c = s.charAt(i);

  while (c) {
    from = i; // Ignore whitespace.

    if (c <= ' ') {
      i += 1;
      c = s.charAt(i); // name.
    } else if (isLetter(c) || c === '_' || c === '$' || c === '#') {
      // first char of name. TODO: remove #
      str = c;
      i += 1;

      for (;;) {
        c = s.charAt(i);

        if (isLetter(c) || isDigit(c) || c === '_' || c === '$') {
          str += c;
          i += 1;
        } else {
          break;
        }
      }

      result.push(make('name', str)); // number.
      // A number cannot start with a decimal point. It must start with a digit,
      // possibly '0'.
    } else if (c >= '0' && c <= '9') {
      str = c;
      i += 1; // Look for more digits.

      for (;;) {
        c = s.charAt(i);

        if (c < '0' || c > '9') {
          break;
        }

        i += 1;
        str += c;
      } // Look for a decimal fraction part.


      if (c === '.') {
        i += 1;
        str += c;

        for (;;) {
          c = s.charAt(i);

          if (c < '0' || c > '9') {
            break;
          }

          i += 1;
          str += c;
        }
      } // Look for an exponent part.


      if (c === 'e' || c === 'E') {
        i += 1;
        str += c;
        c = s.charAt(i);

        if (c === '-' || c === '+') {
          i += 1;
          str += c;
          c = s.charAt(i);
        }

        if (c < '0' || c > '9') {
          makeError(make('number', str), "Bad exponent");
        }

        do {
          i += 1;
          str += c;
          c = s.charAt(i);
        } while (c >= '0' && c <= '9');
      } // Make sure the next character is not a letter.


      if (c >= 'a' && c <= 'z') {
        str += c;
        i += 1;
        makeError(make('number', str), "Bad number");
      } // Don't convert the string value to a number. If it is finite, then it is a good
      // token.
      // result.push(make('number', parseFloat(str)));
      // result.push(make('number', str));


      n = +str;

      if (isFinite(n)) {
        result.push(make('number', n));
      } else {
        makeError(make('number', str), "Bad number");
      } // string

    } else if (c === '\'' || c === '"') {
      str = '';
      q = c;
      i += 1;

      for (;;) {
        c = s.charAt(i);

        if (c < ' ') {
          // make('string', str).error(c === '\n' || c === '\r' || c === '' ?
          //     "Unterminated string." :
          //     "Control character in string.", make('', str));
          makeError(make('', str) || make(q === '"' ? 'string_double' : 'string_single', str), c === '\n' || c === '\r' || c === '' ? "Unterminated string." : "Control character in string.");
        } // Look for the closing quote.


        if (c === q) {
          break;
        } // Look for escapement.


        if (c === '\\') {
          i += 1;

          if (i >= length) {
            makeError(make(q === '"' ? 'string_double' : 'string_single', str), "Unterminated string");
          }

          c = s.charAt(i);

          switch (c) {
            case 'b':
              c = '\b';
              break;

            case 'f':
              c = '\f';
              break;

            case 'n':
              c = '\n';
              break;

            case 'r':
              c = '\r';
              break;

            case 't':
              c = '\t';
              break;

            case 'u':
              if (i >= length) {
                makeError(make(q === '"' ? 'string_double' : 'string_single', str), "Unterminated string");
              }

              c = parseInt(s.substr(i + 1, 4), 16);

              if (!isFinite(c) || c < 0) {
                makeError(make(q === '"' ? 'string_double' : 'string_single', str), "Unterminated string");
              }

              c = String.fromCharCode(c);
              i += 4;
              break;
          }
        }

        str += c;
        i += 1;
      }

      i += 1;
      result.push(make(q === '"' ? 'string_double' : 'string_single', str));
      c = s.charAt(i); // comment.
    } else if (c === '/' && s.charAt(i + 1) === '/') {
      i += 1;

      for (;;) {
        c = s.charAt(i);

        if (c === '\n' || c === '\r' || c === '') {
          break;
        }

        i += 1;
      } // combining

    } else if (prefix.indexOf(c) >= 0) {
      str = c;
      i += 1;

      while (true) {
        c = s.charAt(i);

        if (i >= length || suffix.indexOf(c) < 0) {
          break;
        }

        str += c;
        i += 1;
      }

      result.push(make('operator', str)); // single-character operator
    } else {
      i += 1;
      result.push(make('operator', c));
      c = s.charAt(i);
    }
  }

  return result;
}
/* unused harmony default export */ var _unused_webpack_default_export = (tokenize);

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(129);
module.exports = __webpack_require__(8).Function;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(128);
module.exports = __webpack_require__(8).Dict;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(22);
__webpack_require__(136);
__webpack_require__(138);
__webpack_require__(137);
__webpack_require__(140);
__webpack_require__(142);
__webpack_require__(52);
__webpack_require__(141);
__webpack_require__(139);
__webpack_require__(148);
__webpack_require__(147);
__webpack_require__(144);
__webpack_require__(145);
__webpack_require__(143);
__webpack_require__(135);
__webpack_require__(146);
__webpack_require__(149);
__webpack_require__(101);
__webpack_require__(159);
__webpack_require__(54);
__webpack_require__(158);
__webpack_require__(156);
__webpack_require__(157);
__webpack_require__(160);
__webpack_require__(161);
__webpack_require__(133);
__webpack_require__(131);
__webpack_require__(132);
__webpack_require__(134);
module.exports = __webpack_require__(8).Object;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(22);
__webpack_require__(101);
__webpack_require__(30);
__webpack_require__(162);
module.exports = __webpack_require__(8).Symbol;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(20);
var IObject = __webpack_require__(61);
var toObject = __webpack_require__(10);
var toLength = __webpack_require__(17);
var asc = __webpack_require__(116);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);
var isArray = __webpack_require__(79);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(115);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(4).f;
var create = __webpack_require__(26);
var redefineAll = __webpack_require__(91);
var ctx = __webpack_require__(20);
var anInstance = __webpack_require__(71);
var forOf = __webpack_require__(60);
var $iterDefine = __webpack_require__(63);
var step = __webpack_require__(64);
var setSpecies = __webpack_require__(94);
var DESCRIPTORS = __webpack_require__(2);
var fastKey = __webpack_require__(25).fastKey;
var validate = __webpack_require__(97);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(6);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(12);
var redefineAll = __webpack_require__(91);
var meta = __webpack_require__(25);
var forOf = __webpack_require__(60);
var anInstance = __webpack_require__(71);
var isObject = __webpack_require__(3);
var fails = __webpack_require__(7);
var $iterDetect = __webpack_require__(82);
var setToStringTag = __webpack_require__(48);
var inheritIfRequired = __webpack_require__(77);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(13);
var gOPS = __webpack_require__(46);
var pIE = __webpack_require__(35);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(49)('native-function-to-string', Function.toString);


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(6).document;
module.exports = document && document.documentElement;


/***/ }),
/* 122 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys = __webpack_require__(13);
var toIObject = __webpack_require__(9);
module.exports = function (object, el) {
  var O = toIObject(object);
  var keys = getKeys(O);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) if (O[key = keys[index++]] === el) return key;
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var path = __webpack_require__(90);
var invoke = __webpack_require__(122);
var aFunction = __webpack_require__(19);
module.exports = function (/* ...pargs */) {
  var fn = aFunction(this);
  var length = arguments.length;
  var pargs = new Array(length);
  var i = 0;
  var _ = path._;
  var holder = false;
  while (length > i) if ((pargs[i] = arguments[i++]) === _) holder = true;
  return function (/* ...args */) {
    var that = this;
    var aLen = arguments.length;
    var j = 0;
    var k = 0;
    var args;
    if (!holder && !aLen) return invoke(fn, pargs, that);
    args = pargs.slice();
    if (holder) for (;length > j; j++) if (args[j] === _) args[j] = arguments[k++];
    while (aLen > k) args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(5);
var aFunction = __webpack_require__(19);
var SPECIES = __webpack_require__(1)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(7);

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(50);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(20);
var $export = __webpack_require__(0);
var createDesc = __webpack_require__(27);
var assign = __webpack_require__(83);
var create = __webpack_require__(26);
var getPrototypeOf = __webpack_require__(34);
var getKeys = __webpack_require__(13);
var dP = __webpack_require__(4);
var keyOf = __webpack_require__(123);
var aFunction = __webpack_require__(19);
var forOf = __webpack_require__(60);
var isIterable = __webpack_require__(130);
var $iterCreate = __webpack_require__(81);
var step = __webpack_require__(64);
var isObject = __webpack_require__(3);
var toIObject = __webpack_require__(9);
var DESCRIPTORS = __webpack_require__(2);
var has = __webpack_require__(15);

// 0 -> Dict.forEach
// 1 -> Dict.map
// 2 -> Dict.filter
// 3 -> Dict.some
// 4 -> Dict.every
// 5 -> Dict.find
// 6 -> Dict.findKey
// 7 -> Dict.mapPairs
var createDictMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_EVERY = TYPE == 4;
  return function (object, callbackfn, that /* = undefined */) {
    var f = ctx(callbackfn, that, 3);
    var O = toIObject(object);
    var result = IS_MAP || TYPE == 7 || TYPE == 2
          ? new (typeof this == 'function' ? this : Dict)() : undefined;
    var key, val, res;
    for (key in O) if (has(O, key)) {
      val = O[key];
      res = f(val, key, object);
      if (TYPE) {
        if (IS_MAP) result[key] = res;          // map
        else if (res) switch (TYPE) {
          case 2: result[key] = val; break;     // filter
          case 3: return true;                  // some
          case 5: return val;                   // find
          case 6: return key;                   // findKey
          case 7: result[res[0]] = res[1];      // mapPairs
        } else if (IS_EVERY) return false;      // every
      }
    }
    return TYPE == 3 || IS_EVERY ? IS_EVERY : result;
  };
};
var findKey = createDictMethod(6);

var createDictIter = function (kind) {
  return function (it) {
    return new DictIterator(it, kind);
  };
};
var DictIterator = function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._a = getKeys(iterated);   // keys
  this._i = 0;                   // next index
  this._k = kind;                // kind
};
$iterCreate(DictIterator, 'Dict', function () {
  var that = this;
  var O = that._t;
  var keys = that._a;
  var kind = that._k;
  var key;
  do {
    if (that._i >= keys.length) {
      that._t = undefined;
      return step(1);
    }
  } while (!has(O, key = keys[that._i++]));
  if (kind == 'keys') return step(0, key);
  if (kind == 'values') return step(0, O[key]);
  return step(0, [key, O[key]]);
});

function Dict(iterable) {
  var dict = create(null);
  if (iterable != undefined) {
    if (isIterable(iterable)) {
      forOf(iterable, true, function (key, value) {
        dict[key] = value;
      });
    } else assign(dict, iterable);
  }
  return dict;
}
Dict.prototype = null;

function reduce(object, mapfn, init) {
  aFunction(mapfn);
  var O = toIObject(object);
  var keys = getKeys(O);
  var length = keys.length;
  var i = 0;
  var memo, key;
  if (arguments.length < 3) {
    if (!length) throw TypeError('Reduce of empty object with no initial value');
    memo = O[keys[i++]];
  } else memo = Object(init);
  while (length > i) if (has(O, key = keys[i++])) {
    memo = mapfn(memo, O[key], key, object);
  }
  return memo;
}

function includes(object, el) {
  // eslint-disable-next-line no-self-compare
  return (el == el ? keyOf(object, el) : findKey(object, function (it) {
    // eslint-disable-next-line no-self-compare
    return it != it;
  })) !== undefined;
}

function get(object, key) {
  if (has(object, key)) return object[key];
}
function set(object, key, value) {
  if (DESCRIPTORS && key in Object) dP.f(object, key, createDesc(0, value));
  else object[key] = value;
  return object;
}

function isDict(it) {
  return isObject(it) && getPrototypeOf(it) === Dict.prototype;
}

$export($export.G + $export.F, { Dict: Dict });

$export($export.S, 'Dict', {
  keys: createDictIter('keys'),
  values: createDictIter('values'),
  entries: createDictIter('entries'),
  forEach: createDictMethod(0),
  map: createDictMethod(1),
  filter: createDictMethod(2),
  some: createDictMethod(3),
  every: createDictMethod(4),
  find: createDictMethod(5),
  findKey: findKey,
  mapPairs: createDictMethod(7),
  reduce: reduce,
  keyOf: keyOf,
  includes: includes,
  has: has,
  get: get,
  set: set,
  isDict: isDict
});


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(90);
var $export = __webpack_require__(0);

// Placeholder
__webpack_require__(8)._ = path._ = path._ || {};

$export($export.P + $export.F, 'Function', { part: __webpack_require__(124) });


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(31);
var ITERATOR = __webpack_require__(1)('iterator');
var Iterators = __webpack_require__(24);
module.exports = __webpack_require__(8).isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', { classof: __webpack_require__(31) });


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var define = __webpack_require__(84);

$export($export.S + $export.F, 'Object', { define: define });


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', { isObject: __webpack_require__(3) });


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
var define = __webpack_require__(84);
var create = __webpack_require__(26);

$export($export.S + $export.F, 'Object', {
  make: function (proto, mixin) {
    return define(create(proto), mixin);
  }
});


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(83) });


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(26) });


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(2), 'Object', { defineProperties: __webpack_require__(85) });


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(2), 'Object', { defineProperty: __webpack_require__(4).f });


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(3);
var meta = __webpack_require__(25).onFreeze;

__webpack_require__(11)('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__(9);
var $getOwnPropertyDescriptor = __webpack_require__(21).f;

__webpack_require__(11)('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(11)('getOwnPropertyNames', function () {
  return __webpack_require__(86).f;
});


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(10);
var $getPrototypeOf = __webpack_require__(34);

__webpack_require__(11)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(3);

__webpack_require__(11)('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(3);

__webpack_require__(11)('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(3);

__webpack_require__(11)('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { is: __webpack_require__(92) });


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(3);
var meta = __webpack_require__(25).onFreeze;

__webpack_require__(11)('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(3);
var meta = __webpack_require__(25).onFreeze;

__webpack_require__(11)('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(0);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(93).set });


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__(65);
__webpack_require__(0)({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__(2) && /./g.flags != 'g') __webpack_require__(4).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(43)
});


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(5);
var sameValue = __webpack_require__(92);
var regExpExec = __webpack_require__(47);

// @@search logic
__webpack_require__(42)('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[SEARCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative($search, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(117);
var validate = __webpack_require__(97);
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(118)(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__(0);
var context = __webpack_require__(96);
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(75)(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__(0);
var $includes = __webpack_require__(72)(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(57)('includes');


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var aFunction = __webpack_require__(19);
var $defineProperty = __webpack_require__(4);

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
__webpack_require__(2) && $export($export.P + __webpack_require__(44), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var aFunction = __webpack_require__(19);
var $defineProperty = __webpack_require__(4);

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
__webpack_require__(2) && $export($export.P + __webpack_require__(44), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0);
var $entries = __webpack_require__(88)(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__(0);
var ownKeys = __webpack_require__(89);
var toIObject = __webpack_require__(9);
var gOPD = __webpack_require__(21);
var createProperty = __webpack_require__(73);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var toPrimitive = __webpack_require__(36);
var getPrototypeOf = __webpack_require__(34);
var getOwnPropertyDescriptor = __webpack_require__(21).f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
__webpack_require__(2) && $export($export.P + __webpack_require__(44), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toObject = __webpack_require__(10);
var toPrimitive = __webpack_require__(36);
var getPrototypeOf = __webpack_require__(34);
var getOwnPropertyDescriptor = __webpack_require__(21).f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
__webpack_require__(2) && $export($export.P + __webpack_require__(44), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(67)('observable');


/***/ })
/******/ ]);
});
//# sourceMappingURL=lpe.js.map