import { expectType } from 'tsd';
import { Event, createStore, Store, createEvent } from 'effector';
import { interval } from '../src/interval';

// Only required options with void returns void tick
{
  expectType<{ tick: Event<void>; isRunning: Store<boolean> }>(
    interval({
      timeout: 100,
      start: createEvent<void>(),
      stop: createEvent<void>(),
    }),
  );
}

// All options with void returns void tick
{
  expectType<{ tick: Event<void>; isRunning: Store<boolean> }>(
    interval({
      timeout: 100,
      start: createEvent<void>(),
      stop: createEvent<void>(),
      leading: true,
      trailing: true,
    }),
  );
}

// Leading and trailing allows false/true and only boolean
{
  expectType<{ tick: Event<void>; isRunning: Store<boolean> }>(
    interval({
      timeout: 100,
      start: createEvent<void>(),
      stop: createEvent<void>(),
      leading: false,
      trailing: false,
    }),
  );

  interval({
    timeout: 100,
    start: createEvent<void>(),
    stop: createEvent<void>(),
    // @ts-expect-error
    leading: 1,
    // @ts-expect-error
    trailing: '',
  });

  interval({
    timeout: 100,
    start: createEvent<void>(),
    stop: createEvent<void>(),
    // @ts-expect-error
    leading: [],
    // @ts-expect-error
    trailing: null,
  });
}

// Allow any type as start/stop event but tick doesn't changes
{
  expectType<{ tick: Event<void>; isRunning: Store<boolean> }>(
    interval({
      timeout: 100,
      start: createEvent<number>(),
      stop: createEvent<boolean>(),
    }),
  );
}

// Allow store with number as timeout
{
  expectType<{ tick: Event<void>; isRunning: Store<boolean> }>(
    interval({
      timeout: createStore<number>(0),
      start: createEvent<number>(),
      stop: createEvent<boolean>(),
    }),
  );

  interval({
    // @ts-expect-error
    timeout: createStore<boolean>(true),
    start: createEvent<number>(),
    stop: createEvent<boolean>(),
  });

  interval({
    // @ts-expect-error
    timeout: createStore<any[]>([]),
    start: createEvent<number>(),
    stop: createEvent<boolean>(),
  });

  interval({
    // @ts-expect-error
    timeout: createStore<string>(''),
    start: createEvent<number>(),
    stop: createEvent<boolean>(),
  });
}
