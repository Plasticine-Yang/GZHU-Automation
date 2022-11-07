import { launch, Page } from 'puppeteer'

/**
 * @description puppeteer 工厂函数
 */
async function createPuppeteer() {
  const browser = await launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--proxy-server="direct://"',
      '--proxy-bypass-list=*',
    ],
  })
  const page = await browser.newPage()
  page.setDefaultTimeout(0)
  page.setDefaultNavigationTimeout(0)
  page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  )

  return {
    browser,
    page,
  }
}

/**
 * @description 封装 puppeteer 点击元素操作
 * @param page Page 对象
 * @param selector 选择器
 */
async function clickItem(page: Page, selector: string) {
  await page.waitForSelector(selector)
  await page.$eval(selector, el => {
    ;(el as HTMLElement).click()
  })
}

export { createPuppeteer, clickItem }
