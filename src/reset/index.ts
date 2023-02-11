import { createEvent } from 'effector';

import type { Event, Unit, Store } from 'effector';

type Params = {
  clock?: Unit<any> | Array<Unit<any>>;
  target: Store<any> | Array<Store<any>>;
};

export function reset(_: Required<Params>): void;
export function reset(_: Pick<Params, 'target'>): Event<void>;

export function reset({ clock, target }: Params) {
  const targets = Array.isArray(target) ? target : [target];
  const clocks = Array.isArray(clock) ? clock : [clock ?? createEvent()];
  targets.forEach((target) => {
    target.reset(clocks);
  });

  return clock === undefined ? clocks[0] : undefined;
}
