import { ChatBox } from "@/components/assistant/workOrder/detail/ChatBox"
import { ControlPanel } from "@/components/assistant/workOrder/detail/ControlPanel"
import { InputBox } from "@/components/assistant/workOrder/detail/InputBox"
import { useWorkOrderDetail } from "@/hooks"
import { workOrderProductMapAtom, workOrderQueueSelectedKeysAtom } from "@/stores"
import { createFileRoute } from "@tanstack/react-router"
import { useSetAtom } from "jotai"
import { debounce } from "lodash"
import { useRef, useState, useCallback, useEffect } from "react"

export const Route = createFileRoute("/assistant/workorder/$id")({
  component: RouteComponent,
  staticData: {
    title: "工单详情",
  },
  loader: ({ params }) => {
    const workOrderId = Number(params.id)
    // 确保是有效数字
    if (isNaN(workOrderId)) {
      throw new Error("Invalid WorkOrder ID")
    }
    return { workOrderId }
  },
})

function RouteComponent() {
  const { workOrderId: id } = Route.useLoaderData()
  const { data } = useWorkOrderDetail(id)

  const setWorkOrderQueueSelectedKeys = useSetAtom(workOrderQueueSelectedKeysAtom)
  useEffect(() => {
    setWorkOrderQueueSelectedKeys([id])
  }, [id])

  const setWorkOrderProductMap = useSetAtom(workOrderProductMapAtom)
  useEffect(() => {
    if (data) {
      setWorkOrderProductMap((prev) => {
        return { ...prev, [data.id]: data.relatedProductType }
      })
    }
  }, [data])

  const containerRef = useRef<HTMLDivElement>(null)
  const [isCompact, setIsCompact] = useState(false)

  const checkHeight = useCallback(() => {
    if (containerRef.current) {
      setIsCompact(containerRef.current.offsetHeight < 500)
    }
  }, [])

  useEffect(() => {
    // 创建一个 200ms 的防抖函数
    const debouncedCheckHeight = debounce(checkHeight, 200)

    // 初始检查
    checkHeight()

    window.addEventListener("resize", debouncedCheckHeight)

    return () => {
      // 清理事件监听和取消可能正在进行的防抖调用
      window.removeEventListener("resize", debouncedCheckHeight)
      debouncedCheckHeight.cancel()
    }
  }, [checkHeight])

  useEffect(() => {
    console.log("isCompact", isCompact)
  }, [isCompact])

  const chatBoxRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [data?.discuss])

  return (
    <>
      <div className="h-full overflow-hidden">
        <div
          ref={containerRef}
          className={`h-full flex flex-col user-sidesheet-container overflow-hidden position-relative semi-light-scrollbar`}
        >
          <div className="border-0 border-b border-[var(--semi-color-border)] border-solid">
            <ControlPanel id={id} />
          </div>
          <div ref={chatBoxRef} className={`flex-1 overflow-auto scroll-smooth`}>
            <ChatBox id={id} />
          </div>
          <div className="border-0 border-t border-[var(--semi-color-border)] border-solid">
            <InputBox id={id} />
          </div>
        </div>
      </div>
    </>
  )
}
