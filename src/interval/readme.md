# interval

:::note since
patronum 1.7.0
:::

```ts
import { interval } from 'patronum';
// or
import { interval } from 'patronum/interval';
```

## `interval({ timeout, start, stop })`

### Motivation

Creates a dynamic interval with events to start, stop interval, and handle tick.

### Formulae

```ts
const { tick, isRunning } = interval({
  timeout,
  start,
  stop,
  leading,
  trailing,
});
```

- When `start` is triggered, `tick` will be `triggered` each `timeout` ms
- Till `start` is triggered, until `stop` is triggered, `isRunning` will
  be `true`
- After `stop` is triggered `tick` won't be triggered, until `start` is run
  again

### Arguments

1. `timeout` `(number | Store<number>)` - timeout for each `tick` run
2. `start` `(Event<any>)` - start triggering `tick`. Double trigger
   without `stop` call, do nothing.
3. `stop` `(Event<any>)` - stop triggering `tick`. Double trigger
   without `start` call between them, do nothing.
4. `leading` `(boolean)` - Allows running `tick` when `start` is triggered.
5. `trailing` `(boolean)` - Allows running `tick` when `stop` is triggered, it
   will be final call of `tick`.

### Returns

- An _object_ of event `tick` and store `isRunning`
  - `tick` `(Event<void)` - the event is run on each `timeout` ms after `start`
    trigger until `stop` trigger
  - `isRunning` `(Store<boolean>)` - the store contains `false` until `start` is
    triggered, next until `stop` triggered the store will be `true`.

### Example

```ts
import { createStore, createEvent } from 'effector';
import { interval } from 'patronum';

const startCounter = createEvent();
const stopCounter = createEvent();
const $counter = createStore(0);

const { tick } = interval({
  timeout: 500,
  start: startCounter,
  stop: stopCounter,
});

$counter.on(tick, (number) => number + 1);
$counter.watch((value) => console.log('COUNTER', value));

startCounter();

setTimeout(() => stopCounter(), 5000);
```

[Try it](https://share.effector.dev/EOVzc3df)

### `@@trigger` protocol

`interval` supports [`@@trigger` protocol](https://withease.pages.dev/protocols/trigger.html). It means that you can use `interval` whatever you can use `trigger` with, just do not pass `start` and `stop` options.

```ts
import { interval } from 'patronum';

somethingThatRequiresTrigger({
  trigger: interval({ timeout: 1000 }),
});
```

For example, you can use `interval` to refresh data in the Query from the library [Farfetched](https://farfetched.pages.dev/tutorial/trigger_api.html#external-triggers) using `@@trigger` protocol.

```ts
import { keepFresh } from '@farfetched/core';
import { interval } from 'patronum';

keepFresh(someQuery, {
  // 👇 Query will be refreshed each 1000 ms
  triggers: [interval({ timeout: 1000 })],
});
```
