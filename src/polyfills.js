// src/polyfills.js
if (!Array.prototype.findLast) {
  Object.defineProperty(Array.prototype, 'findLast', {
    value: function(predicate /*, thisArg */) {
      if (this == null) throw new TypeError('"this" es null o no está definido');
      if (typeof predicate !== 'function') throw new TypeError('predicate debe ser una función');
      const list = Object(this);
      const length = list.length >>> 0;
      const thisArg = arguments[1];
      for (let i = length - 1; i >= 0; i--) {
        const v = list[i];
        if (predicate.call(thisArg, v, i, list)) return v;
      }
      return undefined;
    },
    configurable: true,
    writable: true,
    enumerable: false,
  });
}
