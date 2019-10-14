(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jLogger"] = factory();
	else
		root["jLogger"] = factory();
})(global, function() {
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/autoLog.js":
/*!************************!*\
  !*** ./src/autoLog.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/logger.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_logger__WEBPACK_IMPORTED_MODULE_0__);
/*
 * @Author: 8thPrinciple 
 * @Date: 2019-08-22 00:14:56 
 * @Last Modified by: 8thPrinciple
 * @Last Modified time: 2019-08-22 00:16:08
 */

//  自动记录日志 



/* harmony default export */ __webpack_exports__["default"] = (null);

const logger = new _logger__WEBPACK_IMPORTED_MODULE_0___default.a({ file: 'src/common/log/autoLog.js' })

// ------------------全局error--------------------------
// 未捕获的异常
process.on('uncaughtException', (err) => {
  logger.error(err)
})
// // 未处理的拒绝响应
// process.on('unhandledRejection', (reason, promise) => {
//   logger.error(reason)
// })
// 窗口异常
window.addEventListener('error', (event) => {
  logger.error(event.error)
})

// ------------------鼠标事件--------------------------
const mouseEvents = ['click']
mouseEvents.forEach((item) => {
  document.addEventListener(item, (event) => {
    const { pageX, pageY, target } = event
    const { tagName, id, className, textContent } = target
    const content = { tag: tagName, id, class: className, text: textContent }
    logger.info(`loc: [${pageX}, ${pageY}], el: ${JSON.stringify(content)}`, { category: logger.CATEGORY.action, type: 'mouse', event: item })
  })
})

// -----------------键盘事件---------------------------
const keyboardEvents = ['keydown']
keyboardEvents.forEach((item) => {
  document.addEventListener(item, (event) => {
    const { altKey, ctrlKey, shiftKey, metaKey, code, keyCode } = event
    logger.info(`${shiftKey ? 'shift + ' : ''}${ctrlKey ? 'ctrl + ' : ''}${altKey ? 'alt + ' : ''}${metaKey ? 'meta + ' : ''}${code}(${keyCode})`, { category: logger.CATEGORY.action, type: 'keyboard', event: item })
  })
})

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/logger.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_logger__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _autoLog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./autoLog */ "./src/autoLog.js");
/*
 * @Author: 8thPrinciple 
 * @Date: 2019-08-22 00:17:06 
 * @Last Modified by:   8thPrinciple 
 * @Last Modified time: 2019-08-22 00:17:06 
 */




/* harmony default export */ __webpack_exports__["default"] = (_logger__WEBPACK_IMPORTED_MODULE_0___default.a);


/***/ }),

/***/ "./src/logger.js":
/*!***********************!*\
  !*** ./src/logger.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (47:11)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n|   }\n| \n>   CATEGORY = LOG_CATEGORY\n| \n|   _logger({ level, content, callId = getRandomNumber(5), ...otherArgs }) {");

/***/ })

/******/ })["default"];
});
//# sourceMappingURL=jLogger.js.map