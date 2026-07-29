import { Spinner } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
      <Spinner size="large" />
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  );
}
