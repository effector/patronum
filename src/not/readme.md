# not (experimental)

:::note since
patronum 1.8.3
:::

```ts
import { not } from 'patronum/not';
```

### Motivation

The method allows to apply boolean NOT to a value.
Actually converts any "falsey" value into `true` (null, 0, empty string).
But `undefined` is not present, because Store cannot hold it inside.

### Formulae

```ts
$result = not($value);
```

- `$result` store contains `false` if `$value` contains any "truthy" value, otherwise there will be `true`

### Arguments

- `$value: Store<T>` — Any value, that required to be "inverted"

### Returns

- `$result: Store<boolean>`

### Example

```ts
const $isFinished = createStore(false);
const $stillGoingOn = not($isFinished);

console.assert(true === $stillGoingOn.getState());
```

[Try it](https://share.effector.dev/qpTZAzXC)

### Alternative

```ts
const $isFinished = createStore(false);
const $stillGoingOn = $isFinished.map((isFinished) => !isFinished);

console.assert(true === $stillGoingOn.getState());
```
