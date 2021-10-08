import { Store } from 'effector';

export function reshape<Type, Shape extends Record<string, unknown>>({
  source,
  shape,
}: {
  source: Store<Type>;
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

  for (const key in shape) {
    if (key in shape) {
      const fn = shape[key];
      result[key] = source.map((state) => {
        const result = fn(state);
        return result === undefined ? null : result;
      });
    }
  }

  return result as any;
}
