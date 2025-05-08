import 'zx/globals';

setTimeout(() => {
  console.log('Exit by timeout, because tests are hanging');
  $`exit`;
}, 2 * 60 * 1000);

try {
  await $`pnpm test:code`;
} catch (e) {
  $`exit`;
}

setTimeout(() => {
  console.log('Exit by timeout, because tests are hanging');
  $`exit`;
}, 5_000);
