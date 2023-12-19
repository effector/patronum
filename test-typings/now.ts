import { now } from '../dist/now';
import { createEvent, Store } from 'effector';
import { expectType } from 'tsd';

// Always returns the store
{
  const $a = now();
  const $b = now({ clock: createEvent() });

  expectType<Store<number>>($a);
  expectType<Store<number>>($b);
}

// Should not receive non-unit as argument in clock
{
  // @ts-expect-error
  now(1);

  // @ts-expect-error
  now(true);

  // @ts-expect-error
  now('');

  // @ts-expect-error
  now({ a: 123 });

  // @ts-expect-error
  now([]);

  // @ts-expect-error
  now({ clock: 1 });

  // @ts-expect-error
  now({ clock: true });

  // @ts-expect-error
  now({ clock: '' });

  // @ts-expect-error
  now({ clock: { a: 123 } });

  // @ts-expect-error
  now({ clock: [] });
}
