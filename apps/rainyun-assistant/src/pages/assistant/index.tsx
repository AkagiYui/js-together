import { createFileRoute, useRouter } from "@tanstack/react-router"
import { Banner, Divider, Space, Typography } from "@douyinfe/semi-ui"
import { IconSourceControl, IconClock } from "@douyinfe/semi-icons"
import { useAtomValue } from "jotai"
import { apiKeyAtom, backendUrlAtom, debugModeAtom } from "@/stores"
import { useMemo } from "react"
import { useSourceInfo } from "@/hooks"

export const Route = createFileRoute("/assistant/")({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const apiKey = useAtomValue(apiKeyAtom)
  const backendUrl = useAtomValue(backendUrlAtom)
  const isLogin = useMemo(() => {
    return Boolean(apiKey || backendUrl) && true
  }, [apiKey, backendUrl])

  const { commitId, commitTime } = useSourceInfo()
  const debugMode = useAtomValue(debugModeAtom)

  return (
    <Space vertical className="w-full p-2 box-border mt-2">
      <Typography.Title>欢迎使用雨云助手</Typography.Title>
      {debugMode && !isLogin && (
        <Banner
          className=""
          fullMode={false}
          type="warning"
          bordered
          icon={null}
          closeIcon={null}
          title={<div style={{ fontWeight: 600, fontSize: "14px", lineHeight: "20px" }}>还没登录？</div>}
          description={
            <div>
              助手还不知道你的身份哦，请从头像的下拉菜单进入{" "}
              <span
                className="text-blue font-bold cursor-pointer text-size-lg"
                onClick={() => {
                  router.navigate({ href: "/assistant/settings" })
                }}
              >
                设置
              </span>{" "}
              ，填写 后端URL 和 API Key 进行验证。
            </div>
          }
        />
      )}
      <Space>
        <IconSourceControl />
        <Typography.Text>{commitId}</Typography.Text>
        <Divider layout="vertical" />
        <IconClock />
        <Typography.Text>{new Date(commitTime).toLocaleString()}</Typography.Text>
      </Space>
    </Space>
  )
}
