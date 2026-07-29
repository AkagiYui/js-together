import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import githubDark from "@shikijs/themes/github-dark";
import githubLight from "@shikijs/themes/github-light";
import tsxLang from "@shikijs/langs/tsx";
import bashLang from "@shikijs/langs/bash";
import { Button } from "@akagiyui/ui-react";
import { CheckIcon, CopyIcon } from "@akagiyui/ui-react";

/** 单例 highlighter：只初始化一次，跨所有 CodeBlock 实例共享。 */
let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubDark, githubLight],
      langs: [tsxLang, bashLang],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });
  }
  return highlighterPromise;
}

type CodeBlockProps = {
  code: string;
  /** 代码语言，默认 tsx */
  lang?: "tsx" | "bash";
  className?: string;
};

export function CodeBlock({ code, lang = "tsx", className }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  // 未解析主题前（首帧/SSR）默认按 dark 渲染，避免闪烁。
  const isDark = resolvedTheme !== "light";
  const theme = isDark ? "github-dark" : "github-light";

  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    getHighlighter().then((h) => {
      if (!active) return;
      setHtml(
        h.codeToHtml(code, {
          lang,
          theme,
        }),
      );
    });
    return () => {
      active = false;
    };
  }, [code, lang, theme]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 读取或写入剪贴板失败时静默忽略
    }
  }

  return (
    <div className={["group relative", className].filter(Boolean).join(" ")}>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="复制代码"
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 data-[state=copied]:opacity-100"
        data-state={copied ? "copied" : "idle"}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      {html ? (
        <div
          className="overflow-x-auto rounded-lg text-sm [&>pre]:m-0 [&>pre]:rounded-lg [&>pre]:p-4 [&>pre]:text-[13px] [&>pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
