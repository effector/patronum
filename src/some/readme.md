# some

```ts
import { some } from 'patronum/some';
```

## `some({ predicate: Function, stores })`

### Motivation

Method calculates boolean value if at least one state of the store satisfies the condition in `predicate`.
It is useful to check that user filled at least a single field.

### Formulae

```ts
$result = some({ predicate: (value) => true, stores });
```

- read it as: has some predicate at at least one store
- `$result` will be `true` if each at least `predicate` on each store value from `values` returns `true`, otherwise it will be `false`

### Arguments

1. `predicate` `((value: T) => boolean)` — Function to check store value
1. `stores` `(Array<Store<T>>)` — List of stores

### Return

- `$result` `(Store<boolean>)` — `true` if at least one store corresponds to `predicate`

### Example

```ts
const $width = createStore(440);
const $height = createStore(820);

const $tooBig = some({
  predicate: (size) => size > 800,
  stores: [$width, $height],
});

console.assert(true === $tooBig.getState());
```

## `some({ predicate: value, stores })`

### Motivation

This overload compares each store to specific value in `predicate`.
It is useful when you write `combine` with `||` very often, for example to create an invalid form flag.

### Formulae

```ts
$result = some({ predicate: value, stores });
```

- `$result` will be `true` if at least one value in `stores` equals `value`, otherwise it will be `false`

### Arguments

1. `predicate` `(T)` — Data to compare stores values with
1. `stores` `(Array<Store<T>>)` — List of stores to compare with `value`
1. type of `predicate` and `stores` should should be the same

### Return

- `$result` `(Store<boolean>)` — `true` if at least one store contains `value`

### Example

```ts
const $isPasswordCorrect = createStore(true);
const $isEmailCorrect = createStore(true);

const $isFormFailed = some({
  predicate: false,
  stores: [$isPasswordCorrect, $isEmailCorrect],
});

console.assert(false === $isFormFailed.getState());
```

## `some({ predicate: Store, stores })`

### Motivation

This overload compares each store to specific value in store `predicate`.
It is useful when you write `combine` with `||` very often, for example to create an invalid form flag.

### Formulae

```ts
$result = some({ predicate: $value, stores });
```

- `$result` will be `true` if at least one value in `stores` equals value in `$value`, otherwise it will be `false`

### Arguments

1. `predicate` `(Store<T>)` — Store contains value to compare values from `stores` with
1. `stores` `(Array<Store<T>>)` — List of stores to compare with `value`
1. type of `value` and `stores` should be the same

### Return

- `$result` `(Store<boolean>)` — `true` if at least one store contains `value`

### Example

```ts
const $allowToCompare = createStore(true);

const $isPasswordCorrect = createStore(true);
const $isEmailCorrect = createStore(true);

const $isFormFailed = some({
  predicate: $allowToCompare,
  stores: [$isPasswordCorrect, $isEmailCorrect],
});

console.assert(false === $isFormFailed.getState());
```

## Shorthands

```ts
$result = some(stores, value);
$result = some(stores, (value) => false);
$result = some(stores, $predicate);
```

Shorthand have the same rules as the main overrides, just it uses positional arguments instead of object-form.

### Arguments

1. `stores` `(Array<Store<T>>)` — List of stores to compare with predicate in the second argument
2. `predicate` `(Store<T> | (value: T) => boolean | T)` — Predicate to compare with
