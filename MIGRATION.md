# Migration guide from `v0.14+`

```shell
npm install patronum@next
```

```shell
yarn add patronum@next
```

<details>
<summary><strong><code>throttle</code></strong></summary>

```ts
import { throttle } from 'patronum/throttle';
```

### Previous version `v0.14.x`

```ts
const throttled = throttle(source, timeout);
```

### Current version `v0.102.x`

```ts
const throttled = throttle({ source, timeout });

// Also you can set target
const throttled = createEvent(); // or any unit
throttle({ source, timeout, target: throttled });
```

- Wrap `source` and `timeout` arguments to object
- Optionally add `target` parameter

https://github.com/sergeysova/patronum/pull/31

</details>

<details>
<summary><strong><code>debounce</code></strong></summary>

```ts
import { debounce } from 'patronum/debounce';
```

### Previous version `v0.14.x`

```ts
const debounced = debounce(source, timeout);
```

### Current version `v0.102.x`

```ts
const debounced = debounce({ source, timeout });

// Also you can set target
const debounced = createEvent(); // or any unit
debounce({ source, timeout, target: debounced });
```

- Wrap `source` and `timeout` arguments to object
- Optionally add `target` parameter

https://github.com/sergeysova/patronum/pull/38

</details>

<details>
<summary><strong><code>splitMap</code></strong></summary>

```ts
import { splitMap } from 'patronum/split-map';
```

### Previous version `v0.14.x`

```ts
const received = splitMap(nameReceived, {
  firstName: (string) => string.split(' ')[0], // string | undefined
  lastName: (string) => string.split(' ')[1], // string | undefined
});
```

### Current version `v0.102.x`

```ts
const received = splitMap({
  source: nameReceived,
  cases: {
    firstName: (string) => string.split(' ')[0], // string | undefined
    lastName: (string) => string.split(' ')[1], // string | undefined
  });
```

- First argument should be `source`
- Second argument should be `cases`

https://github.com/sergeysova/patronum/pull/41

</details>

<details>
<summary><strong><code>some</code></strong></summary>

```ts
import { some } from 'patronum/some';
```

### Previous version `v0.14.x`

```ts
const $tooBig = some((size) => size > 800, [$width, $height]);
```

### Current version `v0.102.x`

```ts
const $tooBig = some({
  predicate: (size) => size > 800,
  stores: [$width, $height],
});
```

- First argument should be `predicate`
- Second argument should be `stores`

https://github.com/sergeysova/patronum/pull/43

</details>

<details>
<summary><strong><code>every</code></strong></summary>

```ts
import { every } from 'patronum/every';
```

### Previous version `v0.14.x`

```ts
const $result = every(true, [$a, $b, $c]);
const $result = every(() => true, [$a, $b, $c]);
```

### Current version `v0.102.x`

```ts
const $result = every({ predicate: true, stores: [$a, $b, $c] });
const $result = every({ predicate: () => true, stores: [$a, $b, $c] });
```

- First argument should be `predicate`
- Second argument should be `stores`

https://github.com/sergeysova/patronum/pull/50

</details>

<details>
<summary><strong><code>delay</code></strong></summary>

```ts
import { delay } from 'patronum/delay';
```

### Previous version `v0.14.x`

```ts
const delayed = delay(unit, 100);
const logDelayed = delay(unit, { time: (payload) => 100 });
```

### Current version `v0.102.x`

```ts
const delayed = delay({
  source: unit,
  timeout: 100,
});

const delayed = delay({
  source: unit,
  timeout: (payload) => 100,
});

const delayed = delay({
  source: unit,
  timeout: $timeout,
});
```

- First argument should be `source`
- Second argument should be `timeout`
- `time` property from second argument should be `timeout`
- `timeout` can be `Store<number>`

https://github.com/sergeysova/patronum/pull/51

</details>

<details>
<summary><strong><code>status</code></strong></summary>

```ts
import { status } from 'patronum/status';
```

### Previous version `v0.14.x`

```ts
const $status = status(effect, 'initial');
```

### Current version `v0.102.x`

```ts
const $status = status({ effect, defaultValue: 'initial' });
```

- First argument should be `effect` in object
- Second argument should be `defaultValue` and can be optional

https://github.com/sergeysova/patronum/pull/55

</details>

<details>
<summary><strong><code>reshape</code></strong></summary>

```ts
import { reshape } from 'patronum/reshape';
```

### Previous version `v0.14.x`

```ts
const parts = reshape($original, {
  length: (string) => string.length,
  first: (string) => string.split(' ')[0] || '',
  second: (string) => string.split(' ')[1] || '',
});
```

### Current version `v0.102.x`

```ts
const parts = reshape({
  source: $original,
  shape: {
    length: (string) => string.length,
    first: (string) => string.split(' ')[0] || '',
    second: (string) => string.split(' ')[1] || '',
  },
});
```

- First argument should be `source`
- Second argument should be `shape`

https://github.com/sergeysova/patronum/pull/57

</details>

<details>
<summary><strong><code>combineEvents</code></strong></summary>

```ts
import { combineEvents } from 'patronum/combine-events';
```

### Previous version `v0.14.x`

```ts
const target = combineEvents([first, second, third]);
const target = combineEvents({
  key1: event1,
  key2: event2,
});
```

### Current version `v0.102.x`

```ts
const target = combineEvents({ events: [first, second, third] });
const target = combineEvents({
  events: {
    key1: event1,
    key2: event2,
  },
});
```

- Assign first argument to property `events` in object

https://github.com/sergeysova/patronum/pull/58

</details>

<details>
<summary><strong><code>spread</code></strong></summary>

```ts
import { spread } from 'patronum/spread';
```

### Previous version `v0.14.x`

```ts
spread(formReceived, {
  first: $first,
  last: $last,
});

const source = spread({
  first: $first,
  last: $last,
});
```

### Current version `v0.102.x`

```ts
spread({
  source: formReceived,
  targets: {
    first: $first,
    last: $last,
  },
});

const source = spread({
  targets: {
    first: $first,
    last: $last,
  },
});
```

1. If you have two arguments:
  - First argument should be `source` in object
  - Second argument should be `targets`
1. If only one argument:
  - Wrap it to object and assign to `targets`

https://github.com/sergeysova/patronum/pull/61

</details>
