import { Group } from "@/components/Group"
import { IconMinus, IconPlus } from "@douyinfe/semi-icons"
import { InputGroup, Select, AutoComplete, ButtonGroup, Button } from "@douyinfe/semi-ui"
import { faYenSign } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const MoneyMutation = ({ userId }) => {
  return (
    <Group className="w-full">
      <InputGroup className="w-full">
        <AutoComplete
          data={["10000"]}
          prefix={<FontAwesomeIcon icon={faYenSign} className="mx-8px w-16px" color="var(--semi-color-text-2)" />}
          placeholder="余额变动"
          showClear
          className="min-w-22 max-w-30"
        />
        <AutoComplete data={["缴纳罚金", "域名退款", "对公转账", "退订"]} placeholder="原因" className="flex-1" />
        <Select className="w-26" defaultValue="home" clickToHide>
          <Select.Option value="home">手动充值</Select.Option>
          <Select.Option value="work">其他情况</Select.Option>
        </Select>
      </InputGroup>
      <ButtonGroup style={{ flexWrap: "nowrap" }}>
        <Button icon={<IconPlus />}></Button>
        <Button icon={<IconMinus />}></Button>
      </ButtonGroup>
    </Group>
  )
}
