import { http } from "./_base"

export function buildImageUrl(originUrl: string) {
  if (originUrl.startsWith("https://cn-nb1.rains3.com/rainyun-public")) {
    const target = originUrl.replace("https://cn-nb1.rains3.com", "")
    console.debug("before", originUrl, "after", `http://localhost:28183/proxy/rain/image${target}`)
    return `http://localhost:28183/proxy/rain/image${target}`
  }
  return originUrl
}

type WorkOrderListApiResponse = RYPage<{
  ID: number
  UID: number
  ExtUserInfo: ""
  UserName: string
  UserEmail: string
  UserVip: "0" | "1" | "2" | "3" | "4" | "5"
  UserIcon: string
  Title: string
  Type: "tech" | "expense" | "reward" | "sales"
  RelatedProductType: ""
  RelatedProductID: 0
  IsUrgent: 1 | 0
  Status: "handling"
  Time: number
  LastTime: 0
  WaitBeginTime: 0
  AssistID: 0 | number
  AuthStatus: ""
  AuthTime: 0
  AuthID: 0
}>

interface GetWorkOrderListParams {
  pageIndex?: number
  pageSize?: number
  statusFilter?: WorkOrderStatus
  titleFilter?: string
  userIdFilter?: number
  idFilter?: number
}

export async function getWorkOrderList({
  pageIndex = 1,
  pageSize = 50,
  statusFilter,
  titleFilter = "",
  userIdFilter,
  idFilter,
}: GetWorkOrderListParams = {}): Promise<WorkOrderList> {
  const response = await http.get<RYSuccessResponse<WorkOrderListApiResponse>>("/workorder/", {
    params: {
      options: JSON.stringify({
        page: pageIndex,
        perPage: pageSize,
        columnFilters: {
          Title: titleFilter,
          Status: statusFilter || "",
          UID: userIdFilter?.toString() || "",
          "work_orders.ID": idFilter || "",
        },
        sort: [
          { field: "Status", type: "desc" }, // 待回复->被挂起->已回复->已结单
          { field: "IsUrgent", type: "desc" },
          { field: "ID", type: "desc" },
        ],
      }),
    },
  })
  const raw = response.data.data
  return {
    count: raw.TotalRecords,
    records: raw.Records.map((record) => ({
      id: record.ID,
      title: record.Title,
      type: record.Type,
      isUrgent: !!record.IsUrgent,
      status: record.Status,
      time: record.Time,
      assistId: record.AssistID,
      user: {
        id: record.UID,
        username: record.UserName,
        email: record.UserEmail,
        level: record.UserVip,
        avatarUrl: record.UserIcon,
      },
    })),
  }
}

interface WorkOrderDetailApiResponse {
  ID: number
  UID: number
  ExtUserInfo: string
  UserName: string
  UserEmail: string
  UserVip: "0" | "1" | "2" | "3" | "4" | "5"
  UserIcon: string
  Title: string
  Type: "tech" | "expense" | "reward" | "sales"
  RelatedProductType: "" | "rcs" | "rbm" | "rvh" | "rgs" | "domain" | "rcdn" | "ros" | "ssl"
  RelatedProductID: 0 | number
  IsUrgent: 1 | 0
  Status: "handling"
  Time: number
  LastTime: 0 | number
  WaitBeginTime: 0 | number
  AssistID: 0 | number
  AuthStatus: "cancel"
  AuthTime: 0 | number
  AuthID: 0 | number
  Content: string
  Discuss: {
    Content: string
    ID: number
    IsAssist: boolean
    IsScored: boolean
    LastEditTime: 0 | number
    Time: number
    UID: number
    UserName: string
    UserVip: "0" | "1" | "2" | "3" | "4" | "5"
    UserIcon: string
    UserEmail: string
    WaitTime: number
  }[]
}

export async function getWorkOrderDetail(workOrderId: number): Promise<WorkOrderDetail> {
  const response = await http.get<RYSuccessResponse<WorkOrderDetailApiResponse>>(`/workorder/${workOrderId}`)
  const raw = response.data.data
  return {
    id: raw.ID,
    title: raw.Title,
    type: raw.Type,
    relatedProductType: raw.RelatedProductType,
    relatedProductID: raw.RelatedProductID,
    isUrgent: !!raw.IsUrgent,
    status: raw.Status,
    time: raw.Time,
    lastTime: raw.LastTime,
    waitBeginTime: raw.WaitBeginTime,
    assistId: raw.AssistID,
    content: raw.Content,
    auth: {
      status: raw.AuthStatus,
      time: raw.AuthTime,
      id: raw.AuthID,
    },
    user: {
      id: raw.UID,
      username: raw.UserName,
      level: raw.UserVip,
      avatarUrl: raw.UserIcon,
      email: raw.UserEmail,
      extUserInfo: raw.ExtUserInfo,
    },
    discuss: raw.Discuss.map((discuss) => ({
      content: discuss.Content,
      id: discuss.ID,
      isScored: discuss.IsScored,
      time: discuss.Time,
      lastEditTime: discuss.LastEditTime,
      waitTime: discuss.WaitTime,
      user: {
        id: discuss.UID,
        username: discuss.UserName,
        level: discuss.UserVip,
        avatarUrl: discuss.UserIcon,
        email: discuss.UserEmail,
        isAssist: discuss.IsAssist,
      },
    })),
  }
}

export async function setWorkOrderStatus({ workOrderId, status }: { workOrderId: number; status: WorkOrderStatus }) {
  await http.patch<RYSuccessResponse<"ok">>(`/workorder/${workOrderId}/status`, { body: { status } })
}
