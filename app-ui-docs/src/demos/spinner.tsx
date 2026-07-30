import { Spinner } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
      <Spinner className="size-8" />
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  );
}
