const path = require('path');
const { rollup } = require('rollup');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const plugins = [
  nodeResolve({ extensions: ['.js'] }),
  commonjs({ extensions: ['.js'] }),
  terser({}),
];

async function main() {
  const build = await rollup({
    input: path.resolve(__dirname, '..', 'index.js'),
    external: ['effector'],
    plugins,
  });

  await build.write({
    file: path.resolve(__dirname, '..', 'patronum.cjs.js'),
    format: 'cjs',
    freeze: false,
    exports: 'named',
    sourcemap: true,
    externalLiveBindings: false,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
