import { useThemeMode } from "@/hooks"
import { Button, Tooltip } from "@douyinfe/semi-ui"
import { IconSun, IconMoon, IconFont, IconWrench } from "@douyinfe/semi-icons"
import { useAtom } from "jotai"
import { debugModeAtom } from "@/stores"

interface Props {
  className?: string
}

export const DebugModeToggleButton = ({ className = "" }: Props) => {
  const [debugMode, setDebugMode] = useAtom(debugModeAtom)

  const toggleDebugMode = () => {
    setDebugMode(!debugMode)
  }

  return (
    <Tooltip content={() => (debugMode ? "已开启" : "已关闭") + "调试模式"}>
      <Button
        className={className}
        onClick={toggleDebugMode}
        icon={<IconWrench />}
        theme="outline"
        type={debugMode ? "warning" : "primary"}
        aria-label="Toggle Debug Mode"
      />
    </Tooltip>
  )
}
