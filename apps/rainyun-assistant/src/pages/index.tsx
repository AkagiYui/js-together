import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  beforeLoad(ctx) {
    console.log("beforeLoad", ctx)
  },
})
