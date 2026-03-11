import { Group } from "@/components/Group"
import { useWorkOrderDetail } from "@/hooks"
import { useState } from "react"
import { BussinessButtons } from "./BussinessButtons"
import { UserOperate } from "./UserOperate"
import { WorkOrderButtons } from "./WorkOrderButtons"

export const ButtonBar = ({ id: workOrderId }: { id: number }) => {
  const { data } = useWorkOrderDetail(workOrderId)

  const userOpreatePanelVisibleState = useState(false)
  const [userOpreatePanelVisible, setUserOpreatePanelVisible] = userOpreatePanelVisibleState

  return (
    <>
      {data && (
        <UserOperate
          data={data.user}
          show={userOpreatePanelVisible}
          onClose={() => setUserOpreatePanelVisible(false)}
        />
      )}
      <Group justify="between">
        <BussinessButtons id={workOrderId} userOperatePanelVisibleState={userOpreatePanelVisibleState} />
        <WorkOrderButtons id={workOrderId} />
      </Group>
    </>
  )
}
