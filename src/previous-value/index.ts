import { Node, Store, createStore, launch, step } from 'effector';

export function previousValue<State>(store: Store<State>): Store<State | null>;
export function previousValue<State, Init>(
  store: Store<State>,
  initialValue: Init,
): Store<State | Init>;
export function previousValue<State, Init = null>(
  store: Store<State>,
  initialValue: Init | null = null,
) {
  const $prevValue = createStore<State | Init | null>(initialValue);
  const storeNode: Node = (store as any).graphite;
  storeNode.seq.push(
    step.compute({
      fn(upd, _, stack) {
        launch({
          target: $prevValue,
          params: stack.a,
          defer: true,
        });
        return upd;
      },
    }),
  );
  return $prevValue;
}
