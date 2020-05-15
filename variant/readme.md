## Variant

Redirects data from `source` to one of the `cases` using a `key`

#### Explanation

When the `source` data is received the `key` value is used to determine one of the `cases` for triggering the target. You can get the `key` for matching from the source data or from a particular store. You can omit the `key` to use source data itself for determining a case. The data can be processed with the `fn` function (before sending to the target). You can use `__` (two underscores) case to specify a target that will be triggered when the `key` doesn't match any of the `cases` (a default case / fallback)

#### Arguments

`source` - get the source of data from given unit
*string* `key` - get case value by this key from source data
*function* `key` - use a function to get a case value from source data
*store* `key` - use a case value from the store state (not from data)
*object* `key` - use a key of the first function in the object that returns true (as in split)
`fn` - use the source data and return a value that will be sent to the target
`cases` - use an object from which one of the targets will be triggered

### Returns

Variant call returns `undefined` (void)

## Examples

Select a property from a source object by key:

```js
const $move = createStore({ position: "left" });
const moveLeft = createEvent();
const moveRight = createEvent();

variant({
  source: $move,
  key: "position",
  cases: {
    left: moveLeft,
    right: moveRight,
  }
})
```

When the position the store will be `left`, event `moveLeft` will be triggered. If `right` — `moveRight`.

---

Transform value before triggering a target:

```js
const $move = createStore({ position: "left" });
const moveLeft = createEvent();
const moveRight = createEvent();

variant({
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

Get key using function:

```js
const $move = createStore({ position: "left" });
const moveLeft = createEvent();
const moveRight = createEvent();

variant({
  source: $move,
  key: (state) => state.position === 'left',
  cases: {
    true: moveLeft,
    false: moveRight,
  }
})
```

---

Get key from store:

```js
const $move = createStore({ distance: 0 });
const $direction = createStore('left')

const moveLeft = createEvent();
const moveRight = createEvent();

variant({
  source: $move,
  key: $direction,
  cases: {
    left: moveLeft,
    right: moveRight,
  }
})
```

---

Omit the key to use value from a store or event

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

There can be a default case (`__`), if the key is not found in the target object

```js
variant({
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

You can use boolean values for a key

```js
variant({
  source: uploadFx.done,
  key: gate.status,
  cases: {
    true: $uploadResult,
    false: showNotification,
  }
})
```

---

You can use object in key with predicates to select the case (the first returning true will be used)

```js
const updateData = createEvent();
const $data = restore(updateData, { value: 0 });
const greater = createEvent();
const less = createEvent();
const equal = createEvent();

variant({
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

Here is an example of switching store value

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
