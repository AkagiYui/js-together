interface RYSuccessResponse<T> {
  code: 200
  data: T
}

interface RYErrorResponse {
  code: number
  message: string
}

type RYResponse<T> = RYSuccessResponse<T> | RYErrorResponse

interface RYPage<T> {
  TotalRecords: number
  Records: T[]
}

interface Page<T> {
  count: number
  records: T[]
}

interface News {
  time: Date
  title: string
  type: "最新动态" | "最新活动"
  url: string
}

type WorkOrderType = "tech" | "expense" | "reward" | "sales" | "feedback"
type WorkOrderStatus = "handling" | "answered" | "waiting" | "finished"
type UserLevel = "0" | "1" | "2" | "3" | "4" | "5"
type ProductType = "" | "rvh" | "rcs" | "rbm" | "rgs" | "domain" | "rcdn" | "ros" | "ssl"
type AuthStatus = "cancel" | "valid" | ""

interface WorkOrder {
  id: number
  title: string
  type: WorkOrderType
  isUrgent: boolean
  status: WorkOrderStatus
  time: number
  assistId: 0 | number
  user: {
    id: number
    username: string
    email: string
    level: UserLevel
    avatarUrl: string
  }
}

type WorkOrderList = Page<WorkOrder>

interface WorkOrderDetail {
  id: number
  title: string
  type: WorkOrderType
  relatedProductType: ProductType
  relatedProductID: 0 | number
  isUrgent: boolean
  status: WorkOrderStatus
  time: number
  lastTime: 0 | number
  waitBeginTime: 0 | number
  assistId: 0 | number
  auth: {
    status: AuthStatus
    time: 0 | number
    id: 0 | number
  }
  content: string
  user: {
    id: number
    username: string
    level: UserLevel
    avatarUrl: string
    email: string
    extUserInfo: string // 售前工单"111.222.333.444_mTFf76n6frYJiSJC"
  }
  discuss: {
    content: string
    id: number
    isScored: boolean
    lastEditTime: 0 | number
    time: number
    user: {
      id: number
      username: string
      level: UserLevel
      avatarUrl: string
      email: string
      isAssist: boolean
    }
  }[]
}

interface UserInfoInList {
  id: number // 用户ID
  name: string // 用户名
  email: string // 邮箱
  phone: string // 手机号，第4位到第7位已用*脱敏
  money: number // 余额
  registerTime: number // 注册时间戳(秒)
  qqOpenId: string | null // QQOpenID
  qq: string | null // QQ号
  wechatOpenId: string | null // 微信OpenID
  cardCode: string | null // 身份证号
  iconUrl: string // 头像URL
  points: number // 积分
  inviter: number // 邀请人ID
  apiKey: string // APIKey
  lastIp: string // 最后登录IP
  banReason: string // 封号原因，空字符串表示未封号
  unsubscribeCount: number // 退订次数
  alipayAccount: string // 支付宝账号，空字符串表示未绑定
  alipayName: string // 支付宝姓名，空字符串表示未绑定
  lastLogin: string // 最后登录时间戳(秒)
  lastLoginArea: string // 最后登录地区
  loginCount: number // 登录次数
  dlWallet: number // 代理钱包余额
  dlLevel: number // 代理等级
  adminGroup: "operator" // 身份组
  totpSecret: "" | "***" // TOTP密钥
  isLoginEnableTfa: boolean // 是否开启登录二次验证
  isAllowPointUse: boolean // 是否允许使用积分
  shareCode: string // 邀请码
  vipLevel: number // 账号等级
  isAgent: boolean // 是否代理
  valid: boolean // 账号是否有效，被注销(或封号?)时为false
  source: string // 注册来源?
}

interface UserInfo extends UserInfoInList {
  consumeMonthly: number // 本月消费
  consumeAll: 0 // 总消费
  consumeQuarter: number // 本季度消费
  resellDaily: number // 今日代理收益
  resellMonthly: number // 本月代理收益
  resellBeforeMonth: number // 上月代理收益
  resellQuarter: number // 本季度代理收益
  resellAll: number // 代理总收益
  stockDaily: number
  stockMonthly: number
  stockQuarter: number
  stockAll: number
  secondStockQuarter: number
  secondStockAll: number
  subUserMonthly: number // 本月有效邀请用户
  subUserAll: number // 总有效邀请用户
  resellPointsMonthly: number // 本月代理积分收益
  resellPointsAll: number // 总代理积分收益
  vip: {
    title: string // 等级等级名称
    saleRequire: number // 升级所需消费
    certifyRequired: number
    saleProfit: number // 销售提成
    resellProfit: number // 代理提成
    secondResellProfit: number // 二级代理提成
    canSendCoupons: boolean // 是否可以发放优惠券
    canCustomCode: boolean // 是否可以自定义邀请码
    canSendMsg: boolean // 是否可以发送站内信
    canTryUsual: boolean // 是否可以试用常规产品
    freeDomainCount: number // 免费域名数量
    freeSslCount: number // 免费SSL数量
    canBeAgent: boolean // 是否可以成为代理
    agentTitle: string // 代理等级名称
    stockRequire: number // 所需库存
    secondStockRequire: number // 二级库存
    stockDiscount: number // 库存折扣
    secondStockProfit: number // 二级库存提成
  }
  certify: boolean // 是否实名认证
  lockPoints: number // 冻结积分
}

interface Vip {
  title: "Ⅱ级会员" // 等级名称
  saleRequire: number // 消费要求
  resellRequire: number // 代理商销售额要求
  certifyRequired: boolean // 是否需要认证
  saleProfit: number // 销售提成
  resellProfit: number // 代理商提成
  secondResellProfit: number // 二级代理商提成
  canSendCoupons: boolean // 是否可以发放优惠券
}

interface Certify {
  id: number
  userId: number
  orderNo: string
  realName: string
  realId: string
  createTime: number
  certifyId: null | string
  isPassed: boolean
}

type CertifyList = Page<Certify>

interface UserLog {
  id: number
  userId: number
  time: number
  type: string
  data: any
}

interface UserConsumeLog {
  id: number
  userId: number
  startTime: number
  endTime: number
  type: string
  duration: string
  productId: number
  planId: number
  price: number
  cutPrice: number
  stockPrice: number
  agentId: number
  valid: boolean
  discard: boolean
  inoviceIssued: boolean
  data: {
    nodeUuid: string
    couponId: number
  }
}
