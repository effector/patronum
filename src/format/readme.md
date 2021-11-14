# Patronum/Format

```ts
import { format } from 'patronum/format';
```

### Motivation

Sometimes you need to combine several stores into one string, but without `format` you need to write boring `combine` with combinator-function.

### Formulae

```ts
$string = format`parts${$store}`;
```

- on each `$store` change recalculate template and update `$string`

### Arguments

`format` should be called as [tagged template literal function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)

Each part of template literal will be converted to string by `String(argument)`,
that's why format supports `Store<boolean | string | number>`, but also you can pass list of values, and raw values.

### Returns

Method always returns `Store<string>`

### Example with stores with strings

```ts
import { createStore } from 'effector';
import { format } from 'patronum';

const $firstName = createStore('John');
const $lastName = createStore('Doe');

const $fullName = format`${$firstName} ${$lastName}`;
$fullName.watch(console.log);
// => John Doe
```

### Example with stores with arrays

```ts
import { createStore } from 'effector';
import { format } from 'patronum';

const $list = createStore(['First', 'Second', 'Third']);

const $string = format`We have: "${list}"`;
$string.watch(console.log);
// => We have: "First, Second, Third"
```
