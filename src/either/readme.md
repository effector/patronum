# either

```ts
import { either } from 'patronum/either';
```

## Select just one argument

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
