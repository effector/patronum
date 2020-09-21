import { Store, Effect } from 'effector';

export function inFlight(_: {
  effects: Array<Effect<any, any, any>>;
}): Store<number>;
