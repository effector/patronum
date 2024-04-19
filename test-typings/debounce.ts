import { expectType } from 'tsd';
import {
  Store,
  Event,
  Effect,
  createStore,
  createEvent,
  createEffect,
  createDomain,
  fork,
} from 'effector';
import { debounce } from '../dist/debounce';

// Returns the same type as source
{
  const $source = createStore(0);
  expectType<Event<number>>(debounce({ source: $source, timeout: 10 }));
  expectType<Event<number>>(debounce($source, 10));

  const source = createEvent<string>();
  expectType<Event<string>>(debounce({ source, timeout: 10 }));
  expectType<Event<string>>(debounce(source, 10));

  const sourceUnion = createEvent<'demo' | 'another'>();
  expectType<Event<'demo' | 'another'>>(
    debounce({ source: sourceUnion, timeout: 10 }),
  );
  expectType<Event<'demo' | 'another'>>(debounce(sourceUnion, 10));

  const sourceFx = createEffect<boolean, void>();
  expectType<Event<boolean>>(debounce({ source: sourceFx, timeout: 10 }));
  expectType<Event<boolean>>(debounce(sourceFx, 10));
}

// Source should be unit
{
  // @ts-expect-error
  debounce({ timeout: 10 });
  // @ts-expect-error
  debounce({ timeout: 10, source: null });
  // @ts-expect-error
  debounce(null, 10);
  // @ts-expect-error
  debounce({ timeout: 10, source: undefined });
  // @ts-expect-error
  debounce(undefined, 10);
  // @ts-expect-error
  debounce({ timeout: 10, source: true });
  // @ts-expect-error
  debounce(true, 10);
  // @ts-expect-error
  debounce({ timeout: 10, source: 'f' });
  // @ts-expect-error
  debounce('f', 10);
  // @ts-expect-error
  debounce({ timeout: 10, source: Symbol() });
  // @ts-expect-error
  debounce(Symbol(), 10);
  // @ts-expect-error
  debounce({ timeout: 10, source: () => {} });
  // @ts-expect-error
  debounce(() => {}, 10);
  // @ts-expect-error
  debounce({ timeout: 10, source: {} });
  // @ts-expect-error
  debounce({}, 10);
  // @ts-expect-error
  debounce({ timeout: 10, source: [] });
  // @ts-expect-error
  debounce([], 10);
}

// Timeout should be only number
{
  const source = createEvent();
  expectType<Event<void>>(debounce({ source, timeout: 10 }));

  // @ts-expect-error
  debounce({ source });
  // @ts-expect-error
  debounce(source);
  // @ts-expect-error
  debounce({ source, timeout: null });
  // @ts-expect-error
  debounce(source, null);
  // @ts-expect-error
  debounce({ source, timeout: undefined });
  // @ts-expect-error
  debounce(source, undefined);
  // @ts-expect-error
  debounce({ source, timeout: true });
  // @ts-expect-error
  debounce(source, true);
  // @ts-expect-error
  debounce({ source, timeout: 'f' });
  // @ts-expect-error
  debounce(source, 'f');
  // @ts-expect-error
  debounce({ source, timeout: Symbol() });
  // @ts-expect-error
  debounce(source, Symbol());
  // @ts-expect-error
  debounce({ source, timeout: () => {} });
  // @ts-expect-error
  debounce(source, () => {});
  // @ts-expect-error
  debounce({ source, timeout: {} });
  // @ts-expect-error
  debounce(source, {});
  // @ts-expect-error
  debounce({ source, timeout: [] });
  // @ts-expect-error
  debounce(source, []);
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

  // @ts-expect-error
  debounce({ source, timeout: 10, name: null });
  // @ts-expect-error
  debounce({ source, timeout: 10, name: true });
  // @ts-expect-error
  debounce({ source, timeout: 10, name: Symbol() });
  // @ts-expect-error
  debounce({ source, timeout: 10, name: 6 });
  // @ts-expect-error
  debounce({ source, timeout: 10, name: () => {} });
  // @ts-expect-error
  debounce({ source, timeout: 10, name: {} });
  // @ts-expect-error
  debounce({ source, timeout: 10, name: [] });
}

// Name argument is a string with target
{
  const source = createEvent<number>();
  const target = createStore(0);
  expectType<Store<number>>(debounce({ source, target, timeout: 10 }));
  expectType<Store<number>>(
    debounce({ source, target, timeout: 10, name: undefined }),
  );
  expectType<Store<number>>(debounce({ source, target, timeout: 10, name: 'demo' }));

  // @ts-expect-error
  debounce({ source, target, timeout: 10, name: null });
  // @ts-expect-error
  debounce({ source, target, timeout: 10, name: true });
  // @ts-expect-error
  debounce({ source, target, timeout: 10, name: Symbol() });
  // @ts-expect-error
  debounce({ source, target, timeout: 10, name: 6 });
  // @ts-expect-error
  debounce({ source, target, timeout: 10, name: () => {} });
  // @ts-expect-error
  debounce({ source, target, timeout: 10, name: {} });
  // @ts-expect-error
  debounce({ source, target, timeout: 10, name: [] });
}

// Supports void as a target
{
  const source = createEvent<number>();

  const voidEvent = createEvent<void>();
  const voidEffect = createEffect<void, any>();

  expectType<Event<void>>(debounce({ source, timeout: 300, target: voidEvent }));
  expectType<Effect<void, any>>(
    debounce({ source, timeout: 300, target: voidEffect }),
  );
}

// Scope and Domain are not allowed in target
{
  const source = createEvent<number>();

  const domain = createDomain();
  const scope = fork();

  // @ts-expect-error
  debounce({ source, timeout: 0, target: domain });
  // @ts-expect-error
  debounce({ source, timeout: 0, target: scope });
}
