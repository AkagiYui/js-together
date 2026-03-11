import { Tag } from "@douyinfe/semi-ui"

export const TypeTag = ({ type }: { type?: WorkOrderType }) => {
  const tagConfig = {
    tech: { color: "blue", text: "技术支持" },
    expense: { color: "green", text: "财务费用" },
    reward: { color: "grey", text: "其他申请" },
    sales: { color: "amber", text: "售前咨询" },
    feedback: { color: "teal", text: "意见反馈" },
    "": { color: "white", text: "未知" },
  } as const
  const tagProps = tagConfig[type || ""]
  if (!tagProps) {
    return type
  }
  return (
    <Tag {...tagProps} style={{ userSelect: "text" }}>
      {tagProps.text}
    </Tag>
  )
}
