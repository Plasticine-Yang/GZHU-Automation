# @gzhu-automation

广州大学自动化任务，目前已实现的有:

- `每日自动健康打卡`: 可到[@gzhu-automation/health-clock-in](./packages/health-clock-in/README.md)子项目中查看详细介绍
- `图书馆一楼自习室和五楼会议室自动预约`: 可到[@gzhu-automation/reserve-library](./packages/reserve-library/README.md)子项目中查看详细介绍

# 技术栈及相关使用场景

- [TypeScript](https://www.typescriptlang.org/): 前端必备
- [Google puppeteer](https://github.com/puppeteer/puppeteer): 谷歌官方出品的自动化`headless`框架
- [React SSR](https://reactjs.org/docs/react-dom-server.html): 用于将`React`组件解析成`html`字符串，作为日志信息的内容发送到邮件中
- [vitest](https://vitest.dev/): A Vite-native unit test framework. It's fast!
- [rollup](https://rollupjs.org/guide/en/): 轮子打包构建必备
- [pnpm monorepo](https://pnpm.io/workspaces): monorepo 管理仓库更加高效
- [Github Actions](https://github.com/features/actions): 无服务器时使用它可以帮你完成自动化任务
- [cac](https://github.com/cacjs/cac): CLI 构建工具
- [dotenv](https://www.npmjs.com/package/dotenv): 加载`.env`环境变量文件，把你的数字广大账号密码以及邮箱日志服务相关信息放在你的服务器的`.env`文件中，保证你的隐私数据不会泄露
- [execa](https://www.npmjs.com/package/execa): 在 node 环境中运行命令，主要用于构建脚本中

如果觉得好用的话欢迎点个`star`，也欢迎提 PR~
