## Static methods

All prompt classes are exposed as static methods on themselves to allow inheriting classes to easily access that specific class and its properties, regardless of how many ancestors are in the prototype chain.

Example:

```js
class MultiSelect {
  static get multiselect() {
    return MultiSelect;
  }
}

class Foo extends MultiSelect {}
class Bar extends Foo {}

console.log(Bar.multiselect === MultiSelect.multiselect) //=> true
```


## All properties

| **Name** | **Type** | **Description** | **Prompts** | 
| --- | --- | --- | --- | 
|  |  |  | | 

## All options

| **Name** | **Type** | **Description** | **Prompts** | 
| --- | --- | --- | --- |
|  |  |  |  |


## API

## Base types

- String prompts
- Array prompts
- Boolean prompts
- Number prompts
- Date prompts



## Date prompts
## Number prompts
## String prompts
### Instance properties

- `prompt.cursor` - the position of the cursor in the `prompt.typed` string.


## Boolean prompts
## Array prompts

***

## Question objects

Question are represented as `Question` objects that implement the following interface:

```js
interface Question {
  type: string;
  name: string;
  message: string;
}
```

### Question properties

- `type` **{string}** - A string representing the question type. This property is necessary for Enquirer to determine the type of prompt to run.
- `name` **{string}** - The name of the prompt, used as the key for the answer on the returned answers object.
- `message` **{string}** - The message to display when the prompt is rendered in the terminal.


***


```js
const question = {
  type: 'select',
  name: 'colors',
  message: 'Pick a color',
  initial: 1,
  choices: [
    { message: 'Red', value: '#ff0000' },
    { message: 'Green', value: '#00ff00' },
    { message: 'Blue', value: '#0000ff' }
  ]
};
```


### Choice object

```js
Choice {
  name: string;
  message: string | undefined;
  value: any | undefined;
  key: string | undefined;

  hint: string | undefined;
  disabled: boolean | undefined;
  selected: boolean | undefined;
}
```

| **Property**  | **Type**   | **Description**  | 
| --- | --- | --- |
| `name`        | `string`   | The unique id for a choice |
| `message`     | `string`   | The message to display  |
| `value`       | `string`   | The value to return if the choice is selected |
| `alias`       | `string`   | Single character to use when keypress shortcuts are supported |
| `hint`        | `string`   |  |
| `error`       | `string`   |  |
| `disabled`    | `boolean`  |  |
| `separator`   | `boolean`  |  |
| `selected`    | `boolean`  |  |

**Aliases**

- `title` - alias for `message`
- `help` - alias for `help`
- `checked` - alias for `selected`