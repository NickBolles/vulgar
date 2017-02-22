let toString = Object.prototype.toString;

export function isArray<T>(obj: any): obj is T[] {
  return Array.isArray(obj);
}

/**
 * @ngdoc function
 * @name angular.isUndefined
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is undefined.
 */
export function isUndefined(value: any): value is undefined {return typeof value === 'undefined';}


/**
 * @ngdoc function
 * @name angular.isDefined
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is defined.
 */
export function isDefined(value: any): boolean {return typeof value !== 'undefined';}


/**
 * @ngdoc function
 * @name angular.isObject
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
 * considered to be objects. Note that JavaScript arrays are objects.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Object` but not `null`.
 */
export function isObject(value: any): value is Object {
  // http://jsperf.com/isobject4
  return value !== null && typeof value === 'object';
}


/**
 * Determine if a value is an object with a null prototype
 *
 * @returns {boolean} True if `value` is an `Object` with a null prototype
 */
export function isBlankObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Object.getPrototypeOf(value);
}


/**
 * @ngdoc function
 * @name angular.isString
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
export function isString(value: any): value is string {return typeof value === 'string';}


/**
 * @ngdoc function
 * @name angular.isNumber
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `Number`.
 *
 * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
 *
 * If you wish to exclude these then you can use the native
 * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
 * method.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Number`.
 */
export function isNumber(value: any): value is number {return typeof value === 'number';}


/**
 * @ngdoc function
 * @name angular.isDate
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a value is a date.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Date`.
 */
export function isDate(value: any): value is Date {
  return toString.call(value) === '[object Date]';
}



/**
 * @ngdoc function
 * @name angular.isFunction
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}


/**
 * Determines if a value is a regular expression object.
 *
 * @private
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `RegExp`.
 */
export function isRegExp(value: any): boolean {
  return toString.call(value) === '[object RegExp]';
}


/**
 * Checks if `obj` is a window object.
 *
 * @private
 * @param {*} obj Object to check
 * @returns {boolean} True if `obj` is a window obj.
 */
export function isWindow(obj: any): boolean {
  return obj && obj.window === obj;
}


export function isScope(obj: any): boolean {
  return obj && obj.$evalAsync && obj.$watch;
}


export function isFile(obj: any): boolean {
  return toString.call(obj) === '[object File]';
}


export function isFormData(obj: any): boolean {
  return toString.call(obj) === '[object FormData]';
}


export function isBlob(obj: any): boolean {
  return toString.call(obj) === '[object Blob]';
}


export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}


export function isPromiseLike(obj: any): boolean {
  return obj && isFunction(obj.then);
}


var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/;
export function isTypedArray(value: any): boolean {
  return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
}

export function isArrayBuffer(obj: any): boolean {
  return toString.call(obj) === '[object ArrayBuffer]';
}
