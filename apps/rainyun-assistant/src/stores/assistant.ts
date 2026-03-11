import { atomWithDefault, atomWithStorage } from "jotai/utils"
import { STORAGE_KEY_PREFIX } from "./const"

// 雨云 API Token
export const apiKeyAtom = atomWithStorage<string>(`${STORAGE_KEY_PREFIX}apiKey`, "")
apiKeyAtom.debugLabel = "apiKey"

// 后端 URL
export const backendUrlAtom = atomWithStorage<string>(`${STORAGE_KEY_PREFIX}backendUrl`, "")
backendUrlAtom.debugLabel = "backendUrl"

// 用户备注
export const userRemarkAtom = atomWithStorage<Record<number, string>>(`${STORAGE_KEY_PREFIX}userRemark`, {})
userRemarkAtom.debugLabel = "userRemark"

// 工单备注
export const workOrderRemarkAtom = atomWithStorage<Record<number, string>>(`${STORAGE_KEY_PREFIX}workOrderRemark`, {})
workOrderRemarkAtom.debugLabel = "workOrderRemark"

// 登录的用户名
export const usernameAtom = atomWithStorage<string>(`${STORAGE_KEY_PREFIX}username`, "")
usernameAtom.debugLabel = "username"

// 忽略的工单
export const ignoreWorkOrderMapAtom = atomWithStorage<Record<number, WorkOrder>>(
  `${STORAGE_KEY_PREFIX}ignoreWorkOrderMap`,
  {},
)
ignoreWorkOrderMapAtom.debugLabel = "ignoreWorkOrderMap"

// 实名信息
export const certifyInfoAtom = atomWithStorage<Record<number, Certify>>(
  `${STORAGE_KEY_PREFIX}certifyInfo`,
  {},
  undefined,
  { getOnInit: true },
)
certifyInfoAtom.debugLabel = "certifyInfo"
