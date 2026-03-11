import { useWorkOrderList } from "@/hooks"

import { Table, Space, Button, Tag, Tooltip } from "@douyinfe/semi-ui"
import { IconCustomerSupport, IconEyeClosedSolid } from "@douyinfe/semi-icons"
import { useAtom, useAtomValue } from "jotai"
import {
  ignoreWorkOrderMapAtom,
  userRemarkAtom,
  workOrderRemarkAtom,
  workOrderTableStatusFilterAtom,
  workOrderTableTypeFilterAtom,
} from "@/stores"
import { Link } from "@tanstack/react-router"
import { UserLevelIcon } from "../UserLevelIcon"
import { StatusTag } from "./StatusTag"
import { TypeTag } from "./TypeTag"

const { Column } = Table

export function WorkOrderTable() {
  const tableStatusFilter = useAtomValue(workOrderTableStatusFilterAtom)
  const tableTypeFilter = useAtomValue(workOrderTableTypeFilterAtom)
  const { data: workOrderList } = useWorkOrderList({ status: tableStatusFilter })

  const [ignoreWorkOrderMap, setIgnoreWorkOrderMap] = useAtom(ignoreWorkOrderMapAtom)
  const workOrderRemark = useAtomValue(workOrderRemarkAtom)
  const userRemark = useAtomValue(userRemarkAtom)

  const data = workOrderList?.records.filter(
    // ignoreWorkOrderMap中不存在，且tableTypeFilter为undefined或者与当前工单类型相同
    (item) => !ignoreWorkOrderMap[item.id] && (!tableTypeFilter || item.type === tableTypeFilter),
  )

  const renderTitle = (text, record: WorkOrder, index) => {
    return (
      <Space className="w-full">
        <UserLevelIcon level={record.user.level} />
        <div className="min-h-[3rem] flex items-center">
          <span className="line-clamp-2 leading-6">{text}</span>
        </div>
      </Space>
    )
  }

  const renderUserId = (text, record: WorkOrder, index) => {
    const remark = userRemark[record.user.id]
    const tag = (
      <Tag color={remark ? "red" : "white"} className="w-15 justify-center" style={{ userSelect: "text" }}>
        {text}
      </Tag>
    )
    return <Tooltip content={`${record.user.username}${remark ? ` ${remark}` : ""}`}>{tag}</Tooltip>
  }

  const renderId = (text, record: WorkOrder, index) => {
    const remark = workOrderRemark[record.id]
    const tag = (
      <Tag color={remark ? "red" : "white"} style={{ userSelect: "text" }}>
        {text}
      </Tag>
    )
    return remark ? <Tooltip content={remark}>{tag}</Tooltip> : tag
  }

  const renderStatus = (text, record: WorkOrder, index) => {
    return <StatusTag status={text} shape="circle" />
  }

  const renderTime = (text, record: WorkOrder, index) => {
    return <div>{new Date(text * 1000).toLocaleString()}</div>
  }

  const renderType = (text, record: WorkOrder, index) => {
    return <TypeTag type={text} />
  }

  const renderOperate = (text, record: WorkOrder, index) => {
    const url = `/assistant/workorder/${record.id}`
    return (
      <Space>
        <Link href={url} preload="intent">
          <Button theme="solid" icon={<IconCustomerSupport />} />
        </Link>
        <Button
          icon={<IconEyeClosedSolid />}
          onClick={() => {
            setIgnoreWorkOrderMap((prev) => ({ ...prev, [record.id]: record }))
          }}
        >
          忽略
        </Button>
      </Space>
    )
  }

  return (
    <div>
      <Table dataSource={data} pagination={false} sticky size={"small"}>
        <Column title="标题" dataIndex="title" key="title" render={renderTitle} />
        <Column title="用户ID" dataIndex="user.id" key="userId" width={80} render={renderUserId} />
        <Column title="工单ID" dataIndex="id" key="id" width={80} render={renderId} />
        <Column title="类型" dataIndex="type" key="type" render={renderType} width={100} />
        <Column title="状态" dataIndex="status" key="status" render={renderStatus} width={100} />
        <Column
          title="提交时间"
          dataIndex="time"
          key="time"
          render={renderTime}
          width={170}
          className="whitespace-nowrap"
        />
        <Column dataIndex="operate" key="operate" render={renderOperate} width={150} />
      </Table>
    </div>
  )
}
