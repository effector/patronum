# delay

```ts
import { delay } from 'patronum';
// or
import { delay } from 'patronum/delay';
```

Method for delaying triggering given unit for some amount of time. Can accept `number`, `Store<number>` or `(sourceValue) => number` (function for calculating timeout based on `source` payload) as timeout. Exists in two form: shorthand `delay(source, timeout)` and object form `delay({source, timeout, target})`, the first one needs to create new unit for this specific purpose, last one needs when `target` unit is already exists and the goal is just to call it after delay

## `delay(source, timeout: number)`

:::note since
patronum 2.1.0
Use `delay({ source, timeout })` with patronum < 2.1.0
:::

### Formulae

```ts
target = delay(source, timeout);
```

- When `source` is triggered, wait for `timeout`, then trigger `target` with payload of the `source`

### Arguments

1. `source` `(Event<T>` | `Store<T>` | `Effect<T>)` — Source unit, data from this unit used to trigger `target` with.
1. `timeout` `(number)` — time to wait before trigger `event`

### Returns

- `target` `(Event<T>)` — New event which will receive `source` payload after `timeout` delay

### Example

```ts
import { createEvent } from 'effector';
import { delay } from 'patronum/delay';

const trigger = createEvent<string>(); // createStore or createEffect
const delayed = delay(trigger, 300);

delayed.watch((payload) => console.info('triggered', payload));

trigger('hello');
// after 300ms
// => triggered hello
```

## `delay({ source, timeout: number, target })`

### Formulae

```ts
target = delay({ source, timeout: number, target });
```

- When `source` is triggered, wait for `timeout`, then trigger `target` with payload of the `source`

### Arguments

1. `source` `(Event<T>` | `Store<T>` | `Effect<T>)` — Source unit, data from this unit used to trigger `target` with.
2. `timeout` `(number)` — time to wait before trigger `event`
3. `target` `(Unit<T>` | `Array<Unit<T>>)` — Optional. Target unit or array of units that will be called after delay.

### Returns

- `target` `(Unit<T>` | `Array<Unit<T>>)` — Target unit or units that were passed to `delay`

### Example

```ts
import { createEvent } from 'effector';
import { delay } from 'patronum/delay';

const trigger = createEvent<string>(); // createStore or createEffect
const delayed = createEvent<string>();
delay({
  source: trigger,
  timeout: 300,
  target: delayed,
});

delayed.watch((payload) => console.info('triggered', payload));

trigger('hello');
// after 300ms
// => triggered hello
```

## `delay(source, timeout: Function)`

:::note since
patronum 2.1.0
Use `delay({ source, timeout })` with patronum < 2.1.0
:::

### Motivation

This overload allows to calculate timeout from payload of `source`.
It is useful when you know that calculations requires more time if you have more data for payload.

### Formulae

```ts
target = delay(source, timeout);
```

- When `source` is triggered, call `timeout` with payload to get the timeout for delay, then trigger `target` with payload of the `source`

### Arguments

1. `source` `(Event<T>` | `Store<T>` | `Effect<T>)` — Source unit, data from this unit used to trigger `target` with.
2. `timeout` `((payload: T) => number)` — Calculate delay for each `source` call. Receives the payload of `source` as argument. Should return `number` — delay in milliseconds.

### Returns

- `target` `(Event<T>)` — New event which will receive `source` payload after `timeout` delay

### Example

```ts
import { createEvent, createStore } from 'effector';
import { delay } from 'patronum/delay';

const update = createEvent<string>();
const $data = createStore('');
const logDelayed = delay($data, (string) => string.length * 100);

logDelayed.watch((data) => console.log('log', data));

update('Hello');
// after 500ms
// => log Hello

update('!');
// after 100ms
// => log !
```

## `delay({ source, timeout: Function, target })`

### Motivation

This overload allows to calculate timeout from payload of `source`.
It is useful when you know that calculations requires more time if you have more data for payload.

### Formulae

```ts
target = delay({ source, timeout: Function, target });
```

- When `source` is triggered, call `timeout` with payload to get the timeout for delay, then trigger `target` with payload of the `source`

### Arguments

1. `source` `(Event<T>` | `Store<T>` | `Effect<T>)` — Source unit, data from this unit used to trigger `target` with.
2. `timeout` `((payload: T) => number)` — Calculate delay for each `source` call. Receives the payload of `source` as argument. Should return `number` — delay in milliseconds.
3. `target` `(Unit<T>` | `Array<Unit<T>>)` — Optional. Target unit or array of units that will be called after delay.

### Returns

- `target` `(Unit<T>` | `Array<Unit<T>>)` — Target unit or units that were passed to `delay`

### Example

```ts
import { createEvent, createStore } from 'effector';
import { delay } from 'patronum/delay';

const update = createEvent<string>();
const logDelayed = createEvent<string>();
const $data = createStore('');

delay({
  source: $data,
  timeout: (string) => string.length * 100,
  target: logDelayed,
});

logDelayed.watch((data) => console.log('log', data));

update('Hello');
// after 500ms
// => log Hello

update('!');
// after 100ms
// => log !
```

## `delay(source, timeout: Store<T>)`

:::note since
patronum 2.1.0
Use `delay({ source, timeout })` with patronum < 2.1.0
:::

### Motivation

This overload allows you to read timeout from another store.
It is useful when you write music editor and need dynamic delay for your events.

### Formulae

```ts
target = delay(source, timeout);
```

- When `source` is triggered, read timeout from `timeout` store, then trigger `target` with payload of the `source`

### Arguments

1. `source` `(Event<T>` | `Store<T>` | `Effect<T>)` — Source unit, data from this unit used to trigger `target` with.
2. `timeout` `(Store<number>)` — Store with number — delay in milliseconds.

### Returns

- `target` `(Event<T>)` — New event which will receive `source` payload after `timeout` delay

### Example

```ts
import { createEvent, createStore } from 'effector';
import { delay } from 'patronum/delay';

const update = createEvent<string>();
const $timeout = createStore(500);

const logDelayed = delay(update, $timeout);

logDelayed.watch((data) => console.log('log', data));

update('Hello');
// after 500ms
// => log Hello
```

## `delay({ source, timeout: Store<T>, target })`

### Motivation

This overload allows you to read timeout from another store.
It is useful when you write music editor and need dynamic delay for your events.

### Formulae

```ts
target = delay({ source, timeout: $store, target });
```

- When `source` is triggered, read timeout from `timeout` store, then trigger `target` with payload of the `source`

### Arguments

1. `source` `(Event<T>` | `Store<T>` | `Effect<T>)` — Source unit, data from this unit used to trigger `target` with.
2. `timeout` `(Store<number>)` — Store with number — delay in milliseconds.
3. `target` `(Unit<T>` | `Array<Unit<T>>)` — Optional. Target unit or array of units that will be called after delay.

### Returns

- `target` `(Unit<T>` | `Array<Unit<T>>)` — Target unit or units that were passed to `delay`

### Example

```ts
import { createEvent, createStore } from 'effector';
import { delay } from 'patronum/delay';

const update = createEvent<string>();
const $timeout = createStore(500);

delay({
  source: update,
  timeout: $timeout,
  target: logDelayed,
});

logDelayed.watch((data) => console.log('log', data));

update('Hello');
// after 500ms
// => log Hello
```
