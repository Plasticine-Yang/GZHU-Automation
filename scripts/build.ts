import { execa } from 'execa'

/**
 * @description 打包构建
 */
async function build(packageName: string): Promise<void> {
  await execa(
    'rollup',
    [
      '-c',
      // use @rollup/plugin-typescript to execute rollup.config.ts
      '--configPlugin',
      'typescript',
      // inject environment variables
      '--environment',
      [`PACKAGE_NAME:${packageName}`].filter(Boolean).join(','),
    ],
    { stdio: 'inherit' },
  )
}

export { build }
