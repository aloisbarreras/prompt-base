'use strict';

const colors = require('ansi-colors');
const Store = require('data-store');

module.exports = function(name, options = {}) {
  const opts = { ...options };
  const shape = { past: [], present: null, future: [] };
  const initial = opts.state || shape;
  const store = create(name, opts);

  if (!store.has(`${name}.past`)) {
    store.set(name, initial);
  }

  const history = function(action, value) {
    const val = colors.unstyle(value);
    let state = store.get(name);

    if (!state) {
      state = initial;
      state.present = val;
    }

    let { past, present, future } = state;

    switch (action) {
      case 'prev':
      case 'undo':
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        state = {
          past: unique(newPast),
          present: previous,
          future: unique([present, ...future, value])
        };
        break;

      case 'next':
      case 'redo':
        const next = future[0];
        const newFuture = future.slice(1);
        state = {
          past: unique([...past, present]),
          present: next,
          future: unique(newFuture)
        };
        break;

      case 'save':
        if (val == null || val === '') return;
        state.past.push(state.present, val);
        state.past = unique(state.past);
        state.present = '';
        break;

      case 'remove':
        if (val == null || val === '' || !history.has(val)) return;
        state.past = remove(state.past, val);
        state.future = remove(state.future, val);
        state.present = state.past.pop();
        break;

      default: {
        return val;
      }
    }

    store.set(name, state);
    return state.present;
  };

  history.clone = () => store.clone();

  history.get = key => store.get(`${name}.${key}`);

  history.has = value => {
    let state = store.get(name);
    if (state) {
      const { present, future, past } = state;
      return present === value || future.includes(value) || past.includes(value);
    }
    return false;
  };

  history.update = function() {
    let state = store.get(name) || shape;
    state.past.push(...state.future, state.present);
    state.past = unique(state.past.filter(Boolean));
    state.future = [];
    state.present = '';
    store.set(name, state);
  };

  Reflect.defineProperty(history, 'past', {
    set(arr) {
      store.set(`${name}.past`, arr);
    },
    get() {
      return store.get(`${name}.past`) || [];
    }
  });

  Reflect.defineProperty(history, 'future', {
    set(arr) {
      store.set(`${name}.future`, arr);
    },
    get() {
      return store.get(`${name}.future`) || [];
    }
  });

  Reflect.defineProperty(history, 'present', {
    set(value) {
      store.set(`${name}.present`, value);
    },
    get() {
      return store.get(`${name}.present`) || '';
    }
  });

  history.store = store;
  return history;
};

function create(key, options = {}) {
  const name = `history-${options.type || 'prompt'}-${key}`;
  const store = options.store || new Store(name, { ...options });
  const state = store.get(key);
  if (state) {
    state.future = unique(state.future);
    state.past = unique(state.past);
    store.set(key, state);
  }
  return store;
}

function unique(arr) {
  return arr.filter((ele, i) => {
    let val = colors.unstyle(ele);
    return arr.indexOf(val) === i && val !== '' && val != null;
  });
}

function isValidCode(str) {
  if (!str) return false;
  if (str.length > 1) return true;
  const c = str.charCodeAt(0);
  return c < 127 && (c > 31 || c === 10 || c === 13);
}

function remove(arr, ele) {
  return arr.filter(e => e !== ele);
}
