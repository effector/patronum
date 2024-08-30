---
title: either
slug: either
description: Selects just one value based on condition.
group: predicate
---

:::note[since]
patronum 1.11.0
:::

```ts
import { either } from 'patronum';
// or
import { either } from 'patronum/either';
```

### Motivation

The method select one or other value based on condition.
You can think about it as a ternary operator `a ? b : c`.

### Formulae

```ts
$result = either($filter, then, other);
```

- `$result` store contains value of `then` if `$filter` store contains `true`
- `$result` store contains value of `other` if `$filter` store contains `false`

### Arguments

1. `$filter: Store<boolean>` — The store contains condition how to select between `then` and `other`
2. `then: Store<Then> | Then` — First value can be a Store, and returned when `$filter` is `true`
3. `other: Store<Other> | Other` — Second value can be a Store too, returned only when `$filter` if `false`

- `Then` — Generic type argument. Required only to distinguish this type from `Other`
- `Other` — Generic type argument used for the alternative value when `$filter` is `false`

### Returns

- `$result: Store<Then | Other>` — Store contains one of the value depends on `$filter` value

### Object form arguments

For some cases it is useful to add names for each argument.

```ts
$result = either({
  filter,
  then,
  other,
});
```

Types, descriptions, and usage the same as for positional arguments.

### Example

```ts
const $showLatest = createStore(false);
const $latestTweets = createStore<Tweet[]>([]);
const $recommendedTweets = createStore<Tweet[]>([]);

export const $tweets = either($showLatest, $latestTweets, $recommendedTweets);
```

[Try it](https://share.effector.dev/NGmPTxSG)

### Select just one argument

Sometimes we want to write an inverted expression, like this imperative code:

```ts
if (!active) {
  return another;
}
return null;
```

We can write exactly `null` as is:

```ts
const $result = either($active, null, $another); // Store<null | Another>
```

We may want to use `not` for condition:

```ts
import { either, not } from 'patronum';

const $result = either(not($active), $another, null);
```

### Alternative

```ts
import { createStore, combine } from 'effector';
const $showLatest = createStore(false);
const $latestTweets = createStore<Tweet[]>([]);
const $recommendedTweets = createStore<Tweet[]>([]);

export const $tweets = combine(
  $showLatest,
  $latestTweets,
  $recommendedTweets,
  (showLatest, latestTweets, recommendedTweets) =>
    showLatest ? latestTweets : recommendedTweets,
);
```
