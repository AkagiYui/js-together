import { useMemo } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faClock } from "@fortawesome/free-solid-svg-icons"
import DOMPurify from "dompurify"
import { Avatar, Tag, Typography } from "@douyinfe/semi-ui"
import { formatDateTime } from "@/utils"

export interface MessageBubbleProps {
  avatarUrl: string // 用户头像 URL
  username: string // 用户名
  content: string // 消息内容
  isRated?: boolean // 是否被评分
  messageTime: number // 消息时间戳
  lastEditTime?: number // 最后编辑时间戳
  userTag?: string // 用户标签
  isReversed?: boolean // 是否反转消息气泡
  className?: string // 自定义类名
}

export const MessageBubble = ({
  avatarUrl,
  username,
  content,
  isRated = false,
  messageTime,
  lastEditTime,
  userTag = "",
  isReversed = false,
  className,
}: MessageBubbleProps) => {
  const { Text } = Typography

  const Tags = () => {
    return (
      <Tag shape="circle" color="blue">
        {userTag}
      </Tag>
    )
  }

  const contentClass = [
    "rounded-[var(--semi-border-radius-large)] px-1 max-w-xl",
    isReversed
      ? "bg-[var(--semi-color-primary)] text-[var(--semi-color-white)]"
      : "bg-[var(--semi-color-fill-0)] text-[var(--semi-color-text-0)]",
    // " [&_a:visited]:text-[var(--semi-color-link-visited)]",
    // " [&_a]:text-[var(--semi-color-link)]",
    " [&_a]:text-[var(--semi-color-text)]",
    "[&_p]:m-2",
  ].join(" ")

  return (
    <div className={`flex gap-2 w-full ${isReversed ? "flex-row-reverse" : "flex-row"} ${className?.trim()}`}>
      {/* 头像部分 */}
      <div className="flex-shrink-0">
        <Avatar size="small" src={avatarUrl}>
          {username.slice(0, 1)}
        </Avatar>
      </div>

      {/* 消息内容部分 */}
      <div className={`flex flex-col ${isReversed ? "items-end" : "items-start"}`}>
        {/* 用户信息行 */}
        <div className="flex items-center gap-2 mb-1">
          {isRated && isReversed && <FontAwesomeIcon icon={faStar} size="sm" className="text-yellow-500" />}
          {userTag && isReversed && <Tags />}
          <Text>{username}</Text>
          {userTag && !isReversed && <Tags />}
          {isRated && !isReversed && <FontAwesomeIcon icon={faStar} size="sm" className="text-yellow-500" />}
        </div>

        {/* 消息气泡 */}
        <div className={contentClass} dangerouslySetInnerHTML={{ __html: content }} />

        {/* 消息元信息 */}
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500`}>
          <span>{formatDateTime(messageTime)}</span>
          {lastEditTime && (
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} size="sm" className="mt--0.3" />
              最后编辑于 {formatDateTime(lastEditTime)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
