'use strict';

const colors = require('ansi-colors');
const Prompt = require('../..');
const { ansi, first } = Prompt.utils;

/**
 * StringPrompt Element
 * @param {Object} options Options
 * @param {String} options.message Message
 * @param {String} [options.style='default'] Render style
 * @param {String} [options.initial] Default value
 */

class StringPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.initial = options.initial;
    this.value = this.typed = '';
    this.cursor = 0;
    this.help = '';
  }

  skip() {
    if (this.options.value !== void 0) {
      this.value = String(this.options.value);
      return true;
    }
  }

  dispatch(ch, key) {
    if (!ch) return this.alert();
    if (!this.placeholder && this.scale) {
      let before = this.typed.slice(0, this.cursor);
      let after = this.typed.slice(this.cursor);
      this.typed = `${before}${ch}${after}`;
      this.cursor += this.scale;
    } else {
      this.typed += ch;
      this.cursor = this.typed.length;
    }
    this.render();
  }

  moveCursor(n) {
    if (!this.placeholder) {
      this.cursor += n;
    }
  }

  delete() {
    if (this.placeholder) return this.alert();
    let before = this.typed.slice(0, this.cursor - this.scale);
    let after = this.typed.slice(this.cursor);
    this.typed = `${before}${after}`;
    this.cursor -= this.scale;
    this.render();
  }

  reset() {
    this.typed = '';
    this.render();
  }

  next() {
    if (!this.placeholder) return this.alert();
    this.typed = this.initial;
    this.cursor = this.typed.length;
    this.render();
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.typed.length;
    this.render();
  }

  left() {
    if (this.cursor <= 0 || this.placeholder) {
      return this.alert();
    }
    this.moveCursor(-1);
    this.render();
  }

  right() {
    if (this.cursor * this.scale >= this.typed.length || this.placeholder) {
      return this.alert();
    }
    this.moveCursor(1);
    this.render();
  }

  renderMessage(input = '') {
    const prefix = this.style.prefix();
    const msg = this.options.message;
    const sep = this.style.separator();
    const prompt = [prefix, msg, sep, input, this.help].filter(Boolean);
    return prompt.join(' ');
  }

  render() {
    this.clear();
    const input = this.transform.render(this.placeholder ? this.initial : this.typed);
    const value = this.placeholder ? colors.dim(input) : input;
    const length = -input.length + this.cursor;

    // ~ render header
    this.write(this.renderHeader());

    // ? Render prompt message
    this.write(this.renderMessage(value));

    // ~ render footer
    this.write(this.renderFooter());
    this.write(ansi.cursor.move(length));

    if (this.answered && !this.value) {
      this.value = this.options.initial;
    }
  }

  get plain() {
    return this.typed != null ? colors.unstyle(String(this.typed)) : '';
  }

  get placeholder() {
    return !!this.initial && !colors.unstyle(String(this.typed || ''));
  }

  submit() {
    this.value = this.value || this.plain;
    return super.submit();
  }

  static get StringPrompt() {
    return StringPrompt;
  }
}

module.exports = StringPrompt;
