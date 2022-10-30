import { Page } from 'puppeteer'

/**
 * @description 数字广大统一认证登录
 * @param page Page 对象
 * @param username 数字广大用户名
 * @param password 数字广大密码
 */
const gzhuLogin = async (page: Page, username: string, password: string) => {
  try {
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
  } catch (e) {
    console.log('Login Error:', e)
    return false
  }

  return true
}

export { gzhuLogin }
