import { Layout, Space } from "@douyinfe/semi-ui"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudSunRain } from "@fortawesome/free-solid-svg-icons"
import { useThemeMode, useUserInfo } from "@/hooks"
import { ThemeToggleButton } from "@/components/ThemeToggleButton"

import { Nav, Avatar, Dropdown, Typography } from "@douyinfe/semi-ui"
import { IconFaq } from "@douyinfe/semi-icons-lab"
import { Link, useRouter } from "@tanstack/react-router"
import { DebugModeToggleButton } from "../DebugModeToggleButton"
import { IconBox, IconExit, IconSetting, IconUser } from "@douyinfe/semi-icons"

const Logo = () => {
  const { isDark } = useThemeMode()
  return <img src="/img/icons/favicon-color.svg" alt="logo" style={{ height: "36px" }} />
  // return <FontAwesomeIcon icon={faCloudSunRain} style={{ color: isDark ? "#ffffff" : "#54a9ff", height: "36px" }} />
}

export const Header = () => {
  const router = useRouter()
  const { data: userInfo } = useUserInfo()

  const AvatarWithMenu = () => {
    const url = userInfo?.iconUrl
    return (
      <Dropdown
        position="bottomRight"
        clickToHide
        render={
          <Dropdown.Menu>
            <Link to="/assistant/info" className="no-underline">
              <Dropdown.Item icon={<IconUser />}>个人信息</Dropdown.Item>
            </Link>

            <Link to="/assistant/settings" className="no-underline">
              <Dropdown.Item icon={<IconSetting />}>助手设置</Dropdown.Item>
            </Link>

            <Dropdown.Divider />
            <Dropdown.Item
              icon={<IconExit />}
              onClick={() => {
                router.navigate({ href: "/" })
              }}
            >
              退出助手
            </Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <Avatar size="small" color="light-blue" style={{ margin: 4 }} src={url}>
          {userInfo?.name.slice(0, 1)}
        </Avatar>
        <Typography.Text>{userInfo?.name}</Typography.Text>
      </Dropdown>
    )
  }

  return (
    <Layout.Header className="w-full">
      <Nav mode={"horizontal"}>
        <Link to="/assistant">
          <Nav.Header logo={<Logo />} />
        </Link>
        <Link to="/assistant/workorder" className="no-underline">
          <Nav.Item itemKey="workOrder">
            <Space>
              <IconFaq size="extra-large" />
              <span>工单</span>
            </Space>
          </Nav.Item>
        </Link>

        <Nav.Footer>
          <Space>
            <DebugModeToggleButton />
            <ThemeToggleButton />
            <AvatarWithMenu />
          </Space>
        </Nav.Footer>
      </Nav>
    </Layout.Header>
  )
}
