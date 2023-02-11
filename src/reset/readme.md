# reset

:::note since
patronum 1.7.0
:::

```ts
import { reset } from 'patronum';
// or
import { reset } from 'patronum/reset';
```

````

### Motivation

The method allow to reset many stores by a single line

### Formulae

```ts
reset({ clock, target });

or

const resetEvent = reset({ target });
````

- When `clock` or `resetEvent` is triggered, reset store/stores in `target` to the initial value.

:::note since
The `clock` argument became optional since patronum 1.15.0
:::

### Arguments

1. `clock: Unit<any> | Array<Unit<any>>` _optional_ — Any kind of units is accepted (Store, Event, Effect).
2. `target: Store<any> | Array<Store<any>>` — Each of these stores will be reset to the initial values when `clock` is happened.

### Returns

- `resetEvent` `(Event<void>)` _optional_ — New event that reset store/stores in `target` **if** `clock` was not passed.

### Example

```ts
import { createEvent, createStore } from 'effector';
import { reset } from 'patronum/reset';

const pageUnmounted = createEvent();
const userSessionFinished = createEvent();

const $post = createStore(null);
const $comments = createStore([]);
const $draftComment = createStore('');

reset({
  clock: [pageUnmounted, userSessionFinished],
  target: [$post, $comments, $draftComment],
});
```

```ts
import { createStore } from 'effector';
import { reset } from 'patronum/reset';

const $post = createStore(null);
const $comments = createStore([]);
const $draftComment = createStore('');

const resetEvent = reset({ target: [$post, $comments, $draftComment] });
```

[Try it](https://share.effector.dev/06hpVftG)

### Alternative

First variant is writing each reset by yourself:

```ts
$post.reset([pageUnmounted, userSessionFinished]);
$comments.reset([pageUnmounted, userSessionFinished]);
$draftComment.reset([pageUnmounted, userSessionFinished]);
```

There has another way — use domain:

```ts
import { createDomain, createStore } from 'effector';
const resetOnSomeCases = createDomain();

const $post = resetOnSomeCases.createStore(null);
const $comments = resetOnSomeCases.createStore([]);
const $draftComment = resetOnSomeCases.createStore('');

resetOnSomeCases.onCreateStore((store) => {
  store.reset([pageUnmounted, userSessionFinished]);
});
```
