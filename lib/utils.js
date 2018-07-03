'use strict';

const readline = require('readline');

/**
 * Create a readline interface with the given `options`.
 * @param {Object} `options`
 * @api public
 */

exports.createInterface = options => {
  const opts = { terminal: true, ...options };
  const { input, terminal } = opts;
  const rl = readline.createInterface({ input, terminal });
  readline.emitKeypressEvents(input, rl);
  process.setMaxListeners(0);
  input.setMaxListeners(0);
  rl.setMaxListeners(0);
  return rl;
};

exports.height = (str = '') => str.split('\n').length;

exports.trim = val => {
  if (val !== void 0 && typeof val !== 'string') return val;
  return val ? val.trim() : '';
};

exports.merge = (a = {}, b = {}) => {
  const target = Object.assign({}, a, b);
  for (const key of Object.keys(target)) {
    if (isObject(b[key])) {
      target[key] = exports.merge(a[key], b[key]);
    }
  }
  return target;
};

exports.isValidChar = ch => {
  if (ch && typeof ch === 'string') {
    const code = ch.charCodeAt(0);
    return code > 31 && code < 128;
  }
  return false;
};

exports.isEmpty = val => val == null;
exports.isNumber = val => /^[-0-9.]+$/.test(`${val}`.trim());

exports.isValidNumberKey = (n, choices) => {
  let num = +(String(n).trim());
  return exports.isNumber(n) && num >= 0 && num <= choices.length;
};

exports.isStyled = str => {
  return typeof str === 'string' && exports.ansi.strip(str) !== str;
};

exports.first = (...args) => args.find(val => !exports.isEmpty(val));

exports.round = (num, precision) => {
  let pow = Math.pow(10, precision);
  return Math.round(num * pow) / pow;
};

exports.define = (obj, key, value) => {
  Reflect.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: value
  });
};

function isObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

/**
 * Expose helpers
 */

exports.extras = require('./extras');
exports.actions = require('./actions');
exports.symbols = require('./style/symbols');
exports.ansi = require('./style/ansi');
exports.Style = require('./style/style');
