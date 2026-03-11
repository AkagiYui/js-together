import { UserLevelIcon } from "@/components/assistant/UserLevelIcon"
import { Group } from "@/components/Group"
import { copyToClipboard } from "@/utils"
import { IconPaperclip } from "@douyinfe/semi-icons"
import { ImagePreview, Avatar, Typography, Button, Toast } from "@douyinfe/semi-ui"
import { useState } from "react"

export const UserInfo = ({ data }: { data: WorkOrderDetail["user"] }) => {
  const [avatarPreviewVisible, setAvatarPreviewVisible] = useState(false)

  return (
    <>
      <Group align="center">
        <ImagePreview src={data.avatarUrl} visible={avatarPreviewVisible} onVisibleChange={setAvatarPreviewVisible} />
        <Avatar
          size="default"
          src={data.avatarUrl}
          onClick={() => {
            data.avatarUrl && setAvatarPreviewVisible(true)
          }}
        >
          {data.username.slice(0, 1)}
        </Avatar>
        <UserLevelIcon level={data.level || "0"} />
        <Typography.Title heading={6}>{data.username}</Typography.Title>
        <Button
          icon={<IconPaperclip />}
          onClick={async () => {
            try {
              await copyToClipboard(data.id)
              Toast.success("复制成功")
            } catch (e) {
              Toast.error("复制失败")
            }
          }}
        >
          {data.id}
        </Button>
      </Group>
      {data.email && <Typography.Text>用户邮箱：{data.email}</Typography.Text>}
      {data.extUserInfo && <Typography.Text>额外信息：{data.extUserInfo}</Typography.Text>}
    </>
  )
}
