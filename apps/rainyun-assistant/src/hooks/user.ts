import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCertifyList, getUserInfo, getUserInfoList, getUserLogList } from "@/api/rainyun"
import { getQQAvatarUrl } from "@/utils"
import { certifyInfoAtom } from "@/stores"
import { useAtom } from "jotai"
import { useState } from "react"

export function useUserInfo() {
  return useQuery<UserInfo, Error>({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const raw = await getUserInfo()
      if (!raw.iconUrl) {
        raw.iconUrl = getQQAvatarUrl(raw.email)
      }
      return raw
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

export function useUserCertifyInfo({ userId }: { userId: number }) {
  const [offlineCertifyInfo, setOfflineCertifyInfo] = useAtom(certifyInfoAtom)
  const [placeholder, setPlaceholder] = useState<Certify | undefined>(offlineCertifyInfo[userId])

  const queryClient = useQueryClient()
  const reset = () => {
    setPlaceholder(undefined)
    queryClient.resetQueries({ queryKey: ["userCertifyInfo", userId] })
    setOfflineCertifyInfo((prev) => {
      const next = { ...prev }
      delete next[userId]
      return next
    })
  }

  return {
    ...useQuery<Certify | null, Error>({
      queryKey: ["userCertifyInfo", userId],
      queryFn: async () => {
        const raw = await getCertifyList({ userIdFilter: userId })
        const filtered = raw.records.filter((item) => item.userId === userId)
        const data = filtered[0] || null
        setOfflineCertifyInfo((prev) => {
          const next = { ...prev }
          if (data) {
            next[userId] = data
          } else {
            delete next[userId]
          }
          return next
        })
        return data
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      enabled: false,
      placeholderData: placeholder,
    }),
    reset,
  }
}

export function useUserInfoList({ userId }: { userId?: number }) {
  return useQuery<Page<UserInfoInList>, Error>({
    queryKey: ["userInfoList", userId],
    queryFn: async () => {
      const raw = await getUserInfoList({ userIdFilter: userId })
      return raw
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

export function useUserInfoInList({ userId }: { userId: number }) {
  return useQuery<UserInfoInList | null, Error>({
    queryKey: ["userInfoInList", userId],
    queryFn: async () => {
      const raw = await getUserInfoList({ userIdFilter: userId })
      const filtered = raw.records.filter((item) => item.id === userId)
      return filtered[0] || null
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

export function useUserMoneyLogList({
  userId,
  pageIndex = 1,
  pageSize = 20,
}: {
  userId: number
  pageIndex?: number
  pageSize?: number
}) {
  return useQuery<Page<UserMoneyLog>, Error>({
    queryKey: ["userMoneyLogList", userId, pageIndex, pageSize],
    queryFn: async () => {
      const raw = await getUserLogList({
        logType: "user/expense/money_change",
        userIdFilter: userId,
        pageIndex,
        pageSize,
      })
      return {
        count: raw.count,
        records: raw.records.map((item) => ({
          id: item.id,
          time: item.time,
          moneyBefore: Math.floor(item.data.MoneyBefore * 100) / 100,
          moneyChanged: Math.floor(item.data.MoneyChanged * 100) / 100,
          moneyNow: Math.floor(item.data.MoneyNow * 100) / 100,
          callerFunc: item.data.CallerFunc.replace(/.*(?=services\/)/, ""),
        })),
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: false,
  })
}
