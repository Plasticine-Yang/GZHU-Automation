# @gzhu-automation/reserve-library

可用于自动化预约广州大学图书馆一楼自习室和五楼会议室

# Usage

```shell
pnpm i @gzhu-automation/reserve-library
```

导入该包下的`run`函数，并传入配置后运行即可

```js
import { run } from '@gzhu-automation/reserve-library'

// 预约规则
const rules = (
    [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ] as Weekday[]
  ).map(weekday => ({
    weekday,
    area: 'firstFloor',
    roomName: '学习室E21',
    // multiRules 用于在一天内预约多个房间 每个子规则的配置会继承自外层规则对象
    // 如有配置则会覆盖外层规则对象中相应配置项
    multiRules: [
      {
        // 会覆盖外层的 roomName 配置
        roomName: '学习室E23',
        beginTime: '9:30',
        endTime: '12:00',
      },
      {
        // 这里的 roomName 会继承自外层的 roomName
        beginTime: '14:30',
        endTime: '18:30',
      }
    ],
  }))

// useEnv 开启后会从系统的环境变量中读取配置
// 如果环境变量中没有相应配置项则会在 run 函数的第一个参数对象中继续配置
run({ useEnv: true, rules })
```

# 环境变量配置

## 登录数字广大

- `GZHU_USERNAME`: 数字广大用户名
- `GZHU_PASSWORD`: 数字广大密码

## 邮箱日志服务 -- 如果有需要可以进行配置 配置后会在成功和失败的时候通过邮件的方式通知

- `EMAIL_HOST`: 邮件服务器域名
- `EMAIL_USER`: 邮箱用户名
- `EMAIL_PASS`: 邮箱授权码

# 预约规则配置

也就是上面示例中的`rules`对象里的每一个规则项，类型如下:

```ts
interface ReserveRule {
  /** @description 周几预约 */
  weekday: Weekday

  /** @description 预约的区域 */
  area: ReserveArea

  /** @description 预约的房间名 */
  roomName: RoomName

  /** @description 开始时间 -- 格式: 15:20 */
  beginTime: string

  /** @description 结束时间 -- 格式: 15:20 */
  endTime: string

  /** @description 预约主题 -- 默认值为 `学习` */
  title?: string

  /** @description 除了预约发起人之外的其他预约人 */
  studentIdList?: string[]

  /** @description 一天内要预约多次时在该字段进行配置 */
  multiRules?: Partial<Omit<ReserveRule, 'weekday' | 'multiRules'>>[]
}
```
