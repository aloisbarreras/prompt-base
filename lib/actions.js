'use strict';

const keypress = require('./keypress');

/**
 * Default keypress actions
 */

const actions = {
  ctrl: {
    a: 'first',
    c: 'abort',
    d: 'abort',
    e: 'last',
    g: 'reset',
    r: 'remove',
    s: 'save',
    u: 'undo',
    z: 'undo'
  },

  shift: {
    up: 'shiftUp',
    down: 'shiftDown',
    left: 'shiftLeft',
    right: 'shiftRight',
    tab: 'prev'
  },

  keys: {
    abort: 'abort',
    backspace: 'delete',
    down: 'down',
    enter: 'submit',
    escape: 'abort',
    left: 'left',
    space: 'space',
    number: 'number',
    return: 'submit',
    right: 'right',
    tab: 'next',
    up: 'up'
  }
};

module.exports = (ch, k) => {
  const key = keypress(ch, k);

  if (key.ctrl && actions.ctrl[key.name]) {
    key.action = actions.ctrl[key.name];
  } else if (key.shift && actions.shift[key.name]) {
    key.action = actions.shift[key.name];
  } else {
    key.action = actions.keys[key.name];
  }

  return key;
};
