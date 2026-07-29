import { Separator } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm">Content above</div>
      <Separator />
      <div className="text-sm">Content below</div>
      <Separator orientation="vertical" className="h-8" />
    </div>
  );
}
