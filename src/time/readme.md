# time

:::note since
patronum 1.7.0
:::

```ts
import { time } from 'patronum/time';
```

### Motivation

The method allow to read current time just as an effector method.

### Formulae

```ts
$time = time({ clock, getNow, initial });
```

- Initialize `$time` with `initial`, if not present call `getNow`, if not present call `Date.now()`
- When `clock` is triggered, call `getNow` to update `$time` with results, if not present use `Date.now()`

### Arguments

1. `clock: Event<any> | Effect<any, any, any> | Store<any>` — The unit triggers time reading and updates `$time` store
2. `getNow?: () => Time` — A custom function to read time when `clock` triggers. **Must be synchronous**.
3. `initial?: Time` — Initial state for `$time` store. If not passed `getNow` is called.

— `Time` is a generic type argument used for overriding time reader function. By default, is is `number`

### Returns

`$time: Store<Time>` — Store contains unix timestamp snapshot, updates when `clock` triggers.
If `getNow` is overrided, contains value this function returns.
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
