---
title: xor
slug: xor
description: Logical XOR for multiple stores
group: predicate
---

```ts
import { xor } from "patronum";
// or
import { xor } from "patronum/xor";
```

:::note[since]

patronum 2.4.0

:::

### Motivation

Combines multiple stores, returning `true` if exactly one of them is truthy.

### Formulae

```ts
$result = xor($first, $second);
```

- `$result` will be `true`, if exactly one of the stores is truthy
- `$result` will be `false`, if all stores are falsy or more than one store is
  truthy

### Arguments

The method receives any amount of arguments.

- `stores: Array<Store<any>>` — Any number of stores to check through XOR

### Returns

- `$result: Store<boolean>` — The store contains `true` if exactly one of the
  passed stores is truthy, otherwise `false`

### Example

#### Basic usage

```ts
import { createStore } from "effector";
import { xor } from "patronum/xor";

const $isOnline = createStore(true);
const $isProcessing = createStore(false);

const $isDisabled = xor($isOnline, $isProcessing);
console.assert(true === $isDisabled.getState());
// $isDisabled === true, because $isOnline === true and $isProcessing === false

const $hasError = createStore(true);
const $result = xor($isOnline, $isProcessing, $hasError);
console.assert(false === $result.getState());
// $result === false, because multiple stores are truthy ($isOnline and $hasError)
```

[Try it](https://share.effector.dev)
