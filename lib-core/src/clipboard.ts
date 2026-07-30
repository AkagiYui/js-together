/**
 * 复制文本到剪贴板。
 *
 * isomorphic：模块加载时不触碰任何宿主全局，仅在调用时探测运行环境。
 * - 浏览器安全上下文：使用 `navigator.clipboard.writeText`
 * - 浏览器非安全上下文：回退 `document.execCommand("copy")`
 * - Node / Workers 等无剪贴板环境：reject
 */
export function copyToClipboard(text: string): Promise<void> {
  // 浏览器安全上下文
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof window !== "undefined" && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }

  // 浏览器非安全上下文：回退 execCommand
  if (typeof document !== "undefined" && typeof document.execCommand === "function") {
    const tempInput = document.createElement("input")
    tempInput.style.position = "absolute"
    tempInput.style.left = "-9999px"
    document.body.appendChild(tempInput)
    tempInput.value = text
    tempInput.select()
    try {
      document.execCommand("copy")
      document.body.removeChild(tempInput)
      return Promise.resolve()
    } catch (err) {
      document.body.removeChild(tempInput)
      return Promise.reject(err)
    }
  }

  // 无剪贴板能力的运行环境
  return Promise.reject(new Error("当前运行环境不支持剪贴板"))
}
