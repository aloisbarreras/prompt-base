'use strict';

module.exports = function(prompt) {
  const history = function(action, key, value) {
    let state = prompt.store.get(key);
    let { past, present, future } = state;

    switch (action) {
      case 'prev':
      case 'undo':
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        state = {
          past: newPast,
          present: previous,
          future: [present, ...future]
        };
        break;

      case 'next':
      case 'redo':
        const next = future[0];
        const newFuture = future.slice(1);
        state = {
          past: [...past, present],
          present: next,
          future: newFuture
        };
        break;

      case 'save':
        state.present = value;
        history.clean(state);
        prompt.store.set(key, state);
        break;

      case 'remove':
        state.present = '';
        history.clean(state, value);
        prompt.store.set(key, state);
        break;

      default: {
        state.present = value;
        break;
      }
    }

    return state;
  };

  history.clean = function(state, valueToRemove) {
    state.future = unique(state.future.filter(Boolean));
    state.past = unique(state.past.filter(Boolean));
    if (valueToRemove) {
      state.future = remove(state.future, valueToRemove);
      state.past = remove(state.past, valueToRemove);
    }
  };

  history.set = function(key, state) {
    history.clean(state);
    prompt.store.set(key, state);
  };

  history.update = function(values) {
    let res = {};
    for (const key of Object.keys(values)) {
      let { past, present, future } = prompt.store.get(key);
      let value = values[key];
      past.push(...future, present, value);
      past = unique(past.filter(Boolean));
      future = [];
      present = '';
      res[key] = { past, present, future };
    }
    prompt.store.set(res);
  };

  return history;
};

function unique(arr) {
  return arr.filter((ele, i) => arr.indexOf(ele) === i);
}

function remove(arr, ele) {
  return arr.filter(e => e !== ele);
}
