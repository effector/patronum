import { Event, Tuple, Unit, UnitTargetable, is, sample } from 'effector';

type TargetUnits<T> =
  | UnitTargetable<T | void>
  | Tuple<UnitTargetable<T | void>>
  | ReadonlyArray<UnitTargetable<T | void>>;

const hasPropBase = {}.hasOwnProperty;
const hasOwnProp = <O extends { [k: string]: unknown }>(object: O, key: string) =>
  hasPropBase.call(object, key);

export function splitMap<
  S,
  Cases extends Record<string, (payload: S) => any | undefined>,
  Targets extends {
    [K in keyof Cases]?: Cases[K] extends (s: S) => infer R
      ? Targets[K] extends TargetUnits<infer TargetType>
        ? Exclude<R, undefined> extends TargetType
          ? TargetUnits<TargetType>
          : TargetUnits<Exclude<R, undefined>>
        : TargetUnits<Exclude<R, undefined>>
      : never;
  } & { __?: TargetUnits<S> },
>({
  source,
  cases,
  targets,
}: {
  source: Unit<S>;
  cases: Cases;
  targets?: Targets;
}): {
  [K in keyof Cases]: Cases[K] extends (p: S) => infer R
    ? Event<Exclude<R, undefined>>
    : never;
} & { __: Event<S> } {
  const result: Record<string, Event<any>> = {};

  let current = is.store(source) ? source.updates : (source as Event<S>);

  for (const key in cases) {
    if (hasOwnProp(cases, key)) {
      const fn = cases[key];

      const caseEvent = current.filterMap(fn);

      result[key] = caseEvent;

      current = current.filter({
        fn: (data) => !fn(data),
      });

      if (targets && hasOwnProp(targets, key)) {
        const currentTarget = targets[key];

        sample({
          clock: caseEvent,
          target: currentTarget as UnitTargetable<any>,
        });
      }
    }
  }

  // eslint-disable-next-line no-underscore-dangle
  result.__ = current;

  if (targets && '__' in targets) {
    const defaultCaseTarget = targets.__;

    sample({
      clock: current,
      target: defaultCaseTarget as UnitTargetable<any>,
    });
  }

  return result as any;
}
