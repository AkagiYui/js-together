import { workOrderTableTypeFilterAtom } from "@/stores"
import { Select } from "@douyinfe/semi-ui"
import { useAtom } from "jotai"
import { TypeTag } from "../TypeTag"

export const TableTypeSelector = () => {
  // 本地筛选

  const [tableTypeFilter, setTableTypeFilter] = useAtom(workOrderTableTypeFilterAtom)

  const handleChange = (value: any) => {
    setTableTypeFilter(value as WorkOrderType | undefined)
  }

  return (
    <Select value={tableTypeFilter} style={{ width: 120 }} onChange={handleChange} clickToHide>
      <Select.Option value={undefined} label={"所有类型"} />
      <Select.Option value={"tech"}>
        <TypeTag type={"tech"} />
      </Select.Option>
      <Select.Option value={"expense"}>
        <TypeTag type={"expense"} />
      </Select.Option>
      <Select.Option value={"reward"}>
        <TypeTag type={"reward"} />
      </Select.Option>
      <Select.Option value={"sales"}>
        <TypeTag type={"sales"} />
      </Select.Option>
      <Select.Option value={"feedback"}>
        <TypeTag type={"feedback"} />
      </Select.Option>
    </Select>
  )
}
