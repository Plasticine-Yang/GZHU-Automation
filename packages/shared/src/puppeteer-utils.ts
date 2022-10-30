import { Page } from 'puppeteer'

/**
 * @description 封装 puppeteer 点击元素操作
 * @param page Page 对象
 * @param selector 选择器
 */
const clickItem = async (page: Page, selector: string) => {
  await page.waitForSelector(selector)
  await page.$eval(selector, el => {
    ;(el as HTMLElement).click()
  })
}

export { clickItem }
