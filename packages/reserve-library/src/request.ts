import type { Protocol } from 'puppeteer'

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

function createRequestInstance(icCookie: Protocol.Network.Cookie) {
  /** @description 针对图书馆预约系统定制的 axios instance */
  const instance = axios.create({
    baseURL: 'http://libbooking.gzhu.edu.cn/ic-web',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Cache-Control': 'no-cache',
      Cookie: `ic-cookie=${icCookie.value}`,
      Host: 'libbooking.gzhu.edu.cn',
      lan: 1,
      Pragma: 'no-cache',
      'Proxy-Connection': 'keep-alive',
      Referer: 'http://libbooking.gzhu.edu.cn/',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    },
  })

  // 拦截器处理默认的 AxiosResponse
  instance.interceptors.response.use(res => {
    const icWebResponse: ICWebResponse = res.data
    if (icWebResponse.code !== 0) {
      return Promise.reject(
        new Error(`ICWeb API Error: ${icWebResponse.message}`),
      )
    }

    return Promise.resolve(icWebResponse.data)
  })

  /** @description 泛型修正后的 request 实例 */
  const request = {
    get<T = any>(url: string, config?: AxiosRequestConfig) {
      return instance.get<T, AxiosResponse<T>['data']>(url, config)
    },

    post<T = any, R = AxiosResponse<T>['data'], D = any>(
      url: string,
      data: D,
      config?: AxiosRequestConfig<D>,
    ) {
      return instance.post<T, R, D>(url, data, config)
    },
  }

  return request
}

export { createRequestInstance }
