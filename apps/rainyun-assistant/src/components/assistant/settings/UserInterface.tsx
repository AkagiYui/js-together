import { showWorkOrderRemarkAtom, showUserRemarkAtom } from "@/stores"
import { Switch, Typography } from "@douyinfe/semi-ui"
import { useAtom } from "jotai/react"
import { Group } from "@/components/Group"

export const UserInterface = () => {
  const [shoWorkOrderRemark, setShoworkOrderRemark] = useAtom(showWorkOrderRemarkAtom)
  const [showUserRemark, setShowUserRemark] = useAtom(showUserRemarkAtom)

  const { Title, Text } = Typography
  return (
    <>
      <Title heading={2}>界面功能</Title>
      <Group align="center">
        <Title heading={6}>显示工单备注</Title>
        <Switch checked={shoWorkOrderRemark} onChange={setShoworkOrderRemark} aria-label="显示工单备注" />
      </Group>
      <Group align="center">
        <Title heading={6}>显示用户备注</Title>
        <Switch checked={showUserRemark} onChange={setShowUserRemark} aria-label="显示用户备注" />
      </Group>
    </>
  )
}
