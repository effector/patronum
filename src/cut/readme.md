# cut

```ts
import { cut } from 'patronum/cut';
```

## `shape = cut({ source, cases })`

### Motivation

The method is similar to [`split-map`], but do not stop on first case but processes them all.
It is useful when you want to have cut some event into smaller events.

[`split-map`]: https://effector.dev/docs/api/effector/split-map

### Formulae

```ts
shape = cut({ source, cases });
```

- On each `source` trigger, call each function in `cases` object one after another, and call event in `shape` with the same name as function in `cases` object if `case` function returns non undefined.
- If all functions returned value `undefined`  event `__` in `shape` should be triggered

### Arguments

1. `source` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Source unit, data from this unit passed to each function in `cases` object and `__` event in `shape` as is
2. `cases` (`{ [key: string]: (payload: T) => any | void }`) — Object of functions. Function receives one argument is a payload from `source`, should return any value or `undefined`

### Returns

- `shape` (`{ [key: string]: Event<any>; __: Event<T> }`) — Object of events, with the same structure as `cases`, but with the _default_ event `__`, that triggered when each other function returns `undefined`

[_`event`_]: https://effector.dev/docs/api/effector/event
[_`effect`_]: https://effector.dev/docs/api/effector/effect
[_`store`_]: https://effector.dev/docs/api/effector/store

### Examples

#### Extract passed fields from optional object

```ts
import { createEvent } from 'effector';
import { cut } from 'patronum/cut';

const event = createEvent<object>();

const shape = cut({
  source: event,
  cases: {
    getType: (input) => input.type,
    getDemo: (input) => input.demo,
  },
});

shape.getType.watch((type) => console.log('TYPE', type));
shape.getDemo.watch((demo) => console.log('DEMO', demo));
shape.__.watch((other) => console.log('OTHER', other));

event({ type: 'demo' });
// => TYPE demo

event({ demo: 5 });
// => DEMO 5

event({ type: 'demo', demo: 5 });
// => TYPE demo
// => DEMO 5

event({});
// => OTHER {}
```

#### Cut WebSocket events into effector events

```ts
import { createEvent } from 'effector';
import { cut } from 'patronum/cut';

type WSInitEvent =  { type: 'init'; key: string };
type WSIncrementEvent =  { type: 'increment'; count: number; name: string };
type WSResetEvent =   { type: 'reset'; name: string };
type WSEvent =
  | WSInitEvent
  | WSIncrementEvent
  | WSResetEvent

export const websocketEventReceived = createEvent<WSEvent[]>();

const { init, increment, reset, __ } = cut({
  source: websocketEventReceived,
  cases: {
    init: (events) => events.filter((wsEvent: WSEvent): wsEvent is WSInitEvent => wsEvent.type === 'init'),
    increment: (events) => events.filter((wsEvent: WSEvent): wsEvent is WSIncrementEvent => wsEvent.type === 'increment'),
    reset: (events) => events.filter((wsEvent: WSEvent): wsEvent is WSResetEvent => wsEvent.type === 'reset'),
  },
});

init.watch(initEvents => {
  console.info(`inited for ${initEvents.length}`);
});

increment.watch(incrementEvents => {
  console.info('should be incremented', incrementEvents.map(wsEvent => wsEvent.count).reduce((a, b) => a + b));
});

websocketEventReceived([{ type: 'increment', name: 'demo', count: 5 }, { type: 'increment', name: 'demo', count: 15 }]);
// => inited for 0
// => should be incremented 20
```

