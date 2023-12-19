# setupTimers

```ts
import { setupTimers } from 'patronum/testing';
```

### Motivation

The event allow to manually set implementations of setTimeout/clearTimeout, which used in delay/interval/throttle/debounce

### Formulae

```ts
setupTimers({ setTimeout: () => {} })
```

- Reassign implementations of setTimeout/clearTimeout in current scope
- If doesn't called then delay/interval/throttle/debounce uses global setTimeout/clearTimeout

### Arguments

```typescript
Partial<{
  setTimeout: (handler: (...args: any[]) => void, timeout?: number, ...args: any[]) => NodeJS.Timeout;
  clearTimeout: (handle: NodeJS.Timeout) => void;
  now: () => number;
}>
```

### Example

```ts
import { setupTimers, interval } from 'patronum';
import { createEvent, sample } from 'effector';

const fakeTimers = {
  setTimeout: (handler, timeout) => setTimeout(handler, timeout * 2), // your fake implementation
  clearTimeout: clearTimeout, // your fake implementation
  now: () => Date.now() * 2 // your fake implementation
};

sample({
  clock: appStarted,
  fn: () => fakeTimers,
  target: setupTimers,
});

// ...

const startInterval = createEvent();
const stopInterval = createEvent();
const tick = interval({ start: startInterval, stop: stopInterval, timeout: 400 });

tick.watch(() => console.log('Called after 800ms'));

const someUIEvent = createEvent();

sample({
  clock: someUIEvent,
  target: startInterval,
});
```
