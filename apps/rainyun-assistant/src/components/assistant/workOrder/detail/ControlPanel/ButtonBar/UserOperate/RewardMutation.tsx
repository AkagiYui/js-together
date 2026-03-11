import { Group } from "@/components/Group"
import { IconGift, IconMinus, IconPlus } from "@douyinfe/semi-icons"
import { InputGroup, AutoComplete, ButtonGroup, Button } from "@douyinfe/semi-ui"

export const RewardMutation = ({ userId }) => {
  return (
    <Group className="w-full">
      <InputGroup className="w-full">
        <AutoComplete
          prefix={<IconGift />}
          data={["10000"]}
          placeholder="积分变动"
          showClear
          className="min-w-22 max-w-30"
        />
        <AutoComplete data={["视频奖励", "文章奖励", "友链奖励"]} placeholder="原因" className="flex-1" />
      </InputGroup>
      <ButtonGroup style={{ flexWrap: "nowrap" }}>
        <Button icon={<IconPlus />}></Button>
        <Button icon={<IconMinus />}></Button>
      </ButtonGroup>
    </Group>
  )
}
