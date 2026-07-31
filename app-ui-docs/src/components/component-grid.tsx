import { Link, type LinkProps } from "@tanstack/react-router";
import type { ComponentGroup } from "./component-groups";

/** alert-dialog -> AlertDialog */
function toTitle(name: string) {
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

/** 生成文件的组件名即注册路由名，此处按 Link 的 to 类型收窄。 */
function routeOf(name: string) {
  return `/${name}` as LinkProps["to"];
}

/** 首页组件一览：按分组展示卡片，点击进入预览 / 源码 / 安装页。 */
export function ComponentGrid({ groups }: { groups: ComponentGroup[] }) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-bold text-foreground">组件一览</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          按与官方 shadcn 的差异分组，点击进入预览 / 源码 / 安装。
        </p>
      </section>
      {groups.map((group) => (
        <section key={group.title} aria-label={group.title}>
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-semibold">{group.title}</h3>
            <span className="text-sm text-muted-foreground">{group.items.length} 个</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {group.items.map((name) => (
              <Link
                key={name}
                to={routeOf(name)}
                className="block rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition-colors hover:bg-accent"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-lg font-semibold">{toTitle(name)}</h4>
                  <span className="shrink-0 rounded bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">
                    {group.badge}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{group.cardDesc}</p>
                <code className="mt-3 block rounded bg-muted px-2 py-1 text-xs break-all text-muted-foreground">
                  npx shadcn@latest add @akagiyui/{name}
                </code>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
