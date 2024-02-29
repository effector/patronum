import { Event, is, Store, Unit } from 'effector';

export function cut<
  S,
  Cases extends Record<string, (payload: S) => any | undefined>,
>({
  source,
  cases,
}: {
  source: Unit<S>;
  cases: Cases;
}): {
  [K in keyof Cases]: Cases[K] extends (p: S) => infer R
    ? Event<Exclude<R, undefined>>
    : never;
} & { __: Event<S> } {
  const result: Record<string, Event<any> | Store<any>> = {};

  const original = is.store(source) ? source.updates : (source as Event<S>);
  let current = original.map((_) => _);

  for (const key in cases) {
    if (key in cases) {
      const fn = cases[key];

      result[key] = original.filterMap(fn);
      current = current.filter({
        fn: (data) => fn(data) === undefined,
      });
    }
  }

  // eslint-disable-next-line no-underscore-dangle
  result.__ = current;

  return result as any;
}
