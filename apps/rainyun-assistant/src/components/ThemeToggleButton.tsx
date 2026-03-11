import { useThemeMode } from "@/hooks"
import { Button, Tooltip } from "@douyinfe/semi-ui"
import { IconSun, IconMoon, IconFont } from "@douyinfe/semi-icons"

interface Props {
  className?: string
}

export const ThemeToggleButton = ({ className = "" }: Props) => {
  const { themeValue, setTheme } = useThemeMode()

  const toggleTheme = () => {
    const nextTheme = ((themeValue + 1) % 3) as ThemeValue
    setTheme(nextTheme)
  }

  return (
    <Tooltip
      content={() =>
        ({
          0: "亮色",
          1: "暗色",
          2: "跟随系统",
        })[themeValue]
      }
    >
      <Button
        className={className}
        onClick={toggleTheme}
        icon={themeValue === 0 ? <IconSun /> : themeValue === 1 ? <IconMoon /> : <IconFont />}
        aria-label="Toggle theme"
      />
    </Tooltip>
  )
}
