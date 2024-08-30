---
title: once
slug: once
description: Runs only once.
group: predicate
---

```ts
import { once } from 'patronum';
// or
import { once } from 'patronum/once';
```

## `target = once(source)`

### Motivation

The method allows to do something only on the first ever trigger of `source`.
It is useful to trigger effects or other logic only once per application's lifetime.

### Formulae

```ts
target = once(source);
```

- When `source` is triggered, launch `target` with data from `source`, but only once.

### Arguments

- `source` `(Event<T>` | `Effect<T>` | `Store<T>)` — Source unit, data from this unit is used by `target`.

### Returns

- `target` `Event<T>` — The event that will be triggered exactly once after `source` is triggered.

### Example

```ts
const messageReceived = createEvent<string>();
const firstMessageReceived = once(messageReceived);

firstMessageReceived.watch((message) =>
  console.log('First message received:', message),
);

messageReceived('Hello'); // First message received: Hello
messageReceived('World');
```

#### Alternative

```ts
import { createGate } from 'effector-react';

const PageGate = createGate();

sample({
  source: once(PageGate.open),
  target: fetchDataFx,
});
```

## `target = once({ source, reset })`

### Motivation

This overload may receive `reset` in addition to `source`. If `reset` is fired,
`target` will be allowed to trigger one more time, when `source` is called.

### Formulae

```ts
target = once({ source, reset });
```

- When `source` is triggered, launch `target` with data from `source`, but only once.
- When `reset` is triggered, let `once` be reset to the initial state and allow `target` to be triggered again upon `source` being called.

### Arguments

- `source` `(Event<T>` | `Effect<T>` | `Store<T>)` — Source unit, data from this unit is used by `target`.
- `reset` `(Event` | `Effect` | `Store)` — A unit that resets `once` to the initial state, allowing `target` to be triggered again.

### Returns

- `target` `Event<T>` — The event that will be triggered once after `source` is triggered, until `once` is reset by calling `reset`.

### Example

```ts
import { createGate } from 'effector-react';

const PageGate = createGate();

sample({
  source: once({
    source: PageGate.open,
    reset: fetchDataFx.fail,
  }),
  target: fetchDataFx,
});
```
