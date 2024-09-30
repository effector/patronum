---
title: time
slug: time
description: Allows reading current timestamp by triggering clock.
group: timeouts
---

```ts
import { time } from 'patronum';
// or
import { time } from 'patronum/time';
```

## `time(clock)`

:::note[since]
patronum 2.1.0
Use `time({ clock })` with patronum < 2.1.0
:::

### Motivation

The method allow to read current time and write it to store

### Formulae

```ts
$time = time(clock);
```

- Initialize `$time` with `Date.now()`
- When `clock` is triggered, call `Date.now()` to update `$time` with results

### Arguments

1. `clock: Event<any> | Effect<any, any, any> | Store<any>` — The unit triggers time reading and updates `$time` store

— `Time` is a generic type argument used for overriding time reader function. By default, it is `number`

### Returns

`$time: Store<Time>` — Store contains unix timestamp snapshot, updates when `clock` triggers.
Initialized with `Date.now()`

### Example

```ts
import { time } from 'patronum';

const tick = createEvent();
const $time = time(tick);

$time.watch((time) => console.log('time', time));
// => time 1660293358847

tick();
// => time 1660293358848
await new Promise((res) => setTimeout(res, 100));
tick();
// => 1660293358952
```

[Try it](https://share.effector.dev/ZKcm1ebv)

## `time({clock, getNow, initial})`

:::note[since]
patronum 1.7.0
:::

### Motivation

The method allow to read current time and write it to store. Object form allows to use additional parameters: `getNow` and `initial`

### Formulae

```ts
$time = time({ clock, getNow, initial });
```

- Initialize `$time` with `initial`, if not present call `getNow`, if not present call `Date.now()`
- When `clock` is triggered, call `getNow` to update `$time` with results, if not present use `Date.now()`

### Arguments

1. `clock: Event<any> | Effect<any, any, any> | Store<any>` — The unit triggers time reading and updates `$time` store
2. `getNow: () => Time` — Optional. A custom function to read time when `clock` triggers. **Must be synchronous**.
3. `initial: Time` — Optional. Initial state for `$time` store. If not passed `getNow` is called.

— `Time` is a generic type argument used for overriding time reader function. By default, it is `number`

### Returns

`$time: Store<Time>` — Store contains unix timestamp snapshot, updates when `clock` triggers.
If `getNow` is overridden, contains value this function returns.
By default, it is `number`.
Initialized with `initial`, by default, it is `Date.now()`

### Example

```ts
import { time } from 'patronum';

const tick = createEvent();
const $time = time({ clock: tick });

$time.watch((time) => console.log('time', time));
// => time 1660293358847

tick();
// => time 1660293358848
await new Promise((res) => setTimeout(res, 100));
tick();
// => 1660293358952
```

[Try it](https://share.effector.dev/VuhhzWKE)
