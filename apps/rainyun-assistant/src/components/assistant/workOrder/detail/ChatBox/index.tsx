import { useEffect, useMemo } from "react"
import { useWorkOrderDetail } from "@/hooks"
import { MessageBubble, type MessageBubbleProps } from "./MessageBubble"
import { Group } from "@/components/Group"
import DOMPurify from "dompurify"

export function ChatBox({ id: workOrderId }: { id: number }) {
  const { data } = useWorkOrderDetail(workOrderId)

  const messages = useMemo<MessageBubbleProps[]>(() => {
    if (!data) {
      return []
    }

    // clean content
    const cleanContent = (content?: string) => {
      if (!content) {
        return ""
      }

      const santiizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ["h1", "h2", "h3", "p", "strong", "em", "ul", "li", "a", "img"],
        ALLOWED_ATTR: ["href", "target", "src", "crossorigin"],
      })

      // replace image url
      const parser = new DOMParser()
      const doc = parser.parseFromString(santiizedContent, "text/html")
      console.log(doc.body.innerHTML)
      return doc.body.innerHTML
    }

    return [
      {
        avatarUrl: data.user.avatarUrl || "",
        username: data.user.username || "",
        content: cleanContent(data.content),
        isRated: false,
        messageTime: data!.time * 1000,
      },
      ...(data.discuss.map((item) => {
        return {
          avatarUrl: item.user.avatarUrl,
          username: item.user.username,
          content: cleanContent(item.content),
          isRated: item.isScored,
          messageTime: item.time * 1000,
          lastEditTime: item.lastEditTime,
          userTag: item.user.isAssist ? "客服" : undefined,
          isReversed: item.user.isAssist,
        }
      }) || []),
    ]
  }, [data])

  return (
    <Group vertical className="w-full p-2">
      {messages.map((message, index) => (
        <MessageBubble key={index} {...message} className="mb-2" />
      ))}
    </Group>
  )
}
