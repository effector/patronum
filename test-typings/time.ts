import { expectType } from 'tsd';
import { Store, createStore, createEvent, createEffect, createDomain } from 'effector';
import { time } from '../src/time';

// Returns correct default Store value
{
  const clock = createEvent<void>();

  expectType<Store<number>>(time({ clock }));
  expectType<Store<number>>(time({ clock, initial: 100 }));
}

// Infers correct Store value
{
  const clock = createEvent<void>();

  const getNowString = (): string => 'time';
  const getNowNumber = (): number => 0;
  const getNowDate = (): Date => new Date();

  expectType<Store<string>>(time({ clock, getNow: getNowString }));
  expectType<Store<number>>(time({ clock, getNow: getNowNumber }));
  expectType<Store<Date>>(time({ clock, getNow: getNowDate }));

  const getNowUnion = (): 'a' | 'b' | 0 => 'a';

  expectType<Store<'a' | 'b' | 0>>(time({ clock, getNow: getNowUnion }));
}

// getNow and initial types should match
{
  const clock = createEvent<void>();

  const getNowString = (): string => 'time';
  const getNowDate = (): Date => new Date();

  expectType<Store<Date>>(time({ clock, getNow: getNowDate, initial: new Date() }));
  expectType<Store<string>>(
    time({ clock, getNow: getNowString, initial: 'another' }),
  );

  // @ts-expect-error
  time({ clock, getNow: getNowString, initial: 100 });
  // @ts-expect-error
  time({ clock, getNow: getNowDate, initial: 100 });
}

// Does not infer Store value from initial
{
  const clock = createEvent<void>();

  // @ts-expect-error
  time({ clock, initial: new Date() });
  // @ts-expect-error
  time({ clock, initial: 'time' });
}

// Clock only accepts valid units
{
  const event = createEvent<void>();
  const effectFx = createEffect<void, void, void>();
  const $store = createStore<void>(undefined);

  expectType<Store<number>>(time({ clock: event }));
  expectType<Store<number>>(time({ clock: effectFx }));
  expectType<Store<number>>(time({ clock: $store }));

  const fn = () => null;
  const domain = createDomain()

  // @ts-expect-error
  time({ clock: fn });
  // @ts-expect-error
  time({ clock: domain });
}
