import { Unit, Store, Event } from 'effector';

export function condition<State>(options: {
  if: Store<boolean> | ((payload: State) => boolean) | State;
  then: Unit<State> | Unit<void>;
}): Event<State>;
export function condition<State>(options: {
  if: Store<boolean> | ((payload: State) => boolean) | State;
  else: Unit<State> | Unit<void>;
}): Event<State>;
export function condition<State>(options: {
  if: Store<boolean> | ((payload: State) => boolean) | State;
  then: Unit<State> | Unit<void>;
  else: Unit<State> | Unit<void>;
}): Event<State>;

export function condition<State, Source extends Unit<State>>(options: {
  source: Source;
  if: Store<boolean> | ((payload: State) => boolean) | State;
  then: Unit<State> | Unit<void>;
}): Source;
export function condition<State, Source extends Unit<State>>(options: {
  source: Source;
  if: Store<boolean> | ((payload: State) => boolean) | State;
  else: Unit<State> | Unit<void>;
}): Source;
export function condition<State, Source extends Unit<State>>(options: {
  source: Source;
  if: Store<boolean> | ((payload: State) => boolean) | State;
  then: Unit<State> | Unit<void>;
  else: Unit<State> | Unit<void>;
}): Source;
