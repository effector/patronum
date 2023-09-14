import { createStore, type Event, is, sample, type Store } from 'effector';

export function reshape<Type, Shape extends Record<string, unknown>>({
  source,
  shape,
}: {
  source: Store<Type> | Event<Type>;
  shape: {
    [ShapeKey in keyof Shape]: (value: Type) => Shape[ShapeKey];
  };
}): {
  [ResultKey in keyof Shape]: Store<
    undefined extends Shape[ResultKey]
      ? Exclude<Shape[ResultKey], void> | null
      : Shape[ResultKey]
  >;
} {
  const result: Record<string, Store<any>> = {};

  const mapUnit = (fn: (value: Type) => any) => (state: Type | null) => {
    const result = state && fn(state);
    return result === undefined ? null : result;
  };

  for (const key in shape) {
    if (Object.hasOwnProperty.call(shape, key)) {
      const fn = shape[key];

      if (is.store(source)) {
        result[key] = source.map(mapUnit(fn));
      } else if (is.event(source)) {
        const tempStore = createStore<Type | null>(null);
        sample({ source: source, filter: Boolean, target: tempStore });

        result[key] = tempStore.map(mapUnit(fn));
      }
    }
  }

  return result as any;
}
