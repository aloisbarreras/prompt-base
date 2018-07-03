'use strict';

const colors = require('ansi-colors');
const { dim } = colors;

module.exports = {
  default: {
    scale: 1,
    initial: (input = '') => `${input}`,
    render: (input = '') => `${input}`
  },
  number: {
    scale: 1,
    render: (input = '') => Number(input),
    initial: (input = '') => input !== void 0 ? Number(input) : ''
  },
  double: {
    scale: 2,
    render: (input = '') => `${input}${input}`,
    initial(input = '') {
      return [...input].map(this.render).join('');
    }
  },
  invisible: {
    scale: 0,
    render: () => '',
    initial: () => ''
  },
  password: {
    scale: 1,
    render: (input = '') => dim('*'.repeat(input.length)),
    initial(input = '') {
      return this.render(input);
    }
  },
  emoji: {
    scale: 2,
    render: (input = '') => '😃'.repeat(input.length),
    initial(input = '') {
      return this.render(input);
    }
  }
};
