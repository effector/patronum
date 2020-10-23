# ☄️ effector patronum ✨

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](http://prettier.io) ![Node.js CI](https://github.com/effector/patronum/workflows/Node.js%20CI/badge.svg)

☄️ Effector operators library delivering modularity and convenience

## Table of contents

### Predicate

- [Condition](#condition) — Trigger then or else by condition.
- [Some](#some) — Checks that state in at least one store passes the predicate test.
- [Every](#every) — Checks that state in each store passes the predicate test.

### Effect

- [Pending](#pending) — Checks that has effects in pending state.
- [InFlight](#inflight) — Counts all pending effects
- [Status](#status) — Return text representation of effect state.

### Timeout

- [Debounce](#debounce) — Creates event which waits until time passes after previous trigger.
- [Delay](#delay) — Delays the call of the event by defined timeout.
- [Throttle](#throttle) — Creates event which triggers at most once per timeout.

### Combination/Decomposition

- [CombineEvents](#combineevents) — Wait for all passed events is triggered.
- [Reshape](#reshape) — Destructure one store to different stores
- [SplitMap](#splitmap) — Split event to different events and map data.
- [Spread](#spread) — Send fields from object to same targets.

### Debug

- [Debug](#debug) — Log triggers of passed units.

## Usage

```bash
npm install patronum
# or
yarn add patronum
```

Import function by its name from `patronum`:

```ts
import { delay } from 'patronum/delay';
import { inFlight } from 'patronum/in-flight';
```

Also use can import it from index:

> Be careful, with this import method, all functions will be at your bundle

```ts
import { delay, inFlight } from 'patronum';
```

## Migration guide

### v0.110

From `v0.110.0` patronum removed support of effector v20. Now minimum supported version is `v21.4`.

Please, before upgrade review release notes of [`effector v21`](https://github.com/zerobias/effector/releases/tag/effector%4021.0.0).

### v0.100

From `v0.100.0` patronum introduced object arguments form with **BREAKING CHANGES**. Please, review [migration guide](./MIGRATION.md) before upgrade from `v0.14.x` on your project.

---

## [Condition](/condition 'Documentation')

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

longString.watch(str => console.log("long", str))
shortString.watch(str => console.log("short", str))

trigger("hi") // => short hi
trigger("welcome") // => long welcome
```

[Try it](https://share.effector.dev/vGMekp9H 'in playground')

## [Delay](/delay 'Documentation')

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

## [Debounce](/debounce 'Documentation')

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

## [Throttle](/throttle 'Documentation')

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

## [Debug](/debug 'Documentation')

```ts
import { createStore, createEvent, createEffect } from 'effector';
import { debug } from 'patronum/debug';

const event = createEvent();
const effect = createEffect().use((payload) =>
  Promise.resolve('result' + payload),
);
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

## [Status](/status 'Documentation')

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

## [Spread](/spread 'Documentation')

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

$first.watch(console.log) // => Hello
$second.watch(console.log) // => World
```

[Try it](https://share.effector.dev/DmiLrYAC)

## [CombineEvents](/combine-events 'Documentation')

Call target event when all event from object/array is triggered

```ts
import { createEvent } from 'effector';
import { combineEvents } from 'patronum/combine-events';

const event1 = createEvent();
const event2 = createEvent();
const event3 = createEvent();

const event = combineEvents({
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
```

[Try it](https://share.effector.dev/nzc276i0)

## [Every](/every 'Documentation')

```ts
import { createStore } from 'effector'
import { every } from 'patronum/every'

const $isPasswordCorrect = createStore(true);
const $isEmailCorrect = createStore(true);

const $isFormCorrect = every({
  predicate: true,
  stores: [$isPasswordCorrect, $isEmailCorrect],
});

$isFormCorrect.watch(console.log) // => true
```

[Try it](https://share.effector.dev/Q9ZZSXoZ)

## [InFlight](/in-flight 'Documentation')

```ts
import { createEffect } from 'effector'
import { inFlight } from 'patronum/in-flight'

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

## [Pending](/pending 'Documentation')

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

## [Some](/some 'Documentation')

```ts
import { createStore, restore, createEvent } from 'effector'
import { some } from 'patronum/some'

const widthSet = createEvent<number>();
const $width = restore(widthSet, 820);
const $height = createStore(620);

const $tooBig = some({ predicate: (size) => size > 800, stores: [$width, $height] });

$tooBig.watch(big => console.log("big", big)) // => big true

widthSet(200)
// => big false
```

[Try it](https://share.effector.dev/NBxHl8xR)

## [Reshape](/reshape 'Documentation')

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
parts.second.watch(console.log); // "Second"
```

[Try it](https://share.effector.dev/SmqZgxrx)

## [SplitMap](/split-map 'Documentation')

```ts
import { createEvent } from 'effector';
import { splitMap } from 'patronum/split-map';

const nameReceived = createEvent<string>();

const received = splitMap({
  source: nameReceived,
  cases: {
    firstName: (string) => string.split(' ')[0], // string | undefined
    lastName: (string) => string.split(' ')[1], // string | undefined
  },
});

received.firstName.watch((first) => console.info('firstname received', first));
received.lastName.watch((last) => console.info('lastname received', last));

nameReceived('Sergey');
// firstname received "Sergey"

nameReceived('SergeySova');
// firstname received "Sergey"
// lastname received "Sova"
```

[Try it](https://share.effector.dev/inSAmJAd)
