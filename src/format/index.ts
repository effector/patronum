import { combine, Store, Unit } from 'effector';

type StoreOrValue<T> = T extends Store<infer U>
  ? Store<U>
  : T extends Unit<any>
  ? never
  : T;

export function format(strings: TemplateStringsArray): Store<string>;
export function format<Values extends StoreOrValue<any>[]>(
  strings: TemplateStringsArray,
  ...stores: [...Values]
): Store<string>;
export function format<Values extends StoreOrValue<any>[]>(
  strings: TemplateStringsArray,
  ...stores: [...Values]
): Store<string> {
  return combine(
    stores,
    (stores) =>
      strings.reduce(
        (acc, value, index) =>
          acc.concat(
            isLastElement(strings, index)
              ? value
              : `${value}${toString(stores[index])}`,
          ),
        '',
      ),
    { skipVoid: true },
  );
}

function toString<T extends unknown>(value: T): string {
  if (Array.isArray(value)) {
    return value.map((value) => String(value)).join(', ');
  }
  return String(value);
}

function isLastElement<T>(array: ReadonlyArray<T>, index: number) {
  return index === array.length - 1;
}
