import {
  combine,
  createStore,
  sample,
  Store,
  Unit
} from 'effector'
import { $timers } from '../timers'

export function now({ clock }: { clock?: Unit<any> } = {}): Store<number> {
  if (clock) {
    const $counter = createStore(0);

    sample({
      clock,
      source: $counter,
      fn: (count) => count + 1,
      target: $counter,
    });

    return combine({ timers: $timers, $counter }, ({ timers }) => timers.now());
  }

  return $timers.map((timers) => timers.now());
}
