import { expectType } from 'tsd';
import { Store, createStore, createEvent, createEffect } from 'effector';
import { snapshot } from '../dist/snapshot';

// Check invalid type for source
{
  const a = createEvent();
  // @ts-expect-error
  snapshot({ source: a });

  const b = createEffect();
  // @ts-expect-error
  snapshot({ source: b });

  const c = 12;
  // @ts-expect-error
  snapshot({ source: c });
}

// Check types for Store
{
  const $a = createStore<string>('a');
  expectType<Store<string>>(snapshot({ source: $a }));

  const $b = createStore<'a' | 'b'>('a');
  expectType<Store<'a' | 'b'>>(snapshot({ source: $b }));
}

// Check invalid type for Clock
{
  const $a = createStore(0);

  const b = () => null;

  // @ts-expect-error
  snapshot({ source: $a, clock: b });
}

// Check types for mapper fn
{
  const $a = createStore(0);

  const b = (v: number) => v.toString();

  expectType<Store<string>>(snapshot({ source: $a, fn: b }));
}

// Check invalid type of mapper fn
{
  const $a = createStore(0);

  const b = (v: boolean) => v.toString();

  // @ts-expect-error
  snapshot({ source: $a, fn: b });
}

// Check TargetType is not inferred from return value
{
  const $a = createStore(0);

  // @ts-expect-error
  expectType<Store<string>>(snapshot({ source: $a }));
}

// Check effect is supported as a clock
{
  const $a = createStore(0);

  const clock = createEffect();

  expectType<Store<number>>(snapshot({ source: $a, clock }));
}

// Check store is supported as a clock
{
  const $a = createStore(0);

  const $clock = createStore(0);

  expectType<Store<number>>(snapshot({ source: $a, clock: $clock }));
}
