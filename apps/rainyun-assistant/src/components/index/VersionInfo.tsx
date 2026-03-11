import { Button, Space } from "@douyinfe/semi-ui"
import { Typography } from "@douyinfe/semi-ui"
import { Divider } from "@douyinfe/semi-ui"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { useSourceInfo } from "@/hooks"

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: undefined,
    minute: undefined,
    second: undefined,
    hour12: false,
  })
}

export function VersionInfo() {
  const { commitId, commitTime } = useSourceInfo()
  const { Text } = Typography

  return (
    <Space className="w-full justify-center" align="end">
      <FontAwesomeIcon icon={faCodeBranch} />
      <Text>{commitId}</Text>
      <Divider layout="vertical" />
      <FontAwesomeIcon icon={faClock} />
      <Text>{formatDate(commitTime)}</Text>
    </Space>
  )
}
