'use strict';

const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const extras = {
  heart: '❤',
  hexagon: {
    off: '⬡',
    on: '⬢'
  },
  ballot: {
    on: '☑',
    off: '☐',
    disabled: '☒'
  },
  stars: {
    on: '★',
    off: '☆',
    disabled: '☆'
  },
  folder: {
    on: '▼',
    off: '▶',
    disabled: '▶'
  }
};

const windows = {
  check: '√',
  cross: '×',
  ellipsis: '...',
  info: 'i',
  line: '─',
  middot: '·',
  minus: '－',
  plus: '＋',
  pointer: '>',
  pointerSmall: '»',
  question: '?',
  questionSmall: '﹖',
  warning: '‼',
  radio: {
    off: '( )',
    on: '(*)',
    disabled: '(|)'
  },
  ...extras
};

const other = {
  check: '✔',
  cross: '✖',
  ballotCross: '✘',
  ellipsis: '…',
  info: 'ℹ',
  line: '─',
  middot: '·',
  minus: '－',
  plus: '＋',
  pointer: isLinux ? '▸' : '❯',
  pointerSmall: isLinux ? '‣' : '›',
  question: '?',
  questionFull: '？',
  questionSmall: '﹖',
  warning: '⚠',
  radio: {
    off: '◯',
    on: '◉',
    disabled: 'Ⓘ'
  },
  ...extras
};

module.exports = isWindows ? windows : other;
