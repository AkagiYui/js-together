import type { Plugin } from "vite"
import fg from "fast-glob"

interface PreloadImageOptions {
  dir: string
  attrs?: {
    rel?: "prefetch" | "preload"
  }
}

const TEMPLATE = `
      const images = IMAGES
      function loadImage() {
        console.log("loadImage", images)
        const src = images.shift()
        if (!src) {
          return Promise.resolve()
        }
        return new Promise((resolve, reject) => {
          const link = document.createElement("link")
          link.rel = REL
          link.href = src
          link.as = "image"
          link.onload = resolve
          link.onerror = reject
          document.head.appendChild(link)
          setTimeout(reject, 10000)
        })
      }
      
      function loadImageTask() {
        loadImage().finally(() => {
          if (images.length) {
            loadImageTask()
          }
        })
      }
      
      const taskCount = 3
      for (let i = 0; i < taskCount; i++) {
        loadImageTask()
      }
`

export const preloadImages = (options: PreloadImageOptions): Plugin => {
  const { dir, attrs = {} } = options

  return {
    name: "vite-plugin-image-prefetch",
    transformIndexHtml(_html: string, ctx) {
      const files = fg.sync(dir, { cwd: ctx.server?.config.publicDir })
      const images = files.map((file) => ctx.server?.config.base + file)

      let script = TEMPLATE.replace("IMAGES", JSON.stringify(images))
      script = script.replace("REL", JSON.stringify(attrs.rel || "prefetch"))

      return [
        {
          tag: "script",
          children: script,
        },
      ]
    },
  }
}
