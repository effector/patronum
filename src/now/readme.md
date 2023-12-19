# now

```ts
import { now } from 'patronum';
// or
import { now } from 'patronum/now';
```

### Motivation

The method allow to read current time from
custom timers implementation just as an effector method.

Use this for easy testing of business logic based on time.

### Formulae

```ts
$now = now({ clock });
// or
$now = now();
```

- Initialize `$now` with `$timers.now`
- When `clock` is triggered, call `$timers.now` to update `$now` with results

### Arguments

1. `clock: Event<any> | Effect<any, any, any> | Store<any>` — The unit triggers time reading and updates `$now` store

### Returns

`$now: Store<number>` — Store contains unix timestamp snapshot, updates when `clock` triggers.

### Example

```ts
import { now } from 'patronum';
import { setupTimers } from 'patronum/testing-library'
import { allSettled, fork } from 'effector'

const tick = createEvent();
const $now = now({ clock: tick });

const scope = fork();

await allSettled(setupTimers, { scope, params: { now: () => 1000 } });

$now.watch((time) => console.log('time', time));
// => time 1000

await allSettled(setupTimers, { scope, params: { now: () => 2000 } });
await allSettled(tick, { scope });

// => time 2000
```
