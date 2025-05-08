import { expectType } from 'tsd';
import { createEvent, createEffect, createStore } from 'effector';
import { reset } from '../dist/reset';

import type { Event } from 'effector';

// With clock in params
{
  const event = createEvent();
  const $store = createStore('');
  const $clock = createStore('');
  const fx = createEffect();

  expectType<void>(reset({ clock: event, target: $store }));
  expectType<void>(reset({ clock: event, target: [$store] }));
  expectType<void>(reset({ clock: [event], target: [$store] }));
  expectType<void>(reset({ clock: [event], target: $store }));

  expectType<void>(reset({ clock: fx, target: $store }));
  expectType<void>(reset({ clock: fx, target: [$store] }));
  expectType<void>(reset({ clock: [fx], target: [$store] }));
  expectType<void>(reset({ clock: [fx], target: $store }));

  expectType<void>(reset({ clock: $clock, target: $store }));
  expectType<void>(reset({ clock: $clock, target: [$store] }));
  expectType<void>(reset({ clock: [$clock], target: [$store] }));
  expectType<void>(reset({ clock: [$clock], target: $store }));

  expectType<void>(reset({ clock: [event, $clock, fx], target: $store }));
  expectType<void>(reset({ clock: [event, $clock, fx], target: [$store] }));
}

// Without clock in params
{
  const $store = createStore('');

  expectType<Event<void>>(reset({ target: $store }));
  expectType<Event<void>>(reset({ target: [$store] }));
}
