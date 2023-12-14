# previousValue

:::note since
patronum 2.1.0
:::

```ts
import { previousValue } from 'patronum';
// or
import { previousValue } from 'patronum/previous-value';
```

### Motivation

The method allows to get previous value of given store. Usually need for analytics

### Formulae

```ts
$target = previousValue($source);
$target = previousValue($source, 'initial value');
```

### Arguments

1. `$source` ([_`Store`_]) - source store
2. `defaultValue` (_optional_) - default value for `$target` store, if not passed, `null` will be used

### Returns

- `$target` ([_`Store`_]) - new store that contain previous value of `$source` after first update and null or default value (if passed) before that

### Example

Push analytics with route transition:

```ts
import { createStore, createEvent, createEffect, sample } from 'effector';
import { previousValue } from 'patronum';

const openNewRoute = createEvent<string>();
const $currentRoute = createStore('main_page');
const $previousRoute = previousValue($currentRoute);

const sendRouteTransitionFx = createEffect(async ({ prevRoute, nextRoute }) => {
  console.log(prevRoute, '->', newRoute)
  await fetch(...)
});

sample({clock: openNewRoute, target: $currentRoute});

sample({
  clock: openNewRoute,
  source: {
    prevRoute: $previousRoute,
    nextRoute: $currentRoute,
  },
  target: sendRouteTransitionFx,
});

openNewRoute('messages');
// main_page -> messages
openNewRoute('chats');
// messages -> chats
```
