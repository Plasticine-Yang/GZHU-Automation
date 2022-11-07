import { waitUntilTime } from '@gzhu-automation/shared'
import dayjs, { Dayjs } from 'dayjs'
import type { Protocol } from 'puppeteer'

import { createRequestInstance } from '../request'
import {
  API_GET_ACCNO_BY_STUDENT_ID,
  API_RESERVE,
  API_ROOM_INFO,
  API_USER_INFO,
} from './url'
import { weekdayDelta } from './utils'

function createApi(icCookie: Protocol.Network.Cookie) {
  const request = createRequestInstance(icCookie)

  /**
   * @description 预约
   * @param rules 预约规则
   * @param waitUntil 等到指定时间开始提交预约请求 -- 格式 21:36:03
   */
  async function reserve(rules: ReserveRule[], waitUntil?: string) {
    // 获取预约人信息
    const userInfo = await loadUserInfo()

    /** @description 只能预约今天以及未来 3 天的房间 */
    const isWeekdayValid = (weekday: Weekday) => weekdayDelta(weekday) <= 3

    // 只对有效的 rule 发起请求
    const validRules = rules.filter(rule => isWeekdayValid(rule.weekday))

    // 构造请求信息
    const requestInfoList = await generateReserveRequestInfoList(
      userInfo,
      validRules,
    )

    // 等到指定时间才发起请求
    if (waitUntil) {
      console.log(`等到 ${waitUntil} 才发送请求...`)
      await waitUntilTime(waitUntil)
    }

    // 批量发起请求
    console.log('开始发送请求...')
    return batchSendRequest(requestInfoList)
  }

  /**
   * @description 批量发送预约请求
   * @param requestInfoList 请求信息列表
   * @param maxConcurrency 最大并发量
   */
  function batchSendRequest(requestInfoList: ReserveRequestInfo[]) {
    const promises = requestInfoList.map(info => {
      const sendRequest = async (): Promise<string> => {
        const { area, roomName, time, weekday, studentIdList, title } =
          info.meta

        const logInfo = [
          `地点: ${area} -- ${roomName}`,
          `时间: ${weekday} -- ${time}`,
          `预约人: ${studentIdList.join(', ')}`,
          `主题: ${title}`,
        ]

        try {
          await request.post<null>(API_RESERVE, info.body)
          return await Promise.resolve(logInfo.join('|'))
        } catch (reason) {
          if (String(reason).includes('当前设备正在被预约，请稍后重试')) {
            // 重新请求
            return await Promise.resolve().then(sendRequest)
          } else {
            logInfo.push(`失败原因: ${(reason as any)?.message ?? reason}`)
            return await Promise.reject(new Error(logInfo.join('|')))
          }
        }
      }

      return Promise.resolve().then(sendRequest)
    })

    return Promise.allSettled(promises)
  }

  /**
   * @description 生成请求信息 -- 包括预约请求体和请求元数据信息
   * @param userInfo 用户信息
   * @param rules 预约规则
   */
  async function generateReserveRequestInfoList(
    userInfo: UserInfo,
    rules: ReserveRule[],
  ) {
    const generateInfoByRule = async (
      rule: ReserveRule,
    ): Promise<ReserveRequestInfo> => {
      const {
        weekday,
        area,
        beginTime,
        endTime,
        roomName,
        studentIdList,
        title,
      } = rule
      const resvMember = await Promise.all(
        studentIdList!.map(async studentId => {
          const member = await getAccNoByStudentId(studentId)
          return member.accNo
        }),
      )

      // 处理预约时间格式
      const now = dayjs()

      // 获取 delta 天之后的 dayjs 对象
      const delta = weekdayDelta(weekday)
      const reserveDayjs = now.add(delta, 'day')
      const formattedDate = reserveDayjs.format('YYYY-MM-DD')
      const resvBeginTime = `${formattedDate} ${beginTime}:00`
      const resvEndTime = `${formattedDate} ${endTime}:00`

      // 根据房间名查询对应的 devId
      const roomDevId = await getRoomDevIdByName(area, roomName, reserveDayjs)

      return {
        body: {
          sysKind: 1,
          appAccNo: userInfo.accNo,
          memberKind: 1,
          // resvBeginTime: '2022-10-31 15:20:00',
          resvBeginTime,
          resvEndTime,
          testName: title!,
          resvKind: 2,
          resvProperty: 0,
          appUrl: '',
          resvMember,
          resvDev: [roomDevId],
          memo: '',
          captcha: '',
          addServices: [],
        },
        meta: {
          area,
          roomName,
          time: `${resvBeginTime} ~ ${resvEndTime}`,
          title,
          weekday,
          studentIdList: studentIdList!,
        },
      }
    }

    const requestInfoList: ReserveRequestInfo[] = []
    await Promise.all(
      rules.map(async rule => {
        const { multiRules = [] } = rule

        // 根据学号列表查询对应的 accNo 列表 作为 resvMember 参数
        // 将预约人放进 studentIdList
        rule.title = rule.title ?? '学习'
        rule.studentIdList = rule.studentIdList ?? []
        rule.studentIdList.push(userInfo.pid)

        if (multiRules.length) {
          // multiRules 优先
          await Promise.all(
            multiRules.map(async childRule => {
              // 当必要参数未配置时让其继承自父 rule
              const completeRule: ReserveRule = Object.assign(rule, childRule)

              // 必要参数缺失时该规则无效 --> 跳过
              if (
                !completeRule.weekday ||
                !completeRule.area ||
                !completeRule.beginTime ||
                !completeRule.endTime ||
                !completeRule.roomName
              ) {
                return
              }

              requestInfoList.push(await generateInfoByRule(completeRule))
            }),
          )
        } else {
          // 正常处理
          requestInfoList.push(await generateInfoByRule(rule))
        }
      }),
    )

    return requestInfoList
  }

  /**
   * @description 获取用户信息
   */
  function loadUserInfo() {
    return request.get<UserInfo>(API_USER_INFO)
  }

  /**
   * @description 根据学号查询成员信息
   * @param studentId 学号
   * @returns MemberInfo
   */
  async function getAccNoByStudentId(studentId: string) {
    const memberInfoList = await request.get<MemberInfo[]>(
      API_GET_ACCNO_BY_STUDENT_ID,
      {
        params: {
          key: studentId,
          page: 1,
          pageNum: 10,
        },
      },
    )

    return memberInfoList[0]
  }

  // 根据预约的区域查询对应的 lableIds
  const areaToLabelIdsMap: Record<ReserveArea, string> = {
    firstFloor: '101497594',
    fifthFloor: '100458039',
  }
  /**
   * @description 查询
   * @param roomName 房间名
   * @param area 预约区域 -- firstFloor: 图书馆一楼学习中心 | fifthFloor: 五楼广州文献资源中心
   * @param reserveDate 预约日期
   * @returns RoomInfo[]
   */
  async function getRoomDevIdByName(
    area: ReserveArea,
    roomName: string,
    reserveDayjs: Dayjs,
  ) {
    const [year, month, date] = [
      reserveDayjs.year().toString(),
      (reserveDayjs.month() + 1).toString().padStart(2, '0'),
      reserveDayjs.date().toString().padStart(2, '0'),
    ]
    const reserveDate = `${year}${month}${date}`
    const roomInfoList = await request.get<RoomInfo[]>(API_ROOM_INFO, {
      params: {
        sysKind: 1,
        resvDates: reserveDate,
        lableIds: areaToLabelIdsMap[area],
      },
    })

    const targetRoomDevId = roomInfoList.find(
      room => room.devName === roomName,
    )?.devId

    if (!targetRoomDevId) {
      return Promise.reject(
        new Error(`房间名: ${roomName} 对应的 devId 不存在`),
      )
    }

    return targetRoomDevId
  }

  return {
    reserve,
  }
}

export { createApi }
