import { Divider, Typography } from "@douyinfe/semi-ui"
import { createFileRoute } from "@tanstack/react-router"
import { ConnectionAbility } from "@/components/assistant/settings/ConnectionAbility"
import { Group } from "@/components/Group"
import { UserInterface } from "@/components/assistant/settings/UserInterface"

export const Route = createFileRoute("/assistant/settings")({
  component: RouteComponent,
  beforeLoad(ctx) {
    // document.title = "设置 - 雨云助手"
  },
  staticData: {
    title: "设置",
  },
})

function RouteComponent() {
  const { Title } = Typography

  return (
    <Group vertical gap={3} className="p-4 mt-2 mx-auto max-w-220">
      <Title>助手设置</Title>
      <ConnectionAbility />
      <Divider />
      <UserInterface />
    </Group>
  )
}
