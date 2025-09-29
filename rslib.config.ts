import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      dts: {
        bundle: false,
      },
      output: {
        distPath: {
          root: './dist',
        },
        filename: {
          js: 'index.mjs',
        },
      },
    },
    {
      format: 'cjs',
      dts: false,
      output: {
        distPath: {
          root: './dist',
        },
        filename: {
          js: 'index.js',
        },
      },
    },
  ],
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  output: {
    target: 'web',
    minify: true,
    sourceMap: {
      js: 'source-map',
    },
  },
  tools: {
    rspack: {
      optimization: {
        usedExports: true,
        sideEffects: false,
        providedExports: true,
        mangleExports: false,
      },
      resolve: {
        extensionAlias: {
          '.js': ['.ts', '.js'],
        },
      },
      externals: {
        swr: 'swr',
      },
    },
  },
});