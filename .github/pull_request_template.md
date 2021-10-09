### Description

<!-- Why we should add this method? -->

### Checklist for a new method

- [ ] Create a directory for the new method in the `src` directory in `param-case`
- [ ] Place the source code to `src/method-name/index.ts` in ESModules export in `camelCase` **named** export
- [ ] Add tests to `src/method-name/method-name.test.ts`
- [ ] Add **fork** tests to `src/method-name/method-name.fork.test.ts`
- [ ] Add **type** tests to `test-typings/method-name.ts`
  - Use `// @ts-expect-error` to mark expected type error
  - `import { expectType } from 'tsd'` to check expected return type
- [ ] Add documentation in `src/method-name/reade.md`
  - Add header `Patronum/MethodName`
  - Add section with overloads, if have
  - Add `Motivation`, `Formulae`, `Arguments` and `Return` sections for each overload
  - Add useful examples in `Example` section for each overload
- [ ] Add section to `README.md` in the repository root
  - Add method to the table of contents into correct category `- [MethodName](#methodname) - description.`
  - Add section `## MethodName`
  - Add `[Method documentation & API](/src/method-name)` into section
  - Add simple example
