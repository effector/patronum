# combineEvents

```ts
import { combineEvents } from 'patronum';
// or
import { combineEvents } from 'patronum/combine-events';
```

## `combineEvents(events)`

:::note since
patronum 2.1.0
Use `combineEvents({ events })` with patronum < 2.1.0
:::

### Motivation

Method allows to trigger event when all of given events are triggered, with payloads ov given events

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

Object form which allow to pass `reset` unit or `target`

### Formulae

```ts
const target = combineEvents({
  events: {
    key1: event1,
    key2: event2,
  },
  reset: resetUnit,
  target: targetUnit,
});
```

- When all events are triggered, trigger `target` with `{key1: firstPayload, key2: secondPayload}`

```ts
const target = combineEvents({
  events: [event1, event2],
  reset: resetUnit,
  target: targetUnit,
});
```

- When all events are triggered, trigger `target` with `[firstPayload, secondPayload]`

### Arguments

1. `events` — Object or array with events
2. `reset` `(Unit<any>)` - Optional. Any unit which will reset state of `combineEvents` and collecting of payloads will start from scratch
3. `target` `(Unit<Shape>)` - Optional. Any unit with type matching `events` shape

### Returns

- `target` — When `target` option is not defined, will return new event with the same shape as `events`, otherwise `target` unit will return

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
