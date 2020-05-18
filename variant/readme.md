## Variant

Redirects data from `source` to one of the `cases` by using a `filter` value (boolean or string)

#### Usage

`variant` is like `guard` but with many cases, not just `true` case. A `filter` in `variant` can return a string value to switch between targets (`cases`). Use `variant` instead of `guard` when you need more cases (or branches) and you don't want to duplicate guards. For example, when you have one `source` of data, and you need to trigger different `cases` (targets) based on that data. You can also use `variant` if you need a `true` and `false` case in `guard`, a fallback (default case `__`), a function (`fn`) transforming the data before sending to the target, or you just want to use falsy value in filter (not truthy). You can also use `variant` instead of `split` if you already have targets defined.

#### Explanation

When the `source` data is received, the `filter` value is used to determine one of the `cases` for triggering the target. You can use a key of source data, a function or a separate store to get the filter value from. You can omit the `filter` to use source data itself for determining a case. The `filter` value is used to match one of the keys in the `cases` object to determine a target. The data can be processed with the `fn` function (before sending to the target). You can use `__` (two underscores) case to specify a target that will be triggered when the `filter` value doesn't match any of the `cases` (a default case / fallback)

#### Arguments

`source` - a source of data (any unit)
*string* `filter` - a key to get the filter value (from source data object)
*function* `filter` - a function to get a filter value (from source data)
*store* `filter` - a store which state will be used as a filter value (not source data)
*object* `filter` - an object with predicates to determine a filter value (the first one is used as in split)
`fn` - a function that receives the source data and returns processed data that will be sent to the target
`cases` - an object with targets (only one target which key equals to filter value will be triggered)

### Returns

Variant call returns `undefined` (void)

## Examples

Use `position` field from source object as a filter value:

```js
const $move = createStore({ position: "left" });
const moveLeft = createEvent();
const moveRight = createEvent();

variant({
  source: $move,
  filter: "position",
  cases: {
    left: moveLeft,
    right: moveRight,
  }
})
```

When the position of the updated store will be `left`, event `moveLeft` will be triggered. If `right` — `moveRight`.

---

Use an `fn` function to transform data before triggering one of the targets:

```js
const $move = createStore({ position: "left" });
const moveLeft = createEvent();
const moveRight = createEvent();

variant({
  source: $move,
  filter: "position",
  fn: (state) => state.position.length,
  cases: {
    left: moveLeft, // triggered with 4
    right: moveRight, // triggered with 5
  }
})
```

---

Use a value from the `filter` function as a case for triggering the target:

```js
const $move = createStore({ position: "left" });
const moveLeft = createEvent();
const moveRight = createEvent();

variant({
  source: $move,
  filter: (state) => state.position === 'left',
  cases: {
    true: moveLeft,
    false: moveRight,
  }
})
```

---

Use a *store* as a `filter` to determine a case:

```js
const $move = createStore({ distance: 0 });
const $direction = createStore('left')

const moveLeft = createEvent();
const moveRight = createEvent();

variant({
  source: $move,
  filter: $direction,
  cases: {
    left: moveLeft,
    right: moveRight,
  }
})
```

---

Skip the `filter` to use the source data as a filter value:

```js
const $move = createStore("left");
const moveLeft = createEvent();
const moveRight = createEvent();

variant({
  source: $move,
  cases: {
    left: moveLeft,
    right: moveRight,
  }
})
```

---

There can be a default case (`__`), if the filter value doesn't match any named case in the target object:

```js
variant({
  source: $account,
  filter: 'kind',
  cases: {
    admin: adminAccount,
    user: userAccount,
    __: guestAccount,
  },
})
```

---

You can use boolean values as cases:

```js
variant({
  source: uploadFx.done,
  filter: gate.status,
  cases: {
    false: showNotification,
  }
})
```

---

You can use an object with predicates in `filter` to select the case (the first returning true will be used):

```js
const updateData = createEvent();
const $data = restore(updateData, { value: 0 });
const greater = createEvent();
const less = createEvent();
const equal = createEvent();

variant({
  source: $data,
  filter: {
    greater: ({ value }) => value > 5,
    less: ({ value }) => value < 5,
    equal: ({ value }) => value === 5,
  },
  fn: ({ value }) => value,
  cases: {
    greater,
    less,
    equal,
  },
});

updateData({ value: 7 }); // greater is triggered with 7
```

---

And here is an example of switching the store value with `variant` by triggering `nextPage`:

```js
variant({
  source: sample(page, nextPage),
  cases: createApi(page, {
    '/intro': () => '/article',
    '/article': () => '/pricing',
    '/pricing': () => '/signup',
  })
})
```
