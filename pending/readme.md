# Patronum/Pending

```ts
import { pending } from 'patronum/pending';
```

## `pending({ effects: [] })`

### Motivation

This overload allows to read pending state of passed effects.
It is usef when you want to show loading state of the whole application.

### Formulae

```ts
$inProcess = pending({ effects: [fx1, fx2] });
```

- When at least one effect from `effects` in pending state, result will be `true`

### Arguments

1. `effects` _(Array<Effect<any, any, any>>)_ - array of any effects

## Returns

- `$inProcess` _(Store<boolean>)_ - Store with boolean state

## Example

```ts
import { createEffect } from 'effector';
import { pending } from 'patronum/pending';

const loadFirst = createEffect(() => Promise.resolve(null));
const loadSecond = createEffect(() => Promise.resolve(2));
const $processing = pending({ effects: [loadFirst, loadSecond] });

$processing.watch((processing) => console.info(`processing: ${processing}`));
// => processing: false

loadFirst();
loadSecond();
// => processing: true
```

## `pending({ domain })`

### Motivation

This overload allows to read pending state of created effects in the domain.
It is usef when you want to show loading state of the whole application.

### Formulae

```ts
$inProcess = pending({ domain });
```

- When at least one effect created in the `domain` in pending state, result will be `true`

### Arguments

1. `domain` _(Domain)_ - Effector domain with at least one effect

## Returns

- `$inProcess` _(Store<boolean>)_ - Store with boolean state

## Example

```ts
import { createDomain } from 'effector';
import { pending } from 'patronum/pending';

const app = createDomain();
const loadFirst = app.createEffect(() => Promise.resolve(null));
const loadSecond = app.createEffect(() => Promise.resolve(2));
const $processing = pending({ domain: app });

$processing.watch((processing) => console.info(`processing: ${processing}`));
// => processing: false

loadFirst();
loadSecond();
// => processing: true
```
