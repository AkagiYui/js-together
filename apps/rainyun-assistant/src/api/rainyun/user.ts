import { http } from "./_base"

interface UserInfoInListApiResponse {
  ID: number // 用户ID
  Name: string // 用户名
  Email: string // 邮箱
  Phone: string // 手机号，第4位到第7位已用*脱敏
  Money: number // 余额
  RegisterTime: number // 注册时间戳(秒)
  QQOpenID: string | null // QQOpenID
  QQ: string | null // QQ号
  WechatOpenID: string | null // 微信OpenID
  CardCode: string | null // 身份证号
  IconUrl: string // 头像URL
  Points: number // 积分
  Inviter: number // 邀请人ID
  APIKey: string // APIKey
  LastIP: string // 最后登录IP
  BanReason: string // 封号原因，空字符串表示未封号
  UnsubscribeCount: number // 退订次数
  AlipayAccount: string // 支付宝账号，空字符串表示未绑定
  AlipayName: string // 支付宝姓名，空字符串表示未绑定
  LastLogin: string // 最后登录时间戳(秒)
  LastLoginArea: string // 最后登录地区
  LoginCount: number // 登录次数
  DLWallet: number // 代理钱包余额
  DLLevel: number // 代理等级
  AdminGroup: "operator" // 身份组
  TOTPSecret: "" | "***" // TOTP密钥
  IsLoginEnableTFA: boolean // 是否开启登录二次验证
  IsAllowPointUse: 0 | 1 // 是否允许使用积分
  ShareCode: string // 邀请码
  VipLevel: number // 账号等级
  IsAgent: boolean // 是否代理
  Valid: boolean // 账号是否有效，被注销(或封号?)时为false
  Source: string // 注册来源?
}

interface UserInfoApiResponse extends UserInfoInListApiResponse {
  ConsumeMonthly: number // 本月消费
  ConsumeAll: 0 // 总消费
  ConsumeQuarter: number // 本季度消费
  ResellDaily: number // 今日代理收益
  ResellMonthly: number // 本月代理收益
  ResellBeforeMonth: number // 上月代理收益
  ResellQuarter: number // 本季度代理收益
  ResellAll: number // 代理总收益
  StockDaily: number
  StockMonthly: number
  StockQuarter: number
  StockAll: number
  SecondStockQuarter: number
  SecondStockAll: number
  SubUserMonthly: number // 本月有效邀请用户
  SubUserAll: number // 总有效邀请用户
  ResellPointsMonthly: number // 本月代理积分收益
  ResellPointsAll: number // 总代理积分收益
  VIP: {
    Title: string // 等级等级名称
    SaleRequire: number // 升级所需消费
    CertifyRequired: number
    SaleProfit: number // 销售提成
    ResellProfit: number // 代理提成
    SecondResellProfit: number // 二级代理提成
    CanSendCoupons: boolean // 是否可以发放优惠券
    CanCustomCode: boolean // 是否可以自定义邀请码
    CanSendMsg: boolean // 是否可以发送站内信
    CanTryUsual: boolean // 是否可以试用常规产品
    FreeDomainCount: number // 免费域名数量
    FreeSSLCount: number // 免费SSL数量
    CanBeAgent: boolean // 是否可以成为代理
    AgentTitle: string // 代理等级名称
    StockRequire: number // 所需库存
    SecondStockRequire: number // 二级库存
    StockDiscount: number // 库存折扣
    SecondStockProfit: number // 二级库存提成
  }
  Certify: 1 | 0 // 是否实名认证
  LockPoints: number // 冻结积分
}

export async function getUserInfo(): Promise<UserInfo> {
  const response = await http.get<RYSuccessResponse<UserInfoApiResponse>>("/user/")
  const raw = response.data.data

  return {
    id: raw.ID,
    name: raw.Name,
    email: raw.Email,
    phone: raw.Phone,
    money: raw.Money,
    registerTime: raw.RegisterTime,
    qqOpenId: raw.QQOpenID,
    qq: raw.QQ,
    wechatOpenId: raw.WechatOpenID,
    cardCode: raw.CardCode,
    iconUrl: raw.IconUrl,
    points: raw.Points,
    inviter: raw.Inviter,
    apiKey: raw.APIKey,
    lastIp: raw.LastIP,
    banReason: raw.BanReason,
    unsubscribeCount: raw.UnsubscribeCount,
    alipayAccount: raw.AlipayAccount,
    alipayName: raw.AlipayName,
    lastLogin: raw.LastLogin,
    lastLoginArea: raw.LastLoginArea,
    loginCount: raw.LoginCount,
    dlWallet: raw.DLWallet,
    dlLevel: raw.DLLevel,
    adminGroup: raw.AdminGroup,
    totpSecret: raw.TOTPSecret,
    isLoginEnableTfa: raw.IsLoginEnableTFA,
    isAllowPointUse: !!raw.IsAllowPointUse,
    shareCode: raw.ShareCode,
    vipLevel: raw.VipLevel,
    isAgent: raw.IsAgent,
    valid: raw.Valid,
    source: raw.Source,
    consumeMonthly: raw.ConsumeMonthly,
    consumeAll: raw.ConsumeAll,
    consumeQuarter: raw.ConsumeQuarter,
    resellDaily: raw.ResellDaily,
    resellMonthly: raw.ResellMonthly,
    resellBeforeMonth: raw.ResellBeforeMonth,
    resellQuarter: raw.ResellQuarter,
    resellAll: raw.ResellAll,
    stockDaily: raw.StockDaily,
    stockMonthly: raw.StockMonthly,
    stockQuarter: raw.StockQuarter,
    stockAll: raw.StockAll,
    secondStockQuarter: raw.SecondStockQuarter,
    secondStockAll: raw.SecondStockAll,
    subUserMonthly: raw.SubUserMonthly,
    subUserAll: raw.SubUserAll,
    resellPointsMonthly: raw.ResellPointsMonthly,
    resellPointsAll: raw.ResellPointsAll,
    vip: {
      title: raw.VIP.Title,
      saleRequire: raw.VIP.SaleRequire,
      certifyRequired: raw.VIP.CertifyRequired,
      saleProfit: raw.VIP.SaleProfit,
      resellProfit: raw.VIP.ResellProfit,
      secondResellProfit: raw.VIP.SecondResellProfit,
      canSendCoupons: raw.VIP.CanSendCoupons,
      canCustomCode: raw.VIP.CanCustomCode,
      canSendMsg: raw.VIP.CanSendMsg,
      canTryUsual: raw.VIP.CanTryUsual,
      freeDomainCount: raw.VIP.FreeDomainCount,
      freeSslCount: raw.VIP.FreeSSLCount,
      canBeAgent: raw.VIP.CanBeAgent,
      agentTitle: raw.VIP.AgentTitle,
      stockRequire: raw.VIP.StockRequire,
      secondStockRequire: raw.VIP.SecondStockRequire,
      stockDiscount: raw.VIP.StockDiscount,
      secondStockProfit: raw.VIP.SecondStockProfit,
    },
    certify: !!raw.Certify,
    lockPoints: raw.LockPoints,
  }
}

type CertifyListApiResponse = RYPage<{
  ID: number
  UID: number
  OrderNo: string
  RealName: string
  RealID: string
  CreateTime: number
  CertifyID: null | string
  IsPassed: boolean
}>

interface GetCertifyListParams {
  pageIndex?: number
  pageSize?: number
  userIdFilter?: number
  realIdFilter?: string
  realNameFilter?: string
}

export async function getCertifyList({
  pageIndex = 1,
  pageSize = 20,
  userIdFilter,
  realIdFilter,
  realNameFilter,
}: GetCertifyListParams): Promise<CertifyList> {
  const response = await http.get<RYSuccessResponse<CertifyListApiResponse>>("/admin/user/certifies", {
    params: {
      options: JSON.stringify({
        page: pageIndex,
        perPage: pageSize,
        columnFilters: {
          UID: userIdFilter?.toString() || "",
          RealID: realIdFilter || "",
          RealName: realNameFilter || "",
        },
        // sort: [{ field: "CreateTime", type: "desc" }],
        sort: [],
      }),
    },
  })
  const raw = response.data.data
  return {
    count: raw.TotalRecords,
    records: raw.Records.map((record) => ({
      id: record.ID,
      userId: record.UID,
      orderNo: record.OrderNo,
      realName: record.RealName,
      realId: record.RealID,
      createTime: record.CreateTime,
      certifyId: record.CertifyID,
      isPassed: record.IsPassed,
    })),
  }
}

interface GetUserInfoListParams {
  pageIndex?: number
  pageSize?: number
  userIdFilter?: number
  usernameFilter?: string
  emailFilter?: string
  phoneFilter?: string
  lastLoginFilter?: string
  qqFilter?: string
}

type UserInfoListApiResponse = RYPage<UserInfoInListApiResponse>

export async function getUserInfoList({
  pageIndex = 1,
  pageSize = 20,
  userIdFilter,
  usernameFilter,
  emailFilter,
  phoneFilter,
  lastLoginFilter,
  qqFilter,
}: GetUserInfoListParams = {}): Promise<Page<UserInfoInList>> {
  const response = await http.get<RYSuccessResponse<UserInfoListApiResponse>>("/admin/user/", {
    params: {
      options: JSON.stringify({
        page: pageIndex,
        perPage: pageSize,
        columnFilters: {
          ID: userIdFilter?.toString() || "",
          Name: usernameFilter || "",
          Email: emailFilter || "",
          Phone: phoneFilter || "",
          LastIP: lastLoginFilter || "",
          QQ: qqFilter || "",
        },
        sort: [],
      }),
    },
  })
  return {
    count: response.data.data.TotalRecords,
    records: response.data.data.Records.map((raw) => ({
      id: raw.ID,
      name: raw.Name,
      email: raw.Email,
      phone: raw.Phone,
      money: raw.Money,
      registerTime: raw.RegisterTime,
      qqOpenId: raw.QQOpenID,
      qq: raw.QQ,
      wechatOpenId: raw.WechatOpenID,
      cardCode: raw.CardCode,
      iconUrl: raw.IconUrl,
      points: raw.Points,
      inviter: raw.Inviter,
      apiKey: raw.APIKey,
      lastIp: raw.LastIP,
      banReason: raw.BanReason,
      unsubscribeCount: raw.UnsubscribeCount,
      alipayAccount: raw.AlipayAccount,
      alipayName: raw.AlipayName,
      lastLogin: raw.LastLogin,
      lastLoginArea: raw.LastLoginArea,
      loginCount: raw.LoginCount,
      dlWallet: raw.DLWallet,
      dlLevel: raw.DLLevel,
      adminGroup: raw.AdminGroup,
      totpSecret: raw.TOTPSecret,
      isLoginEnableTfa: raw.IsLoginEnableTFA,
      isAllowPointUse: !!raw.IsAllowPointUse,
      shareCode: raw.ShareCode,
      vipLevel: raw.VipLevel,
      isAgent: raw.IsAgent,
      valid: raw.Valid,
      source: raw.Source,
    })),
  }
}

// 首先定义一个辅助类型来判断是否为 consume 开头
type IsConsumeType<T> = T extends `consume${string}` ? true : false

// 使用条件类型来决定返回值类型
type LogTypeToReturnType<T extends string> = IsConsumeType<T> extends true ? UserConsumeLog : UserLog

interface GetUserLogListParams {
  pageIndex?: number
  pageSize?: number
  userIdFilter?: number
  idFilter?: number
  dataFilter?: string
}

type UserLogListApiResponse = RYPage<{
  ID: number
  UID: number
  Time: number
  Type: string
  Data: string
}>

type UserConsumeLogListApiResponse = RYPage<{
  ID: number
  UID: number
  StartTime: number
  EndTime: number
  Type: string
  Duration: string
  ProductID: number
  PlanID: number
  Price: number
  CutPrice: number
  StockPrice: number
  AgentID: number
  Valid: boolean // 是否有效
  Discard: boolean // 是否废弃
  InoviceIssued: boolean // 是否已开发票
  Data: {
    NodeUUID: string // 节点UUID
    CouponID: number // 优惠券ID
  }
}>

// 使用类型守卫（Type Guard）
function isConsumeLogType(logType: string): logType is `consume${string}` {
  return logType.startsWith("consume")
}

export async function getUserLogList<
  T extends "consume/" | "consume/rcs" | "user/expense/money_change" | "user/reward",
>({
  pageIndex = 1,
  pageSize = 20,
  logType,
  userIdFilter,
  idFilter,
  dataFilter,
}: GetUserLogListParams & { logType: T }): Promise<Page<LogTypeToReturnType<T>>> {
  const response = await http.get<RYSuccessResponse<UserLogListApiResponse | UserConsumeLogListApiResponse>>(
    `/admin/data/logs`,
    {
      params: {
        options: JSON.stringify({
          columnFilters: {},
          sort: [],
          page: pageIndex,
          perPage: pageSize,
          valueFilters: {
            ...(userIdFilter !== undefined && { UID: userIdFilter.toString() }),
            ...(idFilter !== undefined && { ID: idFilter.toString() }),
            ...(dataFilter && { Data: dataFilter }),
          },
          timeFilters: null,
        }),
        log_type: logType,
      },
    },
  )
  return {
    count: response.data.data.TotalRecords,
    records: response.data.data.Records.map((raw) => {
      if (isConsumeLogType(logType)) {
        return {
          id: raw.ID,
          userId: raw.UID,
          startTime: raw.StartTime,
          endTime: raw.EndTime,
          type: raw.Type,
          duration: raw.Duration,
          productId: raw.ProductID,
          planId: raw.PlanID,
          price: raw.Price,
          cutPrice: raw.CutPrice,
          stockPrice: raw.StockPrice,
          agentId: raw.AgentID,
          valid: raw.Valid,
          discard: raw.Discard,
          inoviceIssued: raw.InoviceIssued,
          data: raw.Data,
        } as LogTypeToReturnType<T>
      } else {
        return {
          id: raw.ID,
          userId: raw.UID,
          time: raw.Time,
          type: raw.Type,
          data: JSON.parse(raw.Data),
        } as LogTypeToReturnType<T>
      }
    }),
  }
}
