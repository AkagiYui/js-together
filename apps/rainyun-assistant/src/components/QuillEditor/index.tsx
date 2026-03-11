import React, { useEffect, useRef } from "react"
import Quill from "quill"
import editorStyle from "./styles.css?raw"
import "quill/dist/quill.snow.css"

interface QuillEditorProps {
  value: string // 内容
  onChange?: (content: string) => void // 内容变化回调 (content: string) => void
  placeholder?: string // 占位符
  theme?: "snow" | "bubble" // 主题
  modules?: Record<string, any>
  formats?: string[]
  readOnly?: boolean
  className?: string
}

export const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = "请输入内容...",
  theme = "snow",
  modules = {},
  formats = [],
  readOnly = false,
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // 仅在组件挂载时初始化
  useEffect(() => {
    if (!editorRef.current) return
    // 如果已经初始化过了，先销毁
    if (quillRef.current) {
      quillRef.current.disable()
      quillRef.current.off("text-change")
      quillRef.current.root.innerHTML = ""
      quillRef.current = null
    }

    // 初始化Quill编辑器
    const quill = new Quill(editorRef.current, {
      theme,
      modules: {
        toolbar: [
          ["bold", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          ["clean"],
          ["link", "image"],
          ...(modules.toolbar || []),
        ],
        ...modules,
      },
      formats: [
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code-block",
        "header",
        "list",
        "script",
        "indent",
        "direction",
        "size",
        "header",
        "color",
        "background",
        "font",
        "align",
        "link",
        "image",
        ...formats,
      ],
      placeholder,
      readOnly,
    })

    quillRef.current = quill

    // 监听内容变化
    quill.on("text-change", () => {
      const content = quill.root.innerHTML
      onChange?.(content)
    })

    // 设置初始内容
    if (value) {
      quill.root.innerHTML = value
    }

    // 调整编辑器容器高度
    if (containerRef.current) {
      const toolbarHeight = containerRef.current.querySelector(".ql-toolbar")?.clientHeight || 0
      const editorContainer = containerRef.current.querySelector(".ql-container")
      if (editorContainer) {
        ;(editorContainer as HTMLElement).style.height = `calc(100% - ${toolbarHeight}px)`
      }
    }

    return () => {
      quillRef.current = null
    }
  }, [])

  // 更新内容
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  // 更新只读状态
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly)
    }
  }, [readOnly])

  // 添加自定义样式来处理布局

  return (
    <div
      className={`quill-editor rounded-[var(--semi-border-radius-small)] border-solid border-1px border-[var(--semi-color-border)] ${className}`.trim()}
    >
      <style>{editorStyle}</style>
      <div ref={editorRef} className={"h-full"} />
    </div>
  )
}
