'use strict';

const colors = require('ansi-colors');
const transforms = require('./transforms');
const symbols = require('./symbols');
const styles = require('./styles');
const utils = require('../utils');
const { green, dim } = colors;
const { first } = utils;

class Style {
  constructor(prompt) {
    this.prompt = prompt;
    this.transforms = transforms;
    this.symbols = utils.merge(symbols, prompt.options.symbols);
    Object.assign(this, utils.merge(styles(this.symbols), prompt.options.styles));
  }

  set(prop, value) {
    const options = this.prompt.options.styles || {};
    this[prop] = { ...this[prop], ...value, ...options[prop] };
  }

  get status() {
    return this.prompt.status;
  }

  alert(str, status = this.status) {
    return str ? (this.alerts[status] || this.alerts.default)(str) : '';
  }
  warning(str) {
    return this.alert(str, 'warning');
  }
  success(str) {
    return this.alert(str, 'success');
  }
  danger(str) {
    return this.alert(str, 'danger');
  }
  help(str, status = 'hint') {
    return (this.hints[status] || this.hints.default)(str);
  }

  transform(type) {
    return this.transforms[type] || this.transforms.default;
  }

  hint(str, status = this.status) {
    const fn = this.hints[status] || this.hints.default;
    const hint = this.answered ? '' : (str ? fn(str) : '');
    return hint ? (' ' + hint) : '';
  }

  prefix(status = this.status) {
    return this.prefixes[status] || this.prefixes.default;
  }
  indicator(status = this.status) {
    return this.indicators[status] || this.indicators.default;
  }

  separator(status = this.status) {
    return this.indicators[status] || this.indicators.default;
  }

  message(choice, enabled) {
    return enabled ? colors.cyan.underline(choice.message) : choice.message;
  }
  pointer(choice, status = choice.status) {
    const str = this.pointers[status] || this.pointers.default
    return str ? str + ' ' : '';
  }
  radio(choice) {
    const { enabled, disabled, symbol = this.symbols.radio, indent } = choice;
    if (disabled) return indent + dim.gray(symbol.disabled);
    return indent + (enabled ? green(symbol.on) : symbol.off);
  }
  check(choice, expandable) {
    if (expandable && choice.expanded !== void 0) return this.item(choice);
    let { enabled, disabled, symbol = this.symbols.check, indent } = choice;
    if (disabled) {
      return indent + dim.gray(symbol.disabled || symbol) + ' ';
    }
    if (enabled) {
      return indent + green(first(symbol.on, symbol)) + ' ';
    }
    return indent + dim.gray(first(symbol.off, symbol)) + ' ';
  }
  item(choice) {
    let { expanded, symbol = this.symbols.folder, indent } = choice;
    return indent + dim(expanded ? symbol.on : symbol.off) + ' ';
  }
}

module.exports = Style;
