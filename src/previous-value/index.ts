import { Node, Store, createStore, launch, step, is } from 'effector';

export function previousValue<State>(store: Store<State>): Store<State | null>;
export function previousValue<State, Init>(
  store: Store<State>,
  initialValue: Init,
): Store<State | Init>;
export function previousValue<State, Init = null>(
  ...args: [store: Store<State>, defaultValue?: Init]
) {
  const [store] = args;
  const initialValue = (args.length < 2 ? null : args[1]) as Init | null;
  if (!is.store(store)) {
    throw Error('previousValue first argument should be a store');
  }
  const $prevValue = createStore<State | Init | null>(initialValue, {
    serialize: 'ignore',
    skipVoid: false,
  });
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
