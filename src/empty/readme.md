# empty (experimental)

:::note since
patronum 1.10.0
:::

:::danger experimental
Operator is going to be renamed. Please review [the discussion](https://github.com/effector/patronum/discussions/224).
:::

```ts
import { empty } from 'patronum';
// or
import { empty } from 'patronum/empty';
```

### Motivation

The method allows to check passed value for `null`.
Sometimes you need just to check for nullability, and go on.

### Formulae

```ts
$result = empty($value);
```

- `$result` store contains `true` if `$value` store contains `null`

### Arguments

- `$value: Store<T | null>` — The store contains any kind of value.

### Returns

- `$result: Store<boolean>` — The store contains `false` if passed `$value` store contains any kind of value other from `null`

### Example

```ts
const $account = createStore<Account | null>(null);
const $anonymous = empty($account);
const $authorized = not($anonymous);

console.assert(true === $anonymous.getState());
console.assert(false === $authorized.getState());
```

[Try it](https://share.effector.dev/aY8yRLP9)

### Alternative

```ts
import { createStore } from 'effector';
const $account = createStore<Account | null>(null);
const $anonymous = $account.map((account) => account === null);
const $authorized = $anonymous.map((anonymous) => !anonymous);

console.assert(true === $anonymous.getState());
console.assert(false === $authorized.getState());
```
