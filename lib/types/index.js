'use strict';

define(exports, 'array', () => require('./array'));
define(exports, 'boolean', () => require('./boolean'));
define(exports, 'number', () => require('./number'));
define(exports, 'string', () => require('./string'));

function define(obj, key, get) {
  Reflect.defineProperty(obj, key, { get });
}
