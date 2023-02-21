import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';
import copy from 'rollup-plugin-copy';

const bundle = (config) => ({
  external: (id) => {
    return !/^[./]/.test(id);
  },
  ...config,
});

const swcPlugin = swc(
  defineRollupSwcOption({
    jsc: { target: 'es2021' },
  }),
);

export default [
  bundle({
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
    plugins: [
      swcPlugin,
      copy({ targets: [{ src: 'src/index.d.ts', dest: 'dist' }] }),
    ],
  }),
];
