import { Unit, Store, Event } from 'effector';

export function condition<
  T,
  State extends Exclude<T, void | null>,
  Source extends Unit<State | void>
>(options: {
  source: Source;
  if: State | ((payload: State) => boolean) | Store<boolean>;
  then: Unit<State | void>;
}): Source;

export function condition<
  T,
  State extends Exclude<T, void | null>,
  Source extends Unit<State | void>
>(options: {
  source: Source;
  if: State | ((payload: State) => boolean) | Store<boolean>;
  else: Unit<State | void>;
}): Source;

export function condition<
  T,
  State extends Exclude<T, void | null>,
  Source extends Unit<State | void>
>(options: {
  source: Source;
  if: State | ((payload: State) => boolean) | Store<boolean>;
  then: Unit<State | void>;
  else: Unit<State | void>;
}): Source;

// Without `source`

export function condition<T, State extends Exclude<T, void | null>>(options: {
  if: State | ((payload: State) => boolean) | Store<boolean>;
  then: Unit<State | void>;
}): Event<State>;

export function condition<T, State extends Exclude<T, void | null>>(options: {
  if: State | ((payload: State) => boolean) | Store<boolean>;
  else: Unit<State | void>;
}): Event<State>;

export function condition<T, State extends Exclude<T, void | null>>(options: {
  if: State | ((payload: State) => boolean) | Store<boolean>;
  then: Unit<State | void>;
  else: Unit<State | void>;
}): Event<State>;
