import { defineConfig, configDefaults } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    exclude: [
      ...configDefaults.exclude,
      '**/examples/**/*',
      '**/examples/*.ts'
    ],
    coverage: {
      exclude: [
        ...(configDefaults.coverage?.exclude ?? []),
        '**/examples/**/*',
        '**/node_modules/**',
        '**/.*/**'
      ]
    },
    typecheck: {
      tsconfig: 'tsconfig.json'
    }
  },
  plugins: [tsconfigPaths()]
})
