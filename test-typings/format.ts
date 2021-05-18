import { expectType } from 'tsd';
import {
  Store,
  createStore,
  createEffect,
  createEvent,
  createDomain,
} from 'effector';
import { format } from '../format';

// check that accepts only stores
{
  expectType<Store<string>>(format`store: ${createStore('')}`);

  // @ts-expect-error
  format`event: ${createEvent()}`;

  // @ts-expect-error
  format`effect: ${createEffect()}`;

  // @ts-expect-error
  format`domain: ${createDomain()}`;
}

// check that accepts different stores type
{
  expectType<Store<string>>(format`store: ${createStore('')}`);

  expectType<Store<string>>(format`store: ${createStore(0)}`);

  expectType<Store<string>>(
    format`first store: ${createStore('')} second store: ${createStore(0)}`,
  );
}
