import { AspectRatio } from "@akagiyui/ui-react";

export default function Demo() {
  return (
    <AspectRatio ratio={16 / 9} className="w-full max-w-sm">
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
        16 : 9
      </div>
    </AspectRatio>
  );
}
