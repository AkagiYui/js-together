import { Icon, type IconProps } from "@iconify/react"

import { cn } from "../../lib/utils"

/**
 * 图标统一封装层。
 *
 * 本库不直接依赖 `lucide-react`，而是通过 Iconify 的 lucide 图标集
 * （`@iconify-icons/lucide` 数据 + `@iconify/react` 渲染）提供图标。
 *
 * 这里按 lucide-react 的既有命名导出同名组件，使各组件源码与调用方零感知：
 *   - 带后缀的（`CheckIcon`、`ChevronDownIcon`…）保留原名
 *   - 不带后缀的（`ChevronRight`、`ArrowLeft`、`MoreHorizontal`）也保留原名
 *
 * 说明：组件名沿用原 `lucide-react@1.x`（新命名）导出名，但 `@iconify-icons/lucide`
 * 数据包用的是 lucide 旧版图标名，故下列图标需做新旧名映射：
 *   - `Loader2Icon`（新名 loader-circle）→ 旧数据 `loader-2`
 *   - `MoreHorizontal[Icon]`（新名 ellipsis）→ 旧数据 `more-horizontal`
 *   - `CircleCheckIcon`（新名 circle-check）→ 旧数据 `check-circle-2`
 *   - `TriangleAlertIcon`（新名 triangle-alert）→ 旧数据 `alert-triangle`
 *   - `OctagonXIcon`（新名 octagon-x）→ 旧数据 `x-octagon`
 */

/** 由 Iconify 图标数据构造一个接受 className / SVG props 的 React 组件。 */
function makeIcon(icon: object, displayName: string) {
  const Comp = ({ className, ...props }: Omit<IconProps, "icon">) => (
    <Icon icon={icon as never} className={cn(className)} {...props} />
  )
  Comp.displayName = displayName
  return Comp
}

import check from "@iconify-icons/lucide/check"
import chevronDown from "@iconify-icons/lucide/chevron-down"
import chevronLeft from "@iconify-icons/lucide/chevron-left"
import chevronRight from "@iconify-icons/lucide/chevron-right"
import chevronUp from "@iconify-icons/lucide/chevron-up"
import circle from "@iconify-icons/lucide/circle"
import x from "@iconify-icons/lucide/x"
import minus from "@iconify-icons/lucide/minus"
import gripVertical from "@iconify-icons/lucide/grip-vertical"
import loaderCircle from "@iconify-icons/lucide/loader-2"
import panelLeft from "@iconify-icons/lucide/panel-left"
import search from "@iconify-icons/lucide/search"
import arrowDown from "@iconify-icons/lucide/arrow-down"
import arrowLeft from "@iconify-icons/lucide/arrow-left"
import arrowRight from "@iconify-icons/lucide/arrow-right"
import ellipsis from "@iconify-icons/lucide/more-horizontal"
import circleCheck from "@iconify-icons/lucide/check-circle-2"
import info from "@iconify-icons/lucide/info"
import triangleAlert from "@iconify-icons/lucide/alert-triangle"
import octagonX from "@iconify-icons/lucide/x-octagon"
import moon from "@iconify-icons/lucide/moon"
import sun from "@iconify-icons/lucide/sun"
import terminal from "@iconify-icons/lucide/terminal"
import italic from "@iconify-icons/lucide/italic"
import underline from "@iconify-icons/lucide/underline"
import download from "@iconify-icons/lucide/download"
import bold from "@iconify-icons/lucide/bold"
import copy from "@iconify-icons/lucide/copy"

export const CheckIcon = makeIcon(check, "CheckIcon")
export const ChevronDownIcon = makeIcon(chevronDown, "ChevronDownIcon")
export const ChevronLeftIcon = makeIcon(chevronLeft, "ChevronLeftIcon")
export const ChevronRightIcon = makeIcon(chevronRight, "ChevronRightIcon")
export const ChevronUpIcon = makeIcon(chevronUp, "ChevronUpIcon")
export const ChevronRight = makeIcon(chevronRight, "ChevronRight")
export const CircleIcon = makeIcon(circle, "CircleIcon")
export const XIcon = makeIcon(x, "XIcon")
export const MinusIcon = makeIcon(minus, "MinusIcon")
export const GripVerticalIcon = makeIcon(gripVertical, "GripVerticalIcon")
export const Loader2Icon = makeIcon(loaderCircle, "Loader2Icon")
export const PanelLeftIcon = makeIcon(panelLeft, "PanelLeftIcon")
export const SearchIcon = makeIcon(search, "SearchIcon")
export const ArrowDownIcon = makeIcon(arrowDown, "ArrowDownIcon")
export const ArrowLeft = makeIcon(arrowLeft, "ArrowLeft")
export const ArrowRight = makeIcon(arrowRight, "ArrowRight")
export const MoreHorizontal = makeIcon(ellipsis, "MoreHorizontal")
export const MoreHorizontalIcon = makeIcon(ellipsis, "MoreHorizontalIcon")
export const CircleCheckIcon = makeIcon(circleCheck, "CircleCheckIcon")
export const InfoIcon = makeIcon(info, "InfoIcon")
export const TriangleAlertIcon = makeIcon(triangleAlert, "TriangleAlertIcon")
export const OctagonXIcon = makeIcon(octagonX, "OctagonXIcon")
export const MoonIcon = makeIcon(moon, "MoonIcon")
export const SunIcon = makeIcon(sun, "SunIcon")
export const TerminalIcon = makeIcon(terminal, "TerminalIcon")
export const ItalicIcon = makeIcon(italic, "ItalicIcon")
export const UnderlineIcon = makeIcon(underline, "UnderlineIcon")
export const DownloadIcon = makeIcon(download, "DownloadIcon")
export const BoldIcon = makeIcon(bold, "BoldIcon")
export const CopyIcon = makeIcon(copy, "CopyIcon")
