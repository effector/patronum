# Patronum/abort

```ts
import { abort, AbortedError } from 'patronum/abort';
```

## `abortableFx = abort({ signal, getKey, handler})`

### Motivation

This method allows you to create abortable effects. It is mostly useful for abortable api request calls and for granular control over all kinds of timeouts and intervals.

### Formulae

```ts
abortableFx = abort({ signal, getKey, handler });
```

### Arguments

1. `handler` _(`(params: Params, config: { onAbort: (callback: () => void) => () => void }) => R`)_ — handler of abortable effect, accepts params and a config object with `onAbort` function to register cleanup callbacks, that will be called on abort. `onAbort` can be called multiple times and for each call returns function to remove abort listener.
2. `getKey` _(`(params: Params) => string | number`)_ — function to get a key from effect params for every effect call. Needed to cancel some specific effect call. Provided key doesn't have to be unique
3. `signal` ([_`Event`_]) — `Event` that will trigger abort of effect calls, accepts key of effect call to be aborted. If multiple effect calls share the same key, they all will be aborted on signal triggered with that key
4. `domain` ([_`Domain`_]) - optional effector domain. If provided - all internal units will be created from it

### Returns

- `result` ([_`Effect`_]) — Abortable Effect. If aborted manually by provided signal, will return `AbortedError` in `effect.failData` event. `AbortedError` can be detected by `instanceof AbortedError` or by `aborted` and `key` fields in it

[_`event`_]: https://effector.dev/docs/api/effector/event
[_`effect`_]: https://effector.dev/docs/api/effector/effect

### Examples

#### Abort specific effect call by key

```ts
import { createEvent } from "effector";
import { abort } from "patronum/abort";

const cancel = createEvent<number>();
const abortableFx = abort({
  signal: cancel,
  getKey: (p: number) => p,
  async handler(todoId: number, { onAbort }) {
    const controller = new AbortController();

    const revoke = onAbort(() => {
      console.log("bla");
      // you can call onAbort multiple times and revoke reigstered callbacks
    });

    revoke(); // removes specific abort callback

    onAbort(() => {
      // handle abort logic, e.g. cancel promise or call AbortSignal for fetch
      controller.abort();
    });

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      { signal: controller.signal }
    );
    const result = await response.json();

    return result;
  },
});

abortableFx(1);
abortableFx(2);
abortableFx(3);

cancel(2);
```

#### Abort all effect calls

```ts
import { createEvent } from "effector";
import { abort } from "patronum/abort";

const cancel = createEvent<string>();
const abortableFx = abort({
  signal: cancel,
  getKey: () => "shared",
  async handler(todoId: number, { onAbort }) {
    const controller = new AbortController();

    const revoke = onAbort(() => {
      console.log("bla");
      // you can call onAbort multiple times and revoke reigstered callbacks
    });

    revoke(); // removes specific abort callback

    onAbort(() => {
      // handle abort logic, e.g. cancel promise or call AbortSignal for fetch
      controller.abort();
    });

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      { signal: controller.signal }
    );
    const result = await response.json();

    return result;
  },
});

abortableFx(1);
abortableFx(2);
abortableFx(3);

cancel("shared");

// calling cancel with "shared" key will abort all abortableFx calls in fly with AbortedError
```
#### Check if aborted

```ts
import { createEvent, guard } from 'effector';
import { abort, AbortedError } from 'patronum/abort';

const cancel = createEvent<string>();
const abortableFx = abort({
  signal: cancel,
  getKey: () => 'shared',
  async handler(_: void, { onAbort }) {
    await new Promise((r, rj) => {
      let id = setTimeout(r, 1000);

      onAbort(() => {
        // cleanup timeout and reject promise, so effect call is actually aborted
        rj();
        clearTimeout(id);
      });
    });
  },
});

guard({
  source: abortableFx.failData,
  filter: (error) => error instanceof AbortedError,
}).watch(console.log); // will log only if error is AbortedError, it is possible to check the key of the aborted calls like `error.key`

abortableFx();
abortableFx();
abortableFx();

cancel('shared');

// calling cancel with "shared" key will abort all abortableFx calls in fly with AbortedError
```

#### Common case: take last

```ts
import { createEvent, forward } from 'effector';
import { abort, AbortedError } from 'patronum/abort';

const cancel = createEvent<string>();
const abortableFx = abort({
  signal: cancel,
  getKey: () => 'shared',
  async handler(_: void, { onAbort }) {
    await new Promise((r, rj) => {
      let id = setTimeout(r, 1000);

      onAbort(() => {
        // cleanup
        rj();
        clearTimeout(id);
      });
    });
  },
});

forward({
  from: abortableFx, // for each effect call
  to: cancel.prepend(() => 'shared'), // abort all previous calls
});

abortableFx();
abortableFx();
abortableFx();

cancel('shared');
```

#### Common case: race

```ts
import { createEvent, forward } from 'effector';
import { abort, AbortedError } from 'patronum/abort';

const cancel = createEvent<string>();
const abortableFx = abort({
  signal: cancel,
  getKey: () => 'shared',
  async handler(_: void, { onAbort }) {
    await new Promise((r, rj) => {
      let id = setTimeout(r, 1000);

      onAbort(() => {
        // cleanup
        rj();
        clearTimeout(id);
      });
    });
  },
});

forward({
  from: abortableFx.finally, // for each effect call result
  to: cancel.prepend(() => 'shared'), // abort all other calls in flight
});

abortableFx();
abortableFx();
abortableFx();

cancel('shared');
```

