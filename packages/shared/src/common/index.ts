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

export { sleep, promiseWithTimeout }
