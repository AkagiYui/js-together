import { Header } from "@/components/assistant/Header"
import { Layout } from "@douyinfe/semi-ui"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/assistant")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout className="flex flex-col h-screen">
      <Header />
      <Layout.Content className="flex-1 overflow-auto">
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
