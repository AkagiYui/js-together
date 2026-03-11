import { IconInherit, IconPuzzle } from "@douyinfe/semi-icons"
import { Banner, Space, Button } from "@douyinfe/semi-ui"
import { useAtomValue } from "jotai"
import { Group } from "../Group"

export const BackendStatusCard = ({ closable = false }: { closable?: boolean }) => {
  const proxyHealth = true

  return (
    <Banner
      className="my-2"
      fullMode={false}
      type={proxyHealth ? "success" : "danger"}
      bordered
      icon={<IconInherit />}
      closeIcon={closable ? undefined : null}
      title={
        <div style={{ fontWeight: 600, fontSize: "14px", lineHeight: "20px" }}>
          {proxyHealth ? "后端状态" : "未连接到后端！"}
        </div>
      }
      description={
        proxyHealth ? (
          <>
            <div>已成功连接到后端，您可以开始使用雨云助手提供的各种功能了！</div>
          </>
        ) : (
          <Space vertical>
            <div>可能无法正常使用雨云助手，请确保已启动后端并正确配置后端URL地址！后端URL不应以斜杠"/"结束。</div>
          </Space>
        )
      }
    />
  )
}
