import { expectType } from 'tsd';
import {
  Store,
  createEffect,
  createStore,
  createEvent,
  createDomain,
} from 'effector';
import { status, EffectState } from '../dist/status';

// Check that accepts only effect
{
  expectType<Store<EffectState>>(status({ effect: createEffect<number, string>() }));
  expectType<Store<EffectState>>(status(createEffect<number, string>()));

  // @ts-expect-error
  status({ effect: createEvent() });
  // @ts-expect-error
  status({ effect: createStore(0) });
  // @ts-expect-error
  status({ effect: createDomain() });

  // @ts-expect-error
  status(createEvent());
  // @ts-expect-error
  status(createStore(0));
  // @ts-expect-error
  status(createDomain());
}

// Check that accept effect with fail type
{
  const fx = createEffect<number, boolean, string>();

  expectType<Store<EffectState>>(status({ effect: fx }));
  expectType<Store<EffectState>>(status(fx));
}
