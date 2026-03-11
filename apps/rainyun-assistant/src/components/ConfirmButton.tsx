import { Button } from "@douyinfe/semi-ui"
import { ButtonProps } from "@douyinfe/semi-ui/lib/es/button"
import { useMemo, useState } from "react"

type Props = {
  children?: React.ReactNode
  onConfirm?: () => void
  confirmTimeout?: number
  confirmIcon?: ButtonProps["icon"]
} & ButtonProps

export const ConfirmButton = ({ children, confirmTimeout = 3000, onConfirm, ...rest }: Props) => {
  const [buttonState, setButtonState] = useState<"idle" | "confirming">("idle")

  let timer
  const handleClick = () => {
    if (buttonState === "idle") {
      setButtonState("confirming")
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        setButtonState("idle")
      }, confirmTimeout)
    } else if (buttonState === "confirming") {
      clearTimeout(timer)
      onConfirm && onConfirm()
      setButtonState("idle")
    }
  }

  const icon = useMemo(() => {
    if (buttonState === "confirming" && rest.confirmIcon) {
      return rest.confirmIcon
    }
    return rest.icon
  }, [buttonState, rest.confirmIcon, rest.icon])

  return (
    <Button {...rest} theme={buttonState === "confirming" ? "solid" : undefined} onClick={handleClick} icon={icon}>
      {children}
    </Button>
  )
}
