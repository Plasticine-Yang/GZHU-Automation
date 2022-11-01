import { HTTPResponse, Page } from 'puppeteer'

/**
 * @description 数字广大统一认证登录
 * @param page Page 对象
 * @param username 数字广大用户名
 * @param password 数字广大密码
 */
const gzhuLogin = async (page: Page, username: string, password: string) => {
  let wipResolve: (value: unknown) => void
  let wipReject: (reason?: any) => void

  const wipPromise = new Promise((resolve, reject) => {
    wipResolve = resolve
    wipReject = reject
  })

  const loginResponseHandler = async (response: HTTPResponse) => {
    const url = response.url()

    if (url.startsWith('https://newcas.gzhu.edu.cn/cas/login?service')) {
      const status = response.status()

      if (status === 200) {
        const text = await response.text()
        if (text.includes('连续登录失败')) {
          wipReject(new Error('账号或密码错误'))
          page.off('response', loginResponseHandler)
        }
      }

      if (status === 302) {
        wipResolve(null)
        page.off('response', loginResponseHandler)
      }
    }
  }

  page.on('response', loginResponseHandler)

  try {
    console.log('访问登录页')
    await page.goto('https://newcas.gzhu.edu.cn/')
    console.log('成功进入登录页')

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
    // @ts-ignore
    wipReject(e)
    page.off('response', loginResponseHandler)
  }

  return wipPromise
}

export { gzhuLogin }
