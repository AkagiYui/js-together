import { Button } from "@akagiyui/ui-react";

const sourceCode = `import { Button } from "@akagiyui/ui-react";

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`;

export function ButtonPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Button</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          registry:ui · 基础按钮组件，支持 variant/size/asChild。
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">预览</h2>
        <div className="flex flex-wrap gap-3 rounded-lg border bg-card p-6">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sizes</h2>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-6">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">A</Button>
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
          npx shadcn@latest add @akagiyui/button
        </code>
      </section>
    </div>
  );
}