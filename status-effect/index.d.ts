import { Store, Effect } from 'effector';

type Status = 'initial' | 'pending' | 'done' | 'fail';

export function statusEffect<Params, Result>(
  effect: Effect<P, R>,
  defaultValue?: Status,
): Store<Status>;
