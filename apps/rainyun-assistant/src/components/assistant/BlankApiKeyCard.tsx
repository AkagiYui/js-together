import { apiKeyAtom } from "@/stores"
import { IconInherit, IconPuzzle } from "@douyinfe/semi-icons"
import { Banner, Space, Button } from "@douyinfe/semi-ui"
import { useAtomValue } from "jotai"
import { Group } from "../Group"

export const BlankApiKeyCard = ({ closable = false }: { closable?: boolean }) => {
  const apiKey = useAtomValue(apiKeyAtom)

  return (
    <Banner
      className="my-2"
      fullMode={false}
      type={apiKey ? "success" : "danger"}
      bordered
      icon={<IconInherit />}
      closeIcon={closable ? undefined : null}
      title={
        <div style={{ fontWeight: 600, fontSize: "14px", lineHeight: "20px" }}>
          {apiKey ? "API Key" : "未填写API Key！"}
        </div>
      }
      description={
        apiKey ? (
          <>
            <div>
              请确保您填写了<b>正确</b>的API Key，您可以点击下方测试按钮来验证API Key的正确性。
            </div>
          </>
        ) : (
          <Space vertical>
            <div>
              将无法使用雨云助手，请前往
              <a href="https://app.rainyun.com/account/settings/api-key" target="_blank">
                雨云控制台
              </a>
              生成API Key并填写到下方文本框。
            </div>
          </Space>
        )
      }
    />
  )
}
