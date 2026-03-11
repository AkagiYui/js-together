import { themeAtom } from "@/stores"
import { useAtom } from "jotai/react"
import { useEffect, useState } from "react"

type ThemeMode = "dark" | "light"

export const useThemeMode = () => {
  // 状态：主题设置值
  const [themeValue, setThemeValue] = useAtom<ThemeValue>(themeAtom)

  // 状态：系统主题
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    return mql.matches ? "dark" : "light"
  })

  // 监听系统主题变化
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)")

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    mql.addEventListener("change", handleThemeChange)

    return () => {
      mql.removeEventListener("change", handleThemeChange)
    }
  }, [])

  // 设置 body 属性
  useEffect(() => {
    let theme: ThemeMode
    switch (themeValue) {
      case 0:
        theme = "light"
        break
      case 1:
        theme = "dark"
        break
      case 2:
        theme = systemTheme
        break
      default:
        theme = "light"
    }
    if (theme === "dark") {
      document.body.setAttribute("theme-mode", "dark")
    } else if (theme === "light") {
      document.body.removeAttribute("theme-mode")
    }
  }, [themeValue, systemTheme])

  // 计算当前主题
  const theme: ThemeMode = themeValue === 2 ? systemTheme : themeValue === 1 ? "dark" : "light"

  // 设置主题值
  const setTheme = (value: ThemeValue) => {
    setThemeValue(value)
  }

  return {
    theme, // 当前实际生效的主题
    themeValue, // 主题设置值（0/1/2）
    systemTheme, // 系统当前的主题
    setTheme, // 设置主题值
    isDark: theme === "dark", // 是否是暗色主题
    isFollowingSystem: themeValue === 2, // 是否跟随系统
  }
}
