import { Store, Effect } from 'effector';

export type EffectState = 'initial' | 'pending' | 'done' | 'fail';

export function status<Params, Result>(_: {
  effect: Effect<Params, Result>;
  defaultValue?: EffectState;
}): Store<EffectState>;
