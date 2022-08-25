/* eslint-disable @typescript-eslint/no-unused-vars */
import { combine, is, Store, Unit } from 'effector';

interface EitherConfig<Then, Other> {
  filter: Store<boolean>;
  then: Then | Store<Then>;
  other: Other | Store<Other>;
}

export function either<Then, Other>(
  filter: Store<boolean>,
  then: Then extends Unit<any>
    ? Then extends Store<any>
      ? Then
      : { error: 'only stores or generic values allowed' }
    : Then,
  other: Other extends Unit<any>
    ? Other extends Store<any>
      ? Other
      : { error: 'only stores or generic values allowed' }
    : Other,
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
