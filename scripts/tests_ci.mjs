import 'zx/globals';

try {
  await $`pnpm test:code`;
} catch (e) {
  $`exit ${e.code}`;
}

setTimeout(() => {
  console.log('Exit by timeout, because tests are hanging');
  $`exit`;
}, 5_000);
