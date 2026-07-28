import { Link } from "@tanstack/react-router";

const components = [
  {
    name: "Button",
    type: "registry:ui",
    to: "/button",
    description: "按钮组件，多 variant/size，支持 asChild。",
    install: "npx shadcn@latest add @akagiyui/button",
  },
  {
    name: "CardCounter",
    type: "registry:block",
    to: "/card-counter",
    description: "带计数器的卡片，组合 Button + useCounter。",
    install: "npx shadcn@latest add @akagiyui/card-counter",
  },
];

export function IndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          @akagiyui/ui-react
        </h1>
        <p className="mt-2 text-muted-foreground">
          基于 shadcn 的个人 React 组件库。支持 npm 包和 registry 双模消费。
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {components.map((c) => (
          <Link
            key={c.name}
            to={c.to}
            className="block rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition-colors hover:bg-accent"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{c.name}</h2>
              <span className="rounded bg-secondary px-2 py-0.5 text-xs font-mono text-secondary-foreground">
                {c.type}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
            <code className="mt-3 block rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
              {c.install}
            </code>
          </Link>
        ))}
      </div>
    </div>
  );
}