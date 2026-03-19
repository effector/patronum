import {
  createEvent,
  Effect,
  Event,
  sample,
  is,
  Store,
  UnitTargetable,
  split,
  UnitValue,
  EventCallable,
  EventCallableAsReturnType,
} from 'effector';

type NoInfer<T> = [T][T extends any ? 0 : never];
type NonFalsy<T> = T extends null | undefined | false | 0 | 0n | '' ? never : T;

type SourceUnit<T> = Store<T> | Event<T> | Effect<T, any, any>;

type Targetable<T> = UnitTargetable<T> | ReadonlyArray<UnitTargetable<T>>;

// -- Without `source`, with type guard --
export function condition<Payload, Then extends Payload = Payload>(options: {
  source?: undefined;
  if: ((payload: Payload) => payload is Then) | Then;
  then?: Targetable<NoInfer<Then> | void>;
  else?: Targetable<Exclude<NoInfer<Payload>, Then> | void>;
}): EventCallableAsReturnType<Payload>;

// -- Without `source`, with BooleanConstructor --
export function condition<
  Payload,
  Then extends NonFalsy<Payload> = NonFalsy<Payload>,
>(options: {
  source?: undefined;
  if: BooleanConstructor;
  then?: Targetable<NoInfer<Then> | void>;
  else?: Targetable<Exclude<NoInfer<Payload>, Then> | void>;
}): EventCallableAsReturnType<Payload>;

// -- Without `source` --
export function condition<Payload>(options: {
  source?: undefined;
  if: ((payload: Payload) => boolean) | Store<boolean> | NoInfer<Payload>;
  then?: Targetable<NoInfer<Payload> | void>;
  else?: Targetable<NoInfer<Payload> | void>;
}): EventCallableAsReturnType<Payload>;

// -- With `source` and type guard --
export function condition<
  Payload extends UnitValue<Source>,
  Then extends Payload = Payload,
  Source extends SourceUnit<any> = SourceUnit<Payload>,
>(options: {
  source: Source;
  if: ((payload: Payload) => payload is Then) | Then;
  then?: Targetable<NoInfer<Then>>;
  else?: Targetable<Exclude<NoInfer<Payload>, Then>>;
}): Source;

// -- With `source` and BooleanConstructor --
export function condition<
  Payload extends UnitValue<Source>,
  Then extends NonFalsy<Payload> = NonFalsy<Payload>,
  Source extends SourceUnit<any> = SourceUnit<Payload>,
>(options: {
  source: Source;
  if: BooleanConstructor;
  then?: Targetable<NoInfer<Then> | void>;
  else?: Targetable<Exclude<NoInfer<Payload>, Then>>;
}): EventCallable<Payload>;

// -- With `source` --
export function condition<
  Payload extends UnitValue<Source>,
  Source extends SourceUnit<any> = SourceUnit<Payload>,
>(options: {
  source: SourceUnit<Payload>;
  if: ((payload: Payload) => boolean) | Store<boolean> | NoInfer<Payload>;
  then?: Targetable<NoInfer<Payload> | void>;
  else?: Targetable<NoInfer<Payload> | void>;
}): Source;

export function condition<Payload>({
  source = createEvent<Payload>(),
  if: test,
  then: thenBranch,
  else: elseBranch,
}: {
  source?: SourceUnit<Payload>;
  if: ((payload: Payload) => boolean) | Store<boolean> | Payload;
  then?: Targetable<Payload | void>;
  else?: Targetable<Payload | void>;
}) {
  if (!thenBranch && !elseBranch) {
    throw new Error('condition: at least one of then/else is required');
  }

  const checker =
    is.unit(test) || isFunction(test) ? test : (value: Payload) => value === test;

  if (thenBranch && elseBranch) {
    split({
      source,
      match: {
        then: checker,
        else: inverse(checker as any),
      },
      cases: {
        then: thenBranch,
        else: elseBranch,
      },
      // split overloads don't accept checker/inverse union types
    } as any);
  } else if (thenBranch) {
    // @ts-expect-error - checker/target unions don't match sample overloads
    sample({
      source,
      filter: checker,
      target: thenBranch,
    });
  } else {
    // elseBranch is defined: we threw above if both were missing
    // @ts-expect-error - checker/target unions don't match sample overloads
    sample({
      source,
      filter: inverse(checker as any),
      target: elseBranch!,
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
