import { createStore, Effect, sample, Store, Unit, Event } from 'effector';

type NoInfer<T> = [T][T extends any ? 0 : never];

export function snapshot<SourceType, TargetType = SourceType>({
  source,
  clock,
  fn = (value: SourceType) => value as unknown as TargetType,
}: {
  source: Store<SourceType>;
  clock?: Event<any> | Effect<any, any, any> | Store<any>;
  fn?(value: SourceType): TargetType;
}): Store<NoInfer<TargetType>> {
  const defaultValue = fn(source.defaultState);
  const onSnapshot = clock
    ? sample({ source, clock: clock as Unit<any>, fn })
    : sample({ source, fn });
  const $snapshot = createStore(defaultValue);

  $snapshot.on(onSnapshot, (_, value) => value);

  return $snapshot;
}
