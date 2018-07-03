'use strict';

const isNumber = val => /^[-+]?[0-9]+(\.?[0-9]+)?$/.test(val);
const colors = require('ansi-colors');
const Prompt = require('../..');
const { utils } = Prompt;

class NumberPrompt extends Prompt {
  constructor(options) {
    super({ style: 'number', ...options });
    this.initial = this.transform.initial(options.initial);
    this.min = isNumber(options.min) ? +options.min : -Infinity;
    this.max = isNumber(options.max) ? +options.max : Infinity;
    this.step = options.increment || 1;
    this.round = options.round === true || options.float === false;
    this.float = options.float === true;
    this.typed = '';
  }

  skip() {
    if (typeof this.options.value === 'number') {
      this.value = this.options.value;
      return true;
    }
  }

  dispatch(ch, key) {
    if (this.test(ch) === false) return this.alert();
    if (ch === '.' && this.typed.includes('.')) {
      return this.alert(new Error('invalid number'));
    }
    this.typed += ch;
    this.render();
  }

  reset() {
    this.typed = '';
    this.cursor = 0;
    this.render();
  }

  delete() {
    if (!this.typed) return this.alert();
    this.typed = `${this.typed.slice(0, -1)}`;
    this.render();
  }

  up() {
    let value = colors.unstyle(this.cast());
    if (value >= this.max) return this.alert();
    this.typed = `${+value + this.step}`;
    this.render();
  }
  down() {
    let value = colors.unstyle(this.cast());
    if (value <= this.min) return this.alert();
    this.typed = `${+value - this.step}`;
    this.render();
  }

  next() {
    this.typed = this.initial;
    this.render();
  }

  test(ch) {
    return ((ch === '-' || ch === '+') && this.typed === '') || /[0-9.]/.test(ch);
  }

  cast(value = this.value || this.typed) {
    this.placeholder = false;

    if (!value && value !== 0) {
      this.placeholder = true;
      value = `${this.initial}`;
    }

    if (this.answered) {
      value = Math.min(Math.max(value, this.min), this.max);
      this.value = this.round ? Math.round(value) : value;
      return this.value;
    }

    if (/[-+]0?/.test(value)) {
      return value;
    }

    if (value === '.') {
      return '0.';
    }

    if (this.placeholder === true) {
      return colors.gray(value);
    }

    value = Math.min(Math.max(value, this.min), this.max);
    value = this.transform.render(value);

    const str = String(value);
    const dot = str.slice(-1) === '.' ? '.' : '';

    if (this.round) {
      return `${utils.round(value, this.round)}${dot}`;
    }
    return value + dot;
  }

  renderMessage(value = '') {
    const prefix = this.style.prefix();
    const sep = this.style.separator();
    const msg = `${prefix}${this.options.message} ${sep} `;
    return `${msg.trim()} ${value}`;
  }

  render() {
    this.clear();
    const value = this.answered ? colors.cyan.underline(this.cast()) : this.cast();
    this.write(utils.ansi.cursor.hide);
    this.write(this.renderMessage(value));
  }

  submit() {
    if (!this.value) this.value = this.typed;
    return super.submit();
  }

  static get NumberPrompt() {
    return NumberPrompt;
  }
}

module.exports = NumberPrompt;
