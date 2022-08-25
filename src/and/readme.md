# and

:::note since
patronum 1.11.0
:::

```ts
import { and } from 'patronum';
// or
import { and } from 'patronum/and';
```

### Motivation

The method allows to check each passed store for thruthy values.
It can be compared with `if (a && b && c && d)`.

### Formulae

```ts
$result = and(...stores);
```

- `$result` store contains `true` if each passed store contains "truthy" values.

### Arguments

The method receives any amount of arguments.

- `...stores: Array<Store<T>>` — Each argument must be store with a value of any kind.

### Returns

- `$result: Store<boolean>` — The store contains `false` if at least one passed store in `stores` contains "falsey" value

### Example

```ts
const $isAuthorized = createStore(true);
const $isAdmin = createStore(false);
const $orderFinished = createStore(true);

const $showCancelButton = and($isAuthorized, $isAdmin, $orderFinished);
console.assert(false === $showCancelButton.getState());
```

[Try it](https://share.effector.dev/YbahaYCO)

### Composition

```ts
const $showRegisterLink = and(
  not($isAuthorized),
  or($isRegisterInProcess, $isEmailRecovering),
);
```

### Alternative

```ts
const $showRegisterLink = combine(
  $isAuthorized,
  $isRegisterInProcess,
  $isEmailRecovering,
  (isAuthorized, isRegisterInProcess, isEmailRecovering) => {
    return !isAuthorized && (isRegisterInProcess || isEmailRecovering);
  }
);
console.assert(false === $showRegisterLink.getState());
```
