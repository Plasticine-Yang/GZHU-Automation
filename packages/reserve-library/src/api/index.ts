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

  async function reserve(rules: ReserveRule[]) {
    // 获取预约人信息
    const userInfo = await loadUserInfo()

    /** @description 只能预约今天以及未来 3 天的房间 */
    const isWeekdayValid = (weekday: Weekday) => weekdayDelta(weekday) <= 3

    // 只对有效的 rule 发起请求
    const _rules = rules.filter(rule => isWeekdayValid(rule.weekday))

    // 批量构造请求体
    const requestInfoList = await Promise.all(
      _rules.map(async rule => {
        const {
          weekday,
          area,
          roomName,
          beginTime,
          endTime,
          title,
          studentIdList = [],
        } = rule

        // 根据学号列表查询对应的 accNo 列表 作为 resvMember 参数
        // 将预约人放进 studentIdList
        studentIdList.push(userInfo.pid)
        const resvMember = await Promise.all(
          studentIdList.map(async studentId => {
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
        const resvBeginTime = `${formattedDate} ${beginTime}`
        const resvEndTime = `${formattedDate} ${endTime}`

        // 根据房间名查询对应的 devId
        const roomDevId = await getRoomDevIdByName(area, roomName, reserveDayjs)

        // 构造预约请求体
        const reserveRequestBody: ReserveRequestBody = {
          sysKind: 1,
          appAccNo: userInfo.accNo,
          memberKind: 1,
          // resvBeginTime: '2022-10-31 15:20:00',
          resvBeginTime,
          resvEndTime,
          testName: title ?? '学习',
          resvKind: 2,
          resvProperty: 0,
          appUrl: '',
          resvMember,
          resvDev: [roomDevId],
          memo: '',
          captcha: '',
          addServices: [],
        }

        return {
          body: reserveRequestBody,
          meta: {
            area,
            roomName,
            time: `${resvBeginTime} ~ ${resvEndTime}`,
            title,
            weekday,
            studentIdList,
          },
        }
      }),
    )

    const res = await Promise.allSettled(
      requestInfoList.map(info => {
        return request
          .post<null>(API_RESERVE, info.body)
          .then(() => {
            const { area, roomName, time, weekday, studentIdList, title } =
              info.meta

            const logInfo = [
              `地点: ${area} -- ${roomName}`,
              `时间: ${weekday} -- ${time}`,
              `预约人: ${studentIdList.join(', ')}`,
              `主题: ${title}`,
            ]

            return Promise.resolve(logInfo)
          })
          .catch(reason => Promise.reject(reason?.message ?? reason))
      }),
    )

    return res
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
