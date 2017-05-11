var prompt = require('..')({
  name: 'color',
  message: 'What is your favorite color?',
  validate: function(val) {
    if (!val || !val.trim()) {
      return 'must be at least one character'
    }
    return true;
  }
});

prompt.ask(function(answer) {
  console.log(answer);
});


