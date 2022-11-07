// ================================ ResponseBody ================================

/** @description 图书馆预约系统的 api 统一响应体 */
interface ICWebResponse<T = any> {
  /** @description 0 为正常 */
  code: number
  count: number
  data: T
  message: string
  vals: any | null
}

interface UserInfo {
  uuid: string

  /** @description 发起预约请求时填写的预约人标识 -- appAccNo */
  accNo: number
  pid: string
  logonName: string
  password?: any
  cardNo: string
  cardId: string
  idCard: string
  trueName: string
  kind: number
  ident: number
  status: number
  localstatus: number
  classId: number
  className: string
  subsidy: number
  sex: number
  handPhone: string
  email: string
  deptId: number
  deptName: string
  birthday: number
  balance: number
  freeTime: number
  useQuota?: any
  roleId?: any
  roleLevel?: any
  manager: number
  permsSet: any[]
  token: string
  property: number
  expiredDate: number
}

/** @description 根据学号查询到的成员信息 */
interface MemberInfo {
  uuid?: any
  accNo: number
  pid?: any
  logonName: string
  password?: any
  cardNo?: any
  cardId?: any
  idCard?: any
  trueName?: any
  kind?: any
  ident?: any
  status: number
  localstatus: number
  classId?: any
  className?: any
  subsidy?: any
  sex?: any
  handPhone?: any
  email?: any
  deptId?: any
  deptName: string
  birthday?: any
  balance?: any
  freeTime?: any
  useQuota?: any
  roleId?: any
  roleLevel?: any
  manager?: any
  permsSet?: any
  token?: any
  property?: any
  expiredDate?: any
}

interface RoomInfo {
  devId: number
  devSn: number
  devName: string
  minUser: number
  maxUser: number
  devStatus: number
  devProp: number
  coordinate?: any
  icon?: any
  kindId: number
  kindName: string
  roomId: number
  roomSn: string
  openRulesn: number
  openState: number
  roomName: string
  roomProp: number
  labId: number
  labName: string
  labProp: number
  openStart: string
  openEnd: string
  resvRule: ResvRule
  kindUrl: string
  kindProp: number
  openTimes: OpenTime[]
  resvInfo: any[]
  endDayOpenInfo?: any
  pointSize?: any
  onlyView: boolean
  addServices?: any
  deviceAttributes?: any
  usePersonType?: any
  pointProperty?: any
  maintenanceTime?: any
  startDayOfWeek?: any
  deadlineTime?: any
  timeScopeOpenInfo?: any
}

interface OpenTime {
  openStartTime: string
  openEndTime: string
  openLimit: number
}

interface ResvRule {
  uuid: string
  ruleId: number
  ruleName: string
  ident: number
  deptId: number
  groupId: number
  classKind: number
  priority: number
  limit: number
  earlyInTime: number
  earliestResvTime: number
  latestResvTime: number
  minResvTime: number
  maxResvTime: number
  resvEndNoticeTime: number
  seriesTimeLimit: number
  cancelTime: number
  resvEndNewTime: number
  resvBeforeNoticeTime: number
  resvAfterNoticeTime: number
  devType: number
  devKindList: string
  devRoomList?: any
  laterLineTime: number
  devId: string
  freezingTime: number
  timeInterval: number
  defaultMode?: any
  defaultValue?: any
  useDuration?: any
  defaultRatio?: any
  allowConflict?: any
  endMode: number
  deadlineTime: number
  rangeNum: number
  startDayOfWeek: number
  gmtCreate: number
  gmtModified: number
  memo?: any
}

// ================================ RequestBody ================================
type ReserveArea = 'firstFloor' | 'fifthFloor'

interface ReserveRequestBody {
  sysKind: 1

  /** @description UserInfo 中的 accNo */
  appAccNo: UserInfo['accNo']

  memberKind: 1
  resvBeginTime: string
  resvEndTime: string
  testName: string
  resvKind: 2
  resvProperty: 0
  appUrl: string
  resvMember: number[]
  resvDev: number[]
  memo: string
  captcha: string
  addServices: any[]
}
