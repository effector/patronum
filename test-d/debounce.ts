import { expectType, expectError } from 'tsd';
import {
  Store,
  Event,
  Effect,
  createStore,
  createEvent,
  createEffect,
} from 'effector';
import { debounce } from '../debounce';

// Returns the same type as source
{
  const $source = createStore(0);
  expectType<Event<number>>(debounce({ source: $source, timeout: 10 }));

  const source = createEvent<string>();
  expectType<Event<string>>(debounce({ source, timeout: 10 }));

  const sourceUnion = createEvent<'demo' | 'another'>();
  expectType<Event<'demo' | 'another'>>(
    debounce({ source: sourceUnion, timeout: 10 }),
  );

  const sourceFx = createEffect<boolean, void>();
  expectType<Event<boolean>>(debounce({ source: sourceFx, timeout: 10 }));
}

// Source should be unit
{
  expectError(debounce({ timeout: 10 }));
  expectError(debounce({ timeout: 10, source: null }));
  expectError(debounce({ timeout: 10, source: undefined }));
  expectError(debounce({ timeout: 10, source: true }));
  expectError(debounce({ timeout: 10, source: 'f' }));
  expectError(debounce({ timeout: 10, source: Symbol() }));
  expectError(debounce({ timeout: 10, source: () => {} }));
  expectError(debounce({ timeout: 10, source: {} }));
  expectError(debounce({ timeout: 10, source: [] }));
}

// Timeout should be only number
{
  const source = createEvent();
  expectType<Event<void>>(debounce({ source, timeout: 10 }));

  expectError(debounce({ source }));
  expectError(debounce({ source, timeout: null }));
  expectError(debounce({ source, timeout: undefined }));
  expectError(debounce({ source, timeout: true }));
  expectError(debounce({ source, timeout: 'f' }));
  expectError(debounce({ source, timeout: Symbol() }));
  expectError(debounce({ source, timeout: () => {} }));
  expectError(debounce({ source, timeout: {} }));
  expectError(debounce({ source, timeout: [] }));
}

// Source and target should be compatible
// Returns the same type as target
{
  expectType<Event<number>>(
    debounce({
      source: createStore(0),
      timeout: 10,
      target: createEvent<number>(),
    }),
  );

  expectType<Effect<string, void>>(
    debounce({
      source: createStore(''),
      timeout: 10,
      target: createEffect<string, void>(),
    }),
  );

  expectType<Store<string>>(
    debounce({
      source: createEffect<string, void>(),
      timeout: 10,
      target: createStore(''),
    }),
  );
}

// Name argument is a string without target
{
  const source = createEvent();
  expectType<Event<void>>(debounce({ source, timeout: 10 }));
  expectType<Event<void>>(debounce({ source, timeout: 10, name: undefined }));
  expectType<Event<void>>(debounce({ source, timeout: 10, name: 'demo' }));

  expectError(debounce({ source, timeout: 10, name: null }));
  expectError(debounce({ source, timeout: 10, name: true }));
  expectError(debounce({ source, timeout: 10, name: Symbol() }));
  expectError(debounce({ source, timeout: 10, name: 6 }));
  expectError(debounce({ source, timeout: 10, name: () => {} }));
  expectError(debounce({ source, timeout: 10, name: {} }));
  expectError(debounce({ source, timeout: 10, name: [] }));
}

// Name argument is a string with target
{
  const source = createEvent<number>();
  const target = createStore(0);
  expectType<Store<number>>(debounce({ source, target, timeout: 10 }));
  expectType<Store<number>>(
    debounce({ source, target, timeout: 10, name: undefined }),
  );
  expectType<Store<number>>(
    debounce({ source, target, timeout: 10, name: 'demo' }),
  );

  expectError(debounce({ source, target, timeout: 10, name: null }));
  expectError(debounce({ source, target, timeout: 10, name: true }));
  expectError(debounce({ source, target, timeout: 10, name: Symbol() }));
  expectError(debounce({ source, target, timeout: 10, name: 6 }));
  expectError(debounce({ source, target, timeout: 10, name: () => {} }));
  expectError(debounce({ source, target, timeout: 10, name: {} }));
  expectError(debounce({ source, target, timeout: 10, name: [] }));
}
