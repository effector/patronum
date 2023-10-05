import {
  Unit,
  Store,
  Event,
  Effect,
  EventAsReturnType,
  is,
  sample,
  createStore,
} from 'effector';

type SourceType<T> = Event<T> | Effect<T, any, any> | Store<T>;

export function once<T>(config: {
  source: SourceType<T>;
  reset?: SourceType<any>;
}): EventAsReturnType<T>;

export function once<T>(unit: SourceType<T>): EventAsReturnType<T>;

export function once<T>(
  unitOrConfig: { source: SourceType<T>; reset?: SourceType<any> } | SourceType<T>,
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

  return sample({ clock: trigger });
}
