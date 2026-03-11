import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Layout } from "@douyinfe/semi-ui"
import { WorkOrderQueue } from "@/components/assistant/workOrder/WorkOrderQueue"

export const Route = createFileRoute("/assistant/workorder")({
  component: RouteComponent,
})

function RouteComponent() {
  const { Content, Sider } = Layout

  return (
    <Layout className="flex-1 h-full">
      <Sider style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
        <WorkOrderQueue />
      </Sider>
      <Content className="bg-[var(--semi-color-bg-0)]">
        <Outlet />
      </Content>
    </Layout>
  )
}
