import { IconEyeClosed, IconRefresh } from "@douyinfe/semi-icons"
import { Button } from "@douyinfe/semi-ui"
import { TableStatusSelector } from "./TableStatusSelector"
import { useWorkOrderList } from "@/hooks"
import { useAtomValue } from "jotai"
import { ignoreWorkOrderMapAtom, workOrderTableStatusFilterAtom } from "@/stores"
import { Group } from "@/components/Group"
import { TableTypeSelector } from "./TableTypeSelector"
import { IgnoreModal } from "./IgnoreModal"
import { useState } from "react"

export const ControlBar = () => {
  const tableStatusFilter = useAtomValue(workOrderTableStatusFilterAtom)
  const ignoreWorkOrderMap = useAtomValue(ignoreWorkOrderMapAtom)
  const { refetch } = useWorkOrderList({ status: tableStatusFilter })

  const ignoreMapSize = Object.keys(ignoreWorkOrderMap).length

  const [showIgnoreModal, setShowIgnoreModal] = useState(false)

  return (
    <>
      <IgnoreModal
        show={showIgnoreModal}
        onCloseClick={() => {
          setShowIgnoreModal(false)
        }}
      />
      <Group
        justify="between"
        className="p-2 w-full bg-[var(--semi-color-nav-bg)] border-0 border-b border-[var(--semi-color-border)] border-solid"
      >
        <Group>
          <Button
            icon={<IconRefresh />}
            onClick={() => {
              refetch()
            }}
          >
            刷新
          </Button>
          <TableStatusSelector />
          <TableTypeSelector />
        </Group>
        <Group>
          <Button
            icon={<IconEyeClosed />}
            onClick={() => {
              setShowIgnoreModal(true)
            }}
          >
            忽略列表{!!ignoreMapSize ? ` ${ignoreMapSize}` : ""}
          </Button>
        </Group>
      </Group>
    </>
  )
}
