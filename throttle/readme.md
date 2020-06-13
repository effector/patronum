# Patronum/Throttle

```ts
import { throttle } from 'patronum/throttle';
```

## Usage

Create event that should be throttled:

```ts
import { createEvent } from 'effector';

const someHappened = createEvent<number>();
```

Create throttled event from it:

```ts
import { throttle } from 'effector-throttle';

const THROTTLE_TIMEOUT_IN_MS = 200;

const throttled = throttle({
  source: someHappened,
  timeout: THROTTLE_TIMEOUT_IN_MS,
});
```

When you call `someHappened` it will make throttled call the `throttled` event:

```ts
throttled.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);
```

Also you can use `Effect` and `Store` as trigger. `throttle` always returns `Event`:

```ts
const event = createEvent<number>();
const debouncedEvent: Event<number> = throttle({ source: event, timeout: 100 });

const fx = createEffect<number, void>();
const debouncedEffect: Event<number> = throttle({ source: fx, timeout: 100 });

const $store = createStore<number>(0);
const debouncedStore: Event<number> = throttle({
  source: $store,
  timeout: 100,
});
```
