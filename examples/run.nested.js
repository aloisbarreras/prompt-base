var answers = [];
var Prompt = require('..');
var prompt = new Prompt({
  name: 'color',
  message: 'What is your favorite color?'
});

prompt.run()
  .then(function(answer) {
    answers.push(answer);

    prompt.run()
      .then(function(answer) {
        answers.push(answer);

        prompt.run()
          .then(function(answer) {
            answers.push(answer);
            console.log(answers)
          });
      });
  });



