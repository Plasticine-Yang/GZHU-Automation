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

export { weekdayDelta }
