import { IconUserGroup } from "@douyinfe/semi-icons"

import { Space, Tag, Tooltip } from "@douyinfe/semi-ui"
import { useEffect, useState } from "react"

import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import "dayjs/locale/zh-cn"
import { StatusTag } from "../../StatusTag"
import { TypeTag } from "../../TypeTag"
import { formatDateTime } from "@/utils"

dayjs.extend(duration)
dayjs.locale("zh-cn")

const UrgentTag = ({ isUrgent }: { isUrgent: boolean }) => {
  return (
    <Tag color={isUrgent ? "red" : "grey"} style={{ userSelect: "text" }}>
      {isUrgent ? "紧急" : "非紧急"}
    </Tag>
  )
}

const TimeTag = ({ time }: { time: number }) => {
  return (
    <Tag color="grey" style={{ userSelect: "text" }}>
      发起时间 {formatDateTime(time)}
    </Tag>
  )
}

const LastTimeTag = ({ time }: { time: number }) => {
  return (
    <Tag color="grey" style={{ userSelect: "text" }}>
      最近消息 {formatDateTime(time)}
    </Tag>
  )
}

const WaitBeginTimeTag = ({ waitBeginTime }: { waitBeginTime: number }) => {
  const [waitTimeStr, setWaitTimeStr] = useState("")
  const [waitTime, setWaitTime] = useState(0)

  useEffect(() => {
    // 更新等待时间的函数
    const updateWaitTime = () => {
      const now = new Date().getTime() / 1000
      const waitTime = now - waitBeginTime
      const formattedTime = dayjs
        .duration(waitTime, "seconds")
        .format("H[小时]m[分]s[秒]")
        .replace(/\b0秒\b/, "")
        .replace(/\b0分\b/, "")
        .replace(/\b0小时\b/, "")
      setWaitTime(waitTime)
      setWaitTimeStr(formattedTime)
    }

    // 首次执行
    updateWaitTime()

    // 设置定时器，每秒更新一次
    const timer = setInterval(updateWaitTime, 1000)

    // 清理函数
    return () => {
      clearInterval(timer)
    }
  }, [waitBeginTime]) // 依赖项中加入 waitBeginTime

  return (
    <Tag color={waitTime > 10 * 60 ? "red" : waitTime > 7 * 60 ? "orange" : "cyan"} style={{ userSelect: "text" }}>
      已等待 <span className="font-mono">{waitTimeStr}</span>
    </Tag>
  )
}

const AssistTag = ({ assistID }: { assistID: number }) => {
  return (
    <Tooltip content="转接人">
      <Tag color="grey" style={{ userSelect: "text" }} prefixIcon={<IconUserGroup />}>
        {assistID}
      </Tag>
    </Tooltip>
  )
}

export const TagBar = ({ data }: { data: WorkOrderDetail }) => {
  return (
    <Space wrap>
      <StatusTag status={data.status} />
      <UrgentTag isUrgent={data.isUrgent} />
      <TypeTag type={data.type} />
      {data.status === "waiting" && <WaitBeginTimeTag waitBeginTime={data.waitBeginTime} />}
      <TimeTag time={data.time} />
      <LastTimeTag time={data.lastTime} />
      {!!data.assistId && <AssistTag assistID={data.assistId} />}
    </Space>
  )
}
