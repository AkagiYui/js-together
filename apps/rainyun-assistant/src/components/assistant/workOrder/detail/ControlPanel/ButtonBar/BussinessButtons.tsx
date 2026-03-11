import { ProductTypeIcon } from "@/components/assistant/ProductTypeIcon"
import { UserLevelIcon } from "@/components/assistant/UserLevelIcon"
import { Group } from "@/components/Group"
import { useWorkOrderDetail } from "@/hooks"
import { userRemarkAtom } from "@/stores"
import { copyToClipboard, getProductDisplayName } from "@/utils"
import { IconLock, IconPaperclip, IconUnlock } from "@douyinfe/semi-icons"
import { Avatar, Button, SplitButtonGroup, Toast, Tooltip } from "@douyinfe/semi-ui"
import { faCloudSunRain } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
export const BussinessButtons = ({
  id: workOrderId,
  userOperatePanelVisibleState,
}: {
  id: number
  userOperatePanelVisibleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}) => {
  const { data } = useWorkOrderDetail(workOrderId)
  const [visible, setVisible] = userOperatePanelVisibleState
  const userRemarks = useAtomValue(userRemarkAtom)

  const productDisplayName = useMemo(() => {
    return getProductDisplayName(data?.relatedProductType || "")
  }, [data?.relatedProductType])
  const officialProductUrl = useMemo(() => {
    const suffix =
      {
        ros: "instance",
        rcdn: "instance/overview",
        domain: "manage/dns",
      }[data?.relatedProductType || ""] || "detail"
    return `https://app.rainyun.com/apps/${data?.relatedProductType}/${data?.relatedProductID}/${suffix}`
  }, [data?.relatedProductType, data?.relatedProductID])

  const copyProductLink = async () => {
    const opts = { duration: 3, stack: true }
    try {
      await copyToClipboard(officialProductUrl)
      Toast.success({
        content: "已复制产品链接",
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
      {/* 产品信息按钮组 */}
      {data?.relatedProductID ? (
        <SplitButtonGroup aria-label="产品信息按钮组">
          <Button
            theme="light"
            type="primary"
            icon={<ProductTypeIcon type={data.relatedProductType} />}
            onClick={() => {
              Toast.info({
                content: "暂不支持在雨云助手中查看产品详情",
                duration: 3,
                stack: true,
              })
            }}
          >
            {`${productDisplayName} ${data?.relatedProductID}`}
          </Button>

          <Tooltip content={new Date(data?.auth.time * 1000).toLocaleString()}>
            <Button type="primary" icon={data?.auth.status === "valid" ? <IconUnlock /> : <IconLock />}>
              {data?.auth.status === "valid" ? "已授权" : data?.auth.status === "cancel" ? "被撤销" : "未授权"}
            </Button>
          </Tooltip>

          <Tooltip content="在雨云打开">
            <Button
              theme="light"
              type="primary"
              icon={<FontAwesomeIcon icon={faCloudSunRain} />}
              onClick={() => {
                window.open(officialProductUrl, "_blank")
              }}
            ></Button>
          </Tooltip>
          <Tooltip content="复制链接">
            <Button theme="light" type="primary" icon={<IconPaperclip />} onClick={copyProductLink}></Button>
          </Tooltip>
        </SplitButtonGroup>
      ) : (
        <Button theme="outline">未关联产品</Button>
      )}

      {/* 用户信息按钮组 */}
      {data && (
        <SplitButtonGroup aria-label="用户按钮组">
          <Button
            icon={<UserLevelIcon level={data.user.level || "0"} />}
            onClick={() => {
              setVisible(!visible)
            }}
            type={userRemarks[data.user.id] ? "danger" : "primary"}
          >
            {data?.user.username || "未登录"} {data?.user.id || data?.user.extUserInfo}
          </Button>

          {false && data?.user.avatarUrl && (
            <Button>
              <Avatar size="extra-extra-small" src={data?.user.avatarUrl}>
                {data?.user.username.slice(0, 1)}
              </Avatar>
            </Button>
          )}
        </SplitButtonGroup>
      )}
    </Group>
  )
}
