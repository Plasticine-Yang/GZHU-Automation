import { launch, Page } from 'puppeteer'

import {
  clickItem,
  gzhuLogin,
  sleep,
  createLogger,
} from '@gzhu-automation/shared'

const logger = createLogger('健康打卡')

const { GZHU_USERNAME, GZHU_PASSWORD } = process.env

/**
 * @description 填写并提交表单
 */
const inputAndSubmitForm = async (page: Page) => {
  try {
    await Promise.all([
      // 当日是否外出
      clickItem(page, '#V1_CTRL238'),

      // 是否接触过半个月内有疫情重点地区旅居史的人员
      clickItem(page, '#V1_CTRL46'),

      // 健康码是否为绿码
      clickItem(page, '#V1_CTRL262'),

      // 半个月内是否到过国内疫情重点地区
      clickItem(page, '#V1_CTRL37'),

      // 本人承诺对上述填报内容真实性负责，如有不实，本人愿意承担一切责任
      clickItem(page, '#V1_CTRL82'),
    ])

    // 提交
    await clickItem(page, '#form_command_bar .command_button')

    // 点击确认
    await clickItem(page, '.dialog_button')

    logger.log('打卡成功！', '恭喜您健康打卡成功')
  } catch (err) {
    logger.error('打卡表单提交出错', err)
  }
}

/**
 * @description 广州大学健康打卡
 */
const healthClockIn = async (username: string, password: string) => {
  const browser = await launch()
  const page = await browser.newPage()

  try {
    // 登录
    await gzhuLogin(page, username, password)
  } catch (error) {
    logger.error('数字广大登录失败', error)
  }

  try {
    console.log('登录成功，开始打卡...')

    // 访问健康状况申报首页
    await page.goto('https://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start')

    // 开始上报
    await clickItem(page, '#preview_start_button')

    // 等待表单出现
    await sleep(3000)

    // 填写并提交表单
    await inputAndSubmitForm(page)

    // 关闭浏览器
    await browser.close()
  } catch (error) {
    logger.error('未知错误', error)
  }
}

const username = GZHU_USERNAME ?? ''
const password = GZHU_PASSWORD ?? ''

if (username === '' || password === '') {
  logger.error('环境变量缺失', '环境变量中没有配置数字广大用户名和密码')
} else {
  healthClockIn(username, password)
}
