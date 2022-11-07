import { Page, Protocol } from 'puppeteer'

import {
  createLogger,
  createPuppeteer,
  gzhuLogin,
} from '@gzhu-automation/shared'

import { createApi } from './api'

const logger = createLogger('广州大学图书馆预约')

interface RunConfig {
  rules?: ReserveRule[]
  gzhuUsername?: string
  gzhuPassword?: string
  /** @description 是否从环境变量中读取配置 */
  useEnv?: boolean
  waitUntil?: string
}
async function run({
  gzhuUsername = '',
  gzhuPassword = '',
  useEnv = false,
  rules = [],
  waitUntil,
}: RunConfig = {}) {
  if (useEnv) {
    const { GZHU_USERNAME, GZHU_PASSWORD, RESERVE_RULES, RESERVE_START_TIME } =
      process.env
    gzhuUsername = GZHU_USERNAME ?? gzhuUsername
    gzhuPassword = GZHU_PASSWORD ?? gzhuPassword
    rules = RESERVE_RULES ? JSON.parse(RESERVE_RULES) : rules
    waitUntil = RESERVE_START_TIME ?? waitUntil
  }

  if (gzhuUsername === '' || gzhuPassword === '') {
    logger.error(
      '用户名或密码缺失',
      `gzhuUsername: ${gzhuUsername} | gzhuPassword: ${gzhuPassword}`,
    )
  } else {
    reserveLibrary({
      gzhuUsername,
      gzhuPassword,
      rules,
      waitUntil,
    })
  }
}

/**
 * @description 图书馆预约
 */
async function reserveLibrary({
  gzhuUsername,
  gzhuPassword,
  rules,
  waitUntil,
}: ReserveConfig) {
  if (rules.length === 0) {
    logger.error(
      '未设置预约规则',
      '请在入口函数中传入预约规则或在环境变量中配置预约规则',
    )
    process.exit(1)
  }

  const { browser, page } = await createPuppeteer()

  // 登录数字广大
  try {
    console.log('开始登录数字广大...')
    await gzhuLogin(page, gzhuUsername, gzhuPassword)
    console.log('数字广大登录成功，开始获取 ic-cookie...')
  } catch (error) {
    await logger.error('数字广大登录失败', error)
    await browser.close()
    process.exit(1)
  }

  try {
    // 获取 ic-cookie
    const icCookie = await loadIcCookie(page)

    console.log(`成功获取 ic-cookie: ${icCookie.value}`)

    const api = createApi(icCookie)
    const res = await api.reserve(rules, waitUntil)

    res.forEach(item => {
      switch (item.status) {
        case 'fulfilled':
          logger.log('预约成功', item.value)
          break

        case 'rejected':
          logger.error('预约失败', item.reason)
          break
      }
    })
  } catch (error: any) {
    const content = `message: ${error?.message ?? 'no message'}\nstack info: ${
      error?.stack ?? 'no stack info'
    }`
    await logger.error('未知错误', content)
  } finally {
    await browser.close()
  }
}

/**
 * @description 获取图书馆预约网站的 ic-cookie
 */
async function loadIcCookie(page: Page) {
  let cookies: Protocol.Network.Cookie[] | undefined
  let icCookie: Protocol.Network.Cookie | undefined

  try {
    await page.goto('http://libbooking.gzhu.edu.cn/#/ic/home')

    // 没有任何请求发出时才算加载完成
    await page.waitForNavigation({ waitUntil: 'networkidle0' })

    cookies = await page.cookies()
    icCookie = cookies.find(cookie => cookie.name === 'ic-cookie')
  } catch (error) {
    await logger.error('获取 ic-cookie 出错:', error)
  }

  if (!icCookie) {
    const cookiesLog = cookies
      ?.map(cookie => `${cookie.name}=${cookie.value}`)
      .join('\n')
    await logger.error('ic-cookie 不存在', `cookies: ${cookiesLog}`)
    process.exit(1)
  }

  return icCookie
}

if (process.env.NODE_ENV === 'development') {
  const rules: Partial<ReserveRule>[] = (
    [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ] as Weekday[]
  ).map(weekday => ({
    weekday,
    area: 'firstFloor',
    roomName: '学习室E21',
    multiRules: [
      {
        beginTime: '9:30',
        endTime: '12:00',
      },
      {
        beginTime: '14:30',
        endTime: '18:30',
      },
      {
        beginTime: '19:30',
        endTime: '21:00',
      },
    ],
  }))

  run({ useEnv: true, rules: rules as ReserveRule[], waitUntil: '6:30:00' })
}

export { run }
