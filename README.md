# ☄️ effecto patronum ✨

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](http://prettier.io) ![Node.js CI](https://github.com/sergeysova/patronum/workflows/Node.js%20CI/badge.svg)

☄️ Effector utility library delivering modularity and convenience

## Table of contents

- [CombineEvents](#combineevents)
- [Condition](#condition)
- [Debounce](#debounce)
- [Debug](#debug)
- [Delay](#delay)
- [Every](#every)
- [Reshape](#reshape)
- [Some](#some)
- [SplitMap](#splitmap)
- [Spread](#spread)
- [Status](#status)
- [Throttle](#throttle)

## Usage

```bash
npm install patronum
# or
yarn add patronum
```

Import function by its name from `patronum`:

```ts
import { delay } from 'patronum/delay';
```

Also use can import it from index:

> Be careful, with this method, all functions will be at your bundle

```ts
import { delay } from 'patronum';
```

## [Condition](/condition 'Documentation')

```ts
import { createEvent } from 'effector';
import { condition } from 'patronum/condition';

const trigger = createEvent<string>();

const longString = createEvent<string>();
const shortString = createEvent<string>();

condition({
  source: trigger,
  if: (string) => string.length > 8,
  then: longString,
  else: shortString,
});
```

## [Delay](/delay 'Documentation')

```ts
import { createEvent } from 'effector';
import { delay } from 'patronum/delay';

const trigger = createEvent<string>(); // createStore or createEffect
const delayed = delay(trigger, 300);

delayed.watch((payload) => console.info('triggered', payload));

trigger('hello');
// after 300ms
// => triggered hello
```

## [Debounce](/debounce 'Documentation')

```ts
import { createEvent } from 'effector';
import { debounce } from 'patronum/debounce';

// You should call this event
const trigger = createEvent<number>();

const target = debounce(trigger, 200);

target.watch((payload) => console.info('debounced', payload));

trigger(1);
trigger(2);
trigger(3);
trigger(4);
// after 200ms
// => debounced 4
```

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
// => throttled 1
```

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

## [Status](/status 'Documentation')

```ts
import { createEvent, createEffect } from 'effector';
import { status } from 'patronum/status';

const effect = createEffect().use(() => Promise.resolve(null));
const $status = status(effect);

$status.watch((value) => console.log(`status: ${value}`));
// => status: "initial"

effect();
// => status: "pending"
// => status: "done"
```

## [Spread](/spread 'Documentation')

```ts
import { createEvent, createStore } from 'effector';
import { spread } from 'patronum/spread';

const trigger = createEvent<{ first: string; second: string }>();

const $first = createStore('');
const $second = createStore('');

spread(trigger, {
  first: $first,
  second: $second,
});

trigger({ first: 'Hello', second: 'World' });

$first.getState(); // "Hello"
$second.getState(); // "World"
```

## [CombineEvents](/combine-events 'Documentation')

Call target event when all event from object/array is triggered

```ts
import { createEvent } from 'effector';
import { combineEvents } from 'patronum/combine-events';

const event1 = createEvent();
const event2 = createEvent();
const event3 = createEvent();

const event = combineEvents({
  event1,
  event2,
  event3,
});

event.watch((object) => console.log('triggered', object));

event1(true); // nothing
event2('demo'); // nothing
event3(5); // triggered { event1: true, event2: "demo", event3: 5 }
```

## [Every](/every 'Documentation')

```ts
const $isPasswordCorrect = createStore(true);
const $isEmailCorrect = createStore(true);

const $isFormCorrect = every(true, [$isPasswordCorrect, $isEmailCorrect]);
// true
```

## [Some](/some 'Documentation')

```ts
const $width = createStore(440);
const $height = createStore(820);

const $tooBig = some((size) => size > 800, [$width, $height]);

console.assert(true === $tooBig.getState());
```

## [Reshape](/reshape 'Documentation')

```ts
import { createStore } from 'effector';
import { reshape } from 'patronum/reshape';

const $original = createStore<string>('Hello world');

const parts = reshape($original, {
  length: (string) => string.length,
  first: (string) => string.split(' ')[0] || '',
  second: (string) => string.split(' ')[1] || '',
});

parts.length.watch(console.info); // 11
parts.first.watch(console.log); // "Hello"
parts.second.watch(console.log); // "Second"
```

## [SplitMap](/split-map 'Documentation')

```ts
import { createEvent } from 'effector';
import { splitMap } from 'patronum/split-map';

const nameReceived = createEvent<string>();

const received = splitMap(nameReceived, {
  firstName: (string) => string.split(' ')[0], // string | undefined
  lastName: (string) => string.split(' ')[1], // string | undefined
});

received.firstName.watch((first) => console.info('firstname received', first));
received.lastName.watch((last) => console.info('lastname received', last));

nameReceived('Sergey');
// firstname received "Sergey"

nameReceived('Sergey Sova');
// firstname received "Sergey"
// lastname received "Sova"
```
