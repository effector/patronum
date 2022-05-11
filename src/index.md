---
id: methods
---

# Methods

All methods split into categories.

### Predicate

- [condition](./condition) — Trigger then or else by condition.
- [some](./some) — Checks that state in at least one store passes the predicate test.
- [every](./every) — Checks that state in each store passes the predicate test.
- [reset](./reset) — Reset all passed stores by clock.

### Effect

- [pending](./pending) — Checks that has effects in pending state.
- [inFlight](./in-flight) — Counts all pending effects
- [status](./status) — Return text representation of effect state.

### Timeouts

- [debounce](./debounce) — Creates event which waits until time passes after previous trigger.
- [delay](./delay) — Delays the call of the event by defined timeout.
- [throttle](./throttle) — Creates event which triggers at most once per timeout.
- [interval](./interval) — Creates a dynamic interval with any timeout.
- [time](./time) — Allows reading current timestamp by triggering clock.

### Combination/Decomposition

- [combineEvents](./combine-events) — Wait for all passed events is triggered.
- [reshape](./reshape) — Destructure one store to different stores
- [splitMap](./split-map) — Split event to different events and map data.
- [spread](./spread) — Send fields from object to same targets.
- [snapshot](./snapshot) — Create store value snapshot.
- [format](./format) — Combine stores to a string literal.

### Debug

- [debug](./debug) — Log triggers of passed units.
