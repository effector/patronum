# once

```ts
import { once } from 'patronum';
// or
import { once } from 'patronum/once';
```

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
