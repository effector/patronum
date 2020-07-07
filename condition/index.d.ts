import { Unit, Store, Event } from 'effector';

export function condition<State, Source extends Unit<State>>(options: {
  source: Source;
  if: State | ((payload: State) => boolean) | Store<boolean>;
  then: Unit<State | void>;
}): Source;
export function condition<State, Source extends Unit<State>>(options: {
  source: Source;
  if: State | ((payload: State) => boolean) | Store<boolean>;
  else: Unit<State | void>;
}): Source;
export function condition<State, Source extends Unit<State>>(options: {
  source: Source;
  if: State | ((payload: State) => boolean) | Store<boolean>;
  then: Unit<State | void>;
  else: Unit<State | void>;
}): Source;

export function condition<State>(options: {
  if: State | ((payload: State) => boolean) | Store<boolean>;
  then: Unit<State | void>;
}): Event<State>;
export function condition<State>(options: {
  if: State | ((payload: State) => boolean) | Store<boolean>;
  else: Unit<State | void>;
}): Event<State>;
export function condition<State>(options: {
  if: State | ((payload: State) => boolean) | Store<boolean>;
  then: Unit<State | void>;
  else: Unit<State | void>;
}): Event<State>;
