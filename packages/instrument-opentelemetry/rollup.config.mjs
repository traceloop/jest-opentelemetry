import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';
import typescript from '@rollup/plugin-typescript';

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
    input: ['src/tracing.ts'],
    output: {
      file: 'dist/tracing.js',
      format: 'cjs',
    },
    plugins: [swcPlugin, typescript({ tsconfig: '../../tsconfig.json' })],
  }),
];
