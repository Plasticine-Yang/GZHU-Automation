import type { ModuleFormat } from 'rollup'
import { defineConfig } from 'rollup'

import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

import { resolve } from 'path'

import { createRequire } from 'module'
import { fileURLToPath } from 'url'

export default () => {
  // ================== 包路径解析相关 ==================

  const ROOT_DIR = fileURLToPath(new URL('.', import.meta.url))

  // current building package name
  const PACKAGE_NAME = process.env.PACKAGE_NAME

  if (!PACKAGE_NAME) {
    console.error('env: PACKAGE_NAME not found')
    process.exit(1)
  }

  // all packages directory
  const PACKAGES_DIR = fileURLToPath(new URL('packages', import.meta.url))

  // current building package directory
  const PACKAGE_DIR = resolve(PACKAGES_DIR, PACKAGE_NAME)

  /** @description 以当前构建的包为根目录解析路径 */
  const resolveWithPackage = (path: string) => resolve(PACKAGE_DIR, path)

  const require = createRequire(import.meta.url)
  const pkg = require(resolveWithPackage('package.json'))

  // ================== 构建配置相关 ==================

  type PackageFormat = 'cjs' | 'esm'
  type OutputConfigs = {
    [P in PackageFormat]?: {
      file: string
      format: ModuleFormat
    }
  }
  const packageFormats: PackageFormat[] = ['cjs', 'esm']

  // rollup output configs with format
  const outputConfigs: OutputConfigs = {
    cjs: {
      file: resolveWithPackage(`dist/${PACKAGE_NAME}.cjs.js`),
      format: 'cjs',
    },
    esm: {
      file: resolveWithPackage(`dist/${PACKAGE_NAME}.esm.js`),
      format: 'esm',
    },
  }

  /**
   * @description 根据 format 创建相应的构建配置
   * @param format PackageFormat
   */
  function createConfig(format: PackageFormat) {
    const input = resolveWithPackage('src/index.ts')

    // resove external
    const external = Object.keys(pkg.dependencies)
    switch (PACKAGE_NAME) {
      case 'health-clock-in':
        external.push(...['puppeteer'])
        break

      case 'shared':
        external.push(...['react/jsx-runtime', 'react-dom/server'])
        break
    }

    return defineConfig({
      input,
      output: Object.assign(
        {
          inlineDynamicImports: true,
        },
        outputConfigs[format],
      ),
      plugins: [
        typescript({
          tsconfig: resolve(ROOT_DIR, 'tsconfig.json'),
        }),
        nodeResolve(),
        commonjs(),
        json(),
      ],
      external,
    })
  }

  const packageConfigs = packageFormats.map(format => createConfig(format))

  return packageConfigs
}
