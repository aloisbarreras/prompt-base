'use strict';

const colors = require('ansi-colors');
const Prompt = require('../..');
const { utils } = Prompt;

class BooleanPrompt extends Prompt {
  constructor(options = {}) {
    super(options);
    this.initial = this.cast(this.options.initial);
    this.hint = this.options.hint || '';
    this.value = this.initial;
  }

  skip() {
    if (typeof this.options.value === 'boolean') {
      this.value = this.options.value;
      return true;
    }
  }

  dispatch(ch) {
    this.value = this.cast(ch);
    this.render();
  }

  cast(val) {
    return /^[ty1]/i.test(val);
  }

  renderMessage(value = '') {
    const prefix = this.style.prefix();
    const sep = this.style.separator();
    const msg = `${prefix} ${this.options.message} ${sep} ${value}`;
    return msg.trim();
  }

  render() {
    this.clear();
    this.write(this.renderMessage(colors.cyan(this.value) + this.hint));
  }

  static get BooleanPrompt() {
    return BooleanPrompt;
  }
}

module.exports = BooleanPrompt;
