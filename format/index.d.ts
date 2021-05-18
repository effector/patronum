import { Store } from 'effector';

export function format<T extends Array<Store<any>>>(
  string: TemplateStringsArray,
  ...stores: T
): Store<string>;
