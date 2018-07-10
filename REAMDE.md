# prompt-base

## Installation
Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save prompt-base
```

## Overview
prompt-base provides base types from which you can create custom prompts for use with [enquirer](https://github.com/enquirer/enquirer).

> Note: These types are meant to be extended and not used directly.

The base types are:
- [array](#Array)
- [boolean](#Boolean)
- [number](#Number)
- [string](String)

In most cases, the standard prompts provided by enquirer will satisfy your needs, but if you need something special, feel free to extend the types in this library.

## Base Types
### Array
The aray type provides common functionality for providing a prompt with a list of values.

The following built-in enquirer types are extended from the array type:
- [select](https://github.com/enquirer/enquirer/blob/dev/prompts/select.js)
- [form](https://github.com/enquirer/enquirer/blob/dev/prompts/form.js)
- [multiselect](https://github.com/enquirer/enquirer/blob/dev/prompts/multiselect.js)
- [radio](https://github.com/enquirer/enquirer/tree/dev/prompts)
- [select](https://github.com/enquirer/enquirer/blob/dev/prompts/select.js)

### Boolean
The boolean type provides common functionality for entering truthy/falsey values.

The following built-in enquirer types are extended from the boolean type:
- [confirm](https://github.com/enquirer/enquirer/blob/dev/prompts/confirm.js)
- [toggle](https://github.com/enquirer/enquirer/blob/dev/prompts/toggle.js)

### Number
The number type provides common functionality for entering numberic values.

The following built-in enquirer types are extended from the number type:

### String
The string type provides common functionality for entering strings.

The following built-in enquirer types are extended from the string type:
- [invisible](https://github.com/enquirer/enquirer/blob/dev/prompts/invisible.js)
- [list](https://github.com/enquirer/enquirer/blob/dev/prompts/list.js)
- [password](https://github.com/enquirer/enquirer/blob/dev/prompts/password.js)
- [text](https://github.com/enquirer/enquirer/blob/dev/prompts/text.js)