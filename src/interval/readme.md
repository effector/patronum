# Patronum/Interval

Creates a dynamic interval with events to start, stop interval, and handle tick. 

> From v1.3.0

```ts
import { interval } from 'patronum';
import { interval } from 'patronum/interval';
```

## `interval({ timeout, start, stop })`

### Formulae

```ts
const { tick, isRunning } = interval({ timeout, start, stop })
```

- When `start` is triggered, `tick` will be `triggered` each `timeout` ms
- Till `start` is triggered, until `stop` is triggered, `isRunning` will
  be `true`
- After `stop` is triggered `tick` won't be triggered, until `start` is run
  again

### Arguments

1. `timeout` _(number | Store<number>)_ - timeout for each `tick` run
2. `start` _(Event<any>)_ - start triggering `tick`. Double trigger
   without `stop` call, do nothing.
3. `stop` _(Event<any>)_ - stop triggering `tick`. Double trigger
   without `start` call between them, do nothing.

### Returns

- An *object* of event `tick` and store `isRunning`
  - `tick` _(Event<void)_ - the event is run on each `timeout` ms after `start`
    trigger until `stop` trigger
  - `isRunning` _(Store<boolean>)_ - the store contains `false` until `start` is
    triggered, next until `stop` triggered the store will be `true`.

### Example

```ts
import { createStore, createEvent } from 'effector'
import { interval } from 'patronum'

const startCounter = createEvent();
const stopCounter = createEvent();
const $counter = createStore(0);

const { tick } = interval({
  timeout: 500,
  start: startCounter,
  stop: stopCounter
});

$counter.on(tick, (number) => number + 1);
$counter.watch(value => console.log("COUNTER", value));

startCounter();

setTimeout(() => stopCounter(), 5000)
```

[Try it](https://share.effector.dev/EOVzc3df)

## Leading and trailing

### Motivation

Sometimes we need to run tick on start or stop the interval.

### Formulae

```ts
const { tick, isRunning } = interval({
  timeout,
  start,
  stop,
  leading: true,
  trailing: true
});
```

### Arguments

> All the same, just review first section
4. `leading` _(boolean)_ - Allows running `tick` when `start` is triggered.
5. `trailing` _(boolean)_ - Allows running `tick` when `stop` is triggered, it will be final call of `tick`.
