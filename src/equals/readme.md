# equals

:::note since
patronum 1.11.0
:::

```ts
import { equals } from 'patronum';
// or
import { equals } from 'patronum/equals';
```

### Motivation

The method allows to compare store value with another value wrote as literal or contained in another store.

### Formulae

```ts
$isEquals = equals(first, second);
```

- `$isEquals` will be store with `true` if value in `first` and `second` is equals by comparing them with `===`

### Arguments

1. `first: Store<T> | T` — A value or the store to compare with `second`
2. `second: Store<T> | T` — A value or the store to be compared with `first`

### Returns

- `$isEquals: Store<boolean>` — The store contains `true` if values is equals

### Example

```ts
const $first = createStore('foo bar');
const $isEquals = equals($first, 'foo bar');

console.assert(true === $isEquals.getState());
```

[Try it](https://share.effector.dev/UtAWVd9r)

### Composition

The `equals` operator can be composed with any other method of patronum:

```ts
const $account = createStore<Account | null>(null);
const $authorized = not(equals($account, null));
// $authorized contains `true` only when $account contains not `null`
```

### Alternative

Compare to literal value:

```ts
import { createStore } from 'effector';
const $first = createStore('foo bar');
const $isEquals = $first.map((first) => first === 'foo bar');

console.assert(true === $isEquals.getState());
```

Compare to another store:

```ts
import { createStore, combine } from 'effector';
const $first = createStore('foo bar');
const $second = createStore('foo bar');
const $isEquals = combine($first, $second, (first, second) => first === second);

console.assert(true === $isEquals.getState());
```
