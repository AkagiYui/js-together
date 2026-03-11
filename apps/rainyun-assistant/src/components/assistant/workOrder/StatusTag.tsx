import { IconTickCircle, IconAlertTriangle, IconComment, IconQuit } from "@douyinfe/semi-icons"
import { Tag } from "@douyinfe/semi-ui"
import { TagShape } from "@douyinfe/semi-ui/lib/es/tag/interface"

export const StatusTag = ({ status, shape }: { status?: WorkOrderStatus; shape?: TagShape }) => {
  const tagConfig = {
    answered: { color: "green", prefixIcon: <IconTickCircle />, text: "已回答" },
    handling: { color: "blue", prefixIcon: <IconAlertTriangle />, text: "被挂起" },
    waiting: { color: "orange", prefixIcon: <IconComment />, text: "待回答" },
    finished: { color: "grey", prefixIcon: <IconQuit />, text: "已结单" },
    "": { color: "white", text: "未知状态" },
  } as const

  const tagProps = tagConfig[status || ""]
  if (!tagProps) {
    return status
  }

  return (
    <Tag {...tagProps} shape={shape} style={{ userSelect: "text" }}>
      {tagProps.text}
    </Tag>
  )
}
