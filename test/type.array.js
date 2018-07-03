'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const ArrayPrompt = require('../lib/types/array');
const { nextTick, expect, press } = support(assert);
let prompt;

class Prompt extends ArrayPrompt {
  constructor(options = {}) {
    super({ ...options, maxSelected: 1, show: false });
    this.press = press(this);
  }
  render() {}
}

describe('array prompt', function() {
  describe('options.choices', () => {
    it('should add an array of choice objects', () => {
      prompt = new Prompt({
        message: 'prompt-array',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      assert.has(prompt.choices, [
        { name: 'a', message: 'A', enabled: false },
        { name: 'b', message: 'BB', enabled: false },
        { name: 'c', message: 'CCC', enabled: false },
        { name: 'd', message: 'DDDD', enabled: false }
      ]);
    });

    it('should add an array of choice strings', () => {
      prompt = new Prompt({
        message: 'prompt-array',
        choices: [
          'a',
          'b',
          'c',
          'd'
        ]
      });

      assert.has(prompt.choices, [
        { name: 'a', message: 'a', enabled: false },
        { name: 'b', message: 'b', enabled: false },
        { name: 'c', message: 'c', enabled: false },
        { name: 'd', message: 'd', enabled: false }
      ]);
    });
  });

  describe('options.initial', () => {
    it('should take a number as options.initial', () => {
      prompt = new Prompt({
        message: 'prompt-array',
        initial: 2,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      assert.equal(prompt.initial, 2);
      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'c');
        });
    });
  });

  describe('options.value', () => {
    it('should use options.value', () => {
      prompt = new Prompt({
        message: 'prompt-array',
        value: 'b',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'b');
        });
    });

    it('should not use initial value when answer is given', () => {
      prompt = new Prompt({
        message: 'prompt-array',
        initial: 2,
        value: 'a',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      assert.equal(prompt.initial, 2);
      return prompt.run().then(expect('a'));
    });
  });
});
