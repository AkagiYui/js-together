import { createRoot } from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import "normalize.css/normalize.css"

// 该文件会被自动生成
import { routeTree } from "./routeTree.gen"

const router = createRouter({
  routeTree: routeTree,
})

// 注册 Typescript 提示
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />)

router.subscribe("onBeforeLoad", (route) => {
  console.debug("route", route.toLocation)
})
