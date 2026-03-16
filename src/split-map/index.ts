import { Event, Tuple, Unit, UnitTargetable, is, sample } from 'effector';

type TargetUnits<T> =
  | UnitTargetable<T | void>
  | Tuple<UnitTargetable<T | void>>
  | ReadonlyArray<UnitTargetable<T | void>>;

const hasPropBase = {}.hasOwnProperty;
const hasOwnProp = <O extends { [k: string]: unknown }>(object: O, key: string) =>
  hasPropBase.call(object, key);

/**
 * Split `source` unit into multiple events based on the provided `cases`.
 *
 * @param source - Source unit, data from this unit is passed to each function in cases object and `__` event in shape as is
 * @param cases - Object of functions. Function receives one argument is a payload from `source`, should return any value or `undefined`.
 * If `undefined` is returned from the case function, update will be skipped (the event will not be triggered).
 *
 * @param targets (optional) - Object of units to trigger on corresponding event from cases object
 * @returns Object of events, with the same structure as `cases`, but with the default event `__`, that will be triggered when each other function returns `undefined`
 *
 * @example
 * ```ts
 * const dataFetched = createEvent<unknown>()
 *
 * const dataReceived = splitMap({
 *  source: dataFetched,
 *  cases: {
 *    isString: (payload) => {
 *      if (typeof payload === 'string') return payload
 *    },
 *    isNumber: (payload) => {
 *      if (typeof payload === 'number') return payload
 *    },
 *  }
 * })

 * dataReceived.isString // Event<string>
 * dataReceived.isNumber // Event<number>
 * dataReceived.__ // Event<unknown>
 * ```
 *
 * @example
 * ```ts
 * const dataFetched = createEvent<unknown>()
 * const stringReceived = createEvent<string>()
 * const numberReceived = createEvent<number>()
 * const unknownReceived = createEvent<unknown>()
 * const notifyError = createEvent()
 *
 * const dataReceived = splitMap({
 *  source: dataFetched,
 *  cases: {
 *    isString: (payload) => {
 *      if (typeof payload === 'string') return payload
 *    },
 *    isNumber: (payload) => {
 *      if (typeof payload === 'number') return payload
 *    },
 *  },
 *  targets: {
 *    isString: stringReceived,
 *    isNumber: numberReceived,
 *    __: [unknownReceived, notifyError],
 *  },
 * })
 *
 * dataFetched('string')
 * // => stringReceived('string')
 *
 * dataFetched(42)
 * // => numberReceived(42)
 *
 * dataFetched(null)
 * // => unknownReceived(null)
 * // => notifyError()
 * ```
 */

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

  if (targets && hasOwnProp(targets, '__')) {
    const defaultCaseTarget = targets.__;

    sample({
      clock: current,
      target: defaultCaseTarget as UnitTargetable<any>,
    });
  }

  return result as any;
}
