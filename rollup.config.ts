import { defineConfig } from 'rollup'

import typescript from '@rollup/plugin-typescript'

import { fileURLToPath } from 'url'

export default defineConfig({
  input: 'src/main.ts',
  output: {
    file: fileURLToPath(
      new URL('dist/gzhu-health-clock-in.js', import.meta.url),
    ),
    format: 'cjs',
  },
  plugins: [typescript()],
})
