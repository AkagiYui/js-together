import { workOrderTableStatusFilterAtom } from "@/stores"
import { Select } from "@douyinfe/semi-ui"
import { useAtom } from "jotai"
import { StatusTag } from "../StatusTag"

export const TableStatusSelector = () => {
  const [tableStatusFilter, setTableStatusFilter] = useAtom(workOrderTableStatusFilterAtom)

  const handleChange = (value: any) => {
    setTableStatusFilter(value as WorkOrderStatus | undefined)
  }

  return (
    <Select value={tableStatusFilter} style={{ width: 120 }} onChange={handleChange} clickToHide>
      <Select.Option value={undefined} label={"所有状态"} />
      <Select.Option value={"waiting"}>
        <StatusTag status={"waiting"} shape="circle" />
      </Select.Option>
      <Select.Option value={"handling"}>
        <StatusTag status={"handling"} shape="circle" />
      </Select.Option>
      <Select.Option value={"answered"}>
        <StatusTag status={"answered"} shape="circle" />
      </Select.Option>
      <Select.Option value={"finished"}>
        <StatusTag status={"finished"} shape="circle" />
      </Select.Option>
    </Select>
  )
}
