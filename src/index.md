---
id: methods
---

# Methods

All methods split into categories.

### Predicate

- [condition](./condition/readme.md) — Trigger then or else by condition.
- [some](./some/readme.md) — Checks that state in at least one store passes the predicate test.
- [every](./every/readme.md) — Checks that state in each store passes the predicate test.
- [reset](./reset/readme.md) — Reset all passed stores by clock.

### Effect

- [pending](./pending/readme.md) — Checks that has effects in pending state.
- [inFlight](./in-flight/readme.md) — Counts all pending effects
- [status](./status/readme.md) — Return text representation of effect state.

### Timeouts

- [debounce](./debounce/readme.md) — Creates event which waits until time passes after previous trigger.
- [delay](./delay/readme.md) — Delays the call of the event by defined timeout.
- [throttle](./throttle/readme.md) — Creates event which triggers at most once per timeout.
- [interval](./interval/readme.md) — Creates a dynamic interval with any timeout.
- [time](./time/readme.md) — Allows reading current timestamp by triggering clock.

### Combination/Decomposition

- [combineEvents](./combine-events/readme.md) — Wait for all passed events is triggered.
- [reshape](./reshape/readme.md) — Destructure one store to different stores
- [splitMap](./split-map/readme.md) — Split event to different events and map data.
- [spread](./spread/readme.md) — Send fields from object to same targets.
- [snapshot](./snapshot/readme.md) — Create store value snapshot.
- [format](./format/readme.md) — Combine stores to a string literal.

### Debug

- [debug](./debug/readme.md) — Log triggers of passed units.

