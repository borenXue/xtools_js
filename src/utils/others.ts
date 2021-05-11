const toString = Object.prototype.toString;

export function isObject(obj: any): obj is Object {
  return toString.apply(obj) === '[object Object]';
}

export function isArray(arr: any): arr is Array<any> {
  return toString.apply(arr) === '[object Array]';
}

export function isFunction(func: any): func is Function {
  return toString.apply(func) === '[object Function]';
}
