import {
  createEvent,
  Effect,
  Event,
  sample,
  is,
  Store,
  Unit,
  UnitTargetable,
  split,
} from 'effector';

type NoInfer<T> = T & { [K in keyof T]: T[K] };
type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function condition<State>(options: {
  source: Event<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: UnitTargetable<NoInfer<State> | void>;
  else: UnitTargetable<NoInfer<State> | void>;
}): EventAsReturnType<State>;
export function condition<State>(options: {
  source: Store<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: UnitTargetable<State | void>;
  else: UnitTargetable<State | void>;
}): Store<State>;
export function condition<Params, Done, Fail>(options: {
  source: Effect<Params, Done, Fail>;
  if: ((payload: Params) => boolean) | Store<boolean> | Params;
  then: UnitTargetable<NoInfer<Params> | void>;
  else: UnitTargetable<NoInfer<Params> | void>;
}): Effect<Params, Done, Fail>;

export function condition<State>(options: {
  source: Event<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: UnitTargetable<NoInfer<State> | void>;
}): EventAsReturnType<State>;
export function condition<State>(options: {
  source: Store<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: UnitTargetable<NoInfer<State> | void>;
}): Store<State>;
export function condition<Params, Done, Fail>(options: {
  source: Effect<Params, Done, Fail>;
  if: ((payload: Params) => boolean) | Store<boolean> | Params;
  then: UnitTargetable<NoInfer<Params> | void>;
}): Effect<Params, Done, Fail>;

export function condition<State>(options: {
  source: Event<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  else: UnitTargetable<NoInfer<State> | void>;
}): EventAsReturnType<State>;
export function condition<State>(options: {
  source: Store<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  else: UnitTargetable<NoInfer<State> | void>;
}): Store<State>;
export function condition<Params, Done, Fail>(options: {
  source: Effect<Params, Done, Fail>;
  if: ((payload: Params) => boolean) | Store<boolean> | Params;
  else: UnitTargetable<NoInfer<Params> | void>;
}): Effect<Params, Done, Fail>;

// Without `source`

export function condition<State>(options: {
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: Unit<NoInfer<State> | void>;
  else: Unit<NoInfer<State> | void>;
}): EventAsReturnType<State>;
export function condition<State>(options: {
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: Unit<NoInfer<State> | void>;
}): Event<State>;
export function condition<State>(options: {
  if: ((payload: State) => boolean) | Store<boolean> | State;
  else: Unit<NoInfer<State> | void>;
}): Event<State>;
export function condition<State>({
  if: test,
  then: thenBranch,
  else: elseBranch,
  source = createEvent<State>(),
}: {
  if: ((payload: State) => boolean) | Store<boolean> | State;
  source?: Store<State> | Event<State> | Effect<State, any, any>;
  then?: Unit<State | void>;
  else?: Unit<State | void>;
}) {
  const checker =
    is.unit(test) || isFunction(test) ? test : (value: State) => value === test;

  if (thenBranch && elseBranch) {
    split({
      source,
      match: {
        then: checker,
        else: inverse(checker),
      },
      cases: {
        then: thenBranch,
        else: elseBranch,
      },
    } as any);
  } else if (thenBranch) {
    sample({
      source,
      filter: checker,
      target: thenBranch as Unit<State>,
    });
  } else if (elseBranch) {
    sample({
      source,
      filter: inverse(checker as any),
      target: elseBranch as Unit<State>,
    });
  }

  return source;
}

function isFunction<T>(value: unknown): value is (payload: T) => boolean {
  return typeof value === 'function';
}

function inverse<A extends boolean, T>(
  fnOrUnit: Store<boolean> | ((payload: T) => boolean),
): Store<boolean> | ((payload: T) => boolean) {
  if (is.unit(fnOrUnit)) {
    return fnOrUnit.map((value) => !value, { skipVoid: false });
  }
  return (value) => !fnOrUnit(value);
}
