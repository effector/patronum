import { Store, Event, Effect } from 'effector';

type Source<T> = Store<T> | Event<T> | Effect<T, any, any>;

export function condition<State, Result extends State>(options: {
  source: Source<State>;
  if: (payload: State) => payload is Result;
  then?: Source<Result>;
  else?: Source<State>;
});
export function condition<State>(options: {
  source: Source<State>;
  if: Store<boolean> | ((payload: State) => boolean) | State;
  then?: Source<State>;
  else?: Source<State>;
});
