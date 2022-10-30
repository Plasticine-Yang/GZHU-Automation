import { launch } from 'puppeteer'
import { gzhuLogin } from '../auth'

describe('gzhuLogin', () => {
  test('should login', async () => {
    let loginStatus = false
    const browser = await launch()
    const page = await browser.newPage()

    const username = ''
    const password = ''

    try {
      await gzhuLogin(page, username, password)
      loginStatus = true
    } catch (e) {
      console.log(e)
      loginStatus = false
    }

    expect(loginStatus).toBe(false)
  })
})
