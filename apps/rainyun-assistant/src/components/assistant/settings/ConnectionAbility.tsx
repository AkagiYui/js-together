import { getUserInfo } from "@/api/rainyun"
import { apiKeyAtom, backendUrlAtom, debugModeAtom } from "@/stores"
import { Banner, Button, Checkbox, CheckboxGroup, Divider, Input, Space, Typography } from "@douyinfe/semi-ui"
import { useAtom, useAtomValue } from "jotai/react"
import { useState } from "react"
import { IconDelete, IconBolt } from "@douyinfe/semi-icons"
import { Group } from "@/components/Group"
import { BlankApiKeyCard } from "@/components/assistant/BlankApiKeyCard"
import { BackendStatusCard } from "@/components/assistant/BackendStatusCard"

export const ConnectionAbility = () => {
  const [apiKey, setApiKey] = useAtom(apiKeyAtom)
  const [backendUrl, setBackendUrl] = useAtom(backendUrlAtom)

  const [data, setData] = useState("")
  async function testApi() {
    const data = await getUserInfo()
    setData(JSON.stringify(data, null, 2))
  }

  const debugMode = useAtomValue(debugModeAtom)

  const { Title, Text } = Typography
  return (
    <>
      <Title heading={2}>连接能力</Title>
      <Text underline>
        <b>
          请注意，雨云助手并非纯前端应用，其绝大部分功能需要后端支持。后端可自行部署，也可使用他人提供的公共服务。
          <br />
          请注意，雨云助手仅将所有数据存储于浏览器当中，但后端有能力查看您的 API Key、Cookies
          等敏感信息，为了您的数据安全，强烈建议您自行部署后端服务。
          <br />
        </b>
      </Text>
      {false && (
        <CheckboxGroup type="pureCard" value={["1", "2"]} direction="vertical" aria-label="CheckboxGroup 示例">
          <Group>
            <Checkbox value={"1"} extra="可同步使用雨云控制台的身份信息。" style={{ width: 280 }}>
              雨云身份验证
            </Checkbox>
            <Checkbox value={"2"} extra="绕过Referer限制，正常加载工单图片。" style={{ width: 280 }}>
              加载工单图片
            </Checkbox>
            <Checkbox value={"3"} extra="获取我的世界服务器MOTD信息，更好地判断服务器状态。" style={{ width: 280 }}>
              获取MineCraft服务器MOTD
            </Checkbox>

            <Checkbox value={"4"} extra="通过RCON协议控制游戏服务器。" style={{ width: 280 }}>
              RCON 控制台
            </Checkbox>
            <Checkbox value={"5"} extra="使用SSH连接服务器。" style={{ width: 280 }}>
              SSH 客户端
            </Checkbox>
          </Group>
        </CheckboxGroup>
      )}

      <BackendStatusCard />
      <Space>
        <Typography.Text className="w-24 text-right whitespace-nowrap">后端URL</Typography.Text>
        <Input value={backendUrl} mode="password" onChange={(e) => setBackendUrl(e)} autoComplete="off" />
        <Button icon={<IconBolt />} onClick={testApi}>
          测试
        </Button>
        <Button icon={<IconDelete />} type="warning" onClick={() => setBackendUrl("")} />
      </Space>

      <BlankApiKeyCard />
      <Space>
        <Typography.Text className="w-24 text-right whitespace-nowrap">API Key</Typography.Text>
        <Input value={apiKey} mode="password" onChange={(e) => setApiKey(e)} autoComplete="off" />
        <Button icon={<IconBolt />} onClick={testApi}>
          测试
        </Button>
        <Button icon={<IconDelete />} type="warning" onClick={() => setApiKey("")} />
      </Space>

      {data && (
        <Banner
          className="mt-2"
          fullMode={false}
          type="info"
          bordered
          icon={null}
          title={<div style={{ fontWeight: 600, fontSize: "14px", lineHeight: "20px" }}>测试结果</div>}
          description={data}
          onClose={() => setData("")}
        />
      )}
    </>
  )
}
