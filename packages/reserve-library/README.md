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

// 常规用法
run({ gzhuUsername: '', gzhuPassword: '', rules })

// 从环境变量中读取数字广大用户名密码相关配置
run({ useEnv: true, rules })

// 等到 6:30:00 的时候才并发提交预约请求
run({ useEnv: true, rules, waitUntil: '6:30:00' })

// 加入今天是 monday，只启用 thursday 的规则 也就是总是预约未来第三天的规则
run({ useEnv: true, rules, filterWeekday: delta => delta === 3 })
```

# run 函数配置

- `useEnv`: 是否启用环境变量配置，开启后会优先使用环境变量里的配置，若没有相关环境变量则使用`run`函数的配置对象中的配置
- `gzhuUsername`: 数字广大用户名
- `gzhuPassword`: 数字广大密码
- `rules`: 预约规则，详情查看[rules 规则配置](#rules-规则配置)
- `waitUntil`: 等到特定时间才发送预约请求，这在和卷王们抢位置时十分关键，格式为`HH:mm:ss`，建议设置为`6:30:00`，这个时候是系统开放预约的时候
- `filterWeekday`: 根据规则中的`weekday`与今天之间的天数差对规则进行过滤，当配置了多个规则，而希望某个规则被过滤时可以通过该钩子进行配置

# 预约配置

配置的方式有两种:

1. 直接在`run`函数中传入`rules`数组配置
2. 通过环境变量进行配置

## rules 规则配置

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

## 环境变量配置

要启用环境变量配置需要在`run`函数的第一个参数`config`对象中开启`useEnv`选项

### 登录数字广大

- `GZHU_USERNAME`: 数字广大用户名
- `GZHU_PASSWORD`: 数字广大密码

### 邮箱日志服务 -- 如果有需要可以进行配置 配置后会在成功和失败的时候通过邮件的方式通知

- `EMAIL_HOST`: 邮件服务器域名
- `EMAIL_USER`: 邮箱用户名
- `EMAIL_PASS`: 邮箱授权码

### 预约规则配置

- `RESERVE_RULES`: 预约规则 json 字符串，可先在 js 文件中编写好配置后再将`JSON.stringify()`调用后的结果作为该环境变量的值
- `RESERVE_START_TIME`: 直到指定时间才提交预约请求，将该时间设置为预约系统的最早允许预约时间`6:30`可提高预约成功率
