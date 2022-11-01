import cac, { CAC } from 'cac'

import { resolve } from 'path'

import { build } from './build'

/**
 * @description 注册命令
 * @param cli CAC Instance
 */
const registerCommand = (cli: CAC) => {
  // build
  cli
    .command('build <...packageNames>', 'Build GZHU-Automation')
    .action((packageNames: string[]) => {
      packageNames.forEach(build)
    })
}

const main = async () => {
  const pkg = await import(resolve(process.cwd(), 'package.json'))
  const cli = cac('GZHU-Automation')

  registerCommand(cli)

  cli.help()
  cli.version(pkg.version)
  cli.parse()
}

main()
