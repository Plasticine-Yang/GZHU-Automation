/**
 * @description 睡眠一段时间
 * @param timeout 睡眠时长
 */
const sleep = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

/**
 * @description 为 promise 设置超时限制
 * @param promise Promise
 * @param timeout 可允许等待 promise 的最长时长
 */
const promiseWithTimeout = <T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error('promise timeout'))
    }, timeout)
  })

  return Promise.race([promise, timeoutPromise])
}

/**
 * @description 一直阻塞直到指定时间才继续
 * @param time 指定时间 -- 格式: 21:36:03 否则会直接放行
 */
const waitUntilTime = (time: string): Promise<void> => {
  return new Promise(resolve => {
    try {
      const [hours, minutes, seconds] = time.split(':').map(Number)

      let nowHours: number
      let nowMinutes: number
      let nowSeconds: number

      do {
        const now = new Date()
        nowHours = now.getHours()
        nowMinutes = now.getMinutes()
        nowSeconds = now.getSeconds()
      } while (
        nowHours <= hours &&
        (nowMinutes < minutes || nowSeconds < seconds)
      )

      resolve()
    } catch (error) {
      // 时间格式错误 直接放行
      resolve()
    }
  })
}

export { sleep, promiseWithTimeout, waitUntilTime }
