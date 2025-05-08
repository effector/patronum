import { createStore, Effect, is, StoreWritable } from 'effector';

export type EffectState = 'initial' | 'pending' | 'done' | 'fail';

export function status<Params, Done, Fail = Error>(
  effect: Effect<Params, Done, Fail>,
): StoreWritable<EffectState>;
export function status<Params, Done, Fail = Error>(params: {
  effect: Effect<Params, Done, Fail>;
  defaultValue?: EffectState;
}): StoreWritable<EffectState>;
export function status<Params, Done, Fail = Error>(
  params:
    | {
        effect: Effect<Params, Done, Fail>;
        defaultValue?: EffectState;
      }
    | Effect<Params, Done, Fail>,
) {
  const { effect, defaultValue = 'initial' } = is.effect(params)
    ? { effect: params }
    : params;
  const $status = createStore(defaultValue);

  if (!is.effect(effect)) {
    throw TypeError(`status: "effect" property is not an effect`);
  }

  $status
    .on(effect, () => 'pending')
    .on(effect.done, () => 'done')
    .on(effect.fail, () => 'fail');

  return $status;
}
