# Patronum/Some

```ts
import { some } from 'patronum/some';
```

## `some(predicate, stores)`

```ts
$result = some(predicate, stores);
```

- `$result` will be `true` if each at least `predicate` on each store value from `values` returns `true`, otherwise it will be `false`

### Arguments

1. `predicate` _(`(value: T) => boolean`)_ — Function to check store value
1. `stores` _(`Array<Store<T>>`)_ — List of stores

### Return

- `$result` _(`Store<boolean>`)_ — `true` if at least one store corresponds to `predicate`

### Example

```ts
const $width = createStore(440);
const $height = createStore(820);

const $tooBig = some((size) => size > 800, [$width, $height]);

console.assert(true === $tooBig.getState());
```

## `some(value, stores)`

```ts
$result = some(value, stores);
```

- `$result` will be `true` if at least one value in `stores` equals `values`, otherwise it will be `false`

### Arguments

1. `value` _(`T`)_ — Data to compare stores values with
1. `stores` _(`Array<Store<T>>`)_ — List of stores to compare with `value`
1. type of `value` and `stores` should should be the same

### Return

- `$result` _(`Store<boolean>`)_ — `true` if at least one store contains `value`

### Example

```ts
const $isPasswordCorrect = createStore(true);
const $isEmailCorrect = createStore(true);

const $isFormFailed = some(false, [$isPasswordCorrect, $isEmailCorrect]);

console.assert(false === $isFormFailed.getState());
```
