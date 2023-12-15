---
id: methods
---

# Methods

All methods split into categories.

### Predicate

- [and](./and/readme.md) — Checks all stores by truthy value.
- [condition](./condition/readme.md) — Trigger then or else by condition.
- [either](./either/readme.md) — Selects just one value based on condition.
- [empty](./empty/readme.md) — Checks the store for `null`.
- [equals](./equals/readme.md) — Checks the store for some value.
- [every](./every/readme.md) — Checks that state in each store passes the predicate test.
- [not](./not/readme.md) — Inverts store boolean-value.
- [or](./or/readme.md) — Checks at least one store for truthy value.
- [once](./once/readme.md) — Runs only once.
- [reset](./reset/readme.md) — Reset all passed stores by clock.
- [some](./some/readme.md) — Checks that state in at least one store passes the predicate test.

### Effect

- [inFlight](./in-flight/readme.md) — Counts all pending effects
- [pending](./pending/readme.md) — Checks that has effects in pending state.
- [status](./status/readme.md) — Return text representation of effect state.

### Timeouts

- [debounce](./debounce/readme.md) — Creates event which waits until time passes after previous trigger.
- [delay](./delay/readme.md) — Delays the call of the event by defined timeout.
- [interval](./interval/readme.md) — Creates a dynamic interval with any timeout.
- [throttle](./throttle/readme.md) — Creates event which triggers at most once per timeout.
- [time](./time/readme.md) — Allows reading current timestamp by triggering clock.

### Combination/Decomposition

- [combineEvents](./combine-events/readme.md) — Wait for all passed events is triggered.
- [format](./format/readme.md) — Combine stores to a string literal.
- [reshape](./reshape/readme.md) — Destructure one store to different stores
- [snapshot](./snapshot/readme.md) — Create store value snapshot.
- [splitMap](./split-map/readme.md) — Split event to different events and map data.
- [spread](./spread/readme.md) — Send fields from object to same targets.
- [previous](./previous/readme.md) - Get previous value of store.

### Debug

- [debug](./debug/readme.md) — Log triggers of passed units.
