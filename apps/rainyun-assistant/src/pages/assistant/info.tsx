import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/assistant/info")({
  component: RouteComponent,
  staticData: {
    title: "个人信息",
  },
})

function RouteComponent() {
  return <div>Hello "/assistant/info"!</div>
}
