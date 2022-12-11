# debug

```ts
import { debug } from 'patronum';
// or
import { debug } from 'patronum/debug';
```

It is helpful to debug your application's logic.

Just pass any effector's unit to `debug`.

## Motivation

Sometimes during development, it is necessary to display the value of the stores and payload of events, each time you write `console.log` inside `.watch` and copy/paste it is unpleasant. `debug` allows you to speed up this process a lot by passing all the necessary units for a debugging into a method arguments.

## Example

```ts
import { createStore, createEvent, createEffect } from 'effector';
import { debug } from 'patronum/debug';

const event = createEvent();
const effect = createEffect().use((payload) => Promise.resolve('result' + payload));
const $store = createStore(0)
  .on(event, (state, value) => state + value)
  .on(effect.done, (state) => state * 10);

debug($store, event, effect);

event(5);
effect('demo');

// => [store] $store 1
// => [event] event 5
// => [store] $store 6
// => [effect] effect demo
// => [effect] effect.done {"params":"demo", "result": "resultdemo"}
// => [store] $store 60
```

## Traces

:::note since
patronum 1.9.0
:::

`patronum/debug` supports computation traces logging, if `{ trace: true }` is set.
It is recommended to use this feature along with `effector/babel-plugin`.

```ts
const inputChanged = createEvent();
const $form = createStore(0).on(inputChanged, (s) => s + 1);

debug({ trace: true }, $form, submitFx);

inputChanged();

// "[store] $form 0",
// "[store] $form 1",
// "[store] $form trace",
// "<- [store] $form 1",
// "<- [$form.on] $form.on(inputChanged) 1",
// "<- [event] inputChanged ",
```

## Custom names

Sometimes unit name in specific context may be different from the one it was initially created with.
e.g., an unit may be exported under an alias for explicitness:

```ts
export const $productsListVisible = productsPageModel.$open;
const productAdded = createEvent();

debug($productsListVisible, productAdded);
// or
debug({ trace: true }, $productsListVisible, productAdded);
```

In this case, because of `effector/babel-plugin` which provided `productsPageModel.$open` store its name at the moment of its creation, public name in the `debug` logs will be `$open` instead of `$productsListVisible`.

It can be fixed with custom name, which can be provided by using `Record<string, Unit>` instead of a list of units:

```ts
export const $productsListVisible = productsPageModel.$open;
const productAdded = createEvent();

debug({ $productsListVisible, customEventName: productAdded });
// or
debug({ trace: true }, { $productsListVisible, customEventName: productAdded });
```

This way `$productsListVisible` name in the logs will be the same, as the one which was provided to `debug`. The `productAdded` event will be named `customEventName`.

## Fork API and Scope

Effector can run multiple "instances" of the app simultaniosly via Fork API - it is useful for tests and SSR. Usually you would also use scope on the client in the case of SSR. `debug` will log "scoped" updates in such case:

```ts
const up = createEvent();
const $count = createStore(0).on(up, (s) => s + 1);
const fx = createEffect(() => {});
sample({
  clock: $count,
  target: fx,
});

debug(fx);

const scopeA = fork();

await allSettled(up, { scope: scopeA });

// "[effect] (scope: unknown_scope_3) fx 1",
// "[effect] (scope: unknown_scope_3) fx.done {\\"params\\":1}",
```

By default detected scope will be given default name.

### Scope registration

It is possible to explicitly register scope with given name to have a more explicit logs.

It can work like this:

```ts
const scope = fork({ values: window.__SSR_VALUES__ });

// this way we can commit this to our repo and be sure,
// that bundler will cut this out of production bundle
if (process.env.NODE_ENV === 'development') {
  debug.registerScope(scope, { name: 'my_client_scope' });
}
```

This way scope will be given explicit name in the logs.

```ts
// "[effect] (scope: my_client_scope) fx 1",
// "[effect] (scope: my_client_scope) fx.done {\\"params\\":1}",
```

It is also possible to unregister scope to prevent memory leak, if scope is no longer needed:

```ts
const unregister = debug.registerScope(scope, { name: `my_scope` });

unregister();
```

Or unregister all scopes at once:

```ts
debug.unregisterAllScopes();
```

### Initial store state

`debug($store)` always immediatly prints current state of the store, but this state can be different in different scopes.
It is recommened to register scopes explicitly, since `debug` will print current state of the store in every known scope:

```ts
const $count = createStore(0);

const scopeA = fork({
  values: [[$count, 42]],
});
const scopeB = fork({
  values: [[$count, 1337]],
});

debug.registerScope(scopeA, { name: 'scope_42' });
debug.registerScope(scopeB, { name: 'scope_1337' });

debug($count);

// "[store] $count 0",
// "[store] (scope: scope_42) $count 42",
// "[store] (scope: scope_1337) $count 1337",
```

### Custom log handler

You can provide custom log handler in the config. It can be useful, if `console.log` somehow doesn't fit your use-case: e.g. you want advanced info from `patronum/debug` to built your own dev-tools, debug especially hard case, etc.

Handler is called for each update with context object like this:

Common fields:

- **scope** - `Scope | null` - effector's `Scope` context object, which owns this particular update
- **scopeName** - `string | null` - name of the `Scope`, if registered and `null` otherwise.
- **node** - `Node` - effector's internal node, which update is being logged.
- **name** - `string` - node's name for convenience.
- **kind** - `string` - node's kind for convenience. It can be unit's kind (e.g. `store` or `event`) or operation kind (e.g. `sample`, `split`, etc).
- **value** - `unknown` - value of the update.

Special field if `trace: true` provided:

- **trace** - `undefined | { node: Node; name: string; kind: string; value: unknown; }[]` - trace of updates.

The `trace` field is not provided, if `debug`'s config does not have `trace: true`.

```ts
debug({
  trace: true,
  // custom log handler
  handler: ({ trace, scope, scopeName, node, value, name, kind }) => {
    // your own way to log updates
    doStuff(node, value);

    if (trace) {
      // log trace part
      trace.forEach(({ name, kind, node, value }) => doStuff(node, value));
    }
  },
}, { $a, $b, c });
```
