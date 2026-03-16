---
title: throttle
slug: throttle
description: Creates event which triggers at most once per timeout.
group: timeouts
---

```ts
import { throttle } from 'patronum';
// or
import { throttle } from 'patronum/throttle';
```

## `target = throttle(source, timeout)`

### Motivation

This method allows to trigger `target` in equal timeouts regardless of source trigger frequency.
It is useful in live search in UI.

:::note[since]
patronum 2.1.0
Use `throttle({ source, timeout })` with patronum < 2.1.0
:::

### Formulae

```ts
target = throttle(source, timeout);
```

- Triggers `target` at most once per `timeout` after triggering `source`

### Arguments

1. `source` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Source unit, data from this unit used by the `target`
2. `timeout` ([_`number`_] | `Store<number>`) — time to wait before trigger `target` after last trigger or `source` trigger

### Returns

- `target` ([_`Event`_]) — new event, that triggered each time after triggering `source` with argument from `source`

### Usage

Create event that should be throttled:

```ts
import { createEvent } from 'effector';

const someHappened = createEvent<number>();
```

Create throttled event from it:

```ts
import { throttle } from 'patronum';

const THROTTLE_TIMEOUT_IN_MS = 200;

const throttled = throttle(someHappened, THROTTLE_TIMEOUT_IN_MS);
```

When you call `someHappened` it will make throttled call the `throttled` event:

```ts
throttled.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);

// after 200 ms after first call
// => someHappened now 4
```

Also you can use `Effect` and `Store` as trigger. `throttle` always returns `Event`:

```ts
const event = createEvent<number>();
const throttledEvent: Event<number> = throttle(event, 100);

const fx = createEffect<number, void>();
const throttledEffect: Event<number> = throttle(fx, 100);

const $store = createStore<number>(0);
const throttledStore: Event<number> = throttle($store, 100);
```

## `throttle({ source, timeout, target })`

### Motivation

This overload allows to receive target instead of returning it.
This is useful when you already have a unit that should be triggered.

### Formulae

```ts
throttle({ source, timeout, target });
```

- Triggers `target` at most once per `timeout` after triggering `source`

### Arguments

1. `source` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Source unit, data from this unit used by the `target`
2. `timeout` ([_`number`_] | `Store<number>`) — time to wait before trigger `target` after last trigger or `source` trigger
3. `target` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Target unit, that triggered each time after triggering `source` with argument from `source`

### Returns

- `target` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Target unit passed to arguments

### Usage

```ts
const change = createEvent();
const $source = createStore(0).on(change, (state) => state + 1);

const $dumped = createStore(0);
$dumped.watch((payload) => {
  localStorage.setItem('dump', JSON.stringify(payload));
});

throttle({ source: $source, timeout: 40, target: $dumped });

change();
change();
change();

// after 40ms after first call, 3 will be saved to localStorage
```

### Example with timeout as store

The new timeout will be used after the previous is over (if there was a delayed `target` trigger when the `timeout` store changed).

```ts
import { createEvent } from 'effector';
import { throttle } from 'patronum';

const someHappened = createEvent<number>();
const changeTimeout = createEvent<number>();
const $timeout = createStore(200).on(changeTimeout, (_, value) => value);

const throttled = throttle({
  source: someHappened,
  timeout: $timeout,
});
throttled.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
changeTimeout(300); // will be used for next timeout
someHappened(2);

setTimout(() => {
  // console.log: someHappened now 2
  someHappened(3);
  someHappened(4);
}, 200);

setTimeout(() => {
  // console.log: someHappened now 4
}, 500);
```

## `target = throttle({ source, timeout })`

### Motivation

This overload receives `source` and `timeout` as an object. May be useful for additional clarity, but it's longer to write

### Formulae

```ts
target = throttle({ source, timeout });
```

- Triggers `target` at most once per `timeout` after triggering `source`

### Arguments

1. `source` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Source unit, data from this unit used by the `target`
2. `timeout` ([_`number`_] | `Store<number>`) — time to wait before trigger `target` after last trigger or `source` trigger

### Returns

- `target` ([_`Event`_]) — new event, that triggered each time after triggering `source` with argument from `source`

### Usage

Create event that should be throttled:

```ts
import { createEvent } from 'effector';

const someHappened = createEvent<number>();
```

Create throttled event from it:

```ts
import { throttle } from 'patronum';

const THROTTLE_TIMEOUT_IN_MS = 200;

const throttled = throttle({
  source: someHappened,
  timeout: THROTTLE_TIMEOUT_IN_MS,
});
```

When you call `someHappened` it will make throttled call the `throttled` event:

```ts
throttled.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);

// after 200 ms after first call
// => someHappened now 4
```

Also you can use `Effect` and `Store` as trigger. `throttle` always returns `Event`:

```ts
const event = createEvent<number>();
const throttledEvent: Event<number> = throttle({ source: event, timeout: 100 });

const fx = createEffect<number, void>();
const throttledEffect: Event<number> = throttle({ source: fx, timeout: 100 });

const $store = createStore<number>(0);
const throttledStore: Event<number> = throttle({
  source: $store,
  timeout: 100,
});
```

## `throttle({ source, timeout, leading })`

### Motivation

By default, `throttle` triggers `target` at the **end** of the timeout (trailing edge). With `leading: true`, the first call triggers `target` **immediately**, and subsequent calls within the timeout period are throttled normally.

This is useful when you want immediate feedback on the first interaction, while still preventing excessive calls.

### Formulae

```ts
target = throttle({ source, timeout, leading: true });
```

- First trigger of `source` immediately triggers `target`
- Subsequent triggers within `timeout` are collected, and only the last value triggers `target` after `timeout`

### Arguments

1. `source` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Source unit, data from this unit used by the `target`
2. `timeout` ([_`number`_] | `Store<number>`) — time to wait before trigger `target` after last trigger
3. `leading` (`boolean`) — if `true`, first call triggers immediately. Default: `false`
4. `target` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — (optional) Target unit

### Returns

- `target` ([_`Event`_]) — new event, that triggered on first call immediately (if `leading: true`) and after timeout with the last value

### Usage

```ts
import { createEvent } from 'effector';
import { throttle } from 'patronum';

const buttonClicked = createEvent<number>();

const throttled = throttle({
  source: buttonClicked,
  timeout: 200,
  leading: true,
});

throttled.watch((payload) => {
  console.info('clicked', payload);
});

buttonClicked(1); // => clicked 1 (immediately)
buttonClicked(2); // (ignored, within timeout)
buttonClicked(3); // (ignored, within timeout)
buttonClicked(4); // (saved as last value)

// after 200ms
// => clicked 4
```

### Comparison: `leading: false` vs `leading: true`

Given `timeout: 200ms`:

#### `leading: false` (default behavior)

| Time | Action | State | target fires? |
|------|--------|-------|---------------|
| 0ms | `source(1)` | Timer starts, saved=1 | ❌ No |
| 50ms | `source(2)` | saved=2 | ❌ No |
| 100ms | `source(3)` | saved=3 | ❌ No |
| 200ms | Timer done | — | ✅ **target(3)** |
| 200ms | `source(4)` | Timer starts, saved=4 | ❌ No |
| 250ms | `source(5)` | saved=5 | ❌ No |
| 400ms | Timer done | — | ✅ **target(5)** |

**Result:** target fires **2 times** with values `3` and `5` (only trailing edge).

#### `leading: true`

| Time | Action | State | target fires? |
|------|--------|-------|---------------|
| 0ms | `source(1)` | Timer starts, saved=1 | ✅ **target(1)** (immediate!) |
| 50ms | `source(2)` | saved=2 | ❌ No |
| 100ms | `source(3)` | saved=3 | ❌ No |
| 200ms | Timer done | — | ✅ **target(3)** |
| 200ms | `source(4)` | Timer starts, saved=4 | ✅ **target(4)** (immediate!) |
| 250ms | `source(5)` | saved=5 | ❌ No |
| 400ms | Timer done | — | ✅ **target(5)** |

**Result:** target fires **4 times** with values `1`, `3`, `4`, `5` (leading + trailing edges).

#### Key difference

- **`leading: false`**: User must wait for timeout before seeing any result
- **`leading: true`**: User gets immediate feedback on first interaction, then throttled updates

[_`event`_]: https://effector.dev/docs/api/effector/event
[_`effect`_]: https://effector.dev/docs/api/effector/effect
[_`store`_]: https://effector.dev/docs/api/effector/store
[_`number`_]: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Number
