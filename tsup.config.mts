import { defineConfig } from 'tsup'

// https://www.jsdocs.io/package/tsup
export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['src/index.ts'],
  dts: true,
  shims: true,
  minify: false,
  target: ['deno2', 'node16', 'es2015'],
  skipNodeModulesBundle: true,
  clean: true,
  sourcemap: true,
  platform: 'neutral'
})
