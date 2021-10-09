### Description

<!-- Why we should add this method? -->

### Checklist for a new method

- [ ] Create directory for new method in root in `param-case`
- [ ] Place code to `method-name/index.ts` in ESModules export in `camelCase` **named** export
- [ ] Add tests to `method-name/method-name.test.ts`
- [ ] Add **fork** tests to `method-name/method-name.fork.test.ts`
- [ ] Add **type** tests to `test-typings/method-name.ts`
  - Use `// @ts-expect-error` to mark expected type error
  - `import { expectType } from 'tsd'` to check expected return type
- [ ] Add documentation in `method-name/reade.md`
  - Add header `Patronum/MethodName`
  - Add section with overloads, if have
  - Add `Motivation`, `Formulae`, `Arguments` and `Return` sections for each overload
  - Add useful examples in `Example` section for each overload
- [ ] Add section to `README.md` in the repository root
  - Add method to the table of contents into correct category `- [MethodName](#methodname) - description.`
  - Add section `## MethodName`
  - Add `[Method documentation & API](/src/method-name)` into section
  - Add simple example
