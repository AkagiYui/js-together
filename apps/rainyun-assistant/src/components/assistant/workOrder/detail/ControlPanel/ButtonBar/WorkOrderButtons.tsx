import { Group } from "@/components/Group"
import { useWorkOrderDetail } from "@/hooks"
import { copyToClipboard } from "@/utils"
import { IconClose, IconPaperclip, IconRefresh } from "@douyinfe/semi-icons"
import { Button, SplitButtonGroup, Toast, Tooltip } from "@douyinfe/semi-ui"
import { faCloudSunRain } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "@tanstack/react-router"

export const WorkOrderButtons = ({ id: workOrderId }: { id: number }) => {
  const router = useRouter()
  const { refetch } = useWorkOrderDetail(workOrderId)

  const officialWorkOrderUrl = `https://app.rainyun.com/support/workorder/${workOrderId}`

  const copyWorkOrderLink = async () => {
    const opts = { duration: 3, stack: true }
    try {
      await copyToClipboard(officialWorkOrderUrl)
      Toast.success({
        content: "已复制工单链接",
        ...opts,
      })
    } catch (e) {
      console.error(e)
      Toast.error({
        content: "复制失败",
        ...opts,
      })
    }
  }

  return (
    <Group>
      {/* <Button
        icon={<IconRefresh />}
        onClick={() => {
          refetch()
        }}
      >
        刷新
      </Button> */}

      <SplitButtonGroup aria-label="工单链接按钮组">
        <Button icon={<IconPaperclip />} onClick={copyWorkOrderLink}>
          复制链接 {workOrderId}
        </Button>
        <Tooltip content="在雨云打开">
          <Button
            theme="light"
            type="primary"
            icon={<FontAwesomeIcon icon={faCloudSunRain} />}
            onClick={() => {
              window.open(officialWorkOrderUrl, "_blank")
            }}
          ></Button>
        </Tooltip>
      </SplitButtonGroup>

      <Button
        type="danger"
        icon={<IconClose />}
        onClick={() => {
          router.navigate({ href: "/assistant/workorder" })
        }}
      >
        返回
      </Button>
    </Group>
  )
}
