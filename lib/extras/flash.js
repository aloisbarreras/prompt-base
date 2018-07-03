'use strict';

const hideCursor = '\u001B[?25l';
const showCursor = '\u001B[?25h';

const flash = async(prompt, msg, ms = 1000) => {
  const orig = prompt.help;
  let cursorHidden = prompt.cursorHidden;
  let resolved = false;
  let timeout;

  const clear = () => {
    prompt.clearTimeout && prompt.clearTimeout();
    prompt.off('keypress', clear);
  };

  prompt.on('keypress', clear);
  if (!cursorHidden) prompt.hideCursor();
  prompt.help = msg;
  prompt.render();

  return new Promise((resolve, reject) => {
    const dispatch = () => {
      if (resolved === true) return;
      resolved = true;
      try {
        prompt.cursor = 0;
        if (!cursorHidden) prompt.showCursor();
        prompt.help = orig;
        prompt.render();
        resolve();
      } catch (err) {
        reject();
      }
    };

    timeout = setTimeout(dispatch, ms);
    prompt.clearTimeout = () => {
      if (resolved === true) return;
      prompt.clearTimeout = void 0;
      clearTimeout(timeout);
      dispatch();
    };
  });
};

module.exports = flash;
