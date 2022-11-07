const weekdayToNumber: Record<Weekday, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

/**
 * @description 比较 weekday 距离今天有多少天
 * @param weekday 待比较的星期
 */
function weekdayDelta(weekday: Weekday) {
  // 今天周几
  const todayWeekdayNumber = new Date().getDay()

  // 待比较的是周几
  const weekdayNumber = weekdayToNumber[weekday]
  const delta = weekdayNumber - todayWeekdayNumber

  return delta < 0 ? 7 + delta : delta
}

/**
 * @description Promise 并发控制
 * @param maxConcurrency 最大并发量
 * @param source 数据源数组
 * @param iteratorFn 迭代函数
 */
async function runParallel<T>(
  maxConcurrency: number,
  source: T[],
  iteratorFn: (item: T, source: T[]) => void,
) {
  const ret = []
  const executing: Promise<any>[] = []
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item, source))
    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e: Promise<any> = p.then(() =>
        executing.splice(executing.indexOf(e), 1),
      )
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        try {
          await Promise.race(executing)
        } catch (error) {
          // 忽略异常 交给 Promise.allSettled 由外界处理
          continue
        }
      }
    }
  }
  return Promise.allSettled(ret)
}

export { weekdayDelta, runParallel }
