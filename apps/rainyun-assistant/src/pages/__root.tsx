import { createRootRoute, Outlet, useMatches } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AliveScope } from "react-activation"
import { DevTools } from "jotai-devtools"
import "./root.css"
import { useAtomValue } from "jotai"
import { debugModeAtom } from "@/stores"
import { useEffect } from "react"
import { persistQueryClient } from "@tanstack/react-query-persist-client"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"

const queryClient = new QueryClient()
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: Infinity,
})

const isDev = import.meta.env.MODE === "development"

const AllDevTools = () => {
  const debugMode = useAtomValue(debugModeAtom)

  if (!isDev) return null
  import("jotai-devtools/styles.css")
  return (
    debugMode && (
      <>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools initialIsOpen={false} />
        <DevTools />
      </>
    )
  )
}

export const Route = createRootRoute({
  component: () => {
    const matches = useMatches()

    useEffect(() => {
      if (matches.length === 0) {
        console.error("No route matched")
      } else {
        console.debug("Matched routes", matches)
      }
    }, [matches])

    // 逆向找staticData中有没有title，如果有就设置title
    useEffect(() => {
      const title = [...matches].reverse().find((match) => match.staticData?.title)?.staticData?.title
      if (title) {
        document.title = `${title} | 雨云助手`
      } else {
        document.title = "雨云助手"
      }
    }, [matches])

    return (
      <QueryClientProvider client={queryClient}>
        <AliveScope>
          <Outlet />
        </AliveScope>
        <AllDevTools />
      </QueryClientProvider>
    )
  },
})
