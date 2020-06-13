import { expectType, expectError } from 'tsd';
import {
  Store,
  Event,
  Effect,
  createStore,
  createEvent,
  createEffect,
} from 'effector';
import { throttle } from '../throttle';

// Returns the same type as source
{
  const $source = createStore(0);
  expectType<Event<number>>(throttle({ source: $source, timeout: 10 }));

  const source = createEvent<string>();
  expectType<Event<string>>(throttle({ source, timeout: 10 }));

  const sourceUnion = createEvent<'demo' | 'another'>();
  expectType<Event<'demo' | 'another'>>(
    throttle({ source: sourceUnion, timeout: 10 }),
  );

  const sourceFx = createEffect<boolean, void>();
  expectType<Event<boolean>>(throttle({ source: sourceFx, timeout: 10 }));
}

// Source should be unit
{
  expectError(throttle({ timeout: 10 }));
  expectError(throttle({ timeout: 10, source: null }));
  expectError(throttle({ timeout: 10, source: undefined }));
  expectError(throttle({ timeout: 10, source: true }));
  expectError(throttle({ timeout: 10, source: 'f' }));
  expectError(throttle({ timeout: 10, source: Symbol() }));
  expectError(throttle({ timeout: 10, source: () => {} }));
  expectError(throttle({ timeout: 10, source: {} }));
  expectError(throttle({ timeout: 10, source: [] }));
}

// Timeout should be only number
{
  const source = createEvent();
  expectType<Event<void>>(throttle({ source, timeout: 10 }));

  expectError(throttle({ source }));
  expectError(throttle({ source, timeout: null }));
  expectError(throttle({ source, timeout: undefined }));
  expectError(throttle({ source, timeout: true }));
  expectError(throttle({ source, timeout: 'f' }));
  expectError(throttle({ source, timeout: Symbol() }));
  expectError(throttle({ source, timeout: () => {} }));
  expectError(throttle({ source, timeout: {} }));
  expectError(throttle({ source, timeout: [] }));
}

// Source and target should be compatible
// Returns the same type as target
{
  expectType<Event<number>>(
    throttle({
      source: createStore(0),
      timeout: 10,
      target: createEvent<number>(),
    }),
  );

  expectType<Effect<string, void>>(
    throttle({
      source: createStore(''),
      timeout: 10,
      target: createEffect<string, void>(),
    }),
  );

  expectType<Store<string>>(
    throttle({
      source: createEffect<string, void>(),
      timeout: 10,
      target: createStore(''),
    }),
  );
}

// Name argument is a string without target
{
  const source = createEvent();
  expectType<Event<void>>(throttle({ source, timeout: 10 }));
  expectType<Event<void>>(throttle({ source, timeout: 10, name: undefined }));
  expectType<Event<void>>(throttle({ source, timeout: 10, name: 'demo' }));

  expectError(throttle({ source, timeout: 10, name: null }));
  expectError(throttle({ source, timeout: 10, name: true }));
  expectError(throttle({ source, timeout: 10, name: Symbol() }));
  expectError(throttle({ source, timeout: 10, name: 6 }));
  expectError(throttle({ source, timeout: 10, name: () => {} }));
  expectError(throttle({ source, timeout: 10, name: {} }));
  expectError(throttle({ source, timeout: 10, name: [] }));
}

// Name argument is a string with target
{
  const source = createEvent<number>();
  const target = createStore(0);
  expectType<Store<number>>(throttle({ source, target, timeout: 10 }));
  expectType<Store<number>>(
    throttle({ source, target, timeout: 10, name: undefined }),
  );
  expectType<Store<number>>(
    throttle({ source, target, timeout: 10, name: 'demo' }),
  );

  expectError(throttle({ source, target, timeout: 10, name: null }));
  expectError(throttle({ source, target, timeout: 10, name: true }));
  expectError(throttle({ source, target, timeout: 10, name: Symbol() }));
  expectError(throttle({ source, target, timeout: 10, name: 6 }));
  expectError(throttle({ source, target, timeout: 10, name: () => {} }));
  expectError(throttle({ source, target, timeout: 10, name: {} }));
  expectError(throttle({ source, target, timeout: 10, name: [] }));
}
