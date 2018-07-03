'use strict';

const Emitter = require('events');
const utils = require('./lib/utils');
const { actions, ansi, Style, symbols } = utils;

class Prompt extends Emitter {
  constructor(options = {}) {
    super();
    this.options = { ...options };
    this.name = this.options.name;
    this.style = new Style(this);
    this.transform = this.style.transform(this.options.style);
    this.scale = this.transform.scale;
  }

  async keypress(ch, key) {
    if (ch && ch.length > 1) {
      for (const s of [...ch]) await this.keypress(s, { ...key });
      return;
    }

    const k = this.keypressed = actions(ch, key);
    this.emit('keypress', k);
    this.emit('state', this.state());

    if (k.action && typeof this[k.action] === 'function') {
      return await this[k.action](ch, k);
    }
    if (this.dispatch) {
      return await this.dispatch(ch, k);
    }
    this.alert();
  }

  alert() {
    if (this.options.show === false) {
      this.emit('alert', this.keypressed);
    } else {
      this.write(ansi.beep);
    }
  }

  clear(str = this.str) {
    this.createInterface();
    !this.hasRendered ? this.cursorHide() : this.write(ansi.clear(str, this.width));
    this.hasRendered = true;
    this.str = '';
  }

  cursorHide() {
    this.write(ansi.cursor.hide);
    this.cursorHidden = true;
  }

  cursorShow() {
    this.write(ansi.cursor.show);
    this.cursorHidden = false;
  }

  write(str = '') {
    if (this.options.show !== false) {
      this.output.write(str);
      this.str += str;
    }
  }

  // Return the header to be rendered before the prompt, if defined on options
  renderHeader() {
    return this.options.header ? this.options.header + '\n' : '';
  }

  // Return the footer to be rendered after the prompt, if defined on options
  renderFooter() {
    return this.options.footer ? '\n' + this.options.footer : '';
  }

  render() {
    return this.abort(new Error('Expected a custom render method to be implemented'));
  }

  async skip() {
    if (this.options.skip === true) {
      this.value = this.options.value;
      return true;
    }
  }

  async format(value) {
    if (typeof this.options.format === 'function') {
      return this.options.format.call(this, value);
    }
    return value;
  }

  async validate(value) {
    if (typeof this.options.validate === 'function') {
      return this.options.validate.call(this, value);
    }
    return true;
  }

  async abort(error) {
    this.answered = this.aborted = true;
    this.close();
    this.emit('abort', error);
  }

  async submit() {
    if (this.closed) return;
    if (this.value === void 0) this.value = this.initial;
    if (await this.validate(this.value) === false) {
      return this.alert();
    }

    this.aborted = false;
    this.answered = true;
    this.close();

    this.value = await this.format(this.value);
    this.emit('submit', this.value);
    return this.value;
  }

  close() {
    if (!this.rl || this.closed) return;
    this.closed = true;
    this.render();
    this.write('\n' + ansi.cursor.show);
    this.input.off('keypress', this._keypress);
    this.rl.close();
    this.emit('close');
  }

  createInterface() {
    if (this.rl) return;
    this.hasRendered = false;
    this.closed = false;
    this._keypress = this.keypress = this.keypress.bind(this);
    this.close = this.close.bind(this);
    const defaults = { input: process.stdin, output: process.stdout };
    const opts = { ...defaults, ...this.options };
    this.output = opts.output;
    this.input = opts.input;
    this.input.on('keypress', this._keypress);
    this.rl = utils.createInterface(opts);
    this.rl.on('SIGINT', this.close);
    process.on('exit', this.close);
  }

  run() {
    const promise = new Promise(async(resolve, reject) => {
      if (this.closed) {
        const prompt = new this.constructor(this.options);
        prompt.run().then(resolve).catch(reject);
        return;
      }

      try {
        this.on('submit', resolve);
        this.on('abort', reject);
        this.createInterface();
        this.emit('run');
        if (await this.skip(this) === true) {
          this.render = () => {};
          return await this.submit();
        }
        this.render(true);
      } catch (err) {
        this.abort(err);
      }
    })
      .then(() => this.value);

    const proto = this.constructor.prototype;
    for (const key in proto) {
      if (!(key in promise) && typeof proto[key] === 'function') {
        promise[key] = this[key].bind(this);
      }
    }
    // promise.on = this.on.bind(this);
    return promise;
  }

  state(custom) {
    const { status, cursor, value, typed, error } = this;
    return { status, cursor, value, typed, error, ...custom };
  }

  get width() {
    return this.output.columns || 80;
  }

  set status(value) {
    throw new Error('prompt.status is a getter and may not be defined');
  }
  get status() {
    if (this.aborted) return 'aborted';
    if (this.answered) return 'answered';
    return 'pending';
  }

  static get prompt() {
    return options => {
      const prompt = new this(options);
      prompt.run();
      return prompt;
    };
  }

  static get run() {
    return options => {
      const prompt = new this(options);
      return prompt.run();
    };
  }

  static get types() {
    return require('./lib/types');
  }

  static get utils() {
    return utils;
  }

  static get base() {
    return Prompt;
  }
}

module.exports = Prompt;
