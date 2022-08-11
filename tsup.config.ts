import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    clean: true,
    format: ['cjs'],
    dts: true,
    minify: true,
    outDir: 'lib',
    sourcemap: true,
  },
  {
    entry: ['src/index.ts'],
    clean: true,
    format: ['esm'],
    dts: true,
    minify: true,
    outDir: 'es',
    sourcemap: true,
  },
  {
    entry: [
      'src/plugins/babel',
      'src/plugins/ice',
      'src/plugins/vite',
      'src/plugins/webpack',
    ],
    clean: true,
    format: ['cjs'],
    dts: true,
    minify: true,
    outDir: 'plugins',
    sourcemap: true,
  },
]);
