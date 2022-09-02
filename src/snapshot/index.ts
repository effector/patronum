import { createStore, Event, sample, Store } from 'effector';

export function snapshot<SourceType, TargetType = SourceType>({
  source,
  clock,
  fn = (value: SourceType) => value as unknown as TargetType,
}: {
  source: Store<SourceType>;
  clock?: Event<any>;
  fn?(value: SourceType): TargetType;
}): Store<TargetType> {
  const defaultValue = fn(source.defaultState);
  const onSnapshot = clock ? sample({ source, clock, fn }) : sample({ source, fn });
  const $snapshot = createStore(defaultValue);

  $snapshot.on(onSnapshot, (_, value) => value);

  return $snapshot;
}
