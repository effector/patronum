---
title: includes
slug: includes
description: Checks if a value exists within a store containing a string or an array.
group: predicate
---

```ts
import { includes } from 'patronum';
// or
import { includes } from 'patronum/includes';
```

### Motivation

The includes method allows checking if a store (containing either a string or an array) includes a specified value. This value can either be written as a literal or provided through another store.

### Formulae

```ts
$isInclude = includes(container, value);
```

- `$isInclude` will be a store containing `true` if the `value` exists in `container`

### Arguments

1. `container: Store<string> | Store<Array<T>>` — A store with a string or an array where the `value` will be searched.
2. `value: T | Store<T>` — A literal value or a store containing the value to be checked for existence in `container`.

### Returns

- `$isInclude: Store<boolean>` — The store containing `true` if value exists within `container`, false otherwise.

### Example

#### Checking in Array

```ts
const $array = createStore([1, 2, 3]);
const $isInclude = includes($array, 2);

console.assert($isInclude.getState() === true);
```

#### Checking in String

```ts
const $string = createStore('Hello world!');
const $isInclude = includes($string, 'Hello');

console.assert($isInclude.getState() === true);
```

### Composition

The `includes` operator can be composed with other methods in patronum:

```ts
import { not } from 'patronum';

const $greeting = createStore('Hello world!');
const $isNotInclude = not(includes($greeting, 'Goodbye'));
// $isNotInclude contains `true` only when 'Goodbye' is not in $greeting
```

### Alternative

Compare to literal value:

```ts
import { createStore } from 'effector';
const $array = createStore([1, 2, 3]);
const $isInclude = $array.map((array) => array.includes(2));

console.assert($isInclude.getState() === true);
```

Compare to another store:

```ts
import { createStore, combine } from 'effector';
const $array = createStore([1, 2, 3]);
const $value = createStore(2);
const $isInclude = combine($array, $value, (array, value) => array.includes(value));

console.assert($isInclude.getState() === true);
```
