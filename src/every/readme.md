# every

```ts
import { every } from 'patronum/every';
```

## `every({ predicate: Function, stores })`

### Motivation

Method calculates boolean value if each store satisfies the condition in `predicate`.
It is useful to check that user has correct values in each state.

### Formulae

```ts
$result = every({ predicate: fn, stores });
```

- `$result` will be `true` if each call `predicate` on each store value from `values` returns `true`, otherwise it will be `false`

### Arguments

1. `predicate` `((value: T) => boolean)` — Function to check store value
1. `stores` `(Array<Store<T>>)` — List of stores

### Return

- `$result` `(Store<boolean>)` — `true` if each store corresponds to `predicate`

### Example

```ts
const $width = createStore(440);
const $height = createStore(780);

const $fitsSquare = every({
  predicate: (size) => size < 800,
  stores: [$width, $height],
});

console.assert(true === $fitsSquare.getState());
```

## `every({ predicate: value, stores })`

### Motivation

This overload compares each store to specific value in `predicate`.
It is useful when you write `combine` with `&&` very often, for example to create a pending state or a form valid flag.

### Formulae

```ts
$result = every({ predicate: value, stores });
```

- `$result` will be `true` if each value in `stores` equals `value`, otherwise it will be `false`

### Arguments

1. `predicate` `(T)` — Data to compare stores values with
1. `stores` `(Array<Store<T>>)` — List of stores to compare with `value`
1. type of `value` and `stores` should be the same

### Return

- `$result` `(Store<boolean>)` — `true` if each store contains `value`

### Example

```ts
const $isPasswordCorrect = createStore(true);
const $isEmailCorrect = createStore(true);

const $isFormCorrect = every({
  predicate: true,
  stores: [$isPasswordCorrect, $isEmailCorrect],
});

console.assert(true === $isFormCorrect.getState());
```

## `every({ predicate: Store, stores })`

### Motivation

This overload compares each store to specific value in the store `predicate`.
It is useful when you write `combine` with `&&` very often, for example to create a pending state or a form valid flag.

### Formulae

```ts
$result = every({ predicate: $value, stores });
```

- `$result` will be `true` if each value in `stores` equals value in the `$value`, otherwise it will be `false`

### Arguments

1. `predicate` `(Store<T>)` — Store contains value to compare values from `stores` with
1. `stores` `(Array<Store<T>>)` — List of stores to compare with `$value` store
1. type of `value` and `stores` should be the same

### Return

- `$result` `(Store<boolean>)` — `true` if each store contains value from the `predicate` store

### Example

```ts
const $allowToCompare = createStore(true);

const $isPasswordCorrect = createStore(true);
const $isEmailCorrect = createStore(true);

const $isFormCorrect = every({
  predicate: $allowToCompare,
  stores: [$isPasswordCorrect, $isEmailCorrect],
});

console.assert(true === $isFormCorrect.getState());
```

## Shorthands

```ts
$result = every(stores, value);
$result = every(stores, (value) => false);
$result = every(stores, $predicate);
```

Shorthand have the same rules as the main overrides, just it uses positional arguments instead of object-form.

### Arguments

1. `stores` `(Array<Store<T>>)` — List of stores to compare with predicate in the second argument
2. `predicate` `(Store<T> | (value: T) => boolean | T)` — Predicate to compare with
