import { workOrderRemarkAtom } from "@/stores"
import { TextArea } from "@douyinfe/semi-ui"
import { useAtom } from "jotai"

export const WorkOrderRemark = ({ workOrderId }: { workOrderId: number }) => {
  const [remark, setRemark] = (() => {
    const [workOrderRemark, setWorkOrderRemark] = useAtom(workOrderRemarkAtom)
    return [
      workOrderRemark[workOrderId],
      (remark: string) => {
        setWorkOrderRemark((prev) => {
          if (remark) {
            return { ...prev, [workOrderId]: remark }
          }
          const { [workOrderId]: _, ...rest } = prev
          return rest
        })
      },
    ]
  })()

  return (
    <div>
      <TextArea
        value={remark}
        onChange={setRemark}
        autosize
        rows={1}
        placeholder="工单备注（离线记录，不跟随雨云账号）"
        className="w-full"
        showClear
      />
    </div>
  )
}
