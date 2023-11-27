import {
  Unit,
  Event,
  EventAsReturnType,
  is,
  sample,
  createStore,
} from 'effector';

export function once<T>(config: {
  source: Unit<T>;
  reset?: Unit<any>;
}): EventAsReturnType<T>;

export function once<T>(unit: Unit<T>): EventAsReturnType<T>;

export function once<T>(
  unitOrConfig: { source: Unit<T>; reset?: Unit<any> } | Unit<T>,
): EventAsReturnType<T> {
  let source: Unit<T>;
  let reset: Unit<any> | undefined;

  if (is.unit(unitOrConfig)) {
    source = unitOrConfig;
  } else {
    ({ source, reset } = unitOrConfig);
  }

  const $canTrigger = createStore<boolean>(true);

  const trigger: Event<T> = sample({
    source,
    filter: $canTrigger,
  });

  $canTrigger.on(trigger, () => false);

  if (reset) {
    $canTrigger.reset(reset);
  }

  return trigger
}
