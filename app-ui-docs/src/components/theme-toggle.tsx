import { useTheme } from "next-themes";

import { Button, MoonIcon, SunIcon } from "@akagiyui/ui-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="切换主题"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}