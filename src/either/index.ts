/* eslint-disable @typescript-eslint/no-unused-vars */
import { combine, is, Store } from 'effector';

interface EitherConfig<Then, Other> {
  filter: Store<boolean>;
  then: Then | Store<Then>;
  other: Other | Store<Other>;
}

export function either<Then, Other>(
  filter: Store<boolean>,
  then: Then | Store<Then>,
  other: Other | Store<Other>,
): Store<Then | Other>;

export function either<Then, Other>(
  config: EitherConfig<Then, Other>,
): Store<Then | Other>;

export function either<Then, Other>(
  filterOptions: Store<boolean> | EitherConfig<Then, Other>,
  then?: Then | Store<Then>,
  other?: Other | Store<Other>,
): Store<Then | Other> {
  if (is.store(filterOptions)) {
    return combine(
      filterOptions,
      then as Store<Then>,
      other as Store<Other>,
      (filter, then, other) => (filter ? then : other),
    );
  }
  return either(filterOptions as EitherConfig<Then, Other>);
}
