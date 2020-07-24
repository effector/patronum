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

  expectError(status({ effect: createEvent() }));
  expectError(status({ effect: createStore(0) }));
}

// Check that accept ffect with fail type
{
  const fx = createEffect<number, boolean, string>();

  expectType<Store<EffectState>>(status({ effect: fx }));
}
