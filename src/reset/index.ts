import { Unit, Store } from 'effector';

export function reset({
  clock,
  target,
}: {
  clock: Unit<any> | Array<Unit<any>>;
  target: Store<any> | Array<Store<any>>;
}): void {
  const targets = Array.isArray(target) ? target : [target];
  const clocks = Array.isArray(clock) ? clock : [clock];
  targets.forEach((target) => {
    target.reset(clocks);
  });
}
