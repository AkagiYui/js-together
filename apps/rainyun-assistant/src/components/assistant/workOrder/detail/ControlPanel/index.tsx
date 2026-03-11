import { Group } from "@/components/Group"
import { useWorkOrderDetail } from "@/hooks"
import { Typography } from "@douyinfe/semi-ui"

import { TagBar } from "./TagBar"
import { ButtonBar } from "./ButtonBar"
import { showWorkOrderRemarkAtom, workOrderProductMapAtom } from "@/stores"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { WorkOrderRemark } from "./WorkOrderRemark"

export const ControlPanel = ({ id: workOrderId }: { id: number }) => {
  const { data } = useWorkOrderDetail(workOrderId)
  const setWorkOrderProductMap = useSetAtom(workOrderProductMapAtom)
  const showWorkOrderRemark = useAtomValue(showWorkOrderRemarkAtom)

  useEffect(() => {
    if (data) {
      setWorkOrderProductMap((prev) => {
        return { ...prev, [data.id]: data.relatedProductType }
      })
    }
  }, [data])

  return (
    <Group vertical className="p-2 w-full bg-[var(--semi-color-nav-bg)] box-border">
      {data && <TagBar data={data} />}
      <Typography.Title heading={2}>{data?.title}</Typography.Title>
      {data && <ButtonBar id={workOrderId} />}
      {data && showWorkOrderRemark && <WorkOrderRemark workOrderId={data.id} />}
    </Group>
  )
}
