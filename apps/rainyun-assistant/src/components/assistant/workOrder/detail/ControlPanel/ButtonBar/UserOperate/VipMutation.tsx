import { Group } from "@/components/Group"
import { IconMember, IconPlus } from "@douyinfe/semi-icons"
import { InputGroup, AutoComplete, Button } from "@douyinfe/semi-ui"
import { faCreativeCommonsNcJp } from "@fortawesome/free-brands-svg-icons"
import { faYenSign } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

const FontAwsomeInputIcon = ({ icon }) => {
  return <FontAwesomeIcon icon={icon} className="w-16px" />
}

const switchStyle = `.semi-switch-checked {
  background-color: var(--semi-color-primary);
}
.semi-switch-checked:hover {
  background-color: var(--semi-color-primary-hover);
}
.semi-switch-checked:active {
  background-color: var(--semi-color-primary-active);
}`

export const VipMutation = ({ userId }) => {
  const [open, setOpen] = useState(false)

  return (
    <Group className="w-full">
      <style>{switchStyle}</style>
      <InputGroup>
        <AutoComplete
          prefix={<IconMember />}
          data={["5", "4", "3", "2", "1"]}
          className="min-w-22 max-w-40"
          suffix="用户等级"
        />
      </InputGroup>
      <Button
        theme={open ? "solid" : "light"}
        onClick={() => {
          setOpen(!open)
        }}
        icon={open ? <FontAwsomeInputIcon icon={faYenSign} /> : <FontAwsomeInputIcon icon={faCreativeCommonsNcJp} />}
      >
        {open ? "将设为代理" : "将取消代理"}
      </Button>
      <Button className="ml-auto" icon={<IconPlus />}>
        设置
      </Button>
    </Group>
  )
}
