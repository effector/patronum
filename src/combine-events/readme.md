---
title: combineEvents
slug: combine-events
description: Wait for all passed events is triggered.
group: combination
---

```ts
import { combineEvents } from 'patronum';
// or
import { combineEvents } from 'patronum/combine-events';
```

## `combineEvents(events)`

:::note[since]
patronum 2.1.0
Use `combineEvents({ events })` with patronum < 2.1.0
:::

### Motivation

`combineEvents` is useful when you need to wait for **several independent events** and react only after **each of them has emitted at least once**.  
You can think of it as a `Promise.all` for events. 

This is helpful, when you need to:

- wait for several API calls to finish (user profile, settings, feature flags),
- collect values from different parts of the UI (step 1, step 2, step 3),
- synchronise independent flows before continuing.

:::note
Consider using stores with combine in case of lazy-loaded modules, as they could miss some updates happened before module loaded
:::

### Formulae

```ts
const target = combineEvents({ key1: event1, key2: event2 });
```

- When all events are triggered, trigger `target` with `{key1: firstPayload, key2: secondPayload}`

```ts
const target = combineEvents([event1, event2]);
```

- When all events are triggered, trigger `target` with `[firstPayload, secondPayload]`

### Arguments

1. `events` — Object or array with events

### Returns

- `target` — Event with the same shape as `events`, that triggered after all `events` triggered

## `combineEvents({ events, reset, target })`

### Motivation

This overload is useful when you:

- already have a `target` unit (event, effect or store) that should receive the combined payload, and
- want to control when `combineEvents` should **start collecting payloads from scratch** using a `reset` unit.

Typical use-cases:

- reuse an existing `target` event instead of creating a new one,
- manually restart waiting for all events after an error or user action.

### Formulae

```ts
combineEvents({
  events: {
    key1: event1,
    key2: event2,
  },
  reset: resetUnit,
  target: targetUnit,
});
```

- When all events are triggered, trigger `target` with `{key1: firstPayload, key2: secondPayload}`
- When resetUnit is triggered, internal state is cleared and `combineEvents` starts waiting for all events again

```ts
combineEvents({
  events: [event1, event2],
  reset: resetUnit,
  target: targetUnit,
});
```

- When all events are triggered, trigger `target` with `[firstPayload, secondPayload]`
- When `resetUnit` is triggered, internal state is cleared and `combineEvents` starts waiting for all events again

### Arguments

1. `events` — Object or array with events
2. `reset` `(Unit<any>)` - Optional. Any unit which will reset state of `combineEvents` and collecting of payloads will start from scratch
3. `target` `(Unit<Shape>)` - Optional. Any unit with type matching `events` shape

### Returns

- `target` — If `target` is not provided, a **new event** with the same shape as `events` is created and returned. If `target` is provided, the same unit is returned back.

### Example

```ts
const first = createEvent<number>();
const second = createEvent<string>();
const third = createEvent<boolean>();
const target = createEvent<{ a: number; b: string; c: boolean }>();
const reset = createEvent();

combineEvents({
  events: {
    a: first,
    b: second,
    c: third,
  },
  reset,
  target,
});

target.watch((object) => {
  console.log('first event data', object.a);
  console.log('second event data', object.b);
  console.log('third event data', object.c);
});

first(15); // nothing
second('wow'); // nothing
third(false); // target triggered with {a: 15, b: 'wow', c: false}

first(10);
second('-');

reset(); // combineEvents state is erased

third(true); // nothing, as it's a first saved payload
first(0);
second('ok'); // target triggered with {a: 0, b: 'ok', c: true}
```
