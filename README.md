# <img src="logo.svg" title="effector patronum" alt="Effector Patronum logo" width="640px">

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) ![Node.js CI](https://github.com/effector/patronum/workflows/Node.js%20CI/badge.svg) [![Rate on Openbase](https://badges.openbase.com/js/rating/patronum.svg)](https://openbase.com/js/patronum?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)
[![LICENSE](https://badgen.net/github/license/effector/patronum?color=green)](/LICENSE)
[![Stars](https://badgen.net/github/stars/effector/patronum?color=green)](https://github.com/effector/patronum)
[![Downloads](https://badgen.net/npm/dt/patronum)](https://npmjs.com/package/patronum)

☄️ Effector operators library delivering modularity and convenience

- 🎲 Try it online: [Codesandbox](codesandbox) | [Playground](try-patronum-share)
- 📦 Source: [JSdeliver](jsdelivr) | [Unpkg](unpkg) | [NPM](npm) | [GitHub](github)
- 🦉 Say about it: [Twitter](twitter-share)

[codesandbox]: https://codesandbox.io/s/effector-patronum-playground-zuqjx
[try-patronum-share]: https://share.effector.dev/Neewtbz3
[jsdelivr]: https://www.jsdelivr.com/package/npm/patronum
[unpkg]: https://unpkg.com/browse/patronum@1.7.0/
[npm]: https://www.npmjs.com/package/patronum
[github]: https://github.com/effector/patronum
[twitter-share]: https://twitter.com/intent/tweet?text=I%20used%20patronum!%0AGoing%20to%20Mars%20with%20%40effectorjs%20-%20data-flow%20powered%20tool%20to%20implement%20business%20logic.%0A%0Ahttps%3A%2F%2Fgithub.com%2Feffector%2Fpatronum%0A

## Table of contents

### Predicate

- [Condition](#condition) — Trigger then or else by condition.
- [Some](#some) — Checks that state in at least one store passes the predicate test.
- [Every](#every) — Checks that state in each store passes the predicate test.
- [Reset](#reset) — Reset all passed stores by clock.

### Effect

- [Pending](#pending) — Checks that has effects in pending state.
- [InFlight](#inflight) — Counts all pending effects
- [Status](#status) — Return text representation of effect state.

### Time

- [Debounce](#debounce) — Creates event which waits until time passes after previous trigger.
- [Delay](#delay) — Delays the call of the event by defined timeout.
- [Throttle](#throttle) — Creates event which triggers at most once per timeout.
- [Interval](#interval) — Creates a dynamic interval with any timeout.
- [Time](#time) — Allows reading current timestamp by triggering clock.

### Combination/Decomposition

- [CombineEvents](#combineevents) — Wait for all passed events is triggered.
- [Reshape](#reshape) — Destructure one store to different stores
- [SplitMap](#splitmap) — Split event to different events and map data.
- [Spread](#spread) — Send fields from object to same targets.
- [Snapshot](#snapshot) — Create store value snapshot.
- [Format](#format) — Combine stores to a string literal.

### Debug

- [Debug](#debug) — Log triggers of passed units.

## 💿 Install now

> Please, review documentation for **YOUR** version of patronum not the latest. Find and [open tag/release](https://github.com/effector/patronum/releases) for your version and click on the tag [vA.B.C](https://github.com/effector/patronum/tree/v1.7.0) to view repo and documentation for that version, or use "Switch branches/tags" selector.

```bash
npm install patronum
```

Next just import methods from `"patronum"` and use it:

```ts
import { createEffect } from "effector"
import { status } from "patronum"

const userLoadFx = createEffect()
const $status = status({ effect: userLoadFx })
```

## 🐞 Debug and log

Sometimes we need to log each event and change in our application, here we need to install [`effector-logger`](https://github.com/effector/logger):

```bash
npm install --dev effector-logger
```

We have some variants how to use logger to debug our applications. Please, don't merge all variants, **it's not compatible**!

### 1. Temporarily change imports in certain modules

If we need to debug just some list of modules, we can just replace `effector` import to `effector-logger`:

```diff
-import { createStore, createEvent, sample } from 'effector'
+import { createStore, createEvent, sample } from 'effector-logger'
import { spread } from 'patronum'
```

Next just open the Console in browser DevTools. But here we see strange names of the stores and events like "ashg7d".
This means we need to use [effector babel plugin](https://effector.dev/docs/api/effector/babel-plugin/).

> Note: You don't need to install it separately, because its bundled into effector package.

```json5
// .babelrc
{
  "plugins": [
    ["effector/babel-plugin", { "importName": "effector-logger" }], // Just add this line into your .babelrc or babel.config.js plugins section.
  ],
  "presets": [
    "patronum/babel-preset" // Add this line at the end of the all presets
  ]
}
```

### 2. Use `effector-logger/babel-plugin` to automatically replace all imports in development

But some projects already use `effector/babel-plugin`, and for correct work with `effector-logger` we need **just one** instance of babel plugin.
This means that [effector-logger has its own babel-plugin](https://github.com/effector/logger#usage).<br/>
**Don't use `effector/babel-plugin` simultaneously with `effector-logger/babel-plugin`!** Use just one at the time, for example: for the dev environment use `effector-logger/babel-plugin`, but for production use `effector/babel-plugin`.


<details>
  <summary>
    How to setup `.babelrc`
  </summary>

```json5
// .babelrc
{
  "presets": [
    "patronum/babel-preset" // Add this line at the end of the all presets in the root of the file
  ],
  "env": {
    "development": {
      "plugins": [
        ["effector-logger/babel-plugin", {}] // In the curly brackets you can pass options for logger AND effector
      ]
    },
    "production": {
      "plugins": [
        ["effector/babel-plugin", {}] // In the curly brackets you can pass options for effector
      ]
    },
  },
}
```
  
If you need to pass factories, here you need to duplicate your array:
  
```json5
// .babelrc
{
  "env": {
    "development": {
      "plugins": [
        ["effector-logger/babel-plugin", {
          "effector": { "factories": ["src/shared/lib/compare", "src/shared/lib/timing"] }
        }]
      ]
    },
    "production": {
      "plugins": [
        ["effector/babel-plugin", { "factories": ["src/shared/lib/compare", "src/shared/lib/timing"] }]
      ]
    },
  },
}
```

Also, you need to build your project with `BABEL_ENV=development` for dev and `BABEL_ENV=production` for prod, to choose the appropriate option in the `"env"` section.
  
  
Relative links:
- https://babeljs.io/docs/en/options#env
- https://babeljs.io/docs/en/config-files
  
</details>


<details>
  <summary>
    How to setup `babel.config.js`
  </summary>

```js
module.exports = (api) => {
  const isDev = api.env("development")
  
  return {
    presets: [
      // Add next line at the end of presets list
      "patronum/babel-preset",
    ],
    plugins: [
      // Add next lines at the end of the plugins list
      isDev
        ? ["effector-logger/babel-plugin", {}]
        : ["effector/babel-plugin", {}]
    ]
  }
}
```
  
If you want to pass factories to the effector plugin, you need just put it to the variable:

  
```js

module.exports = (api) => {
  const isDev = api.env("development")
  // Here your factories
  const factories = ["src/shared/lib/compare", "src/shared/lib/timing"]
  
  return {
    plugins: [
      isDev
        // All effector options passed into `effector` property
        ? ["effector-logger/babel-plugin", { effector: { factories } }]
        : ["effector/babel-plugin", { factories }]
    ]
  }
}
```

Also, you need to build your project with `BABEL_ENV=development` for dev and `BABEL_ENV=production` for prod, to choose the appropriate option in the `"env"` section.
  
  
Relative links:
- https://babeljs.io/docs/en/options#env
- https://babeljs.io/docs/en/config-files

</details>


### 3. CRA support with [macros](https://github.com/kentcdodds/babel-plugin-macros)

[`babel-plugin-macros`](https://github.com/kentcdodds/babel-plugin-macros) is bundled into CRA, so we can use it due CRA don't support adding babel plugins into `.babelrc` or `babel.config.js`.

Just import from `patronum/macro` and `effector-logger/macro`, and use as early:

```ts
import { createStore, createEffect, sample } from "effector-logger/macro"
import { status, splitMap, combineEvents } from "patronum/macro";
```

> - Warning: babel-plugin-macros do not support `import * as name`!
> - Note: Since release of patronum@2.0.0 it is required to use babel-plugin-macros@3.0.0 or higher.
> - Please note, that react-scripts@4.0.3 and older **uses outdated version** of this plugin - you can either use [yarn resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) or use react-scripts@5.0.0 or higher.

## Migration guide

<details>
  <summary>
    show / hide
  </summary>


### v2.0.0

Removed support of effector v21. Now the minimum supported version is `v22.1.2`.

### v0.110

From `v0.110.0` patronum removed support of effector v20. Now minimum supported version is `v21.4`.

Please, before upgrade review release notes of [`effector v21`](https://github.com/effector/effector/releases/tag/effector%4021.0.0).

### v0.100

From `v0.100.0` patronum introduced object arguments form with **BREAKING CHANGES**. Please, review [migration guide](./MIGRATION.md) before upgrade from `v0.14.x` on your project.
  
</details>

---

## Condition

[Method documentation & API](/src/condition)

```ts
import { createEvent } from 'effector';
import { condition } from 'patronum/condition';

const trigger = createEvent<string>();

const longString = createEvent<string>();
const shortString = createEvent<string>();

condition({
  source: trigger,
  if: (string) => string.length > 6,
  then: longString,
  else: shortString,
});

longString.watch((str) => console.log('long', str));
shortString.watch((str) => console.log('short', str));

trigger('hi'); // => short hi
trigger('welcome'); // => long welcome
```

[Try it](https://share.effector.dev/vGMekp9H 'in playground')

## Delay

[Method documentation & API](/src/delay)

```ts
import { createEvent } from 'effector';
import { delay } from 'patronum/delay';

const trigger = createEvent<string>(); // createStore or createEffect

// `timeout` also supports (payload) => number and Store<number>
const delayed = delay({ source: trigger, timeout: 300 });

delayed.watch((payload) => console.info('triggered', payload));

trigger('hello');
// after 300ms
// => triggered hello
```

[Try it](https://share.effector.dev/vWwXoL4n)

## Debounce

[Method documentation & API](/src/debounce)

```ts
import { createEvent } from 'effector';
import { debounce } from 'patronum/debounce';

// You should call this event
const trigger = createEvent<number>();

const target = debounce({ source: trigger, timeout: 200 });

target.watch((payload) => console.info('debounced', payload));

trigger(1);
trigger(2);
trigger(3);
trigger(4);
// after 200ms
// => debounced 4
```

[Try it](https://share.effector.dev/ZFXJbv1b)

## Throttle

[Method documentation & API](/src/throttle)

```ts
import { createEvent } from 'effector';
import { throttle } from 'patronum/throttle';

// You should call this event
const trigger = createEvent<number>();

const target = throttle({ source: trigger, timeout: 200 });

target.watch((payload) => console.info('throttled', payload));

trigger(1);
trigger(2);
trigger(3);
trigger(4);
// 200ms after trigger(1)
// => throttled 4
```

[Try it](https://share.effector.dev/OH0TUJUH)

## Interval

[Method documentation & API](/src/interval)

```ts
import { createStore, createEvent } from 'effector';
import { interval } from 'patronum';

const startCounter = createEvent();
const stopCounter = createEvent();
const $counter = createStore(0);

const { tick } = interval({
  timeout: 500,
  start: startCounter,
  stop: stopCounter,
});

$counter.on(tick, (number) => number + 1);
$counter.watch((value) => console.log('COUNTER', value));

startCounter();

setTimeout(() => stopCounter(), 5000);
```

[Try it](https://share.effector.dev/EOVzc3df)

## Debug

[Method documentation & API](/src/debug)

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

[Try it](https://share.effector.dev/iFi3CahC)

## Status

[Method documentation & API](/src/status)

```ts
import { createEvent, createEffect } from 'effector';
import { status } from 'patronum/status';

const effect = createEffect().use(() => Promise.resolve(null));
const $status = status({ effect });

$status.watch((value) => console.log(`status: ${value}`));
// => status: "initial"

effect();
// => status: "pending"
// => status: "done"
```

[Try it](https://share.effector.dev/6VRR39iC)

## Spread

[Method documentation & API](/src/spread)

```ts
import { createEvent, createStore } from 'effector';
import { spread } from 'patronum/spread';

const trigger = createEvent<{ first: string; second: string }>();

const $first = createStore('');
const $second = createStore('');

spread({
  source: trigger,
  targets: {
    first: $first,
    second: $second,
  },
});

trigger({ first: 'Hello', second: 'World' });

$first.watch(console.log); // => Hello
$second.watch(console.log); // => World
```

[Try it](https://share.effector.dev/DmiLrYAC)

## Snapshot

[Method documentation & API](/src/snapshot)

```ts
import { restore, createEvent } from 'effector';
import { snapshot } from 'patronum/snapshot';

const changeText = createEvent<string>();
const createSnapshot = createEvent();

const $original = restore(changeText, 'Example');

const $snapshot = snapshot({
  source: $original,
  clock: createSnapshot,
});

changeText('New text');

// $original -> Store with "New text"
// $snapshot -> Store with "Example"

createSnapshot();

// $original -> Store with "New text"
// $snapshot -> Store with "New text"
```

[Try it](https://share.effector.dev/HcsNyGfM)

## CombineEvents

[Method documentation & API](/src/combine-events)

Call target event when all event from object/array is triggered

```ts
import { createEvent } from 'effector';
import { combineEvents } from 'patronum/combine-events';

const event1 = createEvent();
const event2 = createEvent();
const event3 = createEvent();
const reset = createEvent();

const event = combineEvents({
  reset,
  events: {
    event1,
    event2,
    event3,
  },
});

event.watch((object) => console.log('triggered', object));

event1(true); // nothing
event2('demo'); // nothing
event3(5); // => triggered { event1: true, event2: "demo", event3: 5 }

event1(true); // nothing
event2('demo'); // nothing
reset();
event3(5); // nothing

event1(true); // nothing
event2('demo'); // nothing
event3(5); // => triggered { event1: true, event2: "demo", event3: 5 }
```

[Try it](https://share.effector.dev/nzc276i0)

## Every

[Method documentation & API](/src/every)

```ts
import { createStore } from 'effector';
import { every } from 'patronum/every';

const $isPasswordCorrect = createStore(true);
const $isEmailCorrect = createStore(true);

const $isFormCorrect = every([$isPasswordCorrect, $isEmailCorrect], true);

$isFormCorrect.watch(console.log); // => true
```

[Try it](https://share.effector.dev/Q9ZZSXoZ)

## InFlight

[Method documentation & API](/src/in-flight)

```ts
import { createEffect } from 'effector';
import { inFlight } from 'patronum/in-flight';

const firstFx = createEffect().use(() => Promise.resolve(1));
const secondFx = createEffect().use(() => Promise.resolve(2));

const $allInFlight = inFlight({ effects: [firstFx, secondFx] });

firstFx();
secondFx();
firstFx();

$allInFlight.watch(console.log);
// => 3
// => 2
// => 1
// => 0
```

[Try it](https://share.effector.dev/NYNJEbpH)

## Pending

[Method documentation & API](/src/pending)

```ts
import { createEffect } from 'effector';
import { pending } from 'patronum/pending';

const loadFirst = createEffect().use(() => Promise.resolve(null));
const loadSecond = createEffect().use(() => Promise.resolve(2));
const $processing = pending({ effects: [loadFirst, loadSecond] });

$processing.watch((processing) => console.info(`processing: ${processing}`));
// => processing: false

loadFirst();
loadSecond();
// => processing: true
// => processing: false
```

[Try it](https://share.effector.dev/TaxOi6nT)

## Some

[Method documentation & API](/src/some)

```ts
import { createStore, restore, createEvent } from 'effector';
import { some } from 'patronum/some';

const widthSet = createEvent<number>();
const $width = restore(widthSet, 820);
const $height = createStore(620);

const $tooBig = some({
  predicate: (size) => size > 800,
  stores: [$width, $height],
});

$tooBig.watch((big) => console.log('big', big)); // => big true

widthSet(200);
// => big false
```

[Try it](https://share.effector.dev/NBxHl8xR)

## Reshape

[Method documentation & API](/src/reshape)

```ts
import { createStore } from 'effector';
import { reshape } from 'patronum/reshape';

const $original = createStore<string>('Hello world');

const parts = reshape({
  source: $original,
  shape: {
    length: (string) => string.length,
    first: (string) => string.split(' ')[0] || '',
    second: (string) => string.split(' ')[1] || '',
  },
});

parts.length.watch(console.info); // 11
parts.first.watch(console.log); // "Hello"
parts.second.watch(console.log); // "world"
```

[Try it](https://share.effector.dev/VbNg7nlV)

## SplitMap

[Method documentation & API](/src/split-map)

```ts
import { createEvent } from 'effector';
import { splitMap } from 'patronum/split-map';

type Action =
  | { type: 'update'; content: string }
  | { type: 'created'; value: number }
  | { type: 'another' };

const serverActionReceived = createEvent<Action>();

const received = splitMap({
  source: serverActionReceived,
  cases: {
    update: (action) => (action.type === 'update' ? action.content : undefined),
    created: (action) => (action.type === 'created' ? action.value : undefined),
  },
});

received.update.watch((payload) =>
  console.info('update received with content:', payload),
);
received.created.watch((payload) => console.info('created with value:', payload));
received.__.watch((payload) => console.info('unknown action received:', payload));

serverActionReceived({ type: 'created', value: 1 });
// => created with value: 1

serverActionReceived({ type: 'update', content: 'demo' });
// => update received with content: "demo"

serverActionReceived({ type: 'another' });
// => unknown action received: { type: "another" }
```

[Try it](https://share.effector.dev/RRf57lK4)

## Time

[Method documentation & API](/src/time)

```ts
import { createEvent } from 'effector';
import { time } from 'patronum/time';

const readTime = createEvent();
const $now = time({ clock: readTime });

$now.watch((now) => console.log('Now is:', now));
// => Now is: 1636914286675

readTime();
// => Now is: 1636914300691
```

[Try it](https://share.effector.dev/BFlhNGvk)

## Format

[Method documentation & API](/src/format)

```ts
import { createStore } from 'effector';
import { format } from 'patronum';

const $firstName = createStore('John');
const $lastName = createStore('Doe');

const $fullName = format`${$firstName} ${$lastName}`;
$fullName.watch(console.log);
// => John Doe
```

[Try it](https://share.effector.dev/IafeiFkF)

## Reset

```ts
import { createEvent, createStore } from 'effector';
import { reset } from 'patronum/reset';

const pageUnmounted = createEvent();
const userSessionFinished = createEvent();

const $post = createStore(null);
const $comments = createStore([]);
const $draftComment = createStore('');

reset({
  clock: [pageUnmounted, userSessionFinished],
  target: [$post, $comments, $draftComment],
});
```

[Try it](https://share.effector.dev/06hpVftG)

# Development

You can review [CONTRIBUTING.md](./CONTRIBUTING.md)

## Release process

1. Check out the [draft release](https://github.com/effector/patronum/releases).
1. All PRs should have correct labels and useful titles. You can [review available labels here](https://github.com/effector/patronum/blob/master/.github/release-drafter.yml).
1. Update labels for PRs and titles, next [manually run the release drafter action](https://github.com/effector/patronum/actions/workflows/release-drafter.yml) to regenerate the draft release.
1. Review the new version and press "Publish"
1. If required check "Create discussion for this release"
