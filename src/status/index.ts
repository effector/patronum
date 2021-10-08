import { createStore, Effect, Store } from 'effector';

export type EffectState = 'initial' | 'pending' | 'done' | 'fail';

export function status<Params, Done, Fail = Error>({
  effect,
  defaultValue = 'initial',
}: {
  effect: Effect<Params, Done, Fail>;
  defaultValue?: EffectState;
}): Store<EffectState> {
  const $status = createStore(defaultValue);

  $status
    .on(effect, () => 'pending')
    .on(effect.done, () => 'done')
    .on(effect.fail, () => 'fail');

  return $status;
}
