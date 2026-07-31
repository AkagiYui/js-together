import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "./code-block";

/**
 * 通用 Markdown 渲染器（README 等）。
 * - 代码块走现有 shiki 高亮（CodeBlock），行内代码用主题化 <code>；
 * - 表格包一层 overflow-x-auto，窄屏可横向滚动；
 * - 仓库内相对链接（如 ../AGENTS.md）在文档站没有对应页面，降级为纯文本避免死链。
 * 正文排版样式见 src/styles.css 的 `.markdown`。
 */
const components: Components = {
  a({ href, children }) {
    const external = typeof href === "string" && /^(https?:)?\/\//i.test(href);
    if (!external) {
      return <span className="text-muted-foreground">{children}</span>;
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
  pre({ children }) {
    // code 组件已渲染为 CodeBlock（自带 <pre>），透传避免 <pre> 嵌套
    return <>{children}</>;
  },
  code({ className, children }) {
    const match = /language-([\w-]+)/.exec(className ?? "");
    const text = String(children).replace(/\n$/, "");
    const isBlock = !!match || text.includes("\n");
    if (!isBlock) {
      return (
        <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">
          {children}
        </code>
      );
    }
    return <CodeBlock code={text} lang={match?.[1]} />;
  },
  table(props) {
    return (
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table {...props} />
      </div>
    );
  },
};

export function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
