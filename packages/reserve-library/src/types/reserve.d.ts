interface ReserveConfig {
  username: string
  password: string
  rules: ReserveRule[]
}

type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

type RoomName =
  | '低音研讨室C03'
  | '低音研讨室C04'
  | '低音研讨室C05'
  | '低音研讨室C06'
  | '研讨间C07'
  | '研讨间C08'
  | '研讨间C09'
  | '研讨间E01'
  | '研讨间E02'
  | '研讨间E03'
  | '研讨间E04'
  | '研讨间E05'
  | '研讨间E06'
  | '研讨间E07'
  | '研讨间E08'
  | '研讨间E09'
  | '研讨间E10'
  | '研讨间E11'
  | '研讨间E12'
  | '研讨间E13'
  | '研讨间E14'
  | '研讨间E15'
  | '研讨间E17'
  | '研讨间E18'
  | '研讨间E19'
  | '研讨间E20'
  | '学习室E21'
  | '研讨间E22'
  | '学习室E23'
  | '学习室E24'
  | '学习室E25'
  | '静思间E16'
  | '学士吟'
  | '朝天乐'
  | '清和风'
  | '江如练'
  | '浣溪沙'
  | '沁园春'

interface ReserveRule {
  /** @description 周几预约 */
  weekday: Weekday

  /** @description 预约的区域 */
  area: ReserveArea

  /** @description 预约的房间名 */
  roomName: RoomName

  /** @description 开始时间 -- 格式: 15:20:00 */
  beginTime: string

  /** @description 结束时间 -- 格式: 15:20:00 */
  endTime: string

  /** @description 预约主题 -- 默认值为 `学习` */
  title?: string

  /** @description 除了预约发起人之外的其他预约人 */
  studentIdList?: string[]
}
