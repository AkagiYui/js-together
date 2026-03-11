import { IconHeart } from "@douyinfe/semi-icons-lab"
import { Button, Divider, Layout, Space } from "@douyinfe/semi-ui"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudSunRain } from "@fortawesome/free-solid-svg-icons"
import { useThemeMode } from "@/hooks"
import { ThemeToggleButton } from "@/components/ThemeToggleButton"

export const Header = () => {
  const { isDark } = useThemeMode()

  return (
    <Layout.Header className="sticky top-0 z-50">
      <Space className="mx-2 w-max  flex items-center gap-2 flex-wrap">
        {/* <FontAwesomeIcon icon={faCloudSunRain} style={isDark ? { color: "#ffffff" } : {}} /> */}
        <img src="/img/icons/favicon-color.svg" alt="logo" style={{ height: "36px" }} />
        <h3>欢迎使用 </h3>
        <h1>雨云助手</h1>
        <h3> ！</h3>
        <Button icon={<IconHeart />} aria-label="截屏" />
        <ThemeToggleButton className="ml-auto" />
      </Space>
      <Divider />
    </Layout.Header>
  )
}
