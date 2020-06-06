# Patronum/CombineEvents

```ts
import { combineEvents } from 'patronum/combine-events';
```

## `combineEvents(object)`

### Formulae

```ts
const target = combineEvents({
  key1: event1,
  key2: event2,
});
```

- When all events (`event1` and `event2` from example) is triggered, trigger `target` with data from events mapped to `key1` and `key2`

### Example

```ts
const first = createEvent<number>();
const second = createEvent<string>();
const third = createEvent<boolean>();

const target = combineEvents({
  a: first,
  second,
  another: third,
});

target.watch((object) => {
  console.log('first event data', object.a);
  console.log('second event data', object.second);
  console.log('third event data', object.another);
});

first(15); // nothing
second('wow'); // nothing
third(false); // target triggered with object
```

## `combineEvents(array)`

### Formulae

```ts
const target = combineEvents([event1, event2]);
```

- When all events (`event1` and `event2` from example) is triggered, trigger `target` with array from events with the same order as events

### Example

```ts
const first = createEvent<number>();
const second = createEvent<string>();
const third = createEvent<boolean>();

const target = combineEvents([first, second, third]);

target.watch((list) => {
  console.log('first event data', list[0]);
  console.log('second event data', list[1]);
  console.log('third event data', list[2]);
});

first(15); // nothing
second('wow'); // nothing
third(false); // target triggered with array
```
