# pending

```ts
import { pending } from 'patronum';
// or
import { pending } from 'patronum/pending';
```

## `pendings(effects)`

:::note since
patronum 2.1.0
Use `pending({ effects: [] })` with with patronum < 2.1.0
:::

### Motivation

This overload allows to read pending state of passed effects. It is usef when
you want to show loading state of the whole application.

### Formulae

```ts
$inProcess = pending([fx1, fx2]);
```

- When some of `effects` are in pending state, result will be `true`

### Arguments

1. `effects` `(Array<Effect<any, any, any>>)` - array of any effects

### Returns

- `$inProcess` `(Store<boolean>)` - Store with boolean state

### Example

```ts
import { createEffect } from 'effector';
import { pending } from 'patronum/pending';

const loadFirstFx = createEffect(() => Promise.resolve(null));
const loadSecondFx = createEffect(() => Promise.resolve(2));
const $processing = pending([loadFirstFx, loadSecondFx]);

$processing.watch((processing) => console.info(`processing: ${processing}`));
// => processing: false

loadFirstFx();
loadSecondFx();
// => processing: true
```

## `pending({ effects: [] })`

### Motivation

This overload recieves `effects` and optional `of` strategy as an object. Useful when need to change strategy

### Formulae

```ts
$inProcess = pending({ effects: [fx1, fx2], of: Strategy });
```

- When `effects` pending state, result will be `true`
- The `of` parameter selects strategy

### Arguments

1. `effects` `(Array<Effect<any, any, any>>)` - array of any effects
1. `of` `("some" | "every")` — Optional. Select strategy of combining pendings
   of differents effects. Default `"some"`

:::note since
The `of` argument was added since patronum 1.1.0
:::

### Returns

- `$inProcess` `(Store<boolean>)` - Store with boolean state

### Example: show processing only when all effects are pending

```ts
import { createEffect } from 'effector';
import { pending } from 'patronum/pending';

const loadFirstFx = createEffect(() => Promise.resolve(null));
const loadSecondFx = createEffect(() => Promise.resolve(2));
const $processing = pending({
  effects: [loadFirstFx, loadSecondFx],
  of: 'every',
});

$processing.watch((processing) => console.info(`processing: ${processing}`));
// => processing: false

loadFirstFx();
// => processing is still false
loadSecondFx();
// => processing: true
```

## `pending({ domain })`

:::note since
patronum 1.1.0
:::

### Motivation

This overload allows to read pending state of created effects in the domain. It
is usef when you want to show loading state of the whole application.

### Formulae

```ts
$inProcess = pending({ domain, of: Strategy });
```

- When an effect created in the `domain` in pending state, result will be `true`
- The `of` parameter selects strategy

### Arguments

1. `domain` `(Domain)` - Effector domain with at least one effect
1. `of` `("some" | "every")` — Optional. Select strategy of combining pendings
   of differents effects. Default `"some"`

### Returns

- `$inProcess` `(Store<boolean>)` - Store with boolean state

### Example

```ts
import { createDomain } from 'effector';
import { pending } from 'patronum/pending';

const app = createDomain();
const loadFirstFx = app.createEffect(() => Promise.resolve(null));
const loadSecondFx = app.createEffect(() => Promise.resolve(2));
const $processing = pending({ domain: app });

$processing.watch((processing) => console.info(`processing: ${processing}`));
// => processing: false

loadFirstFx();
loadSecondFx();
// => processing: true
```

## Strategy

There available two options:

- `some` — default strategy when `of` parameter is not provided. At least one
  effect must be in pending state.
- `every` — each effect must be in pending state.

### Example

```ts
import { createEffect } from 'effector';
import { pending } from 'patronum/pending';

const loadFirstFx = createEffect(() => Promise.resolve(null));
const loadSecondFx = createEffect(() => Promise.resolve(2));

const $pending = pending({ effects: [loadFirstFx, loadSecondFx], of: 'every' });

// When no effects is loading, $pending will be true

// If only one is loading, also will be false
loadFirstFx();

// But after running the second effect, $pending will be true
loadSecondFx();

$pending.watch(console.log); // true
```
