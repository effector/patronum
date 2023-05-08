import {
  Unit,
  Store,
  Event,
  Effect,
  sample,
  createStore,
  EventAsReturnType,
} from 'effector';

export function once<T>(
  unit: Event<T> | Effect<T, any, any> | Store<T>,
): EventAsReturnType<T> {
  const $canTrigger = createStore<boolean>(true);

  const trigger: Event<T> = sample({
    clock: unit as Unit<T>,
    filter: $canTrigger,
  });

  $canTrigger.on(trigger, () => false);

  return sample({ clock: trigger });
}
