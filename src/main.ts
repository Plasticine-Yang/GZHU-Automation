import puppeteer, { Page } from 'puppeteer'

const clickItem = async (page: Page, selector: string) => {
  await page.waitForSelector(selector)
  await page.$eval(selector, el => {
    ;(el as HTMLElement).click()
  })
}

const sleep = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

const login = async (page: Page, username: string, password: string) => {
  // 等待登录表单出现
  const usernameSelector = '.login-input-row input#un'
  const passwordSelector = '.login-input-row input#pd'
  await page.waitForSelector(usernameSelector)
  await page.waitForSelector(passwordSelector)

  // 输入登录信息
  await page.type(usernameSelector, username)
  await page.type(passwordSelector, password)

  // 点击登录按钮
  await page.click('#index_login_btn')
}

/**
 * @description 开始上报
 */
const startClockIn = async (page: Page) => {
  // 等待并点击开始上报按钮
  try {
    await page.waitForNavigation()
    const startBtnSelector = '#preview_start_button'
    await page.waitForSelector(startBtnSelector)
    await page.$eval(startBtnSelector, el => {
      ;(el as HTMLElement).click()
    })
  } catch (err) {
    console.error('[ERROR]:', err)
  }
}

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

    console.log('打卡成功！')
  } catch (err) {
    console.error('[ERROR]:', err)
  }
}

/**
 * @description 广州大学健康打卡
 */
const healthClockIn = async (username: string, password: string) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // 访问健康状况申报首页
  await page.goto('https://yqtb.gzhu.edu.cn/infoplus/form/XNYQSB/start')

  // 登录
  await login(page, username, password)

  // 开始上报
  await startClockIn(page)

  // 等待表单出现
  await sleep(3000)

  // 填写并提交表单
  await inputAndSubmitForm(page)

  // 关闭浏览器
  await browser.close()
}

const username = process.env.GZHU_USERNAME ?? ''
const password = process.env.GZHU_PASSWORD ?? ''

if (username === '' || password === '') {
  console.log('请填写用户名和密码!')
} else {
  healthClockIn(username, password)
}
