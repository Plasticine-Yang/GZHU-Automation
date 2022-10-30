import { defineConfig } from 'rollup'

import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import { fileURLToPath } from 'url'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: fileURLToPath(
      new URL('dist/gzhu-health-clock-in.cjs', import.meta.url),
    ),
    format: 'cjs',
  },
  plugins: [typescript(), nodeResolve(), commonjs()],
  external: ['puppeteer'],
})
