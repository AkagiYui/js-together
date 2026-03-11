import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { getWorkOrderDetail, getWorkOrderList, setWorkOrderStatus } from "@/api/rainyun"
import { UseMutationOptions } from "@tanstack/react-query"
import { ignoreWorkOrderMapAtom } from "@/stores"
import { useSetAtom } from "jotai"
import { getQQAvatarUrl } from "@/utils"

interface UseWorkOrderListProps {
  status?: WorkOrderStatus
  userId?: number
  title?: string
  enabled?: boolean
}

export function useWorkOrderList({ status, userId, title, enabled = true }: UseWorkOrderListProps) {
  const setIgnoreWorkOrderMap = useSetAtom(ignoreWorkOrderMapAtom)

  return useQuery<WorkOrderList, Error>({
    queryKey: ["workOrder-list", status, userId, title],
    queryFn: async () => {
      const raw = await getWorkOrderList({ statusFilter: status, userIdFilter: userId, titleFilter: title })

      setIgnoreWorkOrderMap((prev) => {
        const next = { ...prev }
        raw.records.forEach((item) => {
          if (next[item.id]) {
            next[item.id] = item
          }
        })
        return next
      })

      return raw
    },
    staleTime: 1000 * 10, // 10s
    refetchInterval: 1000 * 5, // 5s
    refetchIntervalInBackground: false, // 页面不在活动状态时是否继续轮询
    enabled,
  })
}

export function useWorkOrderDetail(id: number) {
  const setIgnoreWorkOrderMap = useSetAtom(ignoreWorkOrderMapAtom)

  return useQuery<WorkOrderDetail, Error>({
    queryKey: ["workOrder-detail", id],
    queryFn: async () => {
      const raw = await getWorkOrderDetail(id)

      setIgnoreWorkOrderMap((prev) => {
        if (!prev[id]) return prev
        return { ...prev, [id]: raw }
      })

      if (!raw.user.avatarUrl) {
        raw.user.avatarUrl = getQQAvatarUrl(raw.user.email)
      }

      raw.discuss.map((item) => {
        if (!item.user.avatarUrl) {
          item.user.avatarUrl = getQQAvatarUrl(item.user.email)
        }
        return item
      })

      return raw
    },
    staleTime: 1000 * 10, // 10s
    refetchInterval: 1000 * 5, // 5s
    refetchIntervalInBackground: false, // 页面不在活动状态时是否继续轮询
  })
}

type UpdateWorkOrderStatusOptions = UseMutationOptions<void, Error, { workOrderId: number; status: WorkOrderStatus }>

const updateWorkOrderOptions: UpdateWorkOrderStatusOptions = {
  mutationFn: setWorkOrderStatus,
  onSuccess: (_, { workOrderId }, context: any) => {
    const client = context.queryClient as QueryClient
    client.invalidateQueries({ queryKey: ["workOrder-detail", workOrderId] })
    client.invalidateQueries({ queryKey: ["workOrder-list"] })
  },
}

export const useUpdateWorkOrderStatus = () => useMutation(updateWorkOrderOptions)
