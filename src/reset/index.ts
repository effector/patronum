import { createEvent } from 'effector';

import type { EventCallable, Unit, Store, StoreWritable } from 'effector';

type Params = {
  clock?: Unit<any> | Array<Unit<any>>;
  target: StoreWritable<any> | Array<StoreWritable<any>>;
};

export function reset(config: Required<Params>): void;
export function reset(config: Pick<Params, 'target'>): EventCallable<void>;

export function reset({ clock, target }: Params) {
  const targets = Array.isArray(target) ? target : [target];
  const clocks = Array.isArray(clock) ? clock : [clock ?? createEvent()];
  targets.forEach((target) => {
    target.reset(clocks);
  });

  return clock === undefined ? clocks[0] : undefined;
}
