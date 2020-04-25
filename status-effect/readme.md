# Patronum/StatusEffect

```ts
import { statusEffect } from 'patronum/status-effect';
```

## Formulae

```ts
statusEffect(effect, status);
```

## Arguments

1. `effect` _(Effect<P, R>)_
2. `status` _('initial' | 'pending' | 'done' | 'fail')_

## Example

### Change status with status result 'done'

```ts
const event = createEvent();
const effect = createEffect();
const $status = statusEffect(effect);

forward({ from: event, to: effect });

$status.watch((value) => console.log(`status: ${value}`));

event();
// => status: "initial"
// => status: "pending"
// => status: "done"
```

### Change status with status result 'fail' Change status with status result 'done'

```ts
const event = createEvent();
const effect = createEffect({
  handler: () => {
    throw new Error();
  },
});
const $status = statusEffect(effect);

forward({ from: event, to: effect });

$status.watch((value) => console.log(`status: ${value}`));

event();
// => status: "initial"
// => status: "pending"
// => status: "fail"
```

### Default status effect

```ts
const effect = createEffect();
const $status = statusEffect(effect, 'pending');

$status.watch((value) => console.log(`status: ${value}`));
// => status: "pending"
```

### Clear (reset) status

```ts
const effect = createEffect();
const $status = statusEffect(effect, 'pending');

$status.watch((value) => console.log(`status: ${value}`));

event();
// => status: "pending"
// => status: "done"
```
