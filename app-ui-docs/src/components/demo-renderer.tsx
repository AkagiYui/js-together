import { Suspense, type ComponentType } from "react";
import { demos } from "../demos/registry";

export function DemoRenderer({ name }: { name: string }) {
  const demo = demos[name];
  if (!demo) {
    return (
      <p className="text-sm text-muted-foreground">
        预览待补充（可在{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">
          src/demos/{name}.tsx
        </code>{" "}
        添加后重新运行 <code>gen</code>）。
      </p>
    );
  }
  const Comp = demo as unknown as ComponentType;
  return (
    <Suspense
      fallback={
        <p className="text-sm text-muted-foreground">加载预览中…</p>
      }
    >
      <Comp />
    </Suspense>
  );
}