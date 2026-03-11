// copyToClipboard.js
let copy: (text: string) => Promise<void>

if (navigator.clipboard && window.isSecureContext) {
  copy = function (text) {
    return navigator.clipboard.writeText(text)
  }
} else if (document.execCommand) {
  copy = function (text) {
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
} else {
  copy = function () {
    return Promise.reject(new Error("当前浏览器不支持复制到剪贴板"))
  }
}

export const copyToClipboard = copy
