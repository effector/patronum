# debounce

```ts
import { debounce } from 'patronum/debounce';
```

## `debounce({ source, timeout })`

### Motivation

Method creates a new event, that will be triggered after some time. It is useful for handling user events such as scrolling, mouse movement, or keypressing.
It is useful when you want to pass created event immediately to another method as argument.

### Formulae

```ts
event = debounce({ source, timeout });
```

- Wait for `timeout` after the last time `source` was triggered, then trigger `event` with payload of the `source`

### Arguments

1. `source` `(Event<T>` | `Store<T>` | `Effect<T>)` — Source unit, data from this unit used by the `event`
1. `timeout` `(number | Store<number>)` — time to wait before trigger `event`

### Returns

- `event` `(Event<T>)` — New event, that triggered after delay

### Example

```ts
import { createEvent } from 'effector';
import { debounce } from 'patronum/debounce';

const DEBOUNCE_TIMEOUT_IN_MS = 200;

const someHappened = createEvent<number>();
const debounced = debounce({
  source: someHappened,
  timeout: DEBOUNCE_TIMEOUT_IN_MS,
});

debounced.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);

// someHappened now 4
```

## `debounce({ source, timeout, target })`

### Motivation

This overload receives target as argument, that will be triggered after timeout.
It is useful when you already have an unit that you need to trigger.

### Formulae

```ts
event = debounce({ source, timeout, target });
```

- Wait for `timeout` after the last time `source` was triggered and call `target` with data from the `source`

### Arguments

1. `source` `(Event<T>` | `Store<T>` | `Effect<T>)` — Source unit, data from this unit used to trigger `target` with payload of the `source`
1. `timeout` `(number | Store<number>)` — time to wait before trigger `event`
1. `target` `(Event<T>` | `Store<T>` | `Effect<T>)` — Target unit, data from the `source` will be passed to this unit

### Returns

- `target` `(Event<T>` | `Store<T>` | `Effect<T>)` — Target unit that was passed to input argument `target`

### Example

```ts
import { createEvent, createStore } from 'effector';
import { debounce } from 'patronum/debounce';

const DEBOUNCE_TIMEOUT_IN_MS = 200;

const someHappened = createEvent<number>();
const target = createStore<number>(0);
const debounced = debounce({
  source: someHappened,
  timeout: DEBOUNCE_TIMEOUT_IN_MS,
  target,
});

debounced.watch((payload) => {
  console.info('someHappened now', payload);
});

target.watch((payload) => {
  console.info('got data', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);

// someHappened now 4
// got data 4
```

### Example with timeout as store

```ts
import { createStore } from 'effector';
import { debounce } from 'patronum';

const DEBOUNCE_TIMEOUT_IN_MS = 200;

const changeTimeout = createEvent<number>();
const $timeout = createStore(DEBOUNCE_TIMEOUT_IN_MS).on(changeTimeout, (_, value) => value);
const someHappened = createEvent<number>();
const debounced = debounce({
  source: someHappened,
  timeout: $timeout,
});

debounced.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
changeTimeout(400); // will be applied after next source trigger
someHappened(2);

setTimout(() => {
  // console clear
}, 200);

setTimout(() => {
  // someHappened now 2
}, 400)
```