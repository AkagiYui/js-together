import { Button, Layout, Space } from "@douyinfe/semi-ui"
import { createLazyFileRoute, useRouter } from "@tanstack/react-router"
import { Header } from "@/components/index/Header"
import { Footer } from "@/components/index/Footer"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

function Index() {
  const { Content } = Layout
  const router = useRouter()

  return (
    <Layout className="flex flex-col h-screen">
      <Header />

      <Content className="flex-1 overflow-auto p-4">
        <Space vertical>
          <p>为雨云面板带来更多可能。</p>
          <Space>
            <Button onClick={() => window.open("https://app.rainyun.com", "_blank")}>官方控制台</Button>
            <Button onClick={() => router.navigate({ href: "/assistant" })}>立即使用</Button>
          </Space>
        </Space>
      </Content>

      <Footer />
    </Layout>
  )
}
