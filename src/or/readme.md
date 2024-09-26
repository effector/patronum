---
title: or
slug: or
description: Checks at least one store for truthy value.
group: predicate
---

:::note[since]
patronum 1.11.0
:::

```ts
import { or } from 'patronum';
// or
import { or } from 'patronum/or';
```

### Motivation

The method allows to check each passed store for truthy values.
It can be compared with `if (a || b || c || d)`.

### Formulae

```ts
$result = or(...stores);
```

- `$result` store contains `true` if at least one of passed store contains "truthy" value.

### Arguments

The method receives any amount of arguments.

- `...stores: Array<Store<T>>` — Each argument must be store with a value of any kind.

### Returns

- `$result: Store<boolean>` — The store contains `false` if each passed store in `stores` contains "falsey" value

### Example

```ts
const $isAuthorized = createStore(true);
const $immediateOrder = createStore(false);
const $mocksForDemo = createStore(false);

const $allowedToShow = or($isAuthorized, $immediateOrder, $mocksForDemo);
console.assert(true === $allowedToShow.getState());
```

[Try it](https://share.effector.dev/H9cDYEp5)

#### Alternative

```ts
import { combine, createSTore } from 'effector';

const $isAuthorized = createStore(true);
const $immediateOrder = createStore(false);
const $mocksForDemo = createStore(false);

const $allowedToShow = combine(
  $isAuthorized,
  $immediateOrder,
  $mocksForDemo,
  (isAuthorized, immediateOrder, mocksForDemo) =>
    isAuthorized || immediateOrder || mocksForDemo,
);
console.assert(true === $allowedToShow.getState());
```
