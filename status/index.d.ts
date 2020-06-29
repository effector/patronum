import { Store, Effect } from 'effector';

type Status = 'initial' | 'pending' | 'done' | 'fail';

export function status<Params, Result>(_: {
  effect: Effect<Params, Result>;
  defaultValue?: Status;
}): Store<Status>;
