import { atomWithStorage } from "jotai/utils"
import { STORAGE_KEY_PREFIX } from "./const"

// 启用调试模式
export const debugModeAtom = atomWithStorage<boolean>(`${STORAGE_KEY_PREFIX}debugMode`, false)
debugModeAtom.debugLabel = "debugMode"

// 主题
export const themeAtom = atomWithStorage<ThemeValue>(`${STORAGE_KEY_PREFIX}theme`, 2)
themeAtom.debugLabel = "theme"

// 是否折叠工单队列
export const workOrderQueueCollapsedAtom = atomWithStorage<boolean>(
  `${STORAGE_KEY_PREFIX}workOrderQueueCollapsed`,
  false,
)
workOrderQueueCollapsedAtom.debugLabel = "workOrderQueueCollapsed"

// 工单状态筛选
export const workOrderTableStatusFilterAtom = atomWithStorage<WorkOrderStatus | undefined>(
  `${STORAGE_KEY_PREFIX}workOrderTableStatusFilter`,
  undefined,
)
workOrderTableStatusFilterAtom.debugLabel = "workOrderTableStatusFilter"

// 工单类型筛选
export const workOrderTableTypeFilterAtom = atomWithStorage<WorkOrderType | undefined>(
  `${STORAGE_KEY_PREFIX}workOrderTableTypeFilter`,
  undefined,
)
workOrderTableTypeFilterAtom.debugLabel = "workOrderTableTypeFilter"

// 工单队列已选中的 Key
export const workOrderQueueSelectedKeysAtom = atomWithStorage<number[]>(
  `${STORAGE_KEY_PREFIX}workOrderQueueSelectedKeys`,
  [-1],
)
workOrderQueueSelectedKeysAtom.debugLabel = "workOrderQueueSelectedKeys"

// { 工单 ID: 关联产品类型 }
export const workOrderProductMapAtom = atomWithStorage<Record<number, ProductType>>(
  `${STORAGE_KEY_PREFIX}workOrderProductMap`,
  {},
)
workOrderProductMapAtom.debugLabel = "workOrderProductMap"

// 显示工单备注
export const showWorkOrderRemarkAtom = atomWithStorage<boolean>(`${STORAGE_KEY_PREFIX}showWorkOrderRemark`, false)
showWorkOrderRemarkAtom.debugLabel = "showWorkOrderRemark"

// 显示用户备注
export const showUserRemarkAtom = atomWithStorage<boolean>(`${STORAGE_KEY_PREFIX}showUserRemark`, false)
showUserRemarkAtom.debugLabel = "showUserRemark"
