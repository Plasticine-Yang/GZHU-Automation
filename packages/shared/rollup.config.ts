import { defineConfig } from 'rollup'

import typescript from '@rollup/plugin-typescript'

import { fileURLToPath } from 'url'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: fileURLToPath(new URL('dist/shared.cjs', import.meta.url)),
    format: 'cjs',
  },
  plugins: [typescript()],
})
