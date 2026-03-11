import {
  ignoreWorkOrderMapAtom,
  workOrderProductMapAtom,
  workOrderQueueCollapsedAtom,
  workOrderQueueSelectedKeysAtom,
  workOrderTableStatusFilterAtom,
} from "@/stores"
import { IconHome } from "@douyinfe/semi-icons"
import { Divider, Nav } from "@douyinfe/semi-ui"
import { useAtom, useAtomValue } from "jotai"
import { useMemo } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleNodes,
  faCube,
  faDatabase,
  faGamepad,
  faGlobe,
  faKey,
  faQuestion,
  faServer,
  faVectorSquare,
} from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "@tanstack/react-router"
import { useWorkOrderList } from "@/hooks"

const TypeIcon = ({ type = "", status }: { type: ProductType; status: WorkOrderStatus }) => {
  const iconMap = {
    "": [faQuestion, "pt-0.4 pl-1.2"],
    rvh: [faServer, "pt-0.4 pl-0.3"],
    rcs: [faCube, "pt-0.4 pl-0.3"],
    rbm: [faVectorSquare, "pt-0.4 pl-0.6"],
    rgs: [faGamepad, "pt-0.4 ml--0.3"],
    domain: [faGlobe, "pt-0.4 pl-0.3"],
    rcdn: [faCircleNodes, "pt-0.4 pl-0.3"],
    ros: [faDatabase, "pt-0.4 pl-0.5"],
    ssl: [faKey, "pt-0.4 pl-0.3"],
  } as const
  const iconInfo = iconMap[type]
  return (
    <FontAwesomeIcon
      className={iconInfo[1]}
      icon={iconInfo[0]}
      size="lg"
      shake={status === "waiting"}
      color={status === "waiting" ? "var(--semi-color-warning)" : undefined}
    />
  )
}

export const WorkOrderQueue = () => {
  const router = useRouter()
  const [collapsed, setCollapsed] = useAtom(workOrderQueueCollapsedAtom)
  const workOrderQueueSelectedKeys = useAtomValue(workOrderQueueSelectedKeysAtom)
  const workOrderProductMap = useAtomValue(workOrderProductMapAtom)
  const tableStatusFilter = useAtomValue(workOrderTableStatusFilterAtom)
  const { data: workOrderList } = useWorkOrderList({ status: tableStatusFilter })
  const ignoreWorkOrderMap = useAtomValue(ignoreWorkOrderMapAtom)

  const navItems: {
    id: number
    type: ProductType
    status: WorkOrderStatus
    title: string
  }[] = useMemo(() => {
    const originWorkOrders = workOrderList?.records || []

    // 过滤掉已经忽略的工单，和已经结单的工单，如果状态搜索条件是 finished，则不过滤
    const filteredWorkOrders = originWorkOrders.filter((workOrder) => {
      if (ignoreWorkOrderMap[workOrder.id]) {
        return false
      }
      if (tableStatusFilter === "finished") {
        return true
      }
      return workOrder.status !== "finished"
    })

    // 按照 status 排序，waiting 在前，handling 在中，answered 在后，finished 在最后
    const sortedWorkOrders = [...filteredWorkOrders].sort((a, b) => {
      const statusOrder = { waiting: 0, handling: 1, answered: 2, finished: 3 }
      return statusOrder[a.status] - statusOrder[b.status]
    })

    // 按照排序后的工单列表生成 navItems
    const items = sortedWorkOrders.map(
      (workOrder) =>
        ({
          id: workOrder.id,
          type: workOrderProductMap[workOrder.id] || "",
          status: workOrder.status,
          title: workOrder.title,
        }) as const,
    )

    return items
  }, [workOrderList, ignoreWorkOrderMap, workOrderProductMap])

  return (
    <Nav
      className="h-full max-w-220"
      selectedKeys={workOrderQueueSelectedKeys}
      isCollapsed={collapsed}
      onCollapseChange={setCollapsed}
    >
      <Nav.Item
        itemKey={-1}
        text="工单列表"
        icon={<IconHome size="large" />}
        onClick={() => router.navigate({ href: `/assistant/workorder` })}
      />
      <Divider className="" />
      {navItems.map((workOrder) => (
        <Nav.Item
          key={workOrder.id}
          itemKey={workOrder.id}
          text={workOrder.title}
          icon={<TypeIcon type={workOrder.type} status={workOrder.status} />}
          onClick={() => router.navigate({ href: `/assistant/workorder/${workOrder.id}` })}
        />
      ))}
      <Nav.Footer collapseButton collapseText={(collapsed) => (collapsed ? "展开队列" : "折叠队列")}></Nav.Footer>
    </Nav>
  )
}
