import React from "react"

interface GroupProps {
  /**
   * 子元素
   */
  children?: React.ReactNode
  /**
   * 是否纵向排列
   */
  vertical?: boolean
  /**
   * 横向对齐方式
   */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  /**
   * 纵向对齐方式
   */
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  /**
   * 间距
   */
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
  /**
   * 是否允许换行
   */
  wrap?: boolean
  /**
   * 自定义类名
   */
  className?: string
}

export const Group = ({
  children,
  vertical = false,
  justify = "start",
  align = undefined,
  gap = 2,
  wrap = false,
  className = "",
}: GroupProps) => {
  // 根据direction决定flex方向
  const flexDirection = vertical ? "flex-col" : "flex-row"

  // 根据justify决定横向对齐方式
  const justifyMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  }

  // 根据align决定纵向对齐方式
  const alignMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  }

  // 间距映射
  const gapMap = {
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
    12: "gap-12",
    16: "gap-16",
  }

  // 构建className
  const containerClassName = (
    [
      "flex",
      flexDirection,
      justifyMap[justify],
      align ? alignMap[align] : "",
      gapMap[gap] || "gap-4",
      wrap ? "flex-wrap" : "",
      className,
    ] as const
  )
    .filter(Boolean)
    .map((item) => item?.trim())
    .join(" ")

  return <div className={containerClassName}>{children}</div>
}
