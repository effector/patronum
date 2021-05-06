# Patronum/Format

```ts
import { createStore } from 'effector'
import { format } from 'patronum'

const firstName$ = createStore("John");
const lastName$ = createStore("Doe");

const fullName$ = format`${firstName$} ${lastName$}`
```
