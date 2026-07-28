import { CardCounter } from "@akagiyui/ui-react";

const sourceCode = `import { CardCounter } from "@akagiyui/ui-react";

<CardCounter title="My Counter" initialValue={5} />`;

export function CardCounterPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">CardCounter</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          registry:block · 组合组件，依赖 button + use-counter（add 时自动递归拉取）。
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">预览</h2>
        <div className="rounded-lg border bg-card p-6">
          <CardCounter title="My Counter" initialValue={5} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">源码</h2>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <code>{sourceCode}</code>
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">安装</h2>
        <code className="block rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          npx shadcn@latest add @akagiyui/card-counter
        </code>
        <p className="text-xs text-muted-foreground">
          自动递归拉取依赖：button → utils，以及 use-counter。
        </p>
      </section>
    </div>
  );
}