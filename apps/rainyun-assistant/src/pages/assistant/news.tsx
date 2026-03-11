import { createFileRoute } from "@tanstack/react-router"
import { useNews } from "@/hooks"

export const Route = createFileRoute("/assistant/news")({
  component: RouteComponent,
  staticData: {
    title: "公告",
  },
})

function RouteComponent() {
  const { data: news, isLoading, error } = useNews()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <h2>公告</h2>
      <div>{JSON.stringify(news, null, 2)}</div>
    </>
  )
}
