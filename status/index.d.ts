import { Store, Effect } from 'effector';

type Status = 'initial' | 'pending' | 'done' | 'fail';

export function status<Params, Result>(
  effect: Effect<Params, Result>,
  initialValue?: Status,
): Store<Status>;
