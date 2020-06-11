## Split (with config)

Redirects data from `source` to one of the `cases` by using a `key` value (boolean or string)

It can also be used as normal split (with 2 arguments). See: https://effector.now.sh/docs/api/effector/split

#### Usage

`split` with config is like `guard` but with many cases, not just `true` case. A `key` in `split` can return a string value to switch between targets (`cases`). You can use `split` instead of `guard` when you need more cases (or branches) and you don't want to duplicate guards. For example, when you have one `source` of data, and you need to trigger different `cases` (targets) based on that data. You can also use `split` if you need a `true` and `false` case in `guard`, a fallback (default case `__`), a function (`fn`) transforming the data before sending to the target, or you just want to use falsy value in filter (not truthy as by default). You can also use `split` instead of `split` if you already have targets defined.

#### Explanation

When the `source` data is received, the `key` value is used to determine one of the `cases` for triggering the target. You can use a key of source data, a function or a separate store to get the `key` value from. You can omit the `key` to use source data itself for determining a case. The `key` value is used to match one of the keys in the `cases` object to determine a target. The data can be processed with the `fn` function (before sending to the target). You can use `__` (two underscores) case to specify a target that will be triggered when the `key` value doesn't match any of the `cases` (a default case / fallback)

#### Arguments

`source` - a source of data (any unit)
*string* `key` - a key of source data to get the target key value
*function* `key` - a function to get a key value (from source data)
*store* `key` - a store which state will be used as a key value (not source data)
*object* `key` - an object with predicates to determine a key value (the first one returning `true` is used as in split)
`fn` - a function that receives the source data and returns processed data that will be sent to the target
`cases` - an object with targets (only one target which name equals to the key value will be triggered)

### Returns

Split call returns `undefined` (void)

## Examples

Use `position` field from source object as a key value:

```js
const $move = createStore({ position: "left" });
const moveLeft = createEvent();
const moveRight = createEvent();

split({
  source: $move,
  key: "position",
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

split({
  source: $move,
  key: "position",
  fn: (state) => state.position.length,
  cases: {
    left: moveLeft, // triggered with 4
    right: moveRight, // triggered with 5
  }
})
```

---

Use a value from the `key` function as a case for triggering the target:

```js
const $move = createStore({ position: "left" });
const moveLeft = createEvent();
const moveRight = createEvent();

split({
  source: $move,
  key: (state) => state.position === 'left',
  cases: {
    true: moveLeft,
    false: moveRight,
  }
})
```

---

Use a *store* as a `key` to determine a case:

```js
const $move = createStore({ distance: 0 });
const $direction = createStore('left')

const moveLeft = createEvent();
const moveRight = createEvent();

split({
  source: $move,
  key: $direction,
  cases: {
    left: moveLeft,
    right: moveRight,
  }
})
```

---

Skip the `key` to use the source data as a key value:

```js
const $move = createStore("left");
const moveLeft = createEvent();
const moveRight = createEvent();

split({
  source: $move,
  cases: {
    left: moveLeft,
    right: moveRight,
  }
})
```

---

There can be a default case (`__`), if the key value doesn't match any named case in the target object:

```js
split({
  source: $account,
  key: 'kind',
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
split({
  source: uploadFx.done,
  key: gate.status,
  cases: {
    false: showNotification,
  }
})
```

---

You can use an object with predicates in `key` to select the case (the first returning true will be used):

```js
const updateData = createEvent();
const $data = restore(updateData, { value: 0 });
const greater = createEvent();
const less = createEvent();
const equal = createEvent();

split({
  source: $data,
  key: {
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

And here is an example of switching the store value with `split` by triggering `nextPage`:

```js
split({
  source: sample(page, nextPage),
  cases: createApi(page, {
    '/intro': () => '/article',
    '/article': () => '/pricing',
    '/pricing': () => '/signup',
  })
})
```
