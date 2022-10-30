/**
 * @description 睡眠一段时间
 * @param timeout 睡眠时长
 */
const sleep = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

export { sleep }
