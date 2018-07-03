'use strict';

const ansi = require('./ansi');
const colors = require('ansi-colors');
const { red, green, cyan, dim, yellow } = colors;

module.exports = symbols => {
  return {
    help: {
      default: str => str,
      success: str => green(str),
      error: str => red(str),
      warning: str => yellow(str),
      info: str => cyan(str),
      hint: str => dim(str)
    },
    alerts: {
      default: str => str,
      success: str => green(`${symbols.check} ${str}`),
      warning: str => yellow(str),
      danger: str => red(`${symbols.cross} ${str}`),
      invalid: () => ansi.beep
    },
    hints: {
      hint: str => dim(str),
      warning: str => yellow(str),
      error: str => red(str),
      default: () => ''
    },
    indicators: {
      pending: dim(symbols.ellipsis),
      answered: dim(symbols.middot),
      default: dim(symbols.ellipsis)
    },
    pointers: {
      on: green(symbols.radio.on),
      off: symbols.radio.off,
      disabled: colors.dim.gray(symbols.radio.disabled),
      expanded: dim(symbols.minus),
      collapsed: dim(symbols.plus),
      default: cyan(symbols.pointer)
    },
    prefixes: {
      aborted: red(symbols.cross),
      expanded: dim(symbols.minus),
      collapsed: dim(symbols.plus),
      answered: green(symbols.check),
      default: cyan(symbols.question)
    }
  };
};
