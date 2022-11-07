import { Page, Protocol } from 'puppeteer'

import {
  createLogger,
  createPuppeteer,
  gzhuLogin,
} from '@gzhu-automation/shared'

import { createApi } from './api'

const logger = createLogger('广州大学图书馆预约')

const { GZHU_USERNAME, GZHU_PASSWORD, NODE_ENV } = process.env

async function run() {
  const username = GZHU_USERNAME ?? ''
  const password = GZHU_PASSWORD ?? ''

  if (username === '' || password === '') {
    logger.error('环境变量缺失', '环境变量中没有配置数字广大用户名和密码')
  } else {
    const rules: ReserveRule[] = [
      {
        area: 'firstFloor',
        weekday: 'tuesday',
        roomName: '学习室E21',
        beginTime: '15:20:00',
        endTime: '18:00:00',
      },
    ]
    reserveLibrary({ username, password, rules })
  }
}

/**
 * @description 图书馆预约
 */
async function reserveLibrary({ username, password, rules }: ReserveConfig) {
  const { browser, page } = await createPuppeteer()

  // 登录数字广大
  try {
    await gzhuLogin(page, username, password)
  } catch (error) {
    await logger.error('数字广大登录失败', error)
    process.exit(1)
  }

  try {
    // 获取 ic-cookie
    const icCookie = await loadIcCookie(page)

    console.log(`成功获取 ic-cookie: ${icCookie.value}`)

    const api = createApi(icCookie)
    const res = await api.reserve(rules)

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
  } catch (error) {
    await logger.error('未知错误', error)
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
    console.log('登录成功，尝试访问图书馆预约页面获取 ic-cookie...')

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

NODE_ENV === 'development' && run()

export { run }
