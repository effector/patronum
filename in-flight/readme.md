# Patronum/InFlight

```ts
import { inFlight } from 'patronum/inFlight';
```

### Formulae

```ts
$count = inFlight({ effects: [fx1, fx2] });
```

- Count all pending runs of effects in one store

### Arguments

1. `effects` _(Array<Effect<any, any, any>>)_ - array of any effects

## Returns

- `$count` _(Store<number>)_ - Store with count of run effects in pending state

## Example

```ts
import { createEffect } from 'effector';
import { inFlight } from 'patronum/in-flight';

const loadFirst = createEffect().use(() => Promise.resolve(null));
const loadSecond = createEffect().use(() => Promise.resolve(2));
const $count = inFlight({ effects: [loadFirst, loadSecond] });

$count.watch((count) => console.info(`count: ${count}`));
// => count: 0

loadFirst();
loadSecond();
// => count: 2

loadSecond();
loadSecond();
// => count: 4

// Wait to resolve all effects
// => count: 0
```
