import { expectType } from 'tsd';
import { Event, createStore, createEvent, createEffect, Store } from 'effector';
import { delay } from '../dist/delay';

// Check valid type for source
{
  const $string = createStore('');
  const $number = createStore(0);

  expectType<Event<string>>(delay({ source: $string, timeout: 100 }));
  expectType<Event<number>>(delay({ source: $number, timeout: 100 }));
}

// Check timeout type for number
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: 100 }));

  // @ts-expect-error
  delay({ source, timeout: true });
  // @ts-expect-error
  delay({ source, timeout: null });
  // @ts-expect-error
  delay({ source, timeout: '' });
  // @ts-expect-error
  delay({ source, timeout: Symbol('example') });
  // @ts-expect-error
  delay({ source, timeout: undefined });
}

// Check timeout type for function
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: () => 0 }));

  // @ts-expect-error
  delay({ source, timeout: () => true });
  // @ts-expect-error
  delay({ source, timeout: () => null });
  // @ts-expect-error
  delay({ source, timeout: () => '' });
  // @ts-expect-error
  delay({ source, timeout: () => Symbol('example') });
  // @ts-expect-error
  delay({ source, timeout: () => undefined });
}

// Check timeout type for function argument
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: (p: string) => 0 }));

  // @ts-expect-error
  delay({ source, timeout: (p: number) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: symbol) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: null) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: undefined) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: Record<string, unknown>) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: () => '') => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: () => false) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: () => []) => 0 });
}

// Check timeout type for store
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: createStore(0) }));

  // @ts-expect-error
  delay({ source, timeout: createStore(true) });
  // @ts-expect-error
  delay({ source, timeout: createStore(null) });
  // @ts-expect-error
  delay({ source, timeout: createStore('') });
  // @ts-expect-error
  delay({ source, timeout: createStore(Symbol('example')) });
  // @ts-expect-error
  delay({ source, timeout: createStore(undefined) });
}

// void events support
{
  const source = createEvent<number>();
  const target = createEvent();

  expectType<typeof target>(delay({ source, timeout: 100, target }));
}

// void effects support
{
  const source = createEvent<number>();
  const target = createEffect<void, void>();

  expectType<typeof target>(delay({ source, timeout: 100, target }));
}

// supports wider type in target
{
  const source = createEvent<number>();
  const target = createEvent<number | string>();

  delay({ source, timeout: 100, target });
}

// does not allow narrower type in target
{
  const source = createEvent<number>();
  const target = createEvent<1 | 2>();

  delay({
    source,
    timeout: 100,
    // @ts-expect-error
    target,
  });
}

// supports multiple targets as an array
{
  const source = createStore<string>('');

  const $targetStore = createStore<string>('');

  const targetEvent = createEvent<string>();
  const targetEventVoid = createEvent<void>();

  const targetEffect = createEffect<string, void>();
  const targetEffectVoid = createEffect<void, void>();

  delay({
    source,
    timeout: 100,
    target: [
      $targetStore,
      targetEvent,
      targetEventVoid,
      targetEffect,
      targetEffectVoid,
    ],
  });
}

// does not allow invalid targets in array
{
  const source = createStore<string>('');

  // @ts-expect-error
  delay({ source, timeout: 100, target: ['non-unit'] });
  // @ts-expect-error
  delay({ source, timeout: 100, target: [null] });
  // @ts-expect-error
  delay({ source, timeout: 100, target: [100] });
  // @ts-expect-error
  delay({ source, timeout: 100, target: [() => ''] });
}

// does not allow incompatible targets in array
{
  const source = createStore<string>('');

  // @ts-expect-error
  delay({
    source,
    timeout: 100,
    target: [createEvent<number>()],
  });

  // @ts-expect-error
  delay({
    source,
    timeout: 100,
    target: [createEffect<number, void>()],
  });

  // @ts-expect-error
  delay({
    source,
    timeout: 100,
    target: [createStore<number>(0)],
  });

  delay({
    source,
    timeout: 100,
    // @ts-expect-error
    target: [
      createEvent<number>(),
      createEffect<number, void>(),
      createStore<number>(0),
    ],
  });

  // @ts-expect-error
  delay({
    source,
    timeout: 100,
    target: [createEvent<string>(), 'non-unit'],
  });
}

// returns typeof target
{
  const source = createStore<'x'>('x');

  expectType<Event<'x'>>(
    delay({
      source,
      timeout: 100,
      target: createEvent<'x'>(),
    }),
  );

  expectType<[Event<'x'>, Store<string>, Event<string>]>(
    delay({
      source,
      timeout: 100,
      target: [createEvent<'x'>(), createStore<string>(''), createEvent<string>()],
    }),
  );
}
