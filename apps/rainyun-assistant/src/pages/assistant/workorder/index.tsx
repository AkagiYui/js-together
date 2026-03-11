import { createFileRoute } from "@tanstack/react-router"
import { WorkOrderTable } from "@/components/assistant/workOrder/WorkOrderTable"
import { ControlBar } from "@/components/assistant/workOrder/ControlBar"
import { useEffect, useRef, useState } from "react"
import { workOrderQueueSelectedKeysAtom } from "@/stores"
import { useSetAtom } from "jotai"

export const Route = createFileRoute("/assistant/workorder/")({
  component: RouteComponent,
  staticData: {
    title: "工单列表",
  },
})

function RouteComponent() {
  const setWorkOrderQueueSelectedKeys = useSetAtom(workOrderQueueSelectedKeysAtom)

  useEffect(() => {
    setWorkOrderQueueSelectedKeys([-1])
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div>
        <ControlBar />
      </div>
      <div className="flex-1 overflow-auto semi-light-scrollbar">
        <WorkOrderTable />
      </div>
    </div>
  )
}
