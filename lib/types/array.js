'use strict';

const colors = require('ansi-colors');
const Prompt = require('../..');
const { utils } = Prompt;

class ArrayPrompt extends Prompt {
  constructor(options) {
    super(options);
    this.choices = normalize(options.choices || []);
    this.initial = options.initial;
    this.value = options.value || this.initial;
    this.aliases = [];
    this.longest = 0;
    this.toChoices();
    const cursor = options.cursor || this.initial;
    this.cursor = Math.max(this.findIndex(cursor), 0);
  }

  createInterface() {
    super.createInterface();
    if (this.selected && this.selected.disabled) {
      throw new Error('the default choice may not be disabled');
    }
  }

  skip() {
    if (this.options.value !== void 0) {
      this.value = this.find(choice => choice.enabled);
      return true;
    }
  }

  toChoice(choice, choices = []) {
    if (typeof choice === 'string') {
      choice = { name: choice };
    }

    const parent = choice.group;
    const val = utils.first(this.value, this.initial);
    const i = choices.length;
    choice.index = i;
    choice.number = i + 1;
    choice.hint = choice.hint || '';
    choice.indent = choice.indent || '';
    choice.name = choice.name || choice.key || choice.value || choice.message;
    choice.message = choice.message || choice.title || choice.name || choice.value;
    choice.value = choice.value || choice.name;

    if (typeof choice.disabled === 'string') {
      choice.hint = choice.disabled;
      choice.disabled = true;
    }

    if (typeof choice.enabled !== 'boolean') {
      choice.enabled = val !== void 0 && (choice.name === val || i === val);
    }

    if (choice.group) {
      choice.indent = choice.group.indent + '  ';
    }

    Reflect.defineProperty(choice, 'status', {
      get() {
        if (this.disabled) return 'disabled';
        if (this.expandable === true && this.choices) {
          return this.expanded ? 'expanded' : 'collapsed';
        }
        if (this.enabled === false) return 'off';
        if (this.enabled === true) return 'on';
        return 'default';
      }
    });

    this.longest = Math.max(this.longest, choice.message.length);
    this.aliases.push(choice.alias || '');
    return choice;
  }

  toChoices(choices = this.choices) {
    choices = normalize(choices);
    let arr = [];

    const addChoices = choices => {
      if (!choices) return;
      for (let choice of choices) {
        choice = this.toChoice(choice, arr);
        if (!arr.includes(choice)) arr.push(choice);
        addChoices(choice.choices);
      }
    };

    addChoices(choices);
    this.choices = this._choices = arr;
    if (!this.limit) {
      this.limit = this.options.limit || Math.min(arr.length, 10);
    }
    this.toList();
  }

  toList() {
    this.list = this.choices.slice(0, this.limit);
  }

  find(val) {
    switch (typeof val) {
      case 'undefined': return;
      case 'object':
        return val;
      case 'number':
        return this.choices.find(ch => ch.index === val);
      case 'string':
        return this.choices.find(ch => ch.alias === val || ch.name === val);
      case 'function':
        return this.choices.find(val.bind(this));
      default: {
        throw new TypeError(`invalid type: "${typeof val}"`);
      }
    }
  }

  findIndex(val) {
    let choice = this.find(val);
    if (choice) return choice.index;
    return -1;
  }

  toggle() {
    const choice = this.selected;
    if (this.maxSelected === 1) {
      choice.enabled = !choice.enabled;
    } else {
      this.choices.forEach((choice, i) => (choice.enabled = this.cursor === i));
    }
  }

  number(i) {
    const n = +i;
    const choice = this.find(n);

    if (!choice) {
      this.alert();
      return false;
    }

    if (this.list.includes(choice)) {
      this.moveCursor(this.list.indexOf(choice));
      this.render();
      return true;
    }

    if (this.options.paginate === false) {
      this.alert();
      return false;
    }

    let currentIdx = this.choices.indexOf(choice);
    let posChoice = this.list[this.cursor];
    let pos = posChoice.index;
    let idx = choice.index;
    let start, end;

    if (idx <= pos) {
      this.cursor = 0;
      start = this.choices.slice(currentIdx);
      end = this.choices.slice(0, currentIdx);
    } else {
      this.cursor = this.list.length - 1;
      start = this.choices.slice(currentIdx - this.list.length + 1);
      end = this.choices.filter(choice => !start.includes(choice));
    }

    this.choices = start.concat(end);
    this.toList();
    this.render();
    return true;
  }

  moveCursor(i) {
    this.cursor = i;
  }

  reset() {
    this.moveCursor(this.initial);
    this.render();
  }

  first() {
    this.moveCursor(0);
    this.render();
  }
  last() {
    this.moveCursor(this.choices.length - 1);
    this.render();
  }

  prev() {
    this.up();
  }
  next() {
    this.down();
  }

  up() {
    let len = this.list.length;
    let pos = this.cursor - 1;
    if (this.options.paginate !== false && len < this.choices.length && pos === -1) {
      return this.pageUp();
    }
    if (pos < 0) pos = len - 1;
    this.moveCursor(pos);
    this.render();
    if (this.selected && this.selected.disabled) {
      this.up();
    }
  }
  down() {
    let len = this.list.length;
    let pos = this.cursor + 1;
    if (this.options.paginate !== false && len < this.choices.length && pos === len) {
      return this.pageDown();
    }
    if (pos === len) pos = 0;
    this.moveCursor(pos);
    this.render();
    if (this.selected && this.selected.disabled) {
      this.down();
    }
  }

  pageUp() {
    const list = this.choices.slice();
    const item = list.pop();
    this.choices = [item, ...list];
    this.toList();
    this.render();
    const choice = this.selected;
    if (choice && (choice.disabled || choice.collapsed === true)) {
      this.up();
    }
  }
  pageDown() {
    const list = this.choices.slice();
    const item = list.shift();
    this.choices = [...list, item];
    this.toList();
    this.render();
    const choice = this.selected;
    if (choice && (choice.disabled || choice.collapsed === true)) {
      this.down();
    }
  }

  shiftUp() {
    if (this.limit <= 1) return this.alert();
    this.limit > 1 ? this.limit-- : 1;
    if (this.limit <= this.cursor) {
      this.cursor = this.limit - 1;
    }
    this.toList();
    this.render();
  }
  shiftDown() {
    if (this.limit === this.choices.length) return this.alert();
    this.limit < this.choices.length ? this.limit++ : this.choices.length;
    this.toList();
    this.render();
  }

  exceedsMaxSelected(max = this.maxSelected) {
    return max && [].concat(this.selected || []).length > max;
  }

  renderMessage(value = '') {
    const prefix = this.style.prefix();
    const sep = this.style.separator();
    const msg = `${prefix} ${this.options.message} ${sep} ${value}`;
    return msg.trim();
  }

  get selected() {
    const method = this.options.maxSelected === 1 ? 'find' : 'filter';
    return this.choices[method](choice => choice.enabled);
  }

  submit() {
    this.value = this.selected.value;
    return super.submit();
  }

  static get ArrayPrompt() {
    return ArrayPrompt;
  }
}

function normalize(choices, group) {
  if (Array.isArray(choices)) {
    return choices.map(choice => toChoice(choice, group));
  }
  const arr = [];
  for (const name of Object.keys(choices)) {
    arr.push(toChoice({ name, choices: choices[name] }, group));
  }
  return arr;
}

function toChoice(choice, group) {
  if (typeof choice === 'string') {
    choice = { name: choice };
  }
  if (choice.choices) {
    choice.choices = normalize(choice.choices, choice);
  }
  Reflect.defineProperty(choice, 'group', { value: group });
  choice.indent = '';
  return choice;
}

module.exports = ArrayPrompt;
