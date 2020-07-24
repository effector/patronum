import { expectType, expectError } from 'tsd';
import {
  Effect,
  Store,
  createEffect,
  createStore,
  createEvent,
  createDomain,
} from 'effector';
import { status, EffectState } from '../status';

// Check that accepts only effect
{
  expectType<Store<EffectState>>(
    status({ effect: createEffect<number, string>() }),
  );
  // Disabled because tsd cannot correctly handle errors inside expression
  // > Expected an error, but found none.
  /* expectError(status({ effect: createEvent() }));
  expectError(status({ effect: createStore(0) })); */
}

// Check that accept effect with fail type
{
  const fx = createEffect<number, boolean, string>();

  expectType<Store<EffectState>>(status({ effect: fx }));
}
