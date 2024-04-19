# readonly

:::note since
patronum 2.2.0
:::

```ts
import { readonly } from 'patronum';
// or
import { readonly } from 'patronum/readonly';
```

### Motivation

The method allows to convert writable store and callable event to their readonly versions.
It can be helpful to create more strict public api.

### Formulae

```ts
$result = readonly($store);
```

- `$result` store contains mapped `$store`, which is readonly for consumers.

```ts
result = readonly(event);
```

- `result` event contains mapped `event`, which is not callable by consumers.

### Arguments

- `value: Store<T>|Event<T>` — Any store or event, that required to be readonly

### Returns

- `result: Store<T>|Event<T>`

Note: if passed argument is already derived, then argument returns as-is.

### Example

```ts
const $store = createStore({});
const $readonlyStore = readonly($store);

console.assert(false === is.targetable($readonlyStore));
```

```ts
const event = createEvent();
const readonlyEvent = readonly(event);

console.assert(false === is.targetable($readonlyStore));
```
